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

import { BlobApi } from "@here/olp-sdk-dataservice-api";
import {
  BlobInitResponse,
  BlobInitResponseCancelLink,
  BlobInitResponseCompleteLink,
  BlobInitResponseLinks,
  BlobInitResponseStatusLink,
  BlobInitResponseUploadPartLink,
  MultipartCompletePart,
  MultipartCompleteRequest,
  MultipartUploadMetadata,
  MultipartUploadStatus
} from "@here/olp-sdk-dataservice-api/lib/blob-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("BlobApi", function() {
  it("BlobInitResponse  with all required params", function() {
    const params: BlobInitResponse = {};

    assert.isDefined(params);
  });

  it("BlobInitResponse with all required and optional params", function() {
    const params: BlobInitResponse = {
      links: {
        complete: {
          href: "test",
          method: "test"
        },

        _delete: {
          href: "test",
          method: "test"
        },

        status: {
          href: "test",
          method: "test"
        },

        uploadPart: {
          href: "test",
          method: "test"
        }
      }
    };

    assert.isDefined(params);
  });

  it("BlobInitResponseCancelLink  with all required params", function() {
    const params: BlobInitResponseCancelLink = {};

    assert.isDefined(params);
  });

  it("BlobInitResponseCancelLink with all required and optional params", function() {
    const params: BlobInitResponseCancelLink = {
      href: "test",
      method: "test"
    };

    assert.isDefined(params);
  });

  it("BlobInitResponseCompleteLink  with all required params", function() {
    const params: BlobInitResponseCompleteLink = {};

    assert.isDefined(params);
  });

  it("BlobInitResponseCompleteLink with all required and optional params", function() {
    const params: BlobInitResponseCompleteLink = {
      href: "test",
      method: "test"
    };

    assert.isDefined(params);
  });

  it("BlobInitResponseLinks  with all required params", function() {
    const params: BlobInitResponseLinks = {};

    assert.isDefined(params);
  });

  it("BlobInitResponseLinks with all required and optional params", function() {
    const params: BlobInitResponseLinks = {
      complete: {
        href: "test",
        method: "test"
      },

      _delete: {
        href: "test",
        method: "test"
      },

      status: {
        href: "test",
        method: "test"
      },

      uploadPart: {
        href: "test",
        method: "test"
      }
    };

    assert.isDefined(params);
  });

  it("BlobInitResponseStatusLink  with all required params", function() {
    const params: BlobInitResponseStatusLink = {};

    assert.isDefined(params);
  });

  it("BlobInitResponseStatusLink with all required and optional params", function() {
    const params: BlobInitResponseStatusLink = {
      href: "test",
      method: "test"
    };

    assert.isDefined(params);
  });

  it("BlobInitResponseUploadPartLink  with all required params", function() {
    const params: BlobInitResponseUploadPartLink = {};

    assert.isDefined(params);
  });

  it("BlobInitResponseUploadPartLink with all required and optional params", function() {
    const params: BlobInitResponseUploadPartLink = {
      href: "test",
      method: "test"
    };

    assert.isDefined(params);
  });

  it("MultipartCompletePart  with all required params", function() {
    const params: MultipartCompletePart = {};

    assert.isDefined(params);
  });

  it("MultipartCompletePart with all required and optional params", function() {
    const params: MultipartCompletePart = {
      etag: "test",
      number: 1
    };

    assert.isDefined(params);
  });

  it("MultipartCompleteRequest  with all required params", function() {
    const params: MultipartCompleteRequest = {};

    assert.isDefined(params);
  });

  it("MultipartCompleteRequest with all required and optional params", function() {
    const params: MultipartCompleteRequest = {
      parts: [
        {
          etag: "test",
          number: 1
        }
      ]
    };

    assert.isDefined(params);
  });

  it("MultipartUploadMetadata  with all required params", function() {
    const params: MultipartUploadMetadata = {
      contentType: "test"
    };

    assert.isDefined(params);
  });

  it("MultipartUploadMetadata with all required and optional params", function() {
    const params: MultipartUploadMetadata = {
      contentEncoding: "gzip",
      contentType: "test"
    };

    assert.isDefined(params);
  });

  it("MultipartUploadStatus  with all required params", function() {
    const params: MultipartUploadStatus = {};

    assert.isDefined(params);
  });

  it("MultipartUploadStatus with all required and optional params", function() {
    const params: MultipartUploadStatus = {
      status: "failed"
    };

    assert.isDefined(params);
  });

  it("Test cancelMultipartUpload method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      multiPartToken: "mocked-multiPartToken"
    };

    const result = await BlobApi.cancelMultipartUpload(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test cancelMultipartUpload method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      multiPartToken: "mocked-multiPartToken",
      billingTag: "mocked-billingTag"
    };

    const result = await BlobApi.cancelMultipartUpload(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test deleteBlob method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle"
    };

    const result = await BlobApi.deleteBlob(mockedRequestBuilder, params);
  });

  it("Test deleteBlob method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      billingTag: "mocked-billingTag"
    };

    const result = await BlobApi.deleteBlob(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getBlob method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      billingTag: "mocked-billingTag"
    };

    const result = await BlobApi.getBlob(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getBlob method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      billingTag: "mocked-billingTag",
      range: "mocked-range"
    };

    const result = await BlobApi.getBlob(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getMultipartUploadStatus method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      multiPartToken: "mocked-multiPartToken"
    };

    const result = await BlobApi.getMultipartUploadStatus(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getMultipartUploadStatus method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      billingTag: "mocked-billingTag",
      multiPartToken: "mocked-multiPartToken"
    };

    const result = await BlobApi.getMultipartUploadStatus(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test startMultipartUpload method with all required params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      billingTag: "mocked-billingTag"
    };

    const result = await BlobApi.startMultipartUpload(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test startMultipartUpload method with all required and optional params", async function() {
    const params = {
      layerId: "mocked-id",
      dataHandle: "mocked-datahandle",
      billingTag: "mocked-billingTag",
      body: "mocked-body" as any
    };

    const result = await BlobApi.startMultipartUpload(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
