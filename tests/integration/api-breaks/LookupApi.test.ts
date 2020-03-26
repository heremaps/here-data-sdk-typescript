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

import { LookupApi } from "@here/olp-sdk-dataservice-api";
import {
  API,
  ApiNotFoundError
} from "@here/olp-sdk-dataservice-api/lib/lookup-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("LookupApi", () => {
  it("API with all required params", () => {
    const params: API = {
      api: "test",
      version: "test",
      baseURL: "test"
    };

    assert.isDefined(params);
  });

  it("API with all required and optional params", () => {
    const params: API = {
      api: "test",
      version: "test",
      baseURL: "test",
      parameters: { ["test"]: "test" }
    };

    assert.isDefined(params);
  });

  it("ApiNotFoundError with all required params", () => {
    const params: ApiNotFoundError = {};

    assert.isDefined(params);
  });

  it("ApiNotFoundError with all required and optional params", () => {
    const params: ApiNotFoundError = {
      status: 1,
      title: "test",
      detail: [{ name: "test", error: "test" }],
      error: "test",
      error_description: "test"
    };

    assert.isDefined(params);
  });

  it("Test platformAPI method with all required params", async () => {
    const params = {
      api: "mocked-api",
      version: "mocked-version"
    };

    const result = await LookupApi.platformAPI(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test platformAPIList method without params", async () => {
    const result = await LookupApi.platformAPIList(mockedRequestBuilder);

    expect(result).to.be.equal("success");
  });

  it("Test getPlatformAPIList method without params", async () => {
    const result = await LookupApi.getPlatformAPIList(mockedRequestBuilder);

    expect(result).to.be.equal("success");
  });

  it("Test resourceAPI method with all required params", async () => {
    const params = {
      hrn: "mocked-hrn",
      api: "test",
      version: "test"
    };

    const result = await LookupApi.resourceAPI(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test resourceAPI method with all required and optional params", async () => {
    const params = {
      hrn: "mocked-hrn",
      api: "test",
      version: "test",
      region: "mocked-region"
    };

    const result = await LookupApi.resourceAPI(mockedRequestBuilder, params);

    expect(result).to.be.equal("success");
  });

  it("Test resourceAPIList method with all required params", async () => {
    const params = {
      hrn: "mocked-hrn"
    };

    const result = await LookupApi.resourceAPIList(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test resourceAPIList method with all required and optional params", async () => {
    const params = {
      hrn: "mocked-hrn",
      region: "mocked-region"
    };

    const result = await LookupApi.resourceAPIList(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getResourceAPIList method with all required params", async () => {
    const params = {
      hrn: "mocked-hrn"
    };

    const result = await LookupApi.getResourceAPIList(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getResourceAPIList method with all required and optional params", async () => {
    const params = {
      hrn: "mocked-hrn",
      region: "mocked-region"
    };

    const result = await LookupApi.getResourceAPIList(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
