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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import * as dataServiceRead from "../../lib";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";
chai.use(sinonChai);
const expect = chai.expect;

class MockedHrn {
    constructor(private readonly data: dataServiceRead.HRNData) {}
    toString(): string {
        return (
            "hrn:" +
            this.data.partition +
            ":" +
            this.data.service +
            ":" +
            (this.data.region === undefined ? "" : this.data.region) +
            ":" +
            (this.data.account === undefined ? "" : this.data.account) +
            ":" +
            this.data.resource
        );
    }
}

class MockedOlpClientSettings {
    private keyValueCache = new Map();

    constructor() {}
    get cache() {
        return this.keyValueCache;
    }
    get environment() {
        return "test-env";
    }
    get token() {
        return Promise.resolve("mocked-token");
    }
    get downloadManager() {
        return {
            download: (url: string) => Promise.resolve("mocked-results")
        };
    }
}

class MockedApiCacheRepository {
    private readonly hrn: string;
    constructor(private readonly cache: Map<string, string>, hrn?: MockedHrn) {
        this.hrn = hrn ? hrn.toString() : "plathorm-api";
    }

    public get(service: string, serviceVersion: string) {
        return this.cache.get(`${service}-${serviceVersion}`);
    }

    public put(
        serviceName: string,
        serviceVersion: string,
        baseURL: string
    ): boolean {
        this.cache.set(`${serviceName}-${serviceVersion}`, baseURL);
        return true;
    }
}

class MockedDataStoreRequestBuilder {
    constructor(
        readonly downloadManager: dataServiceRead.DownloadManager,
        public readonly baseUrl: string,
        private readonly getBearerToken: () => Promise<string>
    ) {}
}

describe("RequestFactory", () => {
    let ApiCacheRepositoryStub: sinon.SinonStub;
    let DataStoreRequestBuilderStub: sinon.SinonStub;

    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        ApiCacheRepositoryStub = sandbox.stub(
            dataServiceRead,
            "ApiCacheRepository"
        );
        ApiCacheRepositoryStub.callsFake(
            (cache, hrn) => new MockedApiCacheRepository(cache, hrn)
        );

        DataStoreRequestBuilderStub = sandbox.stub(
            dataServiceRead,
            "DataStoreRequestBuilder"
        );
        DataStoreRequestBuilderStub.callsFake((dm, url, token) => {
            return new MockedDataStoreRequestBuilder(dm, url, token);
        });

        sandbox
            .stub(dataServiceRead, "getEnvLookUpUrl")
            .callsFake(() => "http://fake-lookup.service.url");
    });

    describe("create()", () => {
        it("Should return created RequestBuilder with correct base url for platform service", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "platformAPIList")
                .callsFake(() =>
                    Promise.resolve([
                        {
                            api: "statistics",
                            version: "v1",
                            baseURL:
                                "test-base-url-to-platform-service-for-request-builder"
                        }
                    ])
                );

            const settings = new MockedOlpClientSettings();
            const requestBuilder = await dataServiceRead.RequestFactory.create(
                "statistics",
                "v1",
                settings as any
            );

            expect(requestBuilder.baseUrl).to.be.equal(
                "test-base-url-to-platform-service-for-request-builder"
            );
        });

        it("Should reject with correct error about base url", async () => {
            sandbox.stub(dataServiceApi.LookupApi, "platformAPIList").callsFake(
                () =>
                    Promise.resolve({
                        status: 204,
                        title: "No content"
                    }) as any
            );

            const settings = new MockedOlpClientSettings();

            try {
                await dataServiceRead.RequestFactory.create(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.message).to.be.equal("No content");
            }
        });
    });

    describe("getBaseUrl()", () => {
        it("Should return correct base url for platform service", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "platformAPIList")
                .callsFake(() =>
                    Promise.resolve([
                        {
                            api: "statistics",
                            version: "v1",
                            baseURL: "test-base-url-to-platform-service"
                        }
                    ])
                );
            const settings = new MockedOlpClientSettings();
            const baseUrl = await dataServiceRead.RequestFactory.getBaseUrl(
                "statistics",
                "v1",
                settings as any
            );
            expect(baseUrl).to.be.equal("test-base-url-to-platform-service");
        });

        it("Should return correct base url for resource service", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "resourceAPIList")
                .callsFake(() =>
                    Promise.resolve([
                        {
                            api: "statistics",
                            version: "v1",
                            baseURL: "test-base-url-to-resource-service"
                        }
                    ])
                );
            const settings = new MockedOlpClientSettings();

            const baseUrl = await dataServiceRead.RequestFactory.getBaseUrl(
                "statistics",
                "v1",
                settings as any,
                new MockedHrn({
                    partition: "here-dev",
                    resource: "here-test-resource",
                    service: "here-test-service"
                }) as any
            );
            expect(baseUrl).to.be.equal("test-base-url-to-resource-service");
        });

        it("Should reject with correct error message", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "platformAPIList")
                .callsFake(() =>
                    Promise.resolve({
                        status: 404,
                        title: "Service Not Found",
                        detail: []
                    })
                );
            const settings = new MockedOlpClientSettings();
            try {
                await dataServiceRead.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.message).to.be.equal("Service Not Found");
            }
        });

        it("Should reject with correct custom error message", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "platformAPIList")
                .callsFake(() => Promise.resolve({}));
            const settings = new MockedOlpClientSettings();
            try {
                await dataServiceRead.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.message).to.be.equal("No content");
            }
        });

        it("Should reject with not found error message", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "platformAPIList")
                .callsFake(() =>
                    Promise.resolve([
                        {
                            api: "metadata",
                            version: "v1",
                            baseURL: "test-base-url-to-platform-service"
                        }
                    ])
                );
            const settings = new MockedOlpClientSettings();
            try {
                await dataServiceRead.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.status).to.be.equal(404);
            }
        });

        it("Should reject with not found error message for hrn", async () => {
            sandbox
                .stub(dataServiceApi.LookupApi, "resourceAPIList")
                .callsFake(() =>
                    Promise.resolve([
                        {
                            api: "metadata",
                            version: "v1",
                            baseURL: "test-base-url-to-platform-service"
                        }
                    ])
                );
            const settings = new MockedOlpClientSettings();
            try {
                await dataServiceRead.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any,
                    new MockedHrn({
                        partition: "here-dev",
                        resource: "here-test-resource",
                        service: "here-test-service"
                    }) as any
                );
            } catch (error) {
                expect(error.status).to.be.equal(404);
                expect(error.message).to.be.equal(
                    "No BaseUrl found for statistics, v1 hrn:here-dev:here-test-service:::here-test-resource"
                );
            }
        });

        it("Should return correct base url for resource service from cache", async () => {
            const resourceApiStub = sandbox.stub(
                dataServiceApi.LookupApi,
                "resourceAPIList"
            );
            const platformApiStub = sandbox.stub(
                dataServiceApi.LookupApi,
                "platformAPIList"
            );
            const settings = new MockedOlpClientSettings();
            settings.cache.set("statistics-v1", "test-cached-service-url");

            const baseUrl = await dataServiceRead.RequestFactory.getBaseUrl(
                "statistics",
                "v1",
                settings as any,
                new MockedHrn({
                    partition: "here-dev",
                    resource: "here-test-resource",
                    service: "here-test-service"
                }) as any
            );
            expect(baseUrl).to.be.equal("test-cached-service-url");
            expect(resourceApiStub.callCount).to.be.equal(0);
            expect(platformApiStub.callCount).to.be.equal(0);
        });
    });
});
