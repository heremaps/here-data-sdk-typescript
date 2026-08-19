/*
 * Copyright (C) 2021-2026 HERE Europe B.V.
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
import * as core from "@here/olp-sdk-core";
import * as BlobV1UploadRequest from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/BlobV1UploadRequest";
import * as BlobV2UploadRequest from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/BlobV2UploadRequest";
import { NodeFileData } from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/NodeFileData";
import { BufferData } from "@here/olp-sdk-dataservice-write/lib/utils/multipartupload-internal/BufferData";
import { MultiPartUploadWrapper } from "@here/olp-sdk-dataservice-write";

const OlpClientSettingsStub = {} as core.OlpClientSettings;
let wrapper: MultiPartUploadWrapper;

describe("MultiPartUploadWrapper", async function () {
    let HrnFromStringStub: any;
    let requestFactoryCreateStub: any;

    beforeEach(() => {
        HrnFromStringStub = vi
            .spyOn(core.HRN, "fromString")
            .mockReturnValue(undefined as any);
        requestFactoryCreateStub = vi
            .spyOn(core.RequestFactory, "create")
            .mockReturnValue(undefined as any);
    });

    afterEach(() => {
        HrnFromStringStub.mockRestore();
        requestFactoryCreateStub.mockRestore();
    });

    describe("Success cases", () => {
        it("Upload to Blob V1", async () => {
            // ======= Prepare ====== //

            const MockedBlobV1UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    uploadPartUrl: "mocked-upload-part-url",
                    completeUrl: "mocked-complete-url"
                }),
                uploadPart: vi.fn().mockResolvedValue({
                    partId: "mocked-uploaded-part-id",
                    partNumber: 1
                }),
                completeMultipartUpload: vi.fn()
            };

            const BlobV1UploadRequestStub = vi
                .spyOn(BlobV1UploadRequest, "BlobV1UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV1UploadRequest;
                });

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

            const startMultipartUploadCalls =
                MockedBlobV1UploadRequest.startMultipartUpload.mock.calls;
            expect(startMultipartUploadCalls.length).eqls(1);

            const startMultipartUploadCallParams =
                startMultipartUploadCalls[0][0];
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

            const uploadPartCalls =
                MockedBlobV1UploadRequest.uploadPart.mock.calls;
            expect(uploadPartCalls.length).eqls(1);

            const uploadPartCallParams = uploadPartCalls[0][0];
            expect(uploadPartCallParams.layerId).eqls("mocked-layer-id");
            expect(uploadPartCallParams.data.byteLength).eqls(9);
            expect(uploadPartCallParams.multipartToken).eqls(undefined);
            expect(uploadPartCallParams.billingTag).eqls("mocked-billingTag");
            expect(uploadPartCallParams.contentLength).eqls(9);
            expect(uploadPartCallParams.contentType).eqls("text/plain");
            expect(uploadPartCallParams.partNumber).eqls(1);
            expect(uploadPartCallParams.url).eqls("mocked-upload-part-url");

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls =
                MockedBlobV1UploadRequest.completeMultipartUpload.mock.calls;
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0][0];

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

            BlobV1UploadRequestStub.mockRestore();
        });

        it("Upload to Blob V2", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: vi.fn().mockResolvedValue({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: vi.fn()
            };

            const BlobV2UploadRequestStub = vi
                .spyOn(BlobV2UploadRequest, "BlobV2UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV2UploadRequest;
                });

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

            const startMultipartUploadCalls =
                MockedBlobV2UploadRequest.startMultipartUpload.mock.calls;
            expect(startMultipartUploadCalls.length).eqls(1);

            const startMultipartUploadCallParams =
                startMultipartUploadCalls[0][0];
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

            const uploadPartCalls =
                MockedBlobV2UploadRequest.uploadPart.mock.calls;
            expect(uploadPartCalls.length).eqls(1);

            const uploadPartCallParams = uploadPartCalls[0][0];
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

            const completeMultipartUploadCalls =
                MockedBlobV2UploadRequest.completeMultipartUpload.mock.calls;
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0][0];

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

            BlobV2UploadRequestStub.mockRestore();
        });

        it("Should call callbacks if exists", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: vi.fn().mockResolvedValue({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: vi.fn()
            };

            const BlobV2UploadRequestStub = vi
                .spyOn(BlobV2UploadRequest, "BlobV2UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV2UploadRequest;
                });

            const onStart = vi.fn();
            const onStatus = vi.fn();
            const blobFinally = vi.fn();

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

            const onStartCalls = onStart.mock.calls;
            expect(onStartCalls.length).eqls(1);

            const onStartCallParams = onStartCalls[0][0];
            expect(onStartCallParams.dataSize).equals(9);
            expect(onStartCallParams.multipartToken).equals(
                "mocked-multipartToken"
            );
            expect(onStartCallParams.multipartUrl).equals(undefined);
            expect(onStartCallParams.multipartStatusUrl).equals(undefined);

            // =========== Should be called once onStatus callback with correct params. ======= //

            const onStatusCalls = onStatus.mock.calls;
            expect(onStatusCalls.length).eqls(1);

            const onStatusCallsParams = onStatusCalls[0][0];
            expect(onStatusCallsParams.chunkId).equals(
                "mocked-uploaded-part-id"
            );
            expect(onStatusCallsParams.chunkNumber).equals(1);
            expect(onStatusCallsParams.chunkSize).equals(9);
            expect(onStatusCallsParams.totalChunks).equals(1);
            expect(onStatusCallsParams.uploadedChunks).equals(1);

            BlobV2UploadRequestStub.mockRestore();
        });
    });

    describe("Uploading by chunks", () => {
        it("The uploaded data should be splitted by default 5MB chunks", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: vi.fn().mockResolvedValue({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: vi.fn()
            };

            const BlobV2UploadRequestStub = vi
                .spyOn(BlobV2UploadRequest, "BlobV2UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV2UploadRequest;
                });

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

            const startMultipartUploadCalls =
                MockedBlobV2UploadRequest.startMultipartUpload.mock.calls;
            expect(startMultipartUploadCalls.length).eqls(1);

            // =========== Should be called 7 times the uploadPart method. ======= //

            const uploadPartCalls =
                MockedBlobV2UploadRequest.uploadPart.mock.calls;
            expect(uploadPartCalls.length).eqls(7);

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls =
                MockedBlobV2UploadRequest.completeMultipartUpload.mock.calls;
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0][0];

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

            BlobV2UploadRequestStub.mockRestore();
        });

        it("The uploaded data should be splitted by not default 17MB chunks", async () => {
            // ======= Prepare ====== //

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: vi.fn().mockResolvedValue({
                    partNumber: 1,
                    partId: "mocked-uploaded-part-id"
                }),
                completeMultipartUpload: vi.fn()
            };

            const BlobV2UploadRequestStub = vi
                .spyOn(BlobV2UploadRequest, "BlobV2UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV2UploadRequest;
                });

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

            const startMultipartUploadCalls =
                MockedBlobV2UploadRequest.startMultipartUpload.mock.calls;
            expect(startMultipartUploadCalls.length).eqls(1);

            // =========== Should be called 2 times the uploadPart method. ======= //

            const uploadPartCalls =
                MockedBlobV2UploadRequest.uploadPart.mock.calls;
            expect(uploadPartCalls.length).eqls(2);

            // =========== Should be called once completeMultipartUpload method with correct params. ======= //

            const completeMultipartUploadCalls =
                MockedBlobV2UploadRequest.completeMultipartUpload.mock.calls;
            expect(completeMultipartUploadCalls.length).eqls(1);

            const completeMultipartUploadCallParams =
                completeMultipartUploadCalls[0][0];

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

            BlobV2UploadRequestStub.mockRestore();
        });
    });

    describe("Different inputs test", () => {
        it("Upload to Blob", async () => {
            // ======= Prepare ====== //

            const NodeFileDataStub = vi
                .spyOn(NodeFileData, "fromPath")
                .mockResolvedValue(
                    new BufferData(Buffer.from("test-data", "utf-8"))
                );

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    multipartToken: "mocked-multipartToken"
                }),
                uploadPart: vi
                    .fn()
                    .mockResolvedValue({ id: "mocked-uploaded-part-id" }),
                completeMultipartUpload: vi.fn()
            };

            const BlobV2UploadRequestStub = vi
                .spyOn(BlobV2UploadRequest, "BlobV2UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV2UploadRequest;
                });

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

            NodeFileDataStub.mockRestore();
            BlobV2UploadRequestStub.mockRestore();
        });
    });

    describe("Unsuccessful cases", () => {
        it("Not valid startMultipartResponse", async () => {
            // ======= Prepare ====== //

            let MockedBlobV1UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    uploadPartUrl: "mocked-upload-part-url"
                })
            };

            let BlobV1UploadRequestStub = vi
                .spyOn(BlobV1UploadRequest, "BlobV1UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV1UploadRequest;
                });

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

            BlobV1UploadRequestStub.mockRestore();

            MockedBlobV1UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    completeUrl: "mocked-complete-url"
                })
            };

            BlobV1UploadRequestStub = vi
                .spyOn(BlobV1UploadRequest, "BlobV1UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV1UploadRequest;
                });

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

            BlobV1UploadRequestStub.mockRestore();

            MockedBlobV1UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({})
            };

            BlobV1UploadRequestStub = vi
                .spyOn(BlobV1UploadRequest, "BlobV1UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV1UploadRequest;
                });

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

            BlobV1UploadRequestStub.mockRestore();

            const MockedBlobV2UploadRequest = {
                startMultipartUpload: vi.fn().mockResolvedValue({
                    completeUrl: "mocked-complete-url"
                })
            };

            const BlobV2UploadRequestStub = vi
                .spyOn(BlobV2UploadRequest, "BlobV2UploadRequest")
                .mockImplementation(function () {
                    return MockedBlobV2UploadRequest;
                });

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

            BlobV2UploadRequestStub.mockRestore();

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
