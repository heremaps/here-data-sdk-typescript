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

import { StreamApi } from "@here/olp-sdk-dataservice-api";
import { RequestBuilder, UrlBuilder } from "../lib/RequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("StreamApi", () => {
    it("Should commitOffsets works as expected", async () => {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/offsets?subscriptionId=test-subscriptionId&mode=serial"
                );
                expect(options.method).to.be.equal("PUT");
                return Promise.resolve();
            }
        } as RequestBuilder;

        await StreamApi.commitOffsets(builder, {
            layerId: "mocked-id",
            subscriptionId: "test-subscriptionId",
            xCorrelationId: "test-xCorrelationId",
            mode: "serial",
            commitOffsets: {
                offsets: [
                    {
                        partition: 25,
                        offset: 3
                    }
                ]
            }
        });
    });

    it("Should doCommitOffsets works as expected", async () => {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/offsets?subscriptionId=test-subscriptionId&mode=serial"
                );
                expect(options.method).to.be.equal("PUT");
                return Promise.resolve() as any;
            }
        } as RequestBuilder;

        await StreamApi.doCommitOffsets(builder, {
            layerId: "mocked-id",
            subscriptionId: "test-subscriptionId",
            xCorrelationId: "test-xCorrelationId",
            mode: "serial",
            commitOffsets: {
                offsets: [
                    {
                        partition: 25,
                        offset: 3
                    }
                ]
            }
        });
    });

    it("Should subscribe works as expected", async () => {
        const builder = ({
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/subscribe?mode=parallel&subscriptionId=testSubsId&consumerId=testConsumerId"
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve();
            }
        } as unknown) as RequestBuilder;

        await StreamApi.subscribe(builder, {
            layerId: "mocked-id",
            mode: "parallel",
            subscriptionId: "testSubsId",
            consumerId: "testConsumerId",
            subscriptionProperties: {
                autoCommitIntervalMs: 25,
                autoOffsetReset: "earliest"
            }
        });
    });

    it("Should consumeData works as expected", async () => {
        const builder = ({
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/partitions?subscriptionId=testSubsId&mode=parallel"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve();
            }
        } as unknown) as RequestBuilder;

        await StreamApi.consumeData(builder, {
            layerId: "mocked-id",
            mode: "parallel",
            subscriptionId: "testSubsId",
            xCorrelationId: "testxCorrelationId"
        });
    });

    it("Should seekToOffset works as expected", async () => {
        const builder = ({
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/seek?subscriptionId=testSubsId&mode=parallel"
                );
                expect(options.method).to.be.equal("PUT");
                return Promise.resolve();
            }
        } as unknown) as RequestBuilder;

        await StreamApi.seekToOffset(builder, {
            layerId: "mocked-id",
            mode: "parallel",
            subscriptionId: "testSubsId",
            xCorrelationId: "testxCorrelationId",
            seekOffsets: {
                offsets: [
                    {
                        partition: 88,
                        offset: 69
                    }
                ]
            }
        });
    });

    it("Should deleteSubscription works as expected", async () => {
        const builder = {
            baseUrl: "http://mocked.url",
            requestBlob: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/subscribe?subscriptionId=testSubsId&mode=parallel"
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve() as any;
            }
        } as RequestBuilder;

        await StreamApi.deleteSubscription(builder, {
            layerId: "mocked-id",
            mode: "parallel",
            subscriptionId: "testSubsId",
            xCorrelationId: "testxCorrelationId"
        });
    });

    it("Should endpoint works as expected", async () => {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/endpoint"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve();
            }
        } as RequestBuilder;

        await StreamApi.endpoint(builder, {
            layerId: "mocked-id"
        });
    });

    it("Should endpointByConsumer works as expected", async () => {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: UrlBuilder, options: any) => {
                expect(urlBuilder.url).to.be.equal(
                    "http://mocked.url/layers/mocked-id/producer/endpoint"
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve();
            }
        } as RequestBuilder;

        await StreamApi.endpointByConsumer(builder, {
            layerId: "mocked-id",
            type: "producer"
        });
    });
});
