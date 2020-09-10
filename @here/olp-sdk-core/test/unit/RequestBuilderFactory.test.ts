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
import * as lib from "@here/olp-sdk-core";
import * as dataServiceApi from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);
const expect = chai.expect;

class MockedHrn {
    constructor(private readonly data: lib.HRNData) {}
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
    private keyValueCache = new lib.LRUCache(50);

    constructor() {}
    get cache() {
        return this.keyValueCache;
    }
    get environment() {
        return "test-env";
    }
    get token() {
        return () => Promise.resolve("mocked-token");
    }
    get downloadManager() {
        return {
            download: (url: string) =>
                Promise.resolve({
                    status: 200,
                    json: () =>
                        Promise.resolve([
                            {
                                api: "account",
                                version: "v1",
                                baseURL: "https://mocked.url",
                                parameters: {}
                            },
                            {
                                api: "account",
                                version: "v1.1",
                                baseURL:
                                    "https://mocked.url/authorization/v1.1",
                                parameters: {}
                            },
                            {
                                api: "artifact",
                                version: "v1",
                                baseURL:
                                    "https://artifact.api.platform.here.com/v1",
                                parameters: {}
                            },
                            {
                                api: "authentication",
                                version: "v1.1",
                                baseURL:
                                    "https://mocked.url/authentication/v1.1",
                                parameters: {}
                            },
                            {
                                api: "authorization",
                                version: "v1.1",
                                baseURL:
                                    "https://mocked.url/authorization/v1.1",
                                parameters: {}
                            },
                            {
                                api: "config",
                                version: "v1",
                                baseURL:
                                    "https://config.data.api.platform.here.com/config/v1",
                                parameters: {}
                            },
                            {
                                api: "consent",
                                version: "v0",
                                baseURL:
                                    "https://consent.api.platform.here.com/consent-service/v0",
                                parameters: {}
                            },
                            {
                                api: "consent",
                                version: "v1",
                                baseURL:
                                    "https://consent.api.platform.here.com/consent-service/v1",
                                parameters: {}
                            },
                            {
                                api: "location-service-registry",
                                version: "v1",
                                baseURL:
                                    "https://registry.services.api.platform.here.com/v1",
                                parameters: {}
                            },
                            {
                                api: "lookup",
                                version: "v1",
                                baseURL:
                                    "https://api-lookup.data.api.platform.here.com/lookup/v1",
                                parameters: {}
                            },
                            {
                                api: "marketplace",
                                version: "v1",
                                baseURL:
                                    "https://marketplace.api.platform.here.com/api/v1",
                                parameters: {}
                            },
                            {
                                api: "pipelines",
                                version: "v2",
                                baseURL:
                                    "https://pipelines.api.platform.here.com/pipeline-service",
                                parameters: {}
                            }
                        ])
                })
        };
    }
}

class MockedApiCacheRepository {
    private readonly hrn: string;
    constructor(private readonly cache: any, hrn?: MockedHrn) {
        this.hrn = hrn ? hrn.toString() : "plathorm-api";
    }

    public get(service: string, serviceVersion: string, type: string) {
        return this.cache.get(`${service}-${serviceVersion}-${type}`);
    }

    public put(
        serviceName: string,
        serviceVersion: string,
        baseURL: string,
        type: string
    ): boolean {
        this.cache.set(`${serviceName}-${serviceVersion}-${type}`, baseURL);
        return true;
    }
}

class MockedDataStoreRequestBuilder {
    constructor(
        readonly downloadManager: lib.DownloadManager,
        public readonly baseUrl: string,
        private readonly getBearerToken: () => Promise<string>
    ) {}
}

