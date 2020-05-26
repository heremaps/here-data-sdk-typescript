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
import sinon = require("sinon");

import { VersionedLayerClient } from "@here/olp-sdk-dataservice-write";
import { HRN, OlpClientSettings } from "@here/olp-sdk-core";
import { FetchMock } from "../FetchMock";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("Versioned Layer Client for write", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let settings: OlpClientSettings;

  settings = new OlpClientSettings({
    environment: "here",
    getToken: () => Promise.resolve("mocked-token")
  });
  const catalogHrn = HRN.fromString("hrn:here:data:::mocked-hrn");

  const headers = new Headers();
  headers.append("cache-control", "max-age=3600");

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  beforeEach(() => {
    fetchMock = new FetchMock();
    fetchStub = sandbox.stub(global as any, "fetch");
    fetchStub.callsFake(fetchMock.fetch());

    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("mocked-token")
    });
  });

  it("Should initialize", () => {
    const client = new VersionedLayerClient({
      catalogHrn,
      settings
    });

    assert.isDefined(client);
    expect(client).be.instanceOf(VersionedLayerClient);
  });

  xit("Should fetch the latest version of catalog", async () => {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::mocked-hrn/apis`,
      new Response(
        JSON.stringify([
          {
            api: "metadata",
            version: "v1",
            baseURL: "https://metadata.data.api.platform.here.com/metadata/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ]),
        { headers }
      )
    );

    const mockedVersion = {
      version: 123
    };

    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
      new Response(JSON.stringify(mockedVersion), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const client = new VersionedLayerClient({
      catalogHrn,
      settings
    });
    let versionResponse = await client.getBaseVersion();

    assert.isDefined(versionResponse);

    expect(versionResponse).to.be.equal(123);

    /**
     * Should be two calls:
     *  1 - lookup
     *  2 - metadata
     */
    expect(fetchStub.callCount).to.be.equal(2);
  });
});
