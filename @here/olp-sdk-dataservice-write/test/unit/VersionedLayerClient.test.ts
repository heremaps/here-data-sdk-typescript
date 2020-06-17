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

import * as chai from "chai";
import sinonChai = require("sinon-chai");

import {
    VersionedLayerClient,
    StartBatchRequest,
    CancelBatchRequest
} from "@here/olp-sdk-dataservice-write";
import sinon = require("sinon");
import {
    MetadataApi,
    PublishApi,
    BlobApi
} from "@here/olp-sdk-dataservice-api";
import { OlpClientSettings, RequestFactory } from "@here/olp-sdk-core";
import {
    CheckDataExistsRequest,
    CompleteBatchRequest
} from "@here/olp-sdk-dataservice-write/lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;
class MockedHrn {
    constructor(private readonly hrn: string) {}
    toString(): string {
        return this.hrn;
    }
}

describe("VersionedLayerClient write", function() {
    let sandbox: sinon.SinonSandbox;
    let getVersionStub: sinon.SinonStub;
    let initPublicationStub: sinon.SinonStub;
    let cancelPublicationStub: sinon.SinonStub;
    let submitPublicationStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    let checkBlobExistsStub: sinon.SinonStub;
    let settings: OlpClientSettings;

    const fakeURL = "http://fake-base.url";
    const catalogHrn = new MockedHrn("hrn:here:data:::mocked-hrn") as any;

    before(function() {
        sandbox = sinon.createSandbox();
    });

    beforeEach(function() {
        settings = sandbox.createStubInstance(OlpClientSettings) as any;

        getVersionStub = sandbox.stub(MetadataApi, "latestVersion");
        initPublicationStub = sandbox.stub(PublishApi, "initPublication");
        cancelPublicationStub = sandbox.stub(PublishApi, "cancelPublication");
        submitPublicationStub = sandbox.stub(PublishApi, "submitPublication");
        checkBlobExistsStub = sandbox.stub(BlobApi, "checkBlobExistsStatus");

        getBaseUrlRequestStub = sandbox.stub(RequestFactory, "getBaseUrl");
        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("Should initialize", function() {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        assert.isDefined(client);
        expect(client).be.instanceOf(VersionedLayerClient);
    });

    it("checkDataExists returns 200", async function() {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        checkBlobExistsStub.callsFake(() => Promise.resolve({ status: 200 }));
        const isDadaExists = await client.checkDataExists(
            new CheckDataExistsRequest()
                .withDataHandle("test-data-handle")
                .withLayerId("test-layer")
        );
        expect(isDadaExists.status).to.be.equal(200);
    });

    it("checkDataExists rejects with HttpError", async function() {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        checkBlobExistsStub.callsFake(() =>
            Promise.reject({ status: 404, message: "Not found" })
        );
        const isDadaExists = await client
            .checkDataExists(
                new CheckDataExistsRequest()
                    .withDataHandle("test-data-handle")
                    .withLayerId("test-layer")
            )
            .catch(e => e);
        expect(isDadaExists.status).to.be.equal(404);
        expect(isDadaExists.message).to.be.equal("Not found");
    });

    it("checkDataExists rejects with errors if empty params", async function() {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const isDadaExists = await client
            .checkDataExists(
                new CheckDataExistsRequest().withDataHandle("test-data-handle")
            )
            .catch(e => e);

        expect(isDadaExists.message).to.be.equal(
            "Please provide layer id for the CheckDataExistsRequest"
        );

        const isDadaExists2 = await client
            .checkDataExists(
                new CheckDataExistsRequest().withLayerId("test-layer")
            )
            .catch(e => e);

        expect(isDadaExists2.message).to.be.equal(
            "Please provide data handle for the CheckDataExistsRequest"
        );
    });

    it("Should method getBaseVersion provide latest version", async function() {
        const mockedVersion = {
            version: 123
        };

        getVersionStub.callsFake(
            (): Promise<MetadataApi.VersionResponse> => {
                return Promise.resolve(mockedVersion);
            }
        );

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const version = await client.getBaseVersion();

        assert.isDefined(version);
        expect(version).to.be.equal(mockedVersion.version);
    });

    it("Should init the publication", async function() {
        initPublicationStub.callsFake(
            (): Promise<PublishApi.Publication> => {
                return Promise.resolve({
                    catalogId: "hrn:here:data:::mocked-hrn",
                    catalogVersion: 8,
                    details: {
                        expires: 1591845135277,
                        message: "",
                        modified: 1591585935277,
                        started: 1591585935277,
                        state: "initialized"
                    },
                    id: "w2-vr-4c94c5a8-ea2e-4e82-ab83-d0da541cd96d",
                    layerIds: ["mocked-layer-1"],
                    versionDependencies: []
                });
            }
        );

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client.startBatch(
            new StartBatchRequest().withLayers(["mocked-layer-1"])
        );
        expect(response.id).to.be.equal(
            "w2-vr-4c94c5a8-ea2e-4e82-ab83-d0da541cd96d"
        );
    });

    it("Should init the publication throw an error", async function() {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client
            .startBatch(new StartBatchRequest())
            .catch(error => error.message);
        expect(response).to.be.equal(
            "Please provide layer id or ids for the StartBatchRequest"
        );

        getBaseUrlRequestStub.callsFake(() => Promise.reject("Server Error"));
        const response2 = await client
            .startBatch(new StartBatchRequest())
            .catch(error => error.message);
        expect(response2).to.be.equal(
            'Error retrieving from cache builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });

    it("Should cancel the publication", async function() {
        cancelPublicationStub.callsFake(() => {
            return Promise.resolve({
                status: 204
            });
        });

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client.cancelBatch(
            new CancelBatchRequest().withPublicationId("mocked-pub-id")
        );
        expect(response.status === 204).equals(true);
    });

    it("Should rejects with error a cancel the publication operation", async function() {
        cancelPublicationStub.callsFake(() => {
            return Promise.reject({
                message: "Internal Server Error",
                status: 500
            });
        });

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client
            .cancelBatch(
                new CancelBatchRequest().withPublicationId("mocked-pub-id")
            )
            .catch(error => error.message);
        expect(response).to.be.equals("Internal Server Error");

        const response1 = await client
            .cancelBatch(new CancelBatchRequest())
            .catch(error => error.message);
        expect(response1).to.be.equals(
            "Please provide publication id for the CancelBatchRequest"
        );

        getBaseUrlRequestStub.callsFake(() => Promise.reject("Server Error"));
        const response2 = await client
            .cancelBatch(
                new CancelBatchRequest().withPublicationId("mocked-pub-id")
            )
            .catch(error => error.message);
        expect(response2).to.be.equal(
            'Error retrieving from cache builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });

    it("Should submit the publication", async function() {
        submitPublicationStub.callsFake(() => {
            return Promise.resolve({
                status: 204
            });
        });

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client.completeBatch(
            new CompleteBatchRequest().withPublicationId("mocked-pub-id")
        );
        expect(response.status).equals(204);
    });

    it("Should rejects with error a submit the publication operation", async function() {
        submitPublicationStub.callsFake(() => {
            return Promise.reject({
                message: "Internal Server Error",
                status: 500
            });
        });

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client
            .completeBatch(
                new CompleteBatchRequest().withPublicationId("mocked-pub-id")
            )
            .catch(error => error.message);
        expect(response).to.be.equals("Internal Server Error");

        const response1 = await client
            .completeBatch(new CompleteBatchRequest())
            .catch(error => error.message);
        expect(response1).to.be.equals(
            "Please provide publication id for the CompleteBatchRequest"
        );

        getBaseUrlRequestStub.callsFake(() => Promise.reject("Server Error"));
        const response2 = await client
            .cancelBatch(
                new CancelBatchRequest().withPublicationId("mocked-pub-id")
            )
            .catch(error => error.message);
        expect(response2).to.be.equal(
            'Error retrieving from cache builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });
});
