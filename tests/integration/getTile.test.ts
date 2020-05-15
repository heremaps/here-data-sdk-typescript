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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import {
  OlpClientSettings,
  HRN,
  TileRequest,
  quadKeyFromMortonCode,
  getTile,
  TileRequestParams
} from "@here/olp-sdk-dataservice-read";
import { FetchMock } from "./FetchMock";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("getTile", () => {
  let fetchMock: FetchMock;
  let sandbox: sinon.SinonSandbox;
  let fetchStub: sinon.SinonStub;
  let settings: OlpClientSettings;

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

    // Setup settings with new OlpClientSettings.
    settings = new OlpClientSettings({
      environment: "here",
      getToken: () => Promise.resolve("test-token-string")
    });
  });

  it("Should fetch the blob for specific QuadKey and cache Quad Tree Index from parent with delta 4", async () => {
    const mockedResponses = new Map();
    const mockedCatalogHrn = "hrn:here:data::olp-here:mocked";
    const mockedLayerId = "mocked-layer-id";
    const mockedCatalogVersion = 123;
    const mockedDataHandle = "ECD6C103FEC73E81E6B32A80699AE6CA.123";
    const mockedDataHandle2 = "59AA538D8F6D67256FFD521724F72D80.123";
    const mockedBlobSize = 42;
    const mockedBlobSize2 = 100;

    // Set the response from lookup api with the info about Blob and Query services.
    mockedResponses.set(
      `https://api-lookup.data.api.platform.here.com/lookup/v1/resources/${mockedCatalogHrn}/apis`,
      new Response(
        JSON.stringify([
          {
            api: "blob",
            version: "v1",
            baseURL: "https://blob.data.api.platform.here.com/v1",
            parameters: {
              additionalProp1: "string",
              additionalProp2: "string",
              additionalProp3: "string"
            }
          },
          {
            api: "query",
            version: "v1",
            baseURL: "https://query.data.api.platform.here.com/v1",
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

    // Set the response from Query services.
    mockedResponses.set(
      `https://query.data.api.platform.here.com/v1/layers/${mockedLayerId}/versions/123/quadkeys/390625/depths/4`,
      new Response(
        JSON.stringify({
          subQuads: [
            {
              subQuadKey: "381",
              version: 123,
              dataHandle: mockedDataHandle
            },
            {
              subQuadKey: "285",
              version: 123,
              dataHandle: mockedDataHandle2
            }
          ],
          parentQuads: [
            {
              partition: "1525",
              version: 282,
              dataHandle: "8C9B3E08E294ADB2CD07EBC8412062FE.282"
            },
            {
              partition: "23",
              version: 306,
              dataHandle: "FC6388C5624B448E86A469C8740352E2.306"
            }
          ]
        }),
        { headers }
      )
    );

    mockedResponses.set(
      `https://query.data.api.platform.here.com/v1/layers/${mockedLayerId}/versions/123/quadkeys/7/depths/4`,
      new Response(
        JSON.stringify({
          subQuads: [
            {
              subQuadKey: "285",
              version: 123,
              dataHandle: mockedDataHandle2
            }
          ],
          parentQuads: []
        }),
        { headers }
      )
    );

    // Set the response from Blob services.
    mockedResponses.set(
      `https://blob.data.api.platform.here.com/v1/layers/mocked-layer-id/data/${mockedDataHandle}`,
      new Response(Buffer.alloc(mockedBlobSize), { headers })
    );

    mockedResponses.set(
      `https://blob.data.api.platform.here.com/v1/layers/mocked-layer-id/data/${mockedDataHandle2}`,
      new Response(Buffer.alloc(mockedBlobSize2), { headers })
    );

    // Setup the fetch to use mocked responses.
    fetchMock.withMockedResponses(mockedResponses);

    const request = new TileRequest().withCatalogVersion(mockedCatalogVersion);
    const params: TileRequestParams = {
      catalogHrn: HRN.fromString(mockedCatalogHrn),
      layerId: mockedLayerId,
      layerType: "versioned",
      settings
    };

    const response = await getTile(
      request.withTileKey({ row: 3275, column: 8085, level: 13 }),
      params
    );

    assert.isDefined(response);
    const data = await response.blob();
    expect(data.size).to.be.equal(mockedBlobSize);

    const response2 = await getTile(
      request.withTileKey({ row: 2, column: 7, level: 4 }),
      params
    );
    const data2 = await response2.blob();
    expect(data2.size).to.be.equal(mockedBlobSize2);

    const cachedPartition_381 = settings.cache.get(
      "hrn:here:data::olp-here:mocked::mocked-layer-id::123::381::partition"
    );
    const cachedPartition_285 = settings.cache.get(
      "hrn:here:data::olp-here:mocked::mocked-layer-id::123::285::partition"
    );
    const cachedPartition_1525 = settings.cache.get(
      "hrn:here:data::olp-here:mocked::mocked-layer-id::123::1525::partition"
    );
    const cachedPartition_23 = settings.cache.get(
      "hrn:here:data::olp-here:mocked::mocked-layer-id::123::23::partition"
    );

    expect(cachedPartition_381).to.eql(
      '{"partition":"381","version":123,"dataHandle":"ECD6C103FEC73E81E6B32A80699AE6CA.123"}'
    );
    expect(cachedPartition_285).to.eql(
      '{"partition":"285","version":123,"dataHandle":"59AA538D8F6D67256FFD521724F72D80.123"}'
    );
    expect(cachedPartition_1525).to.eql(
      '{"partition":"1525","version":282,"dataHandle":"8C9B3E08E294ADB2CD07EBC8412062FE.282"}'
    );
    expect(cachedPartition_23).to.eql(
      '{"partition":"23","version":306,"dataHandle":"FC6388C5624B448E86A469C8740352E2.306"}'
    );

    /**
     * Should be rejected with error if the QuadKey is not valid
     */
    const response3 = await getTile(new TileRequest(), params).catch(
      e => e.message
    );

    expect(response3).to.equal("Please provide correct QuadKey");

    /**
     * Should be rejected with error if the tile was not found in blob
     */
    const response4 = await getTile(
      request.withTileKey(quadKeyFromMortonCode(1000)),
      params
    ).catch(e => e);

    expect(response4.message).to.equal(
      'Error getting blob for Tile: {"row":30,"column":24,"level":5}'
    );

    /**
     * Two calls getData for specific version
     * and different QuadKeys (one is a subquad) should make 5 calls:
     *
     * 1) Lookup
     * 2) Query
     * 3) Blob for first Tile
     * 4) Blob for second Tile
     * -- Blob for the 3 Tile was rejected without request because of invalid QuadKey
     * 5) Blob for the 4 Tile
     */
    expect(fetchStub.callCount).to.be.equal(5);
  });
});
