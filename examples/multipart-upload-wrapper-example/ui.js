/*
 * Copyright (C) 2021 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

"use strict";

const appContainer = document.getElementById("app");
const abortController = new AbortController();

// Create `UserAuth` and set it up to use our mocked server.
const userAuth = new UserAuth({
  tokenRequester: requestToken,
  customUrl: "http://127.0.0.1:8080/oauth2/token",
  credentials: {
    accessKeyId: "mocked-access-key-id",
    accessKeySecret: "mocked-access-key-secret",
  },
});

// Create `OlpClientSettings` and set it up to use our mocked server.
const settings = new OlpClientSettings({
  environment: "http://127.0.0.1:8080/api/lookup",
  getToken: () => userAuth.getToken(),
});

/**
 * ****** Example of using HERE Data SDK for TypeScript in plain JS *******
 */
async function upload(file) {
  // Set up and draw a progress bar.
  const progress = document.createElement("div");
  const progressBar = document.createElement("progress");
  appContainer.appendChild(progressBar);
  appContainer.appendChild(progress);

  // Set up the mocked data.
  const catalogHrn = "hrn:here:data::mocked:catalog";
  const layerId = "mocked-layer";
  const datahandle = "mocked-datahandle";
  const contentType = "text/plain";

  /**
   * Create the `DataStoreRequest` builder.
   * You need it to make requests to the Publish API.
   */
  const publishRequestBuilder = await RequestFactory.create(
    "publish",
    "v2",
    settings,
    HRN.fromString(catalogHrn),
    abortController.signal
  );

  // Initialize the new publication by sending a request to the Publish API.
  const publication = await PublishApi.initPublication(publishRequestBuilder, {
    body: {
      layerIds: [layerId],
    },
  });

  /**
   * Set up callbacks to subscribe to the uploading progress and progress bar drawing.
   */
  let totalFileSize = 0;
  let uploadedSize = 0;

  const onStart = (event) => {
    totalFileSize = event.dataSize;
    progressBar.setAttribute("max", `${totalFileSize}`);
    progress.innerHTML = `Processing...`;
  };

  const onStatus = (status) => {
    uploadedSize += status.chunkSize;
    progressBar.setAttribute("value", `${uploadedSize}`);
    progress.innerHTML = `Uploaded to Blob V1 ${uploadedSize} of ${totalFileSize} bytes.
    Chunks ${status.uploadedChunks} of ${status.totalChunks}`;
  };

  // Initialize `MultiPartUploadWrapper`.
  const wrapper = new MultiPartUploadWrapper(
    {
      blobVersion: "v1",
      catalogHrn,
      contentType,
      handle: datahandle,
      layerId,
      onStart,
      onStatus,
    },
    settings
  );

  // Upload the file.
  await wrapper.upload(file, abortController.signal);

  // Upload metadata of a new partition by sending a request to the Publish API.
  await PublishApi.uploadPartitions(publishRequestBuilder, {
    layerId,
    publicationId: publication.id,
    body: {
      partitions: [
        {
          partition: file.name,
          dataHandle: datahandle,
          dataSize: totalFileSize,
        },
      ],
    },
  });

  // Submit the new publication by sending a request to the Publish API.
  await PublishApi.submitPublication(publishRequestBuilder, {
    publicationId: publication.id,
  });

  progress.innerHTML += "\nDone!";
}

/**
 * ************** UI ******************
 */
const abortButton = document.getElementById("abort");
abortButton.onclick = () => {
  abortController.abort();
};

const label = document.createElement("label");
label.innerHTML = "Publish to Blob V1: ";
label.setAttribute("for", "uploadToBlobV1");
appContainer.appendChild(label);

const input = document.createElement("input");
input.setAttribute("type", "file");
input.setAttribute("name", "uploadToBlobV1");
input.setAttribute("onchange", "upload(this.files[0])");
appContainer.appendChild(input);
