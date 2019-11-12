import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import * as dataServiceRead from "@here/olp-sdk-dataservice-read";

import { ConfigApi, MetadataApi } from "@here/olp-sdk-dataservice-api/";

chai.use(sinonChai);
const expect = chai.expect;

describe("VersionedLayerClientMockTests", () => {
    let sandbox: sinon.SinonSandbox;
    const mockedHRN = dataServiceRead.HRN.fromString("hrn:here:data:::rib-2");
    const fakeURL = "http://fake-base.url";
    let getVersionStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;

    let olpClientSettingsStubInstance = sinon.createStubInstance(
        dataServiceRead.OlpClientSettings
    );

    let catalogClient = new dataServiceRead.CatalogClient(
        mockedHRN,
        (olpClientSettingsStubInstance as unknown) as dataServiceRead.OlpClientSettings
    );

    let listVersionsStub: sinon.SinonStub;

    describe("getLastestVesion Tests", () => {
        const catalogLatestVersion = 42;
        const mockedVersion = {
            version: 42
        };

        before(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        beforeEach(() => {
            getBaseUrlRequestStub = sandbox.stub(
                dataServiceRead.RequestFactory,
                "getBaseUrl"
            );
            getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
            getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
            getVersionStub.callsFake(
                (
                    builder: any,
                    params: any
                ): Promise<MetadataApi.VersionResponse> => {
                    return Promise.resolve(mockedVersion);
                }
            );
        });

        it("getLastestVersion success test", async () => {
            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);
        });

        it("Test getLastestVersion with default parameter start version", async () => {
            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);

            // @todo will be fixed in the 11 sprint
            // const callStartVersionArgs = latestVersionStub.getCall(0).args[1];
            // expect(callStartVersionArgs.startVersion).equal(-1);
        });

        it("Test getLastestVersion with setted parameter start version", async () => {
            const testStartVersion = 2;

            const latestVersion = await catalogClient.getLatestVersion(
                testStartVersion
            );

            expect(latestVersion).to.be.equal(catalogLatestVersion);

            // @todo will be fixed in the 11 sprint
            // const callStartVersionArgs = latestVersionStub.getCall(0).args[1];
            // expect(callStartVersionArgs.startVersion).equal(testStartVersion);
        });
    });

    describe("getVersions Tests", () => {
        const mockedVersion = {
            version: 1
        };
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

        before(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        beforeEach(() => {
            getBaseUrlRequestStub = sandbox.stub(
                dataServiceRead.RequestFactory,
                "getBaseUrl"
            );
            getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
            listVersionsStub = sandbox.stub(MetadataApi, "listVersions");
            listVersionsStub.callsFake((builder, params) =>
                Promise.resolve(catalogListVersions)
            );
            getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
            getVersionStub.callsFake(
                (
                    builder: any,
                    params: any
                ): Promise<MetadataApi.VersionResponse> => {
                    return Promise.resolve(mockedVersion);
                }
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
            getBaseUrlRequestStub = sandbox.stub(
                dataServiceRead.RequestFactory,
                "getBaseUrl"
            );
            getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
            loadAndCacheCatalogStub = sandbox.stub(ConfigApi, "getCatalog");
            loadAndCacheCatalogStub.callsFake((builder, params) =>
                Promise.reject(mockedErroreResponse)
            );
        });

        before(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Test error reject response", async () => {
            loadAndCacheCatalogStub.callsFake(
                (builder: any, params: any): Promise<ConfigApi.Catalog> => {
                    return Promise.reject(mockedErroreResponse);
                }
            );

            await catalogClient.getCatalog().catch((err: Response) => {
                expect(err).equal(
                    "Can't load catalog configuration. HRN: hrn:here:data:::rib-2, error: testError"
                );
            });
        });
    });
});
