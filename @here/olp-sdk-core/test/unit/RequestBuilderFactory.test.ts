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

import { expect } from "chai";
import { HRN, OlpClientSettings, RequestFactory } from "@here/olp-sdk-core/lib";

describe("RequestFactory", function() {
    describe("create()", function() {
        it("Should return created RequestBuilder with correct base url for platform service", async function() {
            RequestFactory.getBaseUrl = () => {
                return Promise.resolve("https://mocked-base.url");
            };

            // @ts-ignore
            RequestFactory.getDataStoreRequestBuilder = (
                downloadManager,
                baseUrl,
                token,
                abortSignal
            ) => {
                return Promise.resolve({
                    downloadManager,
                    baseUrl,
                    token,
                    abortSignal
                });
            };

            const requestBuilder = await RequestFactory.create(
                "artifact",
                "v1",
                {} as OlpClientSettings,
                {} as HRN
            );

            expect(requestBuilder.baseUrl).to.be.equal(
                "https://mocked-base.url"
            );
        });

        it("Should reject with correct error about base url", async function() {
            RequestFactory.getBaseUrl = () => {
                return Promise.reject({ message: "No content" });
            };

            try {
                await RequestFactory.create(
                    "statistics",
                    "v1",
                    {} as OlpClientSettings
                );
            } catch (error) {
                expect(error.message).to.be.equal("No content");
            }
        });
    });

    // describe("getBaseUrl()", function() {
    //     xit("Should return correct base url for platform service", async function() {
    //         const headers = new Headers();
    //         headers.append("cache-control", "max-age=3600");
    //         const response = {
    //             headers,
    //             resp: [
    //                 {
    //                     api: "statistics",
    //                     version: "v1",
    //                     baseURL: "test-base-url-to-platform-service"
    //                 }
    //             ],
    //             json: function() {
    //                 return this.resp;
    //             }
    //         };
    //         sandbox
    //             .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
    //             .callsFake(() =>
    //                 Promise.resolve((response as unknown) as Response)
    //             );
    //         const settings = new MockedOlpClientSettings();
    //         const baseUrl = await lib.RequestFactory.getBaseUrl(
    //             "statistics",
    //             "v1",
    //             settings as any
    //         );
    //         expect(baseUrl).to.be.equal("test-base-url-to-platform-service");
    //     });

    //     xit("Should return correct base url for resource service", async function() {
    //         const headers = new Headers();
    //         headers.append("cache-control", "max-age=3600");
    //         const response = {
    //             headers,
    //             resp: [
    //                 {
    //                     api: "statistics",
    //                     version: "v1",
    //                     baseURL: "test-base-url-to-resource-service"
    //                 }
    //             ],
    //             json: function() {
    //                 return this.resp;
    //             }
    //         };
    //         sandbox
    //             .stub(dataServiceApi.LookupApi, "getResourceAPIList")
    //             .callsFake(() =>
    //                 Promise.resolve((response as unknown) as Response)
    //             );
    //         const settings = new MockedOlpClientSettings();

    //         const baseUrl = await lib.RequestFactory.getBaseUrl(
    //             "statistics",
    //             "v1",
    //             settings as any,
    //             new MockedHrn({
    //                 partition: "here-dev",
    //                 resource: "here-test-resource",
    //                 service: "here-test-service"
    //             }) as any
    //         );
    //         expect(baseUrl).to.be.equal("test-base-url-to-resource-service");
    //     });

    //     it("Should reject with correct error message", async function() {
    //         sandbox
    //             .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
    //             .callsFake(() =>
    //                 Promise.resolve(({
    //                     status: 404,
    //                     title: "Service Not Found",
    //                     detail: [],
    //                     json: function() {
    //                         return this;
    //                     }
    //                 } as unknown) as Response)
    //             );
    //         const settings = new MockedOlpClientSettings();
    //         try {
    //             await lib.RequestFactory.getBaseUrl(
    //                 "statistics",
    //                 "v1",
    //                 settings as any
    //             );
    //         } catch (error) {
    //             expect(error.message).to.be.equal("Service Not Found");
    //         }
    //     });

    //     it("Should reject with correct custom error message", async function() {
    //         sandbox
    //             .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
    //             .callsFake(() =>
    //                 Promise.resolve(({
    //                     json: function() {
    //                         return this;
    //                     }
    //                 } as unknown) as Response)
    //             );
    //         const settings = new MockedOlpClientSettings();
    //         try {
    //             await lib.RequestFactory.getBaseUrl(
    //                 "statistics",
    //                 "v1",
    //                 settings as any
    //             );
    //         } catch (error) {
    //             expect(error.message).to.be.equal("No content");
    //         }
    //     });

    //     xit("Should reject with not found error message", async function() {
    //         const headers = new Headers();
    //         headers.append("cache-control", "max-age=3600");
    //         const response = {
    //             headers,
    //             resp: [
    //                 {
    //                     api: "metadata",
    //                     version: "v1",
    //                     baseURL: "test-base-url-to-platform-service"
    //                 }
    //             ],
    //             json: function() {
    //                 return this.resp;
    //             }
    //         };
    //         sandbox
    //             .stub(dataServiceApi.LookupApi, "getPlatformAPIList")
    //             .callsFake(() =>
    //                 Promise.resolve((response as unknown) as Response)
    //             );
    //         const settings = new MockedOlpClientSettings();
    //         try {
    //             await lib.RequestFactory.getBaseUrl(
    //                 "statistics",
    //                 "v1",
    //                 settings as any
    //             );
    //         } catch (error) {
    //             expect(error.status).to.be.equal(404);
    //         }
    //     });

    //     xit("Should reject with not found error message for hrn", async function() {
    //         const headers = new Headers();
    //         headers.append("cache-control", "max-age=3600");
    //         const response = {
    //             headers,
    //             resp: [
    //                 {
    //                     api: "metadata",
    //                     version: "v1",
    //                     baseURL: "test-base-url-to-platform-service"
    //                 }
    //             ],
    //             json: function() {
    //                 return this.resp;
    //             }
    //         };
    //         sandbox
    //             .stub(dataServiceApi.LookupApi, "getResourceAPIList")
    //             .callsFake(() =>
    //                 Promise.resolve((response as unknown) as Response)
    //             );
    //         const settings = new MockedOlpClientSettings();
    //         try {
    //             await lib.RequestFactory.getBaseUrl(
    //                 "statistics",
    //                 "v1",
    //                 settings as any,
    //                 new MockedHrn({
    //                     partition: "here-dev",
    //                     resource: "here-test-resource",
    //                     service: "here-test-service"
    //                 }) as any
    //             );
    //         } catch (error) {
    //             expect(error.status).to.be.equal(404);
    //             expect(error.message).to.be.equal(
    //                 "No BaseUrl found for statistics, v1 hrn:here-dev:here-test-service:::here-test-resource"
    //             );
    //         }
    //     });

    //     xit("Should return correct base url for resource service from cache while max-age is valid", async function() {
    //         const headers = new Headers();
    //         headers.append("cache-control", "max-age=2");
    //         const response = {
    //             headers,
    //             resp: [
    //                 {
    //                     api: "statistics",
    //                     version: "v1",
    //                     baseURL: "test-base-url-to-resource-service"
    //                 }
    //             ],
    //             json: function() {
    //                 return this.resp;
    //             }
    //         };
    //         const resourceApiStub = sandbox.stub(
    //             dataServiceApi.LookupApi,
    //             "getResourceAPIList"
    //         );

    //         resourceApiStub.callsFake(() =>
    //             Promise.resolve((response as unknown) as Response)
    //         );
    //         const settings = new MockedOlpClientSettings();
    //         const platformApiStub = sandbox.stub(
    //             dataServiceApi.LookupApi,
    //             "getPlatformAPIList"
    //         );

    //         const baseUrl1 = await lib.RequestFactory.getBaseUrl(
    //             "statistics",
    //             "v1",
    //             settings as any,
    //             new MockedHrn({
    //                 partition: "here-dev",
    //                 resource: "here-test-resource",
    //                 service: "here-test-service"
    //             }) as any
    //         );
    //         expect(resourceApiStub.callCount).to.be.equal(1);
    //         expect(baseUrl1).to.be.equal("test-base-url-to-resource-service");

    //         const baseUrl2 = await lib.RequestFactory.getBaseUrl(
    //             "statistics",
    //             "v1",
    //             settings as any,
    //             new MockedHrn({
    //                 partition: "here-dev",
    //                 resource: "here-test-resource",
    //                 service: "here-test-service"
    //             }) as any
    //         );

    //         expect(resourceApiStub.callCount).to.be.equal(1);
    //         expect(baseUrl2).to.be.equal("test-base-url-to-resource-service");

    //         setTimeout(async function() {
    //             const baseUrl3 = await lib.RequestFactory.getBaseUrl(
    //                 "statistics",
    //                 "v1",
    //                 settings as any,
    //                 new MockedHrn({
    //                     partition: "here-dev",
    //                     resource: "here-test-resource",
    //                     service: "here-test-service"
    //                 }) as any
    //             );

    //             expect(resourceApiStub.callCount).to.be.equal(2);
    //             expect(baseUrl3).to.be.equal(
    //                 "test-base-url-to-resource-service"
    //             );
    //         }, 3000);
    //     });
    // });
});
