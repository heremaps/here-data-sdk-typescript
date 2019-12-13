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
  VersionedLayerClient,
  OlpClientSettings,
  HRN,
  PartitionsRequest
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("VersionedLayerClient", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;

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
  });

  it("Shoud be initialised with settings", async () => {
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );
    assert.isDefined(layerClient);
    expect(layerClient).to.be.instanceOf(VersionedLayerClient);
  });

  it("Shoud be fetched partitions metadata for specific IDs", async () => {
    const mockedResponses = new Map();

    // Set the response from lookup api with the info about Query API.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/hrn:here:data:::test-hrn/apis/query/v1`,
      new Response(
        JSON.stringify([
          {
            api: "query",
            version: "v1",
            baseURL: "https://query.data.api.platform.here.com/query/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          }
        ])
      )
    );

    // Set the response with mocked partitions for IDs 100 and 1000 from Query service
    mockedResponses.set(
      `https://query.data.api.platform.here.com/query/v1/layers/test-layed-id/partitions?partition=100&partition=1000`,
      new Response(
        JSON.stringify({
          partitions: [
            {
              checksum: "291f66029c232400e3403cd6e9cfd36e",
              compressedDataSize: 1024,
              dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640510c",
              dataSize: 1024,
              crc: "c3f276d7",
              partition: "100",
              version: 2
            },
            {
              checksum: "123f66029c232400e3403cd6e9cfd45b",
              compressedDataSize: 2084,
              dataHandle: "1b2ca68f-d4a0-4379-8120-cd025640578e",
              dataSize: 2084,
              crc: "c3f2766y",
              partition: "1000",
              version: 2
            }
          ]
        })
      )
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    // Setup Layer Client with new OlpClientSettings.
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );

    // Setup PartitionsRequest to filter response by partition IDs 100 and 1000.
    const request = new PartitionsRequest().withPartitionIds(["100", "1000"]);

    // Send request for partitions metadata.
    const partitions = await layerClient.getPartitions(request).catch(error => {
      console.log(`Error getting partitions: ${error}`);
    });

    // Check if partitions fetched succesful.
    assert.isDefined(partitions);

    if (partitions) {
      // Check if partitions returns as expected.
      expect(partitions.partitions[0].dataHandle).to.be.equal(
        "1b2ca68f-d4a0-4379-8120-cd025640510c"
      );
      expect(partitions.partitions[1].dataHandle).to.be.equal(
        "1b2ca68f-d4a0-4379-8120-cd025640578e"
      );
      expect(partitions.partitions[2]).to.be.undefined;

      /**
       * Check if the count of requests are as expected. Should be called 2 times. One to the lookup service
       * for the baseURL to the Query service and another one to the query service.
       */
      expect(fetchStub.callCount).to.be.equal(2);
    }
  });

  it("Shoud be fetched partitions all metadata", async () => {
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

    // Set the response from Metadata service with the info about latest catalog version.
    mockedResponses.set(
        `https://metadata.data.api.platform.here.com/metadata/v1/versions/latest?startVersion=-1`,
        new Response(JSON.stringify({"version": 128}))
    );

    // Set the response of mocked partitions from metadata service.
    mockedResponses.set(
        `https://metadata.data.api.platform.here.com/metadata/v1/layers/test-layed-id/partitions?version=128`,
        new Response(JSON.stringify(
            {
                "partitions": [
                  {
                    "checksum": "291f66029c232400e3403cd6e9cfd36e",
                    "compressedDataSize": 1024,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640510c",
                    "dataSize": 1024,
                    "crc": "c3f276d7",
                    "partition": "314010583",
                    "version": 1
                  },
                  {
                    "checksum": "123f66029c232400e3403cd6e9cfd45b",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd025640578e",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  },
                  {
                    "checksum": "123f66029c232400e3403cd6e9cfd345",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd0256405444",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  },{
                    "checksum": "123f66029c232400e3403cd6e9cfd234",
                    "compressedDataSize": 2084,
                    "dataHandle": "1b2ca68f-d4a0-4379-8120-cd0256405555",
                    "dataSize": 2084,
                    "crc": "c3f2766y",
                    "partition": "1000",
                    "version": 2
                  }
                ],
                "next": "/uri/to/next/page"
              }
        ))
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    // Setup Layer Client with new OlpClientSettings.
    const settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
    const layerClient = new VersionedLayerClient(
      HRN.fromString("hrn:here:data:::test-hrn"),
      "test-layed-id",
      settings
    );

    // Setup PartitionsRequest without any parameters
    const request = new PartitionsRequest();

    // Send request for partitions metadata.
    const partitions = await layerClient.getPartitions(request).catch(error => {
        console.log(`Error getting partitions: ${error}`);
    });

    // Check if partitions fetched succesful.
    assert.isDefined(partitions);

    if (partitions) {
        // Check if partitions returns as expected.
        expect(partitions.partitions[0].dataHandle).to.be.equal(
          "1b2ca68f-d4a0-4379-8120-cd025640510c"
        );
        expect(partitions.partitions[1].dataHandle).to.be.equal(
          "1b2ca68f-d4a0-4379-8120-cd025640578e"
        );
        expect(partitions.partitions.length).to.be.equal(4);
    }

    /**
       * Check if the count of requests are as expected. Should be called 3 times. One to the lookup service
       * for the baseURL to the Metadata service, the second one to the Metadata service for getting the latest version
       * of catalog and another one to the metadata service for the partitions metadata.
       */
      expect(fetchStub.callCount).to.be.equal(3);
  });
});
