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
    let dataStoreContextStubInstance: sinon.SinonStubbedInstance<
        DataStoreContext
    >;

    describe("getlastestVesion", () => {
        const catalogLatestVersion = 43;

        beforeEach(() => {
            dataStoreContextStubInstance = sinon.createStubInstance(
                DataStoreContext
            );
            latestVersionStub = sinon.stub(MetadataApi, "latestVersion");
            latestVersionStub.callsFake((builder, params) =>
                Promise.resolve(catalogLatestVersion)
            );
        });

        afterEach(() => {
            latestVersionStub.restore();
        });

        it("getlastestVersion success", async () => {
            const catalogClient = new CatalogClient({
                context: (dataStoreContextStubInstance as unknown) as DataStoreContext,
                hrn: "fake-hrn-string"
            });

            const latestVersion = await catalogClient.getLatestVersion();

            expect(latestVersion).to.be.equal(catalogLatestVersion);
        });
    });
});
