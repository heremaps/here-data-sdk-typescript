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
import { LookupApi } from "@here/olp-sdk-dataservice-api";

import * as dataServiceRead from "@here/olp-sdk-dataservice-read";
chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("DataStoreContext initialisation", () => {
    let testToken: string;
    let mockedGetToken: () => Promise<string>;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        testToken = "test-token-string";
        mockedGetToken = () => Promise.resolve(testToken);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Should be initialised with default params", async () => {
        const spyGetEnvLookUpUrl = sandbox.spy(
            dataServiceRead,
            "getEnvLookUpUrl"
        );
        const context = new dataServiceRead.DataStoreContext({
            environment: "here",
            getToken: mockedGetToken
        });

        assert.isDefined(context);

        expect(spyGetEnvLookUpUrl.calledOnceWith("here")).true;
        expect(context.environment).to.equal("here");
        expect(context.getToken).to.equal(mockedGetToken);
        expect(context.dm instanceof dataServiceRead.DataStoreDownloadManager)
            .true;

        const resolvedTokenFromContext = await context.getToken();
        expect(resolvedTokenFromContext).to.equal(testToken);
    });

    it("Should be used download manager from client on initialisation", async () => {
        class CustomDownloadManager implements dataServiceRead.DownloadManager {
            download(url: string, init?: RequestInit) {
                return Promise.resolve(new Response());
            }
        }

        const customDownloadManager = new CustomDownloadManager();

        const context = new dataServiceRead.DataStoreContext({
            environment: "here",
            getToken: mockedGetToken,
            dm: customDownloadManager
        });

        expect(context.dm instanceof CustomDownloadManager).true;
    });
});

describe("DataStoreContext getBaseUrl success", () => {
    let context: dataServiceRead.DataStoreContext;
    let testToken: string;
    let mockedGetToken: () => Promise<string>;
    let platformAPIListStub: any;
    let platformResourseListStub: any;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        platformAPIListStub = sandbox.stub(LookupApi, "platformAPIList");
        platformResourseListStub = sandbox.stub(LookupApi, "resourceAPIList");

        testToken = "test-token-string";
        mockedGetToken = () => Promise.resolve(testToken);

        context = new dataServiceRead.DataStoreContext({
            environment: "here",
            getToken: mockedGetToken
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("it should return base url to the Artifact API", async () => {
        const mockedBaseUrl = "https://mocked-artifact-base-url.com";
        const mockedPlatformApiList: LookupApi.API[] = [
            {
                api: "artifact",
                baseURL: mockedBaseUrl,
                version: "v1"
            }
        ];

        platformAPIListStub.callsFake(async () =>
            Promise.resolve(mockedPlatformApiList)
        );

        const baseUrl = await context.getBaseUrl("artifact");

        expect(baseUrl).to.be.equal(mockedBaseUrl);
    });

    it("it should return base url to the Config API", async () => {
        const mockedBaseUrl = "https://mocked-config-base-url.com";
        const mockedPlatformApiList: LookupApi.API[] = [
            {
                api: "config",
                baseURL: mockedBaseUrl,
                version: "v1"
            }
        ];

        platformAPIListStub.callsFake(async () =>
            Promise.resolve(mockedPlatformApiList)
        );

        const baseUrl = await context.getBaseUrl("config");

        expect(baseUrl).to.be.equal(mockedBaseUrl);
    });

    it("it should return base urls to the resourse APIs", async () => {
        const mockedCatalogHrn = "mocked-catalog-hrn";

        const mockeMetadataBaseUrl = "https://mocked-Metadata-base-url.com";
        const mockeBlobBaseUrl = "https://mocked-Blob-base-url.com";
        const mockeIndexBaseUrl = "https://mocked-Index-base-url.com";
        const mockeIngestBaseUrl = "https://mocked-Ingest-base-url.com";
        const mockeNotificationBaseUrl =
            "https://mocked-Notification-base-url.com";
        const mockePublishBaseUrl = "https://mocked-Publish-base-url.com";
        const mockeQueryBaseUrl = "https://mocked-Query-base-url.com";
        const mockeStatisticsBaseUrl = "https://mocked-Statistics-base-url.com";
        const mockeStreamBaseUrl = "https://mocked-Stream-base-url.com";
        const mockeVolatileBlobBaseUrl =
            "https://mocked-Volatile-blob-base-url.com";

        const mockedCatalogResoursesApiList: LookupApi.API[] = [
            {
                api: "metadata",
                baseURL: mockeMetadataBaseUrl,
                version: "v1"
            },
            {
                api: "blob",
                baseURL: mockeBlobBaseUrl,
                version: "v1"
            },
            {
                api: "index",
                baseURL: mockeIndexBaseUrl,
                version: "v1"
            },
            {
                api: "ingest",
                baseURL: mockeIngestBaseUrl,
                version: "v1"
            },
            {
                api: "notification",
                baseURL: mockeNotificationBaseUrl,
                version: "v1"
            },
            {
                api: "publish",
                baseURL: mockePublishBaseUrl,
                version: "v1"
            },
            {
                api: "query",
                baseURL: mockeQueryBaseUrl,
                version: "v1"
            },
            {
                api: "statistics",
                baseURL: mockeStatisticsBaseUrl,
                version: "v1"
            },
            {
                api: "stream",
                baseURL: mockeStreamBaseUrl,
                version: "v1"
            },
            {
                api: "volatile-blob",
                baseURL: mockeVolatileBlobBaseUrl,
                version: "v1"
            }
        ];

        platformResourseListStub.callsFake(async () =>
            Promise.resolve(mockedCatalogResoursesApiList)
        );

        expect(
            await context.getBaseUrl("metadata", mockedCatalogHrn)
        ).to.be.equal(mockeMetadataBaseUrl);
        expect(await context.getBaseUrl("blob", mockedCatalogHrn)).to.be.equal(
            mockeBlobBaseUrl
        );
        expect(await context.getBaseUrl("index", mockedCatalogHrn)).to.be.equal(
            mockeIndexBaseUrl
        );
        expect(
            await context.getBaseUrl("ingest", mockedCatalogHrn)
        ).to.be.equal(mockeIngestBaseUrl);
        expect(
            await context.getBaseUrl("notification", mockedCatalogHrn)
        ).to.be.equal(mockeNotificationBaseUrl);
        expect(
            await context.getBaseUrl("publish", mockedCatalogHrn)
        ).to.be.equal(mockePublishBaseUrl);
        expect(await context.getBaseUrl("query", mockedCatalogHrn)).to.be.equal(
            mockeQueryBaseUrl
        );
        expect(
            await context.getBaseUrl("statistics", mockedCatalogHrn)
        ).to.be.equal(mockeStatisticsBaseUrl);
        expect(
            await context.getBaseUrl("stream", mockedCatalogHrn)
        ).to.be.equal(mockeStreamBaseUrl);
        expect(
            await context.getBaseUrl("volatile-blob", mockedCatalogHrn)
        ).to.be.equal(mockeVolatileBlobBaseUrl);
    });
});
