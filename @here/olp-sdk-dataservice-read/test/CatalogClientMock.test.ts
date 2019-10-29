import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { CatalogClient } from "../lib/CatalogClient";
import { DataStoreContext } from "../lib/DataStoreContext";

import { MetadataApi } from "@here/olp-sdk-dataservice-api/";
import { ConfigApi } from "@here/olp-sdk-dataservice-api/";

chai.use(sinonChai);
const expect = chai.expect;

describe("VersionLayerClientMockTests", () => {
    let latestVersionStub: sinon.SinonStub;

    let dataStoreContextStubInstance = sinon.createStubInstance(
        DataStoreContext
    );

    let catalogClient = new CatalogClient({
        context: (dataStoreContextStubInstance as unknown) as DataStoreContext,
        hrn: "fake-hrn-string"
    });

    let listVersionsStub: sinon.SinonStub;

    describe("getLastestVesion Tests", () => {
        const catalogLatestVersion = 43;

        beforeEach(() => {
            latestVersionStub = sinon.stub(MetadataApi, "latestVersion");
            latestVersionStub.callsFake((builder, params) =>
                Promise.resolve(catalogLatestVersion)
            );
        });

        afterEach(() => {
            latestVersionStub.restore();
        });

        it("getLastestVersion success test", async () => {
            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);
        });

        it("Test getLastestVersion with default parameter start version", async () => {
            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);

            const callStartVersionArgs = latestVersionStub.getCall(0).args[1];
            expect(callStartVersionArgs.startVersion).equal(-1);
        });

        it("Test getLastestVersion with setted parameter start version", async () => {
            const testStartVersion = 2;

            const latestVersion = await catalogClient.getLatestVersion(
                testStartVersion
            );

            expect(latestVersion).to.be.equal(catalogLatestVersion);

            const callStartVersionArgs = latestVersionStub.getCall(0).args[1];
            expect(callStartVersionArgs.startVersion).equal(testStartVersion);
        });
    });

    describe("getVersions Tests", () => {
        const catalogListVersions = [
            {
                dependencies: [
                    {
                        direct: false,
                        hrn: "hrn:here:data:::my-catalog",
                        version: 23
                    }
                ],
                partitionCounts: {
                    additionalProp1: 0,
                    additionalProp2: 0,
                    additionalProp3: 0
                },
                timestamp: "1516397474657",
                version: 1
            }
        ];

        beforeEach(() => {
            listVersionsStub = sinon.stub(MetadataApi, "listVersions");
            listVersionsStub.callsFake((builder, params) =>
                Promise.resolve(catalogListVersions)
            );
        });

        afterEach(() => {
            listVersionsStub.restore();
        });

        it("getVersions success test", async () => {
            const listVersionsResponse = await catalogClient.getVersions(1, 2);

            expect(listVersionsResponse).to.be.equal(catalogListVersions);
        });

        it("Test correct usage of input parameters start version and end version", async () => {
            const testStartVersion = 1;
            const testEndVersion = 3;

            const listVersionsResponse = await catalogClient.getVersions(
                testStartVersion,
                testEndVersion
            );
            expect(listVersionsResponse).to.be.equal(catalogListVersions);

            const callStartVersionArgs = listVersionsStub.getCall(0).args[1];
            expect(callStartVersionArgs.startVersion).equal(testStartVersion);
            expect(callStartVersionArgs.endVersion).equal(testEndVersion);
        });
    });

    let loadAndCacheCatalogStub: sinon.SinonStub;

    describe("load and Cache Catalog Configuration Tests", () => {
        const mockedErroreResponse: string = "testError";

        beforeEach(() => {
            loadAndCacheCatalogStub = sinon.stub(ConfigApi, "getCatalog");
            loadAndCacheCatalogStub.callsFake((builder, params) =>
                Promise.reject(mockedErroreResponse)
            );
        });

        afterEach(() => {
            loadAndCacheCatalogStub.restore();
        });

        it("Test error reject response", async () => {
            loadAndCacheCatalogStub.callsFake(
                (builder: any, params: any): Promise<ConfigApi.Catalog> => {
                    return Promise.reject(mockedErroreResponse);
                }
            );

            await catalogClient
                .loadAndCacheCatalogConfiguration()
                .catch(err => {
                    expect(err).equal(
                        "Can't load catalog configuration. HRN: fake-hrn-string, error: testError"
                    );
                });
        });
    });
});
