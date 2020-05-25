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
  RequestFactory
} from "@here/olp-sdk-dataservice-read";
import { MetadataApi } from "@here/olp-sdk-dataservice-api";
import { FetchMock } from "../FetchMock";

chai.use(sinonChai);
const expect = chai.expect;

describe("CatalogClient", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
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
  });

  it("Should be passsed parameter Range to the headers of the metadata request", async () => {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Metadata service.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data::olp-here:rib-2/apis`,
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

    const mockedPartitions = {
      partitions: [
        {
          checksum: "291f66029c232400e3403cd6e9cfd36e",
          compressedDataSize: 1024,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
          dataSize: 1024,
          crc: "c3f276d7",
          partition: "314010583"
        },
        {
          checksum: "123f66029c232400e3403cd6e9cfd45b",
          compressedDataSize: 2084,
          dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640578e",
          dataSize: 2084,
          crc: "c3f2766y",
          partition: "1000"
        }
      ],
      next: "/uri/to/next/page"
    };

    // Set the response from Metadata service with the versions info from the catalog.
    mockedResponses.set(
      `https://metadata.data.api.platform.here.com/metadata/v1/layers/cartography/partitions?version=842`,
      new Response(JSON.stringify(mockedPartitions))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const requestBuilder = await RequestFactory.create(
      "metadata",
      "v1",
      settings,
      HRN.fromString("hrn:here:data::olp-here:rib-2")
    );

    const partitions = await MetadataApi.getPartitions(requestBuilder, {
      layerId: "cartography",
      version: 842,
      range: "bytes=10-"
    });

    const callsToApi = fetchStub.getCalls();
    const callToMetadata = callsToApi[1];

    expect(callsToApi.length).equals(2); // First to lookup api, second to the Metadata API.
    expect(mockedPartitions).equals(mockedPartitions);
    expect(callToMetadata.args[1].headers.get("Authorization")).equals(
      "Bearer test-token-string"
    );
    expect(callToMetadata.args[1].headers.get("Range")).equals("bytes=10-");
  });
});
