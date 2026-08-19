/*
 * Copyright (C) 2020-2026 HERE Europe B.V.
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

import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    assert
} from "vitest";
import { createStubInstance } from "./stub-instance";
import {
    VersionedLayerClient,
    StartBatchRequest,
    CancelBatchRequest,
    CheckDataExistsRequest,
    CompleteBatchRequest,
    GetBatchRequest,
    UploadBlobRequest,
    UploadPartitionsRequest,
    PublishSinglePartitionRequest
} from "@here/olp-sdk-dataservice-write";
import {
    MetadataApi,
    PublishApi,
    BlobApi
} from "@here/olp-sdk-dataservice-api";
import { OlpClientSettings, RequestFactory, Uuid } from "@here/olp-sdk-core";

class MockedHrn {
    constructor(private readonly hrn: string) {}
    toString(): string {
        return this.hrn;
    }
}

describe("VersionedLayerClient write", function () {
    let getVersionStub: any;
    let initPublicationStub: any;
    let cancelPublicationStub: any;
    let getPublicationStub: any;
    let submitPublicationStub: any;
    let getBaseUrlRequestStub: any;
    let checkBlobExistsStub: any;
    let startMultipartUploadStub: any;
    let doUploadPartStub: any;
    let doCompleteMultipartUploadStub: any;
    let uploadPartitionsStub: any;
    let settings: OlpClientSettings;
    let uuidCreateStub: any;
    let putDataStub: any;

    const fakeURL = "http://fake-base.url";
    const catalogHrn = new MockedHrn("hrn:here:data:::mocked-hrn") as any;

    beforeAll(function () {});

    beforeEach(function () {
        settings = createStubInstance(OlpClientSettings) as any;

        getVersionStub = vi
            .spyOn(MetadataApi, "latestVersion")
            .mockReturnValue(undefined as any);
        initPublicationStub = vi
            .spyOn(PublishApi, "initPublication")
            .mockReturnValue(undefined as any);
        cancelPublicationStub = vi
            .spyOn(PublishApi, "cancelPublication")
            .mockReturnValue(undefined as any);
        getPublicationStub = vi
            .spyOn(PublishApi, "getPublication")
            .mockReturnValue(undefined as any);
        submitPublicationStub = vi
            .spyOn(PublishApi, "submitPublication")
            .mockReturnValue(undefined as any);
        checkBlobExistsStub = vi
            .spyOn(BlobApi, "checkBlobExistsStatus")
            .mockReturnValue(undefined as any);
        uploadPartitionsStub = vi
            .spyOn(PublishApi, "uploadPartitions")
            .mockReturnValue(undefined as any);
        uuidCreateStub = vi
            .spyOn(Uuid, "create")
            .mockReturnValue(undefined as any);

        startMultipartUploadStub = vi
            .spyOn(BlobApi, "startMultipartUpload")
            .mockReturnValue(undefined as any);
        doUploadPartStub = vi
            .spyOn(BlobApi, "doUploadPart")
            .mockReturnValue(undefined as any);
        doCompleteMultipartUploadStub = vi
            .spyOn(BlobApi, "doCompleteMultipartUpload")
            .mockReturnValue(undefined as any);

        getBaseUrlRequestStub = vi
            .spyOn(RequestFactory, "getBaseUrl")
            .mockReturnValue(undefined as any);
        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.resolve(fakeURL)
        );

        putDataStub = vi
            .spyOn(BlobApi, "putData")
            .mockReturnValue(undefined as any);
    });

    afterEach(function () {
        vi.restoreAllMocks();
    });

    it("Should initialize", function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        assert.isDefined(client);
        expect(client).be.instanceOf(VersionedLayerClient);
    });

    it("checkDataExists returns 200", async function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        checkBlobExistsStub.mockImplementation(() =>
            Promise.resolve({ status: 200 })
        );
        const isDadaExists = await client.checkDataExists(
            new CheckDataExistsRequest()
                .withDataHandle("test-data-handle")
                .withLayerId("test-layer")
        );
        expect(isDadaExists.status).to.be.equal(200);
    });

    it("checkDataExists rejects with HttpError", async function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        checkBlobExistsStub.mockImplementation(() =>
            Promise.reject({ status: 404, message: "Not found" })
        );
        const isDadaExists = await client
            .checkDataExists(
                new CheckDataExistsRequest()
                    .withDataHandle("test-data-handle")
                    .withLayerId("test-layer")
            )
            .catch((e) => e);
        expect(isDadaExists.status).to.be.equal(404);
        expect(isDadaExists.message).to.be.equal("Not found");
    });

    it("checkDataExists rejects with errors if empty params", async function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const isDadaExists = await client
            .checkDataExists(
                new CheckDataExistsRequest().withDataHandle("test-data-handle")
            )
            .catch((e) => e);

        expect(isDadaExists.message).to.be.equal(
            "Please provide layer id for the CheckDataExistsRequest"
        );

        const isDadaExists2 = await client
            .checkDataExists(
                new CheckDataExistsRequest().withLayerId("test-layer")
            )
            .catch((e) => e);

        expect(isDadaExists2.message).to.be.equal(
            "Please provide data handle for the CheckDataExistsRequest"
        );
    });

    it("Should method getBaseVersion provide latest version", async function () {
        const mockedVersion = {
            version: 123
        };

        getVersionStub.mockImplementation(
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

    it("Should init the publication", async function () {
        initPublicationStub.mockImplementation(
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

    it("Should init the publication throw an error", async function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client
            .startBatch(new StartBatchRequest())
            .catch((error) => error.message);
        expect(response).to.be.equal(
            "Please provide layer id or ids for the StartBatchRequest"
        );

        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.reject("Server Error")
        );
        const response2 = await client
            .startBatch(new StartBatchRequest())
            .catch((error) => error.message);
        expect(response2).to.be.equal(
            'Error retrieving from cache builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });

    it("Should cancel the publication", async function () {
        cancelPublicationStub.mockImplementation(function () {
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

    it("Should rejects with error a cancel the publication operation", async function () {
        cancelPublicationStub.mockImplementation(function () {
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
            .catch((error) => error.message);
        expect(response).to.be.equals("Internal Server Error");

        const response1 = await client
            .cancelBatch(new CancelBatchRequest())
            .catch((error) => error.message);
        expect(response1).to.be.equals(
            "Please provide publication id for the CancelBatchRequest"
        );

        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.reject("Server Error")
        );
        const response2 = await client
            .cancelBatch(
                new CancelBatchRequest().withPublicationId("mocked-pub-id")
            )
            .catch((error) => error.message);
        expect(response2).to.be.equal(
            'Error retrieving from cache builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });

    it("Should submit the publication", async function () {
        submitPublicationStub.mockImplementation(function () {
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

    it("Should rejects with error a submit the publication operation", async function () {
        submitPublicationStub.mockImplementation(function () {
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
            .catch((error) => error.message);
        expect(response).to.be.equals("Internal Server Error");

        const response1 = await client
            .completeBatch(new CompleteBatchRequest())
            .catch((error) => error.message);
        expect(response1).to.be.equals(
            "Please provide publication id for the CompleteBatchRequest"
        );

        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.reject("Server Error")
        );
        const response2 = await client
            .cancelBatch(
                new CancelBatchRequest().withPublicationId("mocked-pub-id")
            )
            .catch((error) => error.message);
        expect(response2).to.be.equal(
            'Error retrieving from cache builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });

    it("Should return the publication details", async function () {
        getPublicationStub.mockImplementation(function () {
            return Promise.resolve({
                catalogId: "sdk-writing-test",
                catalogVersion: 37,
                details: {
                    expires: 1595046170000,
                    message: "",
                    modified: 1594786970000,
                    started: 1594786970000,
                    state: "initialized"
                },
                id: "w2-vr-1ca56262-59d0-487c-a755-f8e124435e6f",
                layerIds: ["layer3"],
                versionDependencies: []
            });
        });

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const response = await client.getBatch(
            new GetBatchRequest().withPublicationId("mocked-pub-id")
        );

        expect(response.id).equals(
            "w2-vr-1ca56262-59d0-487c-a755-f8e124435e6f"
        );
        expect(response.details && response.details.state).equals(
            "initialized"
        );
    });

    it("Should rejects with error when getting the publication details", async function () {
        getPublicationStub.mockImplementation(function () {
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
            .getBatch(new GetBatchRequest().withPublicationId("mocked-pub-id"))
            .catch((error) => error.message);
        expect(response).to.be.equals("Internal Server Error");

        const response1 = await client
            .getBatch(new GetBatchRequest())
            .catch((error) => error.message);
        expect(response1).to.be.equals(
            "Please provide publication id for the GetBatchRequest"
        );

        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.reject("Server Error")
        );
        const response2 = await client
            .getBatch(new GetBatchRequest().withPublicationId("mocked-pub-id"))
            .catch((error) => error.message);
        expect(response2).to.be.equal(
            'Error retrieving builder for resource "hrn:here:data:::mocked-hrn" and api: publish. Server Error'
        );
    });

    it("UploadBlob", async function () {
        const data = Buffer.alloc(25000);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );

        const mockedHeaders = new Headers();
        mockedHeaders.set("ETag", "mocked-etag");
        doUploadPartStub.mockImplementation(() =>
            Promise.resolve({
                headers: mockedHeaders,
                status: 204
            })
        );
        doCompleteMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        putDataStub.mockImplementation(() =>
            Promise.resolve({
                status: 204
            })
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request);
        expect(response.getDataHandle()).equals(mockedDatahandle);

        const bigData = Buffer.alloc(52428800);

        const response2 = await client.uploadBlob(request.withData(bigData));
        expect(response2.getDataHandle()).equals(mockedDatahandle);
    });

    it("UploadBlob with content encoding gzip", async function () {
        const data = Buffer.alloc(25);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";
        const mockedContentEncoding = "mocked-contentEncoding";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        putDataStub.mockImplementation(() =>
            Promise.resolve({
                status: 204
            })
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag)
            .withContentEncoding(mockedContentEncoding);

        const response = await client.uploadBlob(request);
        expect(response.getDataHandle()).equals(mockedDatahandle);
        expect(putDataStub.mock.calls[0][1].contentEncoding).equals(
            mockedContentEncoding
        );
    });

    it("UploadBlob should generate and return the datahandle", async function () {
        const data = Buffer.alloc(25000);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );

        uuidCreateStub.mockImplementation(() => mockedDatahandle);
        checkBlobExistsStub.mockImplementation(() =>
            Promise.reject({ status: 404 })
        );

        const mockedHeaders = new Headers();
        mockedHeaders.set("ETag", "mocked-etag");
        doUploadPartStub.mockImplementation(() =>
            Promise.resolve({
                headers: mockedHeaders,
                status: 204
            })
        );
        doCompleteMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        putDataStub.mockImplementation(() =>
            Promise.resolve({
                status: 204
            })
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request);
        expect(response.getDataHandle()).equals(mockedDatahandle);
    });

    it("UploadBlob should try to generate datahandle and return the error", async function () {
        const data = Buffer.alloc(25000);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );

        uuidCreateStub.mockImplementation(() => mockedDatahandle);
        checkBlobExistsStub.mockImplementation(() =>
            Promise.resolve({ status: 200 })
        );

        const mockedHeaders = new Headers();
        mockedHeaders.set("ETag", "mocked-etag");
        doUploadPartStub.mockImplementation(() =>
            Promise.resolve({
                headers: mockedHeaders,
                status: 204
            })
        );
        doCompleteMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request).catch((e) => e);
        expect(response.message).equals("Please set DataHandle to the request");
    });

    it("UploadBlob wrong parameters test", async function () {
        const data = Buffer.alloc(52428800);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        const request = new UploadBlobRequest()
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request).catch((e) => e);
        expect(response.message).equals(
            "Please set layerId to the UploadBlobRequest"
        );

        const request2 = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withBillingTag(mockedBillingTag);

        const response2 = await client.uploadBlob(request2).catch((e) => e);
        expect(response2.message).equals(
            "Please set contentType to the UploadBlobRequest"
        );

        const request3 = new UploadBlobRequest()
            .withLayerId(layerId)
            .withContentType(mockedContentType)
            .withDataHandle(mockedDatahandle)
            .withBillingTag(mockedBillingTag);

        const response3 = await client.uploadBlob(request3).catch((e) => e);
        expect(response3.message).equals(
            "Please set data to the UploadBlobRequest"
        );

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );
        doUploadPartStub.mockImplementation(() =>
            Promise.reject("A some server error")
        );
        const request4 = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response4 = await client.uploadBlob(request4).catch((e) => e);
        expect(response4).equals("A some server error");
    });

    it("UploadBlob rejects if no ETag in header", async function () {
        const data = Buffer.alloc(52428800);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );

        const mockedHeaders = new Headers();
        doUploadPartStub.mockImplementation(() =>
            Promise.resolve({
                headers: mockedHeaders,
                status: 204
            })
        );
        doCompleteMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request).catch((e) => e);
        expect(response.message).equals(
            "Error uploading chunk 1, can not read ETag from the response headers."
        );
    });

    it("UploadBlob rejects if multipart upload not started", async function () {
        const data = Buffer.alloc(52428800);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.reject("Error starting multipart upload")
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request).catch((e) => e);
        expect(response).equals("Error starting multipart upload");
    });

    it("UploadBlob rejects if complete multipart upload was not OK", async function () {
        const data = Buffer.alloc(52428800);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );

        const mockedHeaders = new Headers();
        mockedHeaders.set("ETag", "mocked-etag");
        doUploadPartStub.mockImplementation(() =>
            Promise.resolve({
                headers: mockedHeaders,
                status: 204
            })
        );
        doCompleteMultipartUploadStub.mockImplementation(() =>
            Promise.reject("Error completing upload")
        );

        const request = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withDataHandle(mockedDatahandle)
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.uploadBlob(request).catch((e) => e);
        expect(response).equals("Error completing upload");
    });

    it("UploadPartitions", async function () {
        const mockedPublicationId = "mocked-publication-id";
        const layerId = "mocked-layer";
        const mockedPartitions = {
            partitions: [
                {
                    partition: "partitions-1",
                    dataHandle: "datahandle-1"
                },
                {
                    partition: "partitions-2",
                    dataHandle: "datahandle-2"
                }
            ]
        };

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        uploadPartitionsStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        const request = new UploadPartitionsRequest()
            .withLayerId(layerId)
            .withPublicationId(mockedPublicationId)
            .withPartitions(mockedPartitions);

        const response = await client.uploadPartitions(request);

        expect(response.status).equals(204);
    });

    it("UploadPartitions negative", async function () {
        const mockedPublicationId = "mocked-publication-id";
        const layerId = "mocked-layer";
        const mockedPartitions = {
            partitions: [
                {
                    partition: "partitions-1",
                    dataHandle: "datahandle-1"
                },
                {
                    partition: "partitions-2",
                    dataHandle: "datahandle-2"
                }
            ]
        };

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        uploadPartitionsStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        const request = new UploadPartitionsRequest()
            .withPublicationId(mockedPublicationId)
            .withPartitions(mockedPartitions);

        const response = await client.uploadPartitions(request).catch((e) => e);
        expect(response.message).equals(
            "Please set layerId to the UploadPartitionsRequest"
        );

        const request2 = new UploadPartitionsRequest()
            .withLayerId(layerId)
            .withPartitions(mockedPartitions);

        const response2 = await client
            .uploadPartitions(request2)
            .catch((e) => e);
        expect(response2.message).equals(
            "Please set publicationId to the UploadPartitionsRequest"
        );

        const request3 = new UploadPartitionsRequest()
            .withLayerId(layerId)
            .withPublicationId(mockedPublicationId);

        const response3 = await client
            .uploadPartitions(request3)
            .catch((e) => e);
        expect(response3.message).equals(
            "Please set partitions to the UploadPartitionsRequest"
        );
    });

    it("publishToBatch", async function () {
        const data = Buffer.alloc(25000);
        const mockedDatahandle = "mocked-datahandle";
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        startMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({
                links: {
                    complete: { href: "http://mocked.url", method: "PUT" },
                    _delete: { href: "http://mocked.url", method: "DELETE" },
                    status: { href: "http://mocked.url", method: "GET" },
                    uploadPart: { href: "http://mocked.url", method: "POST" }
                }
            })
        );

        const mockedHeaders = new Headers();
        mockedHeaders.set("ETag", "mocked-etag");
        doUploadPartStub.mockImplementation(() =>
            Promise.resolve({
                headers: mockedHeaders,
                status: 204
            })
        );
        doCompleteMultipartUploadStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        putDataStub.mockImplementation(() =>
            Promise.resolve({
                status: 204
            })
        );

        uploadPartitionsStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        const request = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withData(data)
            .withMetaData({
                partition: "mocked-partition",
                dataSize: data.byteLength,
                dataHandle: "mocked-datahandle"
            })
            .withPublicationId("mocked-publication-id")
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.publishToBatch(request);
        expect(response.status).equals(204);

        const bigData = Buffer.alloc(52428800);

        const response2 = await client.publishToBatch(
            request.withData(bigData)
        );
        expect(response2.status).equals(204);
    });

    it("publishToBatch wrong parameters test", async function () {
        const data = Buffer.alloc(52428800);
        const mockedContentType = "text/plain";
        const mockedBillingTag = "mocked-billing-tag";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const layerId = "mocked-layer";

        const request = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withData(data)
            .withPublicationId("mocked-publication-id")
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response = await client.publishToBatch(request).catch((e) => e);
        expect(response.message).equals(
            "Please set metadata to the PublishSinglePartitionRequest"
        );

        const request2 = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withMetaData({
                partition: "mocked-partition",
                dataSize: data.byteLength,
                dataHandle: "mocked-datahandle"
            })
            .withPublicationId("mocked-publication-id")
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response2 = await client.publishToBatch(request2).catch((e) => e);
        expect(response2.message).equals(
            "Please set data to the PublishSinglePartitionRequest"
        );

        const request3 = new PublishSinglePartitionRequest()
            .withData(data)
            .withMetaData({
                partition: "mocked-partition",
                dataSize: data.byteLength,
                dataHandle: "mocked-datahandle"
            })
            .withPublicationId("mocked-publication-id")
            .withContentType(mockedContentType)
            .withBillingTag(mockedBillingTag);

        const response3 = await client.publishToBatch(request3).catch((e) => e);
        expect(response3.message).equals(
            "Please set layerId to the PublishSinglePartitionRequest"
        );
    });

    it("publishToBatch rejects an incomplete partition description", async function () {
        const data = Buffer.alloc(25000);
        const layerId = "mocked-layer";
        const mockedContentType = "text/plain";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        const withoutPartition = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withData(data)
            .withMetaData({
                dataSize: data.byteLength,
                dataHandle: "mocked-datahandle"
            } as any)
            .withPublicationId("mocked-publication-id")
            .withContentType(mockedContentType);

        const response = await client
            .publishToBatch(withoutPartition)
            .catch((e) => e);
        expect(response.message).equals("Partition ID is missing");

        const withoutPublicationId = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withData(data)
            .withMetaData({
                partition: "mocked-partition",
                dataSize: data.byteLength,
                dataHandle: "mocked-datahandle"
            })
            .withContentType(mockedContentType);

        const response2 = await client
            .publishToBatch(withoutPublicationId)
            .catch((e) => e);
        expect(response2.message).equals(
            "Please set publicationId to the PublishSinglePartitionRequest"
        );

        const withoutContentType = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withData(data)
            .withMetaData({
                partition: "mocked-partition",
                dataSize: data.byteLength,
                dataHandle: "mocked-datahandle"
            })
            .withPublicationId("mocked-publication-id");

        const response3 = await client
            .publishToBatch(withoutContentType)
            .catch((e) => e);
        expect(response3.message).equals(
            "Please set contentType to the UploadBlobRequest"
        );
    });

    it("Should report which api the request builder could not be built for", async function () {
        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        // Every entry point names the api it failed to look up, so that a
        // lookup failure can be told apart from a failure of the call itself.
        getBaseUrlRequestStub.mockImplementation(() =>
            Promise.reject(new Error("mocked-lookup-error"))
        );

        const blobError = await client
            .checkDataExists(
                new CheckDataExistsRequest()
                    .withLayerId("mocked-layer")
                    .withDataHandle("mocked-datahandle")
            )
            .catch((e) => e);
        expect(blobError.message).contains("api: blob");

        const metadataError = await client.getBaseVersion().catch((e) => e);
        expect(metadataError).contains("api: metadata");

        const completeError = await client
            .completeBatch(
                new CompleteBatchRequest().withPublicationId(
                    "mocked-publication-id"
                )
            )
            .catch((e) => e);
        expect(completeError.message).contains("api: publish");

        const uploadError = await client
            .uploadPartitions(
                new UploadPartitionsRequest()
                    .withLayerId("mocked-layer")
                    .withPublicationId("mocked-publication-id")
                    .withPartitions({ partitions: [] })
            )
            .catch((e) => e);
        expect(uploadError.message).contains("api: publish");
    });

    it("publishToBatch fills the data size in and keeps the content encoding", async function () {
        const data = Buffer.alloc(25000);
        const layerId = "mocked-layer";

        const client = new VersionedLayerClient({
            catalogHrn,
            settings
        });

        putDataStub.mockImplementation(() => Promise.resolve({ status: 204 }));
        uploadPartitionsStub.mockImplementation(() =>
            Promise.resolve({ status: 204 })
        );

        // The metadata carries no data size, so the client has to take it from
        // the data itself before the partition is published.
        const request = new PublishSinglePartitionRequest()
            .withLayerId(layerId)
            .withData(data)
            .withMetaData({
                partition: "mocked-partition",
                dataHandle: "mocked-datahandle"
            } as any)
            .withPublicationId("mocked-publication-id")
            .withContentType("text/plain")
            .withContentEncoding("gzip");

        const response = await client.publishToBatch(request);

        expect(response.status).equals(204);
        expect(putDataStub.mock.calls[0][1].contentEncoding).equals("gzip");
        expect(
            uploadPartitionsStub.mock.calls[0][1].body.partitions[0].dataSize
        ).equals(data.byteLength);
    });
});
