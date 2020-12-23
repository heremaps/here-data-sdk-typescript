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

import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  CancelBatchRequest,
  CheckDataExistsRequest,
  CompleteBatchRequest,
  GetBatchRequest,
  PublishSinglePartitionRequest,
  StartBatchRequest,
  UploadBlobRequest,
  UploadPartitionsRequest,
  VersionedLayerClient,
  VersionedLayerClientParams
} from "@here/olp-sdk-dataservice-write";
import { OlpClientSettings, HRN } from "@here/olp-sdk-core";
chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

let layerClient: VersionedLayerClient;
const abortSignal: AbortSignal = new AbortController().signal;
const settings = new OlpClientSettings({
  environment: "here",
  getToken: () => Promise.resolve("test-token-string")
});

describe("VersionedLayerClientParams", function() {
  it("VersionedLayerClientParams with all required params", function() {
    const params: VersionedLayerClientParams = {
      catalogHrn: HRN.fromString("hrn:here:data:::example-catalog"),
      settings: new OlpClientSettings({
        environment: "here",
        getToken: () => Promise.resolve("mocked-token")
      })
    };

    assert.isDefined(params);
  });
});

describe("VersionedLayerClient", function() {
  beforeEach(function() {
    layerClient = new VersionedLayerClient({
      catalogHrn: HRN.fromString("hrn:here:data:::test-hrn"),
      settings
    });
  });

  it("Shoud be initialized with arguments", async function() {
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(VersionedLayerClient);

    assert.isFunction(layerClient.checkDataExists);
    assert.isFunction(layerClient.getBaseVersion);
    assert.isFunction(layerClient.startBatch);
    assert.isFunction(layerClient.publishToBatch);
    assert.isFunction(layerClient.cancelBatch);
    assert.isFunction(layerClient.getBatch);
    assert.isFunction(layerClient.completeBatch);
    assert.isFunction(layerClient.uploadBlob);
    assert.isFunction(layerClient.uploadPartitions);
  });

  it("checkDataExists method", async function() {
    layerClient.checkDataExists(new CheckDataExistsRequest()).catch(e => e);
    layerClient
      .checkDataExists(new CheckDataExistsRequest(), abortSignal)
      .catch(e => e);
  });
  it("getBaseVersion method", async function() {
    layerClient.getBaseVersion().catch(e => e);
    layerClient.getBaseVersion("mocked-billing-tag").catch(e => e);
    layerClient.getBaseVersion("mocked-billing-tag", abortSignal).catch(e => e);
  });
  it("startBatch method", async function() {
    layerClient.startBatch(new StartBatchRequest()).catch(e => e);
    layerClient.startBatch(new StartBatchRequest(), abortSignal).catch(e => e);
  });
  it("publishToBatch method", async function() {
    layerClient
      .publishToBatch(new PublishSinglePartitionRequest())
      .catch(e => e);
    layerClient
      .publishToBatch(new PublishSinglePartitionRequest(), abortSignal)
      .catch(e => e);
  });
  it("cancelBatch method", async function() {
    layerClient.cancelBatch(new CancelBatchRequest()).catch(e => e);
    layerClient
      .cancelBatch(new CancelBatchRequest(), abortSignal)
      .catch(e => e);
  });
  it("getBatch method", async function() {
    layerClient.getBatch(new GetBatchRequest()).catch(e => e);
    layerClient.getBatch(new GetBatchRequest(), abortSignal).catch(e => e);
  });
  it("completeBatch method", async function() {
    layerClient.completeBatch(new CompleteBatchRequest()).catch(e => e);
    layerClient
      .completeBatch(new CompleteBatchRequest(), abortSignal)
      .catch(e => e);
  });
  it("uploadBlob method", async function() {
    layerClient.uploadBlob(new UploadBlobRequest()).catch(e => e);
    layerClient.uploadBlob(new UploadBlobRequest(), abortSignal).catch(e => e);
  });
  it("uploadPartitions method", async function() {
    layerClient.uploadPartitions(new UploadPartitionsRequest()).catch(e => e);
    layerClient
      .uploadPartitions(new UploadPartitionsRequest(), abortSignal)
      .catch(e => e);
  });
});
