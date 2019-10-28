import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { CatalogClient } from "../lib/CatalogClient";
import { DataStoreContext } from "../lib/DataStoreContext";

import { MetadataApi } from "@here/olp-sdk-dataservice-api/";

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

    describe("getLastestVesion", () => {
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

        it("getLastestVersion success", async () => {
            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);
        });

        it("getlastestVersion with default start version", async () => {
            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);

            const callStartVersionArgs = latestVersionStub.getCall(0).args[1];
            expect(callStartVersionArgs.startVersion).equal(-1);
        });

        it("getLastestVersion with setted start version", async () => {
            const testStartVersion = 2;
            const latestVersion = await catalogClient.getLatestVersion(
                testStartVersion
            );

            expect(latestVersion).to.be.equal(catalogLatestVersion);

            const callStartVersionArgs = latestVersionStub.getCall(0).args[1];
            expect(callStartVersionArgs.startVersion).equal(testStartVersion);
        });
    });
});
