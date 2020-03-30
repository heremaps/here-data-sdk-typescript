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


import { VolatileBlobApi } from "@here/olp-sdk-dataservice-api";
import {
  AuthenticationMessage,
  AuthorizationMessage
} from "@here/olp-sdk-dataservice-api/lib/volatile-blob-api";
import { mockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VolatileBlobApi", () => {
  it("AuthenticationMessage  with all required params", () => {
    const params: AuthenticationMessage = {};

    assert.isDefined(params);
  });

  it("AuthenticationMessage with all required and optional params", () => {
    const params: AuthenticationMessage = {
      error: "test",
      errorDescription: "test"
    };

    assert.isDefined(params);
  });

  it("AuthorizationMessage  with all required params", () => {
    const params: AuthorizationMessage = {};

    assert.isDefined(params);
  });

  it("AuthorizationMessage with all required and optional params", () => {
    const params: AuthorizationMessage = {
      error: "test",
      errorDescription: "test"
    };

    assert.isDefined(params);
  });

  it("Test checkHandleExists method with all required params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test"
    };

    const result = await VolatileBlobApi.checkHandleExists(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test checkHandleExists method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test",
      billingTag: "test"
    };

    const result = await VolatileBlobApi.checkHandleExists(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test deleteVolatileBlob method with all required params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test"
    };

    const result = await VolatileBlobApi.deleteVolatileBlob(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test deleteVolatileBlob method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test",
      billingTag: "test"
    };

    const result = await VolatileBlobApi.deleteVolatileBlob(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getVolatileBlob method with all required params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test"
    };

    const result = await VolatileBlobApi.getVolatileBlob(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test getVolatileBlob method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test",
      billingTag: "test"
    };

    const result = await VolatileBlobApi.getVolatileBlob(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test putVolatileBlob method with all required params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test",
      body: "test"
    };

    const result = await VolatileBlobApi.putVolatileBlob(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });

  it("Test putVolatileBlob method with all required and optional params", async () => {
    const params = {
      layerId: "test",
      dataHandle: "test",
      body: "test",
      billingTag: "test"
    };

    const result = await VolatileBlobApi.putVolatileBlob(
      mockedRequestBuilder,
      params
    );

    expect(result).to.be.equal("success");
  });
});
