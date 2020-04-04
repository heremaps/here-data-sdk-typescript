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

import { QueryApi } from "@here/olp-sdk-dataservice-api";
import {
  Index,
  ParentQuad,
  Partition,
  Partitions,
  SubQuad
} from "@here/olp-sdk-dataservice-api/lib/query-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("QueryApi", () => {
  it("Index with all required params", () => {
    const params: Index = {};

    assert.isDefined(params);
  });

  it("Index with all required and optional params", () => {
    const params: Index = {
      parentQuads: [
        {
          additionalMetadata: "test",
          checksum: "test",
          compressedDataSize: 1,
          dataHandle: "test",
          dataSize: 1,
          partition: "test",
          version: 1
        }
      ],
      subQuads: [
        {
          additionalMetadata: "test",
          checksum: "test",
          compressedDataSize: 1,
          dataHandle: "test",
          dataSize: 1,
          subQuadKey: "test",
          version: 1
        }
      ],
      status: 1,
      title: "test"
    };

    assert.isDefined(params);
  });

  it("ParentQuad with all required params", () => {
    const params: ParentQuad = {
      dataHandle: "test",
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("ParentQuad with all required and optional params", () => {
    const params: ParentQuad = {
      additionalMetadata: "test",
      checksum: "test",
      compressedDataSize: 1,
      dataHandle: "test",
      dataSize: 1,
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Partition with all required params", () => {
    const params: Partition = {
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Partition with all required and optional params", () => {
    const params: Partition = {
      checksum: "test",
      compressedDataSize: 1,
      dataHandle: "test",
      dataSize: 1,
      partition: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Partitions with all required params", () => {
    const params: Partitions = {};

    assert.isDefined(params);
  });

  it("Partitions with all required and optional params", () => {
    const params: Partitions = {
      partitions: [
        {
          checksum: "test",
          compressedDataSize: 1,
          dataHandle: "test",
          dataSize: 1,
          partition: "test",
          version: 1
        }
      ],
      status: 1,
      title: "test"
    };

    assert.isDefined(params);
  });

  it("SubQuad with all required params", () => {
    const params: SubQuad = {
      dataHandle: "test",
      subQuadKey: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("SubQuad with all required and optional params", () => {
    const params: SubQuad = {
      additionalMetadata: "test",
      checksum: "test",
      compressedDataSize: 1,
      dataHandle: "test",
      dataSize: 1,
      subQuadKey: "test",
      version: 1
    };

    assert.isDefined(params);
  });

  it("Test getChangesById method with all required params", async () => {
    const params = {
      layerId: "test",
      partition: ["test"]
    };

    const result = await QueryApi.getChangesById(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getChangesById method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      partition: ["test"],
      startVersion: "test",
      endVersion: "test",
      sinceTime: 1,
      additionalFields: ["test"],
      billingTag: "test"
    };

    const result = await QueryApi.getChangesById(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test getPartitionsById method with all required params", async () => {
    const params = {
      layerId: "test",
      partition: ["test"]
    };

    const result = await QueryApi.getPartitionsById(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getPartitionsById method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      partition: ["test"],
      version: "test",
      additionalFields: ["test"],
      billingTag: "test"
    };

    const result = await QueryApi.getPartitionsById(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test quadTreeIndex method with all required params", async () => {
    const params = {
      layerId: "test",
      version: 1,
      quadKey: "test",
      depth: 1
    };

    const result = await QueryApi.quadTreeIndex(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test quadTreeIndex method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      version: 1,
      quadKey: "test",
      depth: 1,
      additionalFields: ["test"],
      billingTag: "test"
    };

    const result = await QueryApi.quadTreeIndex(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test quadTreeIndexVolatile method with all required params", async () => {
    const params = {
      layerId: "test",
      quadKey: "test",
      depth: 1
    };

    const result = await QueryApi.quadTreeIndexVolatile(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test quadTreeIndexVolatile method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      quadKey: "test",
      depth: 1,
      additionalFields: ["test"],
      billingTag: "test"
    };

    const result = await QueryApi.quadTreeIndexVolatile(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
