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
import { ArtifactApi, HttpError } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("ArtifactClient", () => {
    let sandbox: sinon.SinonSandbox;
    let olpClientSettingsStub: sinon.SinonStubbedInstance<dataServiceRead.OlpClientSettings>;
    let getArtifactUsingGETStub: sinon.SinonStub;
    let getSchemaUsingGETStub: sinon.SinonStub;
    let getBaseUrlRequestStub: sinon.SinonStub;
    const mockedHRN = dataServiceRead.HRN.fromString(
        "hrn:here:data:::mocked-hrn"
    );
    const mockedLayerId = "mocked-layed-id";
    const fakeURL = "http://fake-base.url";

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        olpClientSettingsStub = sandbox.createStubInstance(
            dataServiceRead.OlpClientSettings
        );
        getBaseUrlRequestStub = sandbox.stub(
            dataServiceRead.RequestFactory,
            "getBaseUrl"
        );
        getArtifactUsingGETStub = sandbox.stub(
            ArtifactApi,
            "getArtifactUsingGET"
        );
        getSchemaUsingGETStub = sandbox.stub(ArtifactApi, "getSchemaUsingGET");

        getBaseUrlRequestStub.callsFake(() => Promise.resolve(fakeURL));
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Shoud be initialised with settings", async () => {
        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);
    });

    it("Should method getSchema provide data", async () => {
        const mockedSchema: Response = new Response(null, {
            statusText: "mocked response"
        });
        const mockedVersion = {
            id: "42",
            url: "http://fake.url"
        };
        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);
        getArtifactUsingGETStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.resolve(mockedSchema);
            }
        );

        const schemaRequest = new dataServiceRead.SchemaRequest().withVariant(
            mockedVersion
        );

        const response = await artifactClient.getSchema(schemaRequest);
        assert.isDefined(response);
    });

    it("Should method getSchema return HttpError when ArtifactClient API crashes", async () => {
        const NOT_FOUND_ERROR_CODE = 404;
        const mockedError = new HttpError(NOT_FOUND_ERROR_CODE, "Not found");

        const mockedSchema: Response = new Response(null, {
            statusText: "mocked response"
        });
        const mockedVersion = {
            id: "42",
            url: "http://fake.url"
        };
        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);
        getArtifactUsingGETStub.callsFake(
            (builder: any, params: any): Promise<Response> => {
                return Promise.reject(mockedError);
            }
        );

        const schemaRequest = new dataServiceRead.SchemaRequest().withVariant(
            mockedVersion
        );

        const responseSchema = await artifactClient
            .getSchema(schemaRequest)
            .catch((err: any) => {
                assert.isDefined(err);
                expect(err.status).to.be.equal(NOT_FOUND_ERROR_CODE);
                expect(err.message).to.be.equal("Not found");
                expect(err.name).to.be.equal("HttpError");
            });
    });

    it("Should method getSchema return error without variant data provided", async () => {
        const mockedError: string =
            "Please provide the schema variant by schemaRequest.withVariant()";

        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);

        const schemaRequest = new dataServiceRead.SchemaRequest();

        const schema = await artifactClient
            .getSchema(schemaRequest)
            .catch(error => {
                assert.isDefined(error);
                assert.equal(mockedError, error.message);
            });
    });

    it("Should method getSchemaDetails provide data", async () => {
        const mockedSchema: ArtifactApi.GetSchemaResponse = {
            variants: [
                {
                    id: "42",
                    url: "https://fake.url"
                }
            ]
        };
        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);
        getSchemaUsingGETStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ArtifactApi.GetSchemaResponse> => {
                return Promise.resolve(mockedSchema);
            }
        );

        const schemaDetailsRequest = new dataServiceRead.SchemaDetailsRequest().withSchema(
            mockedHRN
        );

        const response = await artifactClient.getSchemaDetails(
            schemaDetailsRequest
        );
        assert.isDefined(!response);
        expect(mockedSchema).be.equal(response);
    });

    it("Should method getSchemaDetails return HttpError when ArtifactClient crashes", async () => {
        const NOT_FOUND_ERROR_CODE = 404;
        const mockedError = new HttpError(NOT_FOUND_ERROR_CODE, "Not found");

        const mockedSchema: ArtifactApi.GetSchemaResponse = {
            variants: [
                {
                    id: "42",
                    url: "https://fake.url"
                }
            ]
        };
        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);

        getSchemaUsingGETStub.callsFake(
            (
                builder: any,
                params: any
            ): Promise<ArtifactApi.GetSchemaResponse> => {
                return Promise.reject(mockedError);
            }
        );

        const schemaDetailsRequest = new dataServiceRead.SchemaDetailsRequest().withSchema(
            mockedHRN
        );

        const responseSchema = await artifactClient
            .getSchemaDetails(schemaDetailsRequest)
            .catch((err: any) => {
                assert.isDefined(err);
                expect(err.status).to.be.equal(NOT_FOUND_ERROR_CODE);
                expect(err.message).to.be.equal("Not found");
                expect(err.name).to.be.equal("HttpError");
            });
    });

    it("Should method getSchemaDetails return error without hrn provided", async () => {
        const mockedError: string =
            "Please provide the schema HRN by schemaDetailsRequest.withSchema()";

        const artifactClient = new dataServiceRead.ArtifactClient(
            olpClientSettingsStub as any
        );
        assert.isDefined(artifactClient);

        const schemaDetailsRequest = new dataServiceRead.SchemaDetailsRequest();

        const schema = await artifactClient
            .getSchemaDetails(schemaDetailsRequest)
            .catch((error: any) => {
                assert.isDefined(error);
                assert.equal(mockedError, error.message);
            });
    });
});
