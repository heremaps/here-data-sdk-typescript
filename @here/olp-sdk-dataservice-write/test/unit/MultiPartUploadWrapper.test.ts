/*
 * Copyright (C) 2021 HERE Europe B.V.
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

import * as sinon from "sinon";
import * as chai from "chai";
import sinonChai = require("sinon-chai");
import * as core from "@here/olp-sdk-core";
import * as BlobV1UploadRequest from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/BlobV1UploadRequest";
import * as BlobV2UploadRequest from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/BlobV2UploadRequest";
import { NodeFileData } from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/NodeFileData";
import { BufferData } from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/BufferData";
import { MultiPartUploadWrapper } from "@here/olp-sdk-dataservice-write";

chai.use(sinonChai);

const expect = chai.expect;

const OlpClientSettingsStub = {} as core.OlpClientSettings;
let wrapper: MultiPartUploadWrapper;

describe("MultiPartUploadWrapper", async function() {
    let HrnFromStringStub: sinon.SinonStub;
    let requestFactoryCreateStub: sinon.SinonStub;

    beforeEach(() => {
        HrnFromStringStub = sinon.stub(core.HRN, "fromString");
        requestFactoryCreateStub = sinon.stub(core.RequestFactory, "create");
    });

    afterEach(() => {
        HrnFromStringStub.restore();
        requestFactoryCreateStub.restore();
    });

    describe("Success cases", () => {
        it("Upload to Blob V1", async () => {
            // ======= Prepare ====== //

            const MockedBlobV1UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    uploadPartUrl: "mocked-upload-part-url",
                    completeUrl: "mocked-complete-url"
                }),
                uploadPart: sinon.stub().resolves({
                    partId: "mocked-uploaded-part-id",
                    partNumber: 1
                }),
                completeMultipartUpload: sinon.stub()
            };

            const BlobV1UploadRequestStub = sinon
                .stub(BlobV1UploadRequest, "BlobV1UploadRequest")
                .returns(MockedBlobV1UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v1",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-datahandle",
                    layerId: "mocked-layer-id",
                    billingTag: "mocked-billingTag",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            const status = await wrapper.upload(
                Buffer.from("test-data", "utf-8")
            );

            expect(status).eqls(204);

            // =========== Should be called once startMultipartUpload method with correct params. ======= //

            const startMultipartUploadCalls = MockedBlobV1UploadRequest.startMultipartUpload.getCalls();
            expect(startMultipartUploadCalls.length).eqls(1);

            const startMultipartUploadCallParams =
                startMultipartUploadCalls[0].args[0];
            expect(startMultipartUploadCallParams.contentType).eqls(
                "text/plain"
            );
            expect(startMultipartUploadCallParams.handle).eqls(
                "mocked-datahandle"
            );
            expect(startMultipartUploadCallParams.layerId).eqls(
                "mocked-layer-id"
            );
            expect(startMultipartUploadCallParams.billingTag).eqls(
                "mocked-billingTag"
            );
            expect(startMultipartUploadCallParams.contentEncoding).eqls("gzip");

            // =========== Should be called once uploadPart method with correct params. ======= //

            const uploadPartCalls = MockedBlobV1UploadRequest.uploadPart.getCalls();
            expect(uploadPartCalls.length).eqls(1);

            const uploadPartCallParams = uploadPartCalls[0].args[0];
            expect(uploadPartCallParams.layerId).eqls("mocked-layer-id");
            expect(uploadPartCallParams.data.byteLength).eqls(9);
            expect(uploadPartCallParams.multipartToken).eqls(undefined);
            expect(uploadPartCallParams.billingTag).eqls("mocked-billingTag");
            expect(uploadPartCallParams.contentLength).eqls(9);
            expect(uploadPartCallParams.contentType).eqls("text/plain");
            expect(uploadPartCallParams.partNumber).eqls(1);
            expect(uploadPartCallParams.url).eqls("mocked-upload-part-url");

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls = MockedBlobV1UploadRequest.completeMultipartUpload.getCalls();
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0].args[0];

            expect(completeMultipartUploadCallParams.parts).eqls([
                { id: "mocked-uploaded-part-id", number: 1 }
            ]);
            expect(completeMultipartUploadCallParams.layerId).eqls(
                "mocked-layer-id"
            );
            expect(completeMultipartUploadCallParams.multipartToken).eqls(
                undefined
            );
            expect(completeMultipartUploadCallParams.billingTag).eqls(
                "mocked-billingTag"
            );
            expect(completeMultipartUploadCallParams.url).eqls(
                "mocked-complete-url"
            );

            BlobV1UploadRequestStub.restore();
        });

        it("Upload to Blob V2", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: sinon.stub().resolves({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: sinon.stub()
            };

            const BlobV2UploadRequestStub = sinon
                .stub(BlobV2UploadRequest, "BlobV2UploadRequest")
                .returns(MockedBlobV2UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v2",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-key",
                    layerId: "mocked-layer-id",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            const status = await wrapper.upload(
                Buffer.from("test-data", "utf-8")
            );

            expect(status).eqls(204);

            // =========== Should be called once startMultipartUpload method with correct params. ======= //

            const startMultipartUploadCalls = MockedBlobV2UploadRequest.startMultipartUpload.getCalls();
            expect(startMultipartUploadCalls.length).eqls(1);

            const startMultipartUploadCallParams =
                startMultipartUploadCalls[0].args[0];
            expect(startMultipartUploadCallParams.contentType).eqls(
                "text/plain"
            );
            expect(startMultipartUploadCallParams.handle).eqls("mocked-key");
            expect(startMultipartUploadCallParams.layerId).eqls(
                "mocked-layer-id"
            );
            expect(startMultipartUploadCallParams.billingTag).eqls(undefined);
            expect(startMultipartUploadCallParams.contentEncoding).eqls("gzip");

            // =========== Should be called once uploadPart method with correct params. ======= //

            const uploadPartCalls = MockedBlobV2UploadRequest.uploadPart.getCalls();
            expect(uploadPartCalls.length).eqls(1);

            const uploadPartCallParams = uploadPartCalls[0].args[0];
            expect(uploadPartCallParams.layerId).eqls("mocked-layer-id");
            expect(uploadPartCallParams.data.byteLength).eqls(9);
            expect(uploadPartCallParams.multipartToken).eqls(
                "mocked-multipartToken"
            );
            expect(uploadPartCallParams.billingTag).eqls(undefined);
            expect(uploadPartCallParams.contentLength).eqls(9);
            expect(uploadPartCallParams.contentType).eqls("text/plain");
            expect(uploadPartCallParams.partNumber).eqls(1);
            expect(uploadPartCallParams.url).eqls(undefined);

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls = MockedBlobV2UploadRequest.completeMultipartUpload.getCalls();
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0].args[0];

            expect(completeMultipartUploadCallParams.parts).eqls([
                { id: "mocked-uploaded-part-id", number: 1 }
            ]);
            expect(completeMultipartUploadCallParams.layerId).eqls(
                "mocked-layer-id"
            );
            expect(completeMultipartUploadCallParams.multipartToken).eqls(
                "mocked-multipartToken"
            );
            expect(completeMultipartUploadCallParams.billingTag).eqls(
                undefined
            );
            expect(completeMultipartUploadCallParams.url).eqls(undefined);

            BlobV2UploadRequestStub.restore();
        });

        it("Should call callbacks if exists", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: sinon.stub().resolves({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: sinon.stub()
            };

            const BlobV2UploadRequestStub = sinon
                .stub(BlobV2UploadRequest, "BlobV2UploadRequest")
                .returns(MockedBlobV2UploadRequest);

            const onStart = sinon.stub();
            const onStatus = sinon.stub();
            const blobFinally = sinon.stub();

            class TestBlobData extends BufferData {
                constructor(data: ArrayBufferLike) {
                    super(data);
                }

                async finally() {
                    blobFinally();
                }
            }

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v2",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-key",
                    layerId: "mocked-layer-id",
                    contentEncoding: "gzip",
                    onStart,
                    onStatus
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            const status = await wrapper.upload(
                new TestBlobData(Buffer.from("test-data", "utf-8"))
            );

            expect(status).eqls(204);

            // =========== Should be called once onStart callback with correct params. ======= //

            const onStartCalls = onStart.getCalls();
            expect(onStartCalls.length).eqls(1);

            const onStartCallParams = onStartCalls[0].args[0];
            expect(onStartCallParams.dataSize).equals(9);
            expect(onStartCallParams.multipartToken).equals(
                "mocked-multipartToken"
            );
            expect(onStartCallParams.multipartUrl).equals(undefined);
            expect(onStartCallParams.multipartStatusUrl).equals(undefined);

            // =========== Should be called once onStatus callback with correct params. ======= //

            const onStatusCalls = onStatus.getCalls();
            expect(onStatusCalls.length).eqls(1);

            const onStatusCallsParams = onStatusCalls[0].args[0];
            expect(onStatusCallsParams.chunkId).equals(
                "mocked-uploaded-part-id"
            );
            expect(onStatusCallsParams.chunkNumber).equals(1);
            expect(onStatusCallsParams.chunkSize).equals(9);
            expect(onStatusCallsParams.totalChunks).equals(1);
            expect(onStatusCallsParams.uploadedChunks).equals(1);

            BlobV2UploadRequestStub.restore();
        });
    });

    describe("Uploading by chunks", () => {
        it("The uploaded data should be splitted by default 5MB chunks", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: sinon.stub().resolves({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: sinon.stub()
            };

            const BlobV2UploadRequestStub = sinon
                .stub(BlobV2UploadRequest, "BlobV2UploadRequest")
                .returns(MockedBlobV2UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v2",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-key",
                    layerId: "mocked-layer-id"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            const data = Buffer.alloc(33554432); // ~ 33 MB

            const status = await wrapper.upload(data);

            expect(status).eqls(204);

            // =========== Should be called once startMultipartUpload method. ======= //

            const startMultipartUploadCalls = MockedBlobV2UploadRequest.startMultipartUpload.getCalls();
            expect(startMultipartUploadCalls.length).eqls(1);

            // =========== Should be called 7 times the uploadPart method. ======= //

            const uploadPartCalls = MockedBlobV2UploadRequest.uploadPart.getCalls();
            expect(uploadPartCalls.length).eqls(7);

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls = MockedBlobV2UploadRequest.completeMultipartUpload.getCalls();
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0].args[0];

            expect(completeMultipartUploadCallParams.parts).eqls([
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 }
            ]);
            expect(completeMultipartUploadCallParams.layerId).eqls(
                "mocked-layer-id"
            );
            expect(completeMultipartUploadCallParams.multipartToken).eqls(
                "mocked-multipartToken"
            );
            expect(completeMultipartUploadCallParams.billingTag).eqls(
                undefined
            );
            expect(completeMultipartUploadCallParams.url).eqls(undefined);

            BlobV2UploadRequestStub.restore();
        });

        it("The uploaded data should be splitted by not default 17MB chunks", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: sinon.stub().resolves({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: sinon.stub()
            };

            const BlobV2UploadRequestStub = sinon
                .stub(BlobV2UploadRequest, "BlobV2UploadRequest")
                .returns(MockedBlobV2UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v2",
                    chunkSizeMB: 17,
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-key",
                    layerId: "mocked-layer-id"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            const data = Buffer.alloc(33554432); // ~ 33 MB

            const status = await wrapper.upload(data);

            expect(status).eqls(204);

            // =========== Should be called once startMultipartUpload method. ======= //

            const startMultipartUploadCalls = MockedBlobV2UploadRequest.startMultipartUpload.getCalls();
            expect(startMultipartUploadCalls.length).eqls(1);

            // =========== Should be called 2 times the uploadPart method. ======= //

            const uploadPartCalls = MockedBlobV2UploadRequest.uploadPart.getCalls();
            expect(uploadPartCalls.length).eqls(2);

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls = MockedBlobV2UploadRequest.completeMultipartUpload.getCalls();
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0].args[0];

            expect(completeMultipartUploadCallParams.parts).eqls([
                { id: "mocked-uploaded-part-id", number: 1 },
                { id: "mocked-uploaded-part-id", number: 1 }
            ]);
            expect(completeMultipartUploadCallParams.layerId).eqls(
                "mocked-layer-id"
            );
            expect(completeMultipartUploadCallParams.multipartToken).eqls(
                "mocked-multipartToken"
            );
            expect(completeMultipartUploadCallParams.billingTag).eqls(
                undefined
            );
            expect(completeMultipartUploadCallParams.url).eqls(undefined);

            BlobV2UploadRequestStub.restore();
        });
    });

    describe("Different inputs test", () => {
        it("Upload to Blob", async () => {
            // ======= Prepare ====== //

            const NodeFileDataStub = sinon
                .stub(NodeFileData, "fromPath")
                .resolves(new BufferData(Buffer.from("test-data", "utf-8")));

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: sinon
                    .stub()
                    .resolves({ id: "mocked-uploaded-part-id" }),
                completeMultipartUpload: sinon.stub()
            };

            const BlobV2UploadRequestStub = sinon
                .stub(BlobV2UploadRequest, "BlobV2UploadRequest")
                .returns(MockedBlobV2UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v2",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-key",
                    layerId: "mocked-layer-id",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            const status = await wrapper.upload("fake path to file");

            expect(status).eqls(204);

            NodeFileDataStub.restore();
            BlobV2UploadRequestStub.restore();
        });
    });

    describe("Unsuccessful cases", () => {
        it("Not valid startMultipartResponse", async () => {
            // ======= Prepare ====== //

            let MockedBlobV1UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    uploadPartUrl: "mocked-upload-part-url"
                })
            };

            let BlobV1UploadRequestStub = sinon
                .stub(BlobV1UploadRequest, "BlobV1UploadRequest")
                .returns(MockedBlobV1UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v1",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-datahandle",
                    layerId: "mocked-layer-id",
                    billingTag: "mocked-billingTag",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            try {
                await wrapper.upload(Buffer.from("test-data", "utf-8"));
            } catch (error) {
                expect(error.message).equals(
                    `Missing completeUrl. Aborting upload.`
                );
            }

            BlobV1UploadRequestStub.restore();

            MockedBlobV1UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    completeUrl: "mocked-complete-url"
                })
            };

            BlobV1UploadRequestStub = sinon
                .stub(BlobV1UploadRequest, "BlobV1UploadRequest")
                .returns(MockedBlobV1UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v1",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-datahandle",
                    layerId: "mocked-layer-id",
                    billingTag: "mocked-billingTag",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            try {
                await wrapper.upload(Buffer.from("test-data", "utf-8"));
            } catch (error) {
                expect(error.message).equals(
                    "Missing uploadPartUrl. Aborting upload."
                );
            }

            BlobV1UploadRequestStub.restore();

            MockedBlobV1UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({})
            };

            BlobV1UploadRequestStub = sinon
                .stub(BlobV1UploadRequest, "BlobV1UploadRequest")
                .returns(MockedBlobV1UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v1",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-datahandle",
                    layerId: "mocked-layer-id",
                    billingTag: "mocked-billingTag",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            try {
                await wrapper.upload(Buffer.from("test-data", "utf-8"));
            } catch (error) {
                expect(error.message).equals(
                    "Missing uploadPartUrl,completeUrl. Aborting upload."
                );
            }

            BlobV1UploadRequestStub.restore();

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: sinon.stub().resolves({
                    completeUrl: "mocked-complete-url"
                })
            };

            const BlobV2UploadRequestStub = sinon
                .stub(BlobV2UploadRequest, "BlobV2UploadRequest")
                .returns(MockedBlobV2UploadRequest);

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v2",
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-datahandle",
                    layerId: "mocked-layer-id",
                    billingTag: "mocked-billingTag",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            try {
                await wrapper.upload(Buffer.from("test-data", "utf-8"));
            } catch (error) {
                expect(error.message).equals(
                    "Multipart upload v2 failed, multipartToken missing"
                );
            }

            BlobV2UploadRequestStub.restore();

            // ======= Initialize ====== //
            wrapper = new MultiPartUploadWrapper(
                {
                    blobVersion: "v3" as any,
                    catalogHrn: "mocked-catalog",
                    contentType: "text/plain",
                    handle: "mocked-datahandle",
                    layerId: "mocked-layer-id",
                    billingTag: "mocked-billingTag",
                    contentEncoding: "gzip"
                },
                OlpClientSettingsStub
            );

            // ======== Call method. ======== //

            try {
                await wrapper.upload(Buffer.from("test-data", "utf-8"));
            } catch (error) {
                expect(error.message).equals("Unsupported Blob version: v3");
            }
        });
    });
});
