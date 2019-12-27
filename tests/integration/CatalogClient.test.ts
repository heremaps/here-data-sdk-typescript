/*
 * Copyright (C) 2019 HERE Europe B.V.
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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  OlpClientSettings,
  HRN,
  CatalogVersionRequest,
  CatalogClient
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogClient", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let catalogClient: CatalogClient;
  let settings: OlpClientSettings;

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

    // Setup Catalog Client with new OlpClientSettings.
    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    catalogClient = new CatalogClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      settings
    );
  });

  it("Shoud be initialized with settings", async () => {
    assert.isDefined(catalogClient);
    expect(catalogClient).to.be.instanceOf(CatalogClient);
  });

  it("Get the information about all catalog versions", async () => {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/metadata/v1`,
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
        ])
      )
    );

    const mockedVersions = {
      versions: [
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 1
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 2
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 3
        },
        {
          dependencies: [
            {
              direct: false,
              hrn: "hrn:here:data:::my-catalog",
              version: 23
            }
          ],
          partitionCounts: {
            additionalProp1: 0,
            additionalProp2: 0,
            additionalProp3: 0
          },
          timestamp: "1516397474657",
          version: 50
        }
      ]
    };

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/versions?startVersion=1&endVersion=50`,
      new Response(JSON.stringify(mockedVersions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new CatalogVersionRequest()
      .withStartVersion(1)
      .withEndVersion(50);

    let versionsResponse = await catalogClient.getVersions(request);

    assert.isDefined(versionsResponse);

    expect(versionsResponse.versions[0].version).to.be.equal(1);
    expect(versionsResponse.versions[1].version).to.be.equal(2);
    expect(versionsResponse.versions[2].version).to.be.equal(3);
    expect(versionsResponse.versions[3].version).to.be.equal(50);

    expect(fetchStub.callCount).to.be.equal(2);
  });
});
