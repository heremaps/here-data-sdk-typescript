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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import * as dataServiceRead from "../../lib";

import { BlobApi, StreamApi, HttpError } from "@here/olp-sdk-dataservice-api";
import { SubscribeRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StreamLayerClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let subscribeStub: sinon.SinonStub;
    let pollStub: sinon.SinonStub;
    let commitOffsetsStub: sinon.SinonStub;
    let getBlobStub: sinon.SinonStub;
    let streamLayerClient: dataServiceRead.StreamLayerClient;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        const params = {
            catalogHrn: mockedHRN,
            layerId: mockedLayerId,
            settings: (settings as unknown) as dataServiceRead.OlpClientSettings
        };
        streamLayerClient = new dataServiceRead.StreamLayerClient(params);
    });

    beforeEach(() => {
        getBlobStub = sandbox.stub(BlobApi, "getBlob");
        subscribeStub = sandbox.stub(StreamApi, "subscribe");
        pollStub = sandbox.stub(StreamApi, "consumeData");
        commitOffsetsStub = sandbox.stub(StreamApi, "commitOffsets");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialized", async () => {
        assert.isDefined(streamLayerClient);
        expect(streamLayerClient).be.instanceOf(
            dataServiceRead.StreamLayerClient
        );
        assert.equal(streamLayerClient.layerId, mockedLayerId);
        assert.equal(streamLayerClient.catalogHrn, mockedHRN);
        expect(streamLayerClient.settings).be.instanceOf(
            dataServiceRead.OlpClientSettings
        );
    });

    it("Should subscribe method post data and return subscription id", async () => {
        const headers = new Headers();
        headers.append("X-Correlation-Id", "9141392.f96875c-9422-4df4-b5ff");
        const mockResponse = {
            headers,
            subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459",
            json: function() {
                return this.subscriptionId;
            }
        };
        subscribeStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<StreamApi.ConsumerSubscribeResponse> => {
                return Promise.resolve(mockResponse);
            }
        );

        const request = new dataServiceRead.SubscribeRequest();
        const subscription = await streamLayerClient.subscribe(request);

        assert.isDefined(subscription);
        expect(subscription).to.be.equal(mockResponse.subscriptionId);
    });

    it("Should subscribe be aborted fetching by abort signal", async () => {
        const mockResponse = {
            nodeBaseURL: "https://mock-url/hrn/id",
            subscriptionId: "-9141392.f96875c-9422-4df4-b5ff-41a4f459"
        };

        subscribeStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<StreamApi.ConsumerSubscribeResponse> => {
                return builder.abortSignal.aborted
                    ? Promise.reject("AbortError")
                    : Promise.resolve(mockResponse);
            }
        );

        const request = new dataServiceRead.SubscribeRequest();
        const abortController = new AbortController();

        streamLayerClient
            .subscribe(
                (request as unknown) as dataServiceRead.SubscribeRequest,
                abortController.signal
            )
            .then()
            .catch((err: any) => {
                assert.strictEqual(err, "AbortError");
                assert.isTrue(abortController.signal.aborted);
            });

        abortController.abort();
    });

    it("Should baseUrl error be handled in the subscribe method", async () => {
        const mockedErrorResponse = "Bad response";
        const request = new dataServiceRead.SubscribeRequest();

        getBaseUrlRequestStub.callsFake(() =>
            Promise.reject({
                status: 400,
                statusText: "Bad response"
            })
        );

        const subscription = await streamLayerClient
            .subscribe(request)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse, error.statusText);
            });
    });

    it("Should poll method get data, post offsets and return messages", async () => {
        const headers = new Headers();
        const commitOffsetsResponse = ("Ok" as unknown) as Response;
        headers.append("X-Correlation-Id", "9141392.f96875c-9422-4df4-bdfj");
        const mockResponse = ({
            headers,
            json: () => {
                return {
                    messages: [
                        {
                            metaData: {
                                partition: "314010583",
                                checksum: "ff7494d6f17da702862e550c907c0a91",
                                compressedDataSize: 152417,
                                dataSize: 100500,
                                data: "",
                                dataHandle:
                                    "iVBORw0-Lf9HdIZBfNEiKAA-AAAE-lFTkSuQmCC",
                                timestamp: 1517916706
                            },
                            offset: {
                                partition: 7,
                                offset: 38562
                            }
                        },
                        {
                            metaData: {
                                partition: "314010584",
                                checksum: "ff7494d6f17da702862e550c907c0a91",
                                dataSize: 100500,
                                data:
                                    "7n348c7y49nry394y39yv39y384tvn3984tvn34ty034ynt3yvt983ny",
                                dataHandle: "",
                                timestamp: 1517916707
                            },
                            offset: {
                                partition: 8,
                                offset: 38563
                            }
                        }
                    ]
                };
            }
        } as unknown) as Response;
        pollStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockResponse);
            }
        );

        commitOffsetsStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(commitOffsetsResponse);
            }
        );

        const request = new dataServiceRead.PollRequest();
        const messages = await streamLayerClient.poll(request);

        assert.isDefined(messages);
        expect(messages.length).to.be.equal(2);
        expect(messages[0].metaData.dataSize).to.be.equal(100500);
    });

    it("Should poll be aborted fetching by abort signal", async () => {
        const mockResponse = ({
            metaData: {},
            offset: {}
        } as unknown) as Response;

        pollStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return builder.abortSignal.aborted
                    ? Promise.reject("AbortError")
                    : Promise.resolve(mockResponse);
            }
        );

        const request = new dataServiceRead.PollRequest();
        const abortController = new AbortController();

        streamLayerClient
            .poll(
                (request as unknown) as dataServiceRead.PollRequest,
                abortController.signal
            )
            .then()
            .catch((err: any) => {
                assert.strictEqual(err, "AbortError");
                assert.isTrue(abortController.signal.aborted);
            });

        abortController.abort();
    });

    it("Should baseUrl error be handled in the poll method", async () => {
        const mockedErrorResponse = "Bad response";
        const request = new dataServiceRead.PollRequest();

        it("Should method getData call API with correct arguments", async () => {
            const mockedBlobData: Response = new Response(
                "mocked-blob-response"
            );
            const mockedMessage = {
                metaData: {
                    partition: "314010583",
                    checksum: "ff7494d6f17da702862e550c907c0a91",
                    compressedDataSize: 152417,
                    dataSize: 250110,
                    data: "",
                    dataHandle:
                        "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
                    timestamp: 1517916706
                },
                offset: {
                    partition: 7,
                    offset: 38562
                }
            };
            getBlobStub.callsFake(
                (builder: any, params: any): Promise<Response> => {
                    return Promise.resolve(mockedBlobData);
                }
            );

            await streamLayerClient.getData(mockedMessage);
            expect(getBlobStub.getCalls()[0].args[1].dataHandle).to.be.equal(
                mockedMessage.metaData.dataHandle
            );
        });

        it("Should method getData return Error without parameters", async () => {
            const mockedMessage = {
                metaData: {
                    partition: "314010583"
                },
                offset: {
                    partition: 7,
                    offset: 38562
                }
            };

            const mockedErrorResponse = {
                message: "No data handle for this partition"
            };

            await streamLayerClient.getData(mockedMessage).catch(error => {
                assert.isDefined(error);
                assert.equal(mockedErrorResponse.message, error.message);
            });
        });

        it("Should error be handled", async () => {
            const mockedMessage = {
                metaData: {
                    partition: "314010583",
                    checksum: "ff7494d6f17da702862e550c907c0a91",
                    compressedDataSize: 152417,
                    dataSize: 250110,
                    data: "",
                    dataHandle:
                        "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
                    timestamp: 1517916706
                },
                offset: {
                    partition: 7,
                    offset: 38562
                }
            };

            const mockedErrorResponse = "mocked-error";

            getBlobStub.callsFake(
                (builder: any, params: any): Promise<Response> => {
                    return Promise.reject("mocked-error");
                }
            );

            const response = await streamLayerClient
                .getData(mockedMessage)
                .catch(error => {
                    assert.isDefined(error);
                    assert.equal(mockedErrorResponse, error);
                });
        });

        it("Should base url error be handled", async () => {
            const mockedMessage = {
                metaData: {
                    partition: "314010583",
                    checksum: "ff7494d6f17da702862e550c907c0a91",
                    compressedDataSize: 152417,
                    dataSize: 250110,
                    data: "",
                    dataHandle:
                        "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
                    timestamp: 1517916706
                },
                offset: {
                    partition: 7,
                    offset: 38562
                }
            };
            const mockedErrorResponse = "Bad response";

            getBaseUrlRequestStub.callsFake(() =>
                Promise.reject({
                    status: 400,
                    statusText: "Bad response"
                })
            );

            const messages = await streamLayerClient
                .poll(request)
                .catch(error => {
                    assert.isDefined(error);
                    assert.equal(mockedErrorResponse, error.statusText);
                });

            const response = await streamLayerClient
                .getData(mockedMessage)
                .catch(error => {
                    assert.isDefined(error);
                    assert.equal(mockedErrorResponse, error.statusText);
                });
        });

        it("Should HttpError be handled", async () => {
            const TEST_ERROR_CODE = 404;
            const mockedError = new HttpError(TEST_ERROR_CODE, "Test Error");

            const mockedMessage = {
                metaData: {
                    partition: "314010583",
                    checksum: "ff7494d6f17da702862e550c907c0a91",
                    compressedDataSize: 152417,
                    dataSize: 250110,
                    data: "",
                    dataHandle:
                        "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAABhQTFRFvb29AACEAP8AhIKEPb5x2m9E5413aFQirhRuvAMqCw+6kE2BVsa8miQaYSKyshxFvhqdzKx8UsPYk9gDEcY1ghZXcPbENtax8g5T+3zHYufF1Lf9HdIZBfNEiKAAAAAElFTkSuQmCC",
                    timestamp: 1517916706
                },
                offset: {
                    partition: 7,
                    offset: 38562
                }
            };

            getBlobStub.callsFake(
                (builder: any, params: any): Promise<Response> => {
                    return Promise.reject(mockedError);
                }
            );

            const response = await streamLayerClient
                .getData(mockedMessage)
                .catch(err => {
                    assert.isDefined(err);
                    expect(err.status).to.be.equal(TEST_ERROR_CODE);
                    expect(err.message).to.be.equal("Test Error");
                    expect(err.name).to.be.equal("HttpError");
                });
        });
    });
});
