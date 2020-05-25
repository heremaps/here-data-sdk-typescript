/*
 * Copyright (C) 2020 HERE Europe B.V.
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

import {
  OlpClientSettings,
  VersionedLayerClient,
  HRN,
  DataRequest,
  PartitionsRequest,
  QuadKeyPartitionsRequest,
  quadKeyFromMortonCode,
  IndexLayerClient,
  IndexQueryRequest,
  StreamLayerClient,
  SubscribeRequest,
  PollRequest,
  SeekRequest,
  VolatileLayerClient
} from "@here/olp-sdk-dataservice-read";
import { UserAuth, requestToken } from "@here/olp-sdk-authentication";

import { HttpError } from "@here/olp-sdk-core";

const config = require("./config.json");

const userAuth = new UserAuth({
  env: config.env,
  credentials: {
    accessKeyId: config.key.id,
    accessKeySecret: config.key.secret
  },
  tokenRequester: requestToken
});

const settings = new OlpClientSettings({
  environment: config.env,
  getToken: () => userAuth.getToken()
});

const versionClient = new VersionedLayerClient({
  catalogHrn: HRN.fromString(config.version.hrn),
  layerId: config.version.layerId,
  settings
});

const indexClient = new IndexLayerClient({
  catalogHrn: HRN.fromString(config.index.hrn),
  layerId: config.index.layerId,
  settings
});

const streamClient = new StreamLayerClient({
  catalogHrn: HRN.fromString(config.stream.hrn),
  layerId: config.stream.layerId,
  settings
});
let subscriptionId: string;

const volatileClient = new VolatileLayerClient({
  catalogHrn: HRN.fromString(config.volatile.hrn),
  layerId: config.volatile.layerId,
  settings
});

export async function getPartitionsByIdsVersion() {
  const request = new PartitionsRequest().withPartitionIds(
    config.version.partitionsIds
  );
  versionClient
    .getPartitions(request)
    .then(partitions => {
      const textnode = document.createTextNode(JSON.stringify(partitions));
      addNode(textnode, "result-fetchPartitionsByIds");
    })
    .catch(addError);
}

export async function getPartitionsByIdsForOneVersion() {
  const layerSomeVersionClient = new VersionedLayerClient({
    catalogHrn: HRN.fromString(config.version.hrn),
    layerId: config.version.layerId,
    settings,
    version: config.version.specificVersion
  });

  const request = new PartitionsRequest().withPartitionIds(
    config.version.partitionsIds
  );
  layerSomeVersionClient
    .getPartitions(request)
    .then(partitions => {
      const textnode = document.createTextNode(JSON.stringify(partitions));
      addNode(textnode, "result-fetchPartitionsByIdsForVersion");
    })
    .catch(addError);
}

export async function getDataByDataHandleVersion() {
  const request = new DataRequest().withDataHandle(config.version.dataHandle);
  versionClient
    .getData(request)
    .then(data => data.blob())
    .then(blob => {
      const textnode = document.createTextNode(
        "Fetched data: " + "size: " + blob.size + ", type: " + blob.type
      );
      addNode(textnode, "result-fetchDataHandle");
    })
    .catch(addError);
}

export async function getDataByPartitionIdVersion() {
  const request = new DataRequest().withPartitionId(config.version.partitionId);
  versionClient
    .getData(request)
    .then(async data => {
      const blob = await data.blob();
      const textnode = document.createTextNode(
        "Fetched data: " + "size: " + blob.size + ", type: " + blob.type
      );
      addNode(textnode, "result-fetchDataPartitionId");
    })
    .catch(addError);
}

export async function getPartitionsByQuadKeyVersion() {
  const request = new DataRequest().withQuadKey(
    quadKeyFromMortonCode(config.version.mortonCode)
  );
  versionClient
    .getData(request)
    .then(partitions => {
      const textnode = document.createTextNode(JSON.stringify(partitions));
      addNode(textnode, "result-fetchPartitionsByQuadKey");
    })
    .catch(addError);
}

export async function getPartitionsByQueryIndex() {
  const request = new IndexQueryRequest().withQueryString(config.index.query);
  indexClient.getPartitions(request).then(partitions => {
    const textnode = document.createTextNode(JSON.stringify(partitions));
    addNode(textnode, "result-fetchPartitionsByQuery");
  });
}

export async function getDataIndex() {
  indexClient
    .getData(config.index.model)
    .then(data => data.blob())
    .then(blob => {
      const textnode = document.createTextNode(
        "Fetched data: " + "size: " + blob.size + ", type: " + blob.type
      );
      addNode(textnode, "result-fetchData");
    });
}

export async function subscribeStream() {
  const request = new SubscribeRequest().withMode(config.stream.serial);
  streamClient
    .subscribe(request)
    .then(result => {
      subscriptionId = result;
      const textnode = document.createTextNode(JSON.stringify(result));
      addNode(textnode, "result-subscribe");
    })
    .catch(addError);
}

export async function pollStream() {
  const request = new PollRequest()
    .withMode(config.stream.serial)
    .withSubscriptionId(subscriptionId);
  streamClient
    .poll(request)
    .then(messages => {
      const textnode = document.createTextNode(JSON.stringify(messages));
      addNode(textnode, "result-poll");
    })
    .catch(addError);
}

export async function seekStream() {
  const request = new SeekRequest().withSeekOffsets({
    offsets: config.stream.offsets
  });
  streamClient
    .seek(request)
    .then(result => {
      const textnode = document.createTextNode(JSON.stringify(result));
      addNode(textnode, "result-seek");
    })
    .catch(addError);
}

export async function fetchPartitionsByQuadKeyVolatile() {
  const request = new QuadKeyPartitionsRequest().withQuadKey(
    quadKeyFromMortonCode(config.volatile.mortonCode)
  );
  volatileClient
    .getPartitions(request)
    .then(partitions => {
      const textnode = document.createTextNode(JSON.stringify(partitions));
      addNode(textnode, "result-fetchPartitionsByQuadKey");
    })
    .catch(addError);
}

export async function fetchPartitionsByIdsVolatile() {
  const request = new PartitionsRequest().withPartitionIds(
    config.volatile.partitionsIds
  );
  volatileClient
    .getPartitions(request)
    .then(partitions => {
      const textnode = document.createTextNode(JSON.stringify(partitions));
      addNode(textnode, "result-fetchPartitionsByIds");
    })
    .catch(addError);
}

export async function fetchDataVolatile() {
  const request = new DataRequest().withDataHandle(config.volatile.dataHandle);
  volatileClient
    .getData(request)
    .then(data => data.blob())
    .then(blob => {
      const textnode = document.createTextNode(
        "Fetched data: " + "size: " + blob.size + ", type: " + blob.type
      );
      addNode(textnode, "result-fetchData");
    })
    .catch(addError);
}

export async function fetchToken() {
  const token = await userAuth.getToken();
  var textnode = document.createTextNode(token);
  addNode(textnode, "result");
}

function addNode(textnode: Text, id: string) {
  const container = document.getElementById(id);
  if (container) {
    hideError();
    container.appendChild(textnode);
  }
}
function addError(error: HttpError) {
  const textnode = document.createTextNode(
    `Error. Status: ${error.status}, message: ${error.message}`
  );
  const container = document.getElementById("error");
  if (container) {
    container.innerHTML = "";
    container.appendChild(textnode);
    container.className = "error";
  }
}
function hideError() {
  const container = document.getElementById("error");
  if (container) {
    container.className = "hide";
  }
}
