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
const MOCKED_SUBSCRIBTION_ID = "882990694";

import "@here/olp-sdk-fetch";

import {
  OlpClientSettings,
  StreamLayerClient,
  HRN,
  SubscribeRequest,
  PollRequest,
  UnsubscribeRequest,
  SeekRequest
} from "@here/olp-sdk-dataservice-read";

describe("Stream Layer Client Read Data", async function() {
  const olpClientSettings = new OlpClientSettings({
    environment: `http://${SERVER_HOST}:${SERVER_PORT}`,
    getToken: () => Promise.resolve("mocked-token-string")
  });

  before(async function() {
    await mockserver.start_mockserver({
      serverPort: SERVER_PORT,
      trace: true
    });
    console.log("Started Mocked Server\n");
  });

  after(async function() {
    await mockserver.stop_mockserver({
      serverPort: SERVER_PORT
    });

    console.log("Stoped Mocked Server\n");
  });

  it("Should Subscribe, Read messages, Read Blob and Unsubscribe from the layer", async function() {
    const client = new StreamLayerClient({
      catalogHrn: HRN.fromString(MOCKED_CATALOG_WITH_STREAM_LAYER_HRN),
      layerId: MOCKED_STREAM_LAYER_ID,
      settings: olpClientSettings
    });

    const MOCKED_DATAHANDLE = "iVBORw0KGgoAAAANSUhEU";
    const MOCKED_DATA =
      "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC";

    const MOCKED_MESSAGE = {
      metaData: {
        partition: "314010583",
        checksum: "ff7494d6f17da702862e550c907c0a91",
        compressedDataSize: 152417,
        dataSize: 250110,
        data: "",
        dataHandle: MOCKED_DATAHANDLE,
        timestamp: 1517916706
      },
      offset: {
        partition: 7,
        offset: 38562
      }
    };

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
              },
              {
                api: "blob",
                version: "v1",
                baseURL: `http://${SERVER_HOST}:${SERVER_PORT}/blob/v1/catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}`,
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
              nodeBaseURL: `http://${SERVER_HOST}:${SERVER_PORT}/stream/v2/stream-catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}`,
              subscriptionId: MOCKED_SUBSCRIBTION_ID
            })
          }
        },
        {
          httpRequest: {
            path: `/stream/v2/stream-catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/layers/${MOCKED_STREAM_LAYER_ID}/subscribe`,
            method: "DELETE",
            queryStringParameters: {
              mode: ["serial"],
              subscriptionId: [MOCKED_SUBSCRIBTION_ID]
            }
          },
          httpResponse: {
            statusCode: 200,
            body: "{}"
          }
        },
        {
          httpRequest: {
            path: `/stream/v2/stream-catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/layers/${MOCKED_STREAM_LAYER_ID}/partitions`,
            method: "GET",
            queryStringParameters: {
              mode: ["serial"],
              subscriptionId: [MOCKED_SUBSCRIBTION_ID]
            }
          },
          httpResponse: {
            statusCode: 200,
            body: JSON.stringify({
              messages: [
                {
                  metaData: {
                    partition: "314010583",
                    checksum: "ff7494d6f17da702862e550c907c0a91",
                    compressedDataSize: 152417,
                    dataSize: 250110,
                    data:
                      "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
                    dataHandle: "",
                    timestamp: 1517916706
                  },
                  offset: {
                    partition: 7,
                    offset: 38562
                  }
                }
              ]
            })
          }
        },
        {
          httpRequest: {
            path: `/stream/v2/stream-catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/layers/${MOCKED_STREAM_LAYER_ID}/offsets`,
            method: "PUT",
            queryStringParameters: {
              mode: ["serial"],
              subscriptionId: [MOCKED_SUBSCRIBTION_ID]
            },
            body: '{"offsets":[{"partition":7,"offset":38562}]}'
          },
          httpResponse: {
            statusCode: 200,
            body: "{}"
          }
        },
        {
          httpRequest: {
            path: `/blob/v1/catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/layers/${MOCKED_STREAM_LAYER_ID}/data/${MOCKED_DATAHANDLE}`,
            method: "GET"
          },
          httpResponse: {
            statusCode: 200,
            body: MOCKED_DATA
          }
        },
        {
          httpRequest: {
            path: `/stream/v2/stream-catalogs/${MOCKED_CATALOG_WITH_STREAM_LAYER_HRN}/layers/${MOCKED_STREAM_LAYER_ID}/seek`,
            method: "PUT",
            queryStringParameters: {
              mode: ["serial"],
              subscriptionId: [MOCKED_SUBSCRIBTION_ID]
            },
            body: '{"offsets":[{"partition":7,"offset":38562}]}'
          },
          httpResponse: {
            statusCode: 200,
            body: "{}"
          }
        }
      ])
      .then(
        function() {
          console.log(
            "Created expectations.\nMock server training finished.\n"
          );
        },
        (error: any) => {
          console.log(error);
        }
      );

    // Test subscribtion
    const subscriptionId = await client.subscribe(
      new SubscribeRequest().withMode("serial")
    );
    expect(subscriptionId).equal(MOCKED_SUBSCRIBTION_ID);

    // Test pull messages
    const messages = await client.poll(
      new PollRequest().withMode("serial").withSubscriptionId(subscriptionId)
    );
    expect(messages.length).equals(1);
    expect(messages[0].metaData.partition).equals("314010583");

    // Test unsubscribtion
    const unsubscribeResponse = await client.unsubscribe(
      new UnsubscribeRequest()
        .withMode("serial")
        .withSubscriptionId(MOCKED_SUBSCRIBTION_ID)
    );
    expect(unsubscribeResponse.status).equals(200);

    // Test reading blob
    const data = await client.getData(MOCKED_MESSAGE).then(res => res.text());
    expect(data).equals(MOCKED_DATA);

    // Test seek method
    const seekResponse = await client.seek(
      new SeekRequest()
        .withSubscriptionId(MOCKED_SUBSCRIBTION_ID)
        .withMode("serial")
        .withSeekOffsets({
          offsets: [
            {
              partition: 7,
              offset: 38562
            }
          ]
        })
    );
    expect(seekResponse.status).equals(200);

    // Test handle "nodatahandle" error
    const getDataResponse = await client
      .getData({
        metaData: {
          partition: "314010583",
          checksum: "ff7494d6f17da702862e550c907c0a91",
          compressedDataSize: 152417,
          dataSize: 250110,
          data:
            "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
          dataHandle: "",
          timestamp: 1517916706
        },
        offset: {
          partition: 7,
          offset: 38562
        }
      })
      .catch(err => err.message);
    expect(getDataResponse).equals("No data handle for this partition");

    // Test subscribtion error handling
    const subscribeResponse = await client
      .subscribe(
        new SubscribeRequest()
          .withConsumerId("test-id")
          .withSubscriptionProperties({})
      )
      .catch(err => err.message);
    expect(subscribeResponse).equals("Not Found");

    // Test Poll error handling
    const pollResponse = await client
      .poll(new PollRequest())
      .catch(err => err.message);
    expect(pollResponse).equals("Not Found");

    client["subscribtionNodeBaseUrl"] = undefined;
    const pollResponse2 = await client
      .poll(new PollRequest())
      .catch(err => err.message);
    expect(pollResponse2).equals(
      "No valid nodeBaseurl provided for the subscribtion id=undefined, please check your subscribtion"
    );

    // Test Seek error handling
    const seekResponseErr = await client
      .seek(new SeekRequest())
      .catch(err => err.message);
    expect(seekResponseErr).equals("Error: offsets are required.");
  });
});
