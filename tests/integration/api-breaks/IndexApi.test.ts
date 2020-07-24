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

import { IndexApi } from "@here/olp-sdk-dataservice-api";
import {
  DataResponse,
  Index,
  MapStringObject,
  UpdateIndexRequest
} from "@here/olp-sdk-dataservice-api/lib/index-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("IndexApi", function() {
  it("DataResponse with all required params", function() {
    const params: DataResponse = {};

    assert.isDefined(params);
  });

  it("DataResponse with all required and optional params", function() {
    const params: DataResponse = {
      data: [
        {
          checksum: "test",
          fields: "test",
          id: "test",
          metadata: { ["test"]: "test" },
          size: 1
        }
      ],
      error: "test"
    };

    assert.isDefined(params);
  });

  it("Index with all required params", function() {
    const params: Index = {};

    assert.isDefined(params);
  });

  it("Index with all required and optional params", function() {
    const params: Index = {
      checksum: "test",
      fields: "test",
      id: "test",
      metadata: { ["test"]: "test" },
      size: 1
    };

    assert.isDefined(params);
  });

  it("MapStringObject with all required params", function() {
    const params: MapStringObject = {
      mykey: "test"
    };

    assert.isDefined(params);
  });

  it("UpdateIndexRequest with all required params", function() {
    const params: UpdateIndexRequest = {};

    assert.isDefined(params);
  });

  it("UpdateIndexRequest with all required and optional params", function() {
    const params: UpdateIndexRequest = {
      additions: [
        {
          checksum: "test",
          fields: "test",
          id: "test",
          metadata: { ["test"]: "test" },
          size: 1
        }
      ],
      removals: ["test"]
    };

    assert.isDefined(params);
  });

  it("Test insertIndexes method with all required params", async function() {
    const params = {
      indexes: [
        {
          checksum: "test",
          fields: "test",
          id: "test",
          metadata: { ["test"]: "test" },
          size: 1
        }
      ],
      layerID: "test"
    };

    const result = await IndexApi.insertIndexes(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test performQuery method with all required params", async function() {
    const params = {
      layerID: "test",
      query: "test"
    };

    const result = await IndexApi.performQuery(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test performQuery method with all required and optional params", async function() {
    const params = {
      layerID: "test",
      query: "test",
      huge: true
    };

    const result = await IndexApi.performQuery(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test performUpdate method with all required params", async function() {
    const params = {
      layerID: "test",
      request: {
        additions: [
          {
            checksum: "test",
            fields: "test",
            id: "test",
            metadata: { ["test"]: "test" },
            size: 1
          }
        ],
        removals: ["test"]
      }
    };

    const result = await IndexApi.performUpdate(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });
});