describe("RequestFactory", function() {
    let ApiCacheRepositoryStub: sinon.SinonStub;
    let DataStoreRequestBuilderStub: sinon.SinonStub;

    let sandbox: sinon.SinonSandbox;

    before(function() {
        sandbox = sinon.createSandbox();
    });

    afterEach(function() {
        sandbox.restore();
    });

    beforeEach(function() {
        ApiCacheRepositoryStub = sandbox.stub(lib, "ApiCacheRepository");
        ApiCacheRepositoryStub.callsFake(
            (cache, hrn) => new MockedApiCacheRepository(cache, hrn)
        );

        DataStoreRequestBuilderStub = sandbox.stub(
            lib,
            "DataStoreRequestBuilder"
        );
        DataStoreRequestBuilderStub.callsFake((dm, url, token) => {
            return new MockedDataStoreRequestBuilder(dm, url, token);
        });

        sandbox
            .stub(lib, "getEnvLookUpUrl")
            .callsFake(() => "http://fake-lookup.service.url");
    });

    describe("create()", function() {
        it("Should return created RequestBuilder with correct base url for platform service", async function() {
            const headers = new Headers();
            headers.append("cache-control", "max-age=3600");
            const response = {
                headers,
                resp: [
                    {
                        api: "statistics",
                        version: "v1",
                        baseURL:
                            "test-base-url-to-platform-service-for-request-builder"
                    }
                ],
                json: function() {
                    return this.resp;
                }
            };
            sandbox
                .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
                .callsFake(() =>
                    Promise.resolve((response as unknown) as Response)
                );

            const settings = new MockedOlpClientSettings();
            const requestBuilder = await lib.RequestFactory.create(
                "statistics",
                "v1",
                settings as any
            );

            expect(requestBuilder.baseUrl).to.be.equal(
                "test-base-url-to-platform-service-for-request-builder"
            );
        });

        it("Should reject with correct error about base url", async function() {
            sandbox
                .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
                .callsFake(
                    () =>
                        Promise.resolve({
                            status: 204,
                            title: "No content",
                            json: function() {
                                return this;
                            }
                        }) as any
                );

            const settings = new MockedOlpClientSettings();

            try {
                await lib.RequestFactory.create(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.message).to.be.equal("No content");
            }
        });
    });

    describe("getBaseUrl()", function() {
        it("Should return correct base url for platform service", async function() {
            const headers = new Headers();
            headers.append("cache-control", "max-age=3600");
            const response = {
                headers,
                resp: [
                    {
                        api: "statistics",
                        version: "v1",
                        baseURL: "test-base-url-to-platform-service"
                    }
                ],
                json: function() {
                    return this.resp;
                }
            };
            sandbox
                .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
                .callsFake(() =>
                    Promise.resolve((response as unknown) as Response)
                );
            const settings = new MockedOlpClientSettings();
            const baseUrl = await lib.RequestFactory.getBaseUrl(
                "statistics",
                "v1",
                settings as any
            );
            expect(baseUrl).to.be.equal("test-base-url-to-platform-service");
        });

        it("Should return correct base url for resource service", async function() {
            const headers = new Headers();
            headers.append("cache-control", "max-age=3600");
            const response = {
                headers,
                resp: [
                    {
                        api: "statistics",
                        version: "v1",
                        baseURL: "test-base-url-to-resource-service"
                    }
                ],
                json: function() {
                    return this.resp;
                }
            };
            sandbox
                .stub(dataServiceApi.LookupApi, "getResourceAPIList")
                .callsFake(() =>
                    Promise.resolve((response as unknown) as Response)
                );
            const settings = new MockedOlpClientSettings();

            const baseUrl = await lib.RequestFactory.getBaseUrl(
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

        it("Should reject with correct error message", async function() {
            sandbox
                .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
                .callsFake(() =>
                    Promise.resolve(({
                        status: 404,
                        title: "Service Not Found",
                        detail: [],
                        json: function() {
                            return this;
                        }
                    } as unknown) as Response)
                );
            const settings = new MockedOlpClientSettings();
            try {
                await lib.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.message).to.be.equal("Service Not Found");
            }
        });

        it("Should reject with correct custom error message", async function() {
            sandbox
                .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
                .callsFake(() =>
                    Promise.resolve(({
                        json: function() {
                            return this;
                        }
                    } as unknown) as Response)
                );
            const settings = new MockedOlpClientSettings();
            try {
                await lib.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.message).to.be.equal("No content");
            }
        });

        it("Should reject with not found error message", async function() {
            const headers = new Headers();
            headers.append("cache-control", "max-age=3600");
            const response = {
                headers,
                resp: [
                    {
                        api: "metadata",
                        version: "v1",
                        baseURL: "test-base-url-to-platform-service"
                    }
                ],
                json: function() {
                    return this.resp;
                }
            };
            sandbox
                .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
                .callsFake(() =>
                    Promise.resolve((response as unknown) as Response)
                );
            const settings = new MockedOlpClientSettings();
            try {
                await lib.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any
                );
            } catch (error) {
                expect(error.status).to.be.equal(404);
            }
        });

        it("Should reject with not found error message for hrn", async function() {
            const headers = new Headers();
            headers.append("cache-control", "max-age=3600");
            const response = {
                headers,
                resp: [
                    {
                        api: "metadata",
                        version: "v1",
                        baseURL: "test-base-url-to-platform-service"
                    }
                ],
                json: function() {
                    return this.resp;
                }
            };
            sandbox
                .stub(dataServiceApi.LookupApi, "getResourceAPIList")
                .callsFake(() =>
                    Promise.resolve((response as unknown) as Response)
                );
            const settings = new MockedOlpClientSettings();
            try {
                await lib.RequestFactory.getBaseUrl(
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

        it("Should return correct base url for resource service from cache while max-age is valid", async function() {
            const headers = new Headers();
            headers.append("cache-control", "max-age=2");
            const response = {
                headers,
                resp: [
                    {
                        api: "statistics",
                        version: "v1",
                        baseURL: "test-base-url-to-resource-service"
                    }
                ],
                json: function() {
                    return this.resp;
                }
            };
            const resourceApiStub = sandbox.stub(
                dataServiceApi.LookupApi,
                "getResourceAPIList"
            );

            resourceApiStub.callsFake(() =>
                Promise.resolve((response as unknown) as Response)
            );
            const settings = new MockedOlpClientSettings();
            const platformApiStub = sandbox.stub(
                dataServiceApi.LookupApi,
                "getPlatformAPIList"
            );

            const baseUrl1 = await lib.RequestFactory.getBaseUrl(
                "statistics",
                "v1",
                settings as any,
                new MockedHrn({
                    partition: "here-dev",
                    resource: "here-test-resource",
                    service: "here-test-service"
                }) as any
            );
            expect(resourceApiStub.callCount).to.be.equal(1);
            expect(baseUrl1).to.be.equal("test-base-url-to-resource-service");

            const baseUrl2 = await lib.RequestFactory.getBaseUrl(
                "statistics",
                "v1",
                settings as any,
                new MockedHrn({
                    partition: "here-dev",
                    resource: "here-test-resource",
                    service: "here-test-service"
                }) as any
            );

            expect(resourceApiStub.callCount).to.be.equal(1);
            expect(baseUrl2).to.be.equal("test-base-url-to-resource-service");

            setTimeout(async function() {
                const baseUrl3 = await lib.RequestFactory.getBaseUrl(
                    "statistics",
                    "v1",
                    settings as any,
                    new MockedHrn({
                        partition: "here-dev",
                        resource: "here-test-resource",
                        service: "here-test-service"
                    }) as any
                );

                expect(resourceApiStub.callCount).to.be.equal(2);
                expect(baseUrl3).to.be.equal(
                    "test-base-url-to-resource-service"
                );
            }, 3000);
        });
    });
});
