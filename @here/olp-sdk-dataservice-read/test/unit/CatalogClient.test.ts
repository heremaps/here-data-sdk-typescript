/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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
import { ConfigApi, MetadataApi } from "@here/olp-sdk-dataservice-api";

import { HttpError } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

class MockCatalogVersionRequest {
    public getBillingTag(): string | undefined {
        return "testBillingTag";
    }
}

describe("CatalogClient", function() {
    let sandbox: sinon.SinonSandbox;
    let getVersionStub: sinon.SinonStub;
    let getLayerVersionsStub: sinon.SinonStub;
    let getCatalogStub: sinon.SinonStub;
    let getListVersionsStub: sinon.SinonStub;
    let getEarliestVersionsStub: sinon.SinonStub;
    let catalogClient: dataServiceRead.CatalogClient;
    let getBaseUrlRequestStub: sinon.SinonStub;
    const fakeURL = "http://fake-base.url";
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::live-weather-na"
    );

    before(function() {
        sandbox = sinon.createSandbox();
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        catalogClient = new dataServiceRead.CatalogClient(
            mockedHRN,
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
    });

    beforeEach(function() {
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        getLayerVersionsStub = sandbox.stub(MetadataApi, "getLayerVersions");
        getCatalogStub = sandbox.stub(ConfigApi, "getCatalog");
        getListVersionsStub = sandbox.stub(MetadataApi, "listVersions");
        getEarliestVersionsStub = sandbox.stub(MetadataApi, "minimumVersion");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Shoud be initialised", async function() {
        assert.isDefined(catalogClient);
    });

    it("Should method getLatestVersion provide data with startVersion parameter", async function() {
        const mockedVersion = {
            version: 42
        };

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        const catalogRequest = new dataServiceRead.CatalogVersionRequest().withStartVersion(
            42
        );

        const response = await catalogClient.getLatestVersion(
            (catalogRequest as unknown) as dataServiceRead.CatalogVersionRequest
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedVersion.version);
    });

    it("Should method getLatestVersion return HttpError when API crashes", async function() {
        const TEST_ERROR_CODE = 404;
        const mockedError = new HttpError(
            TEST_ERROR_CODE,
            "Can not get catalog latest version"
        );

        const mockedVersion = {
            version: 42
        };

        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.reject(mockedError);
            }
        );

        const catalogRequest = new dataServiceRead.CatalogVersionRequest().withStartVersion(
            42
        );

        const response = await catalogClient
            .getLatestVersion(
                (catalogRequest as unknown) as dataServiceRead.CatalogVersionRequest
            )
            .catch((err: any) => {
                assert.isDefined(err);
                expect(err.status).to.be.equal(TEST_ERROR_CODE);
                expect(err.message).to.be.equal(
                    "Can not get catalog latest version"
                );
                expect(err.name).to.be.equal("HttpError");
            });
    });

    it("Should method getLayerVersions return HttpError when MetadataApi.getLayerVersions crashes", async function() {
        const testError = "Can not get catalog layer version";

        getLayerVersionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.LayerVersions> => {
                return Promise.reject("Can not get catalog layer version");
            }
        );

        const catalogRequest = new dataServiceRead.LayerVersionsRequest().withVersion(
            3
        );
        const response = await catalogClient
            .getLayerVersions(
                (catalogRequest as unknown) as dataServiceRead.LayerVersionsRequest
            )
            .catch((err: any) => {
                assert.isDefined(err);
                expect(err.message).to.be.equal(testError);
            });
    });

    it("Should method getLayerVersions provide data with version parameter", async function() {
        const mockedVersion = {
            layerVersions: [
                { layer: "testLayer1", version: 1, timestamp: 11 },
                { layer: "testLayer2", version: 2, timestamp: 22 },
                { layer: "testLayer3", version: 3, timestamp: 33 }
            ],
            version: 3
        };

        getLayerVersionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.LayerVersions> => {
                return Promise.resolve(mockedVersion);
            }
        );

        const catalogRequest = new dataServiceRead.LayerVersionsRequest().withVersion(
            3
        );
        const response = await catalogClient.getLayerVersions(
            (catalogRequest as unknown) as dataServiceRead.LayerVersionsRequest
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedVersion.layerVersions);
    });

    it("Should method getLayerVersions provide data for latests version when version parameter is not setted", async function() {
        const mockedLayerVersions = {
            layerVersions: [
                { layer: "testLayer1", version: 1, timestamp: 11 },
                { layer: "testLayer2", version: 2, timestamp: 22 },
                { layer: "testLayer3", version: 3, timestamp: 33 },
                { layer: "testLayer4", version: 4, timestamp: 44 }
            ],
            version: 4
        };
        getLayerVersionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.LayerVersions> => {
                return Promise.resolve(mockedLayerVersions);
            }
        );

        const mockedLatestVersion = {
            version: 4
        };
        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedLatestVersion);
            }
        );
        const catalogRequest = new dataServiceRead.LayerVersionsRequest();

        const response = await catalogClient.getLayerVersions(
            (catalogRequest as unknown) as dataServiceRead.LayerVersionsRequest
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedLayerVersions.layerVersions);
    });

    it("Should method getEarliestVersion provide the minimun version availiable for the given catalogRequest", async function() {
        const mockedEarliestVersion: MetadataApi.VersionResponse = {
            version: 5
        };

        getEarliestVersionsStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedEarliestVersion);
            }
        );

        const catalogRequest = new MockCatalogVersionRequest();
        const response = await catalogClient.getEarliestVersion(
            (catalogRequest as unknown) as dataServiceRead.CatalogVersionRequest
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedEarliestVersion.version);
    });

    it("Should method getEarliestVersion return HttpError getting earliest catalog version", async function() {
        const TEST_ERROR_CODE = 404;
        const mockedError = new HttpError(
            TEST_ERROR_CODE,
            "Error getting earliest catalog version"
        );

        getEarliestVersionsStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.reject(mockedError);
            }
        );

        const catalogRequest = new dataServiceRead.CatalogVersionRequest();

        const response = await catalogClient
            .getEarliestVersion(
                (catalogRequest as unknown) as dataServiceRead.CatalogVersionRequest
            )
            .catch(err => {
                assert.isDefined(err);
                expect(err.status).to.be.equal(TEST_ERROR_CODE);
                expect(err.message).to.be.equal(
                    "Error getting earliest catalog version"
                );
                expect(err.name).to.be.equal("HttpError");
            });
    });

    it("Should method getCatalog provide data", async function() {
        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "hype-test-prefetch",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (builder: any, params: any): Promise<ConfigApi.Catalog> => {
                return Promise.resolve(mockedCatalogResponse);
            }
        );

        const response = await catalogClient.getCatalog(
            new dataServiceRead.CatalogRequest()
        );

        assert.isDefined(response);
        expect(response).to.be.equal(mockedCatalogResponse);
    });

    it("Should method getCatalog return HttpError when Can not load catalog configuration", async function() {
        const TEST_ERROR_CODE = 404;
        const mockedError = new HttpError(
            TEST_ERROR_CODE,
            "Can't load catalog configuration"
        );

        const mockedCatalogResponse: ConfigApi.Catalog = {
            id: "here-internal-test",
            hrn: "hrn:here-dev:data:::here-internal-test",
            name: "here-internal-test",
            summary: "Internal test for here",
            description: "Used for internal testing on the staging olp.",
            tags: [],
            created: "2018-07-13T20:50:08.425Z",
            replication: {},
            layers: [
                {
                    id: "hype-test-prefetch",
                    hrn:
                        "hrn:here-dev:data:::here-internal-test:hype-test-prefetch",
                    partitioning: {
                        tileLevels: [],
                        scheme: "heretile"
                    },
                    contentType: "application/x-protobuf",
                    layerType: "versioned"
                }
            ],
            version: 3
        };

        getCatalogStub.callsFake(
            (builder: any, params: any): Promise<ConfigApi.Catalog> => {
                return Promise.reject(mockedError);
            }
        );

        const response = await catalogClient
            .getCatalog(new dataServiceRead.CatalogRequest())
            .catch((err: any) => {
                assert.isDefined(err);
                expect(err.status).to.be.equal(TEST_ERROR_CODE);
                expect(err.message).to.be.equal(
                    "Can't load catalog configuration"
                );
                expect(err.name).to.be.equal("HttpError");
            });
    });

    it("Should method getVersions provide data with startVersion and EndVersion parameters", async function() {
        const mockedVersions: MetadataApi.VersionInfos = {
            versions: [
                {
                    dependencies: [
                        {
                            direct: true,
                            hrn: "mocked:::hrn",
                            version: 42
                        }
                    ],
                    timestamp: 13,
                    version: 42
                }
            ]
        };

        getListVersionsStub.callsFake(
            (builder: any, params: any): Promise<MetadataApi.VersionInfos> => {
                return Promise.resolve(mockedVersions);
            }
        );

        const catalogRequest = new dataServiceRead.CatalogVersionRequest()
            .withStartVersion(13)
            .withEndVersion(42);

        const response = await catalogClient.getVersions(
            (catalogRequest as unknown) as dataServiceRead.CatalogVersionRequest
        );

        assert.isDefined(response);
        assert.isTrue(response.versions.length > 0);
    });

    it("Should method getVersions provide data with startVersion parameters", async function() {
        const mockedVersions = {
            versions: [
                {
                    dependencies: [
                        {
                            direct: true,
                            hrn: "mocked:::hrn",
                            version: 42
                        }
                    ],
                    timestamp: 13,
                    version: 42
                }
            ]
        };
        getListVersionsStub.callsFake((builder, params) => {
            return Promise.resolve(mockedVersions);
        });
        getVersionStub.callsFake((builder, params) => {
            return Promise.resolve({ version: 42 });
        });

        const catalogRequest = new dataServiceRead.CatalogVersionRequest().withStartVersion(
            13
        );
        const response = await catalogClient.getVersions(catalogRequest);

        assert.isDefined(response);
        assert.isTrue(response.versions.length > 0);
    });

    it("Should method getVersions return HttpError when API crashes", async function() {
        const TEST_ERROR_CODE = 404;
        const mockedError = new HttpError(
            TEST_ERROR_CODE,
            "Can't get versions"
        );

        getVersionStub.callsFake((builder, params) => {
            return Promise.resolve({ version: 42 });
        });

        getListVersionsStub.callsFake((builder, params) => {
            return Promise.reject(mockedError);
        });

        const catalogRequest = new dataServiceRead.CatalogVersionRequest().withStartVersion(
            13
        );

        const response = await catalogClient
            .getVersions(catalogRequest)
            .catch(err => {
                assert.isDefined(err);
                expect(err.status).to.be.equal(TEST_ERROR_CODE);
                expect(err.message).to.be.equal("Can't get versions");
                expect(err.name).to.be.equal("HttpError");
            });
    });
});
