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

chai.use(sinonChai);

const expect = chai.expect;

const mockserver = require("mockserver-node");
const mockServerClient = require("mockserver-client").mockServerClient;

const SERVER_PORT = 8081;
const SERVER_HOST = "localhost";
const MOCKED_STREAM_LAYER_ID = "mocked-stream-layer-id";
const MOCKED_CATALOG_WITH_STREAM_LAYER_HRN =
  "hrn:here:data:::mocked-catalog-for-testing-stream-layer";
const MOCKED_STREAM_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}/stream/v2/catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}`;

import "@here/olp-sdk-fetch";

import {
  OlpClientSettings,
  StreamLayerClient,
  HRN,
  SubscribeRequest
} from "@here/olp-sdk-dataservice-read";

describe("Stream Layer Client Read Data", async () => {
  const olpClientSettings = new OlpClientSettings({
    environment: `http://${SERVER_HOST}:${SERVER_PORT}`,
    getToken: () => Promise.resolve("mocked-token-string")
  });

  before(async () => {
    await mockserver.start_mockserver({
      serverPort: SERVER_PORT,
      verbose: true
    });
    console.log("Started Mocked Server\n");
  });

  after(async () => {
    await mockserver.stop_mockserver({
      serverPort: SERVER_PORT
    });

    console.log("Stoped Mocked Server\n");
  });

  it("Subscribe to the layer success", async () => {
    const client = new StreamLayerClient({
      catalogHrn: HRN.fromString(MOCKED_CATALOG_WITH_STREAM_LAYER_HRN),
      layerId: MOCKED_STREAM_LAYER_ID,
      settings: olpClientSettings
    });

    await mockServerClient(SERVER_HOST, SERVER_PORT)
      .mockAnyResponse([
        {
          httpRequest: {
            path: `/resources/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/apis`
          },
          httpResponse: {
            statusCode: 200,
            body: JSON.stringify([
              {
                api: "stream",
                version: "v2",
                baseURL: MOCKED_STREAM_BASE_URL,
                parameters: {}
              }
            ])
          }
        },
        {
          httpRequest: {
            path: `/stream/v2/catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/layers/${MOCKED_STREAM_LAYER_ID}/subscribe`,
            method: "POST",
            queryStringParameters: {
              mode: ["serial"]
            }
          },
          httpResponse: {
            statusCode: 200,
            body: JSON.stringify({
              nodeBaseURL: `/stream/v2/stream-catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}`,
              subscriptionId: "882990694"
            })
          }
        }
      ])
      .then(
        () => {
          console.log(
            "Created expectations.\nMock server training finished.\n"
          );
        },
        (error: any) => {
          console.log(error);
        }
      );

    const subscriptionId = await client.subscribe(
      new SubscribeRequest().withMode("serial")
    );
    expect(subscriptionId).equal("882990694");
  });
});
