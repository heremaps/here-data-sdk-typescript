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
import { ConfigApi, MetadataApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogClient", () => {
    let sandbox: sinon.SinonSandbox;
    let getVersionStub: sinon.SinonStub;
    let getLayerVersionsStub: sinon.SinonStub;
    let getLatestVersionStub: sinon.SinonStub;
    let getCatalogStub: sinon.SinonStub;
    let getListVersionsStub: sinon.SinonStub;
    let catalogClient: dataServiceRead.CatalogClient;
    let getBaseUrlRequestStub: sinon.SinonStub;
    const fakeURL = "http://fake-base.url";
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::live-weather-na"
    );

    before(() => {
        sandbox = sinon.createSandbox();
        let settings = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        catalogClient = new dataServiceRead.CatalogClient(
            mockedHRN,
            (settings as unknown) as dataServiceRead.OlpClientSettings
        );
    });

    beforeEach(() => {
        getLayerVersionsStub = sandbox.stub(MetadataApi, "getLayerVersions");
        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        getCatalogStub = sandbox.stub(ConfigApi, "getCatalog");
        getListVersionsStub = sandbox.stub(MetadataApi, "listVersions");
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised", async () => {
        assert.isDefined(catalogClient);
    });

    it("Should method getLatestVersion provide data with startVersion parameter", async () => {
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

    it("Should method getVersions provide data with startVersion and EndVersion parameters", async () => {
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

    it("Should method getLayerVersions provide data with version parameter", async () => {
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

    it("Should method getLayerVersions provide data for latests version when version parameter is not setted", async () => {
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

    it("Should method getVersions provide data with startVersion parameters", async () => {
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
        getVersionStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve({ version: 42 });
            }
        );

        const catalogRequest = new dataServiceRead.CatalogVersionRequest().withStartVersion(
            13
        );

        const response = await catalogClient.getVersions(
            (catalogRequest as unknown) as dataServiceRead.CatalogVersionRequest
        );

        assert.isDefined(response);
        assert.isTrue(response.versions.length > 0);
    });

    it("Should method getCatalog provide data", async () => {
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
});
