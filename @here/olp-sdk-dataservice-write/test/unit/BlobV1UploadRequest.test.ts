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
import { BlobV1UploadRequest } from "../../lib/utils/multipartupload-internal/BlobV1UploadRequest";
import { BlobApi } from "@here/olp-sdk-dataservice-api";

describe("BlobV1UploadRequest", function () {
    const mockedRequestBuilder: any = {
        id: "mocked-request-builder"
    };

    let blobApiStub: any;

    afterEach(() => {
        blobApiStub.mockRestore();
    });

    it("startMultipartUpload", async function () {
        const contentType = "mocked-content-type";
        const handle = "mocked-datahandle";
        const layerId = "mocked-layer-id";
        const contentEncoding = "gzip";
        const billingTag = "mocked-billingTag";

        const mockedApiResponse = {
            links: {
                _delete: { href: "mocked-delete-link", method: "DELETE" },
                complete: { href: "mocked-complete-link", method: "PUT" },
                status: { href: "mocked-status-link", method: "GET" },
                uploadPart: {
                    href: "mocked-uploadPart-url",
                    method: "POST"
                }
            }
        };

        blobApiStub = vi
            .spyOn(BlobApi, "startMultipartUpload")
            .mockResolvedValue(mockedApiResponse);

        const request = new BlobV1UploadRequest(mockedRequestBuilder);
        const result = await request.startMultipartUpload({
            contentType,
            handle,
            layerId,
            billingTag,
            contentEncoding
        });

        expect(result.uploadPartUrl).equals(
            mockedApiResponse.links.uploadPart.href
        );

        expect(blobApiStub).toHaveBeenCalledWith(mockedRequestBuilder, {
            dataHandle: handle,
            layerId,
            billingTag,
            body: {
                contentType,
                contentEncoding
            }
        });

        const mockedApiBadResponse = {
            links: undefined
        };

        blobApiStub.mockRestore();
        blobApiStub = vi
            .spyOn(BlobApi, "startMultipartUpload")
            .mockResolvedValue(mockedApiBadResponse);

        await request
            .startMultipartUpload({
                contentType,
                handle,
                layerId,
                billingTag,
                contentEncoding
            })
            .catch((e) => {
                expect(e.message).eqls(
                    "Failed to start the multipart upload to Blob V1. Bad response."
                );
            });
    });

    it("uploadPart", async function () {
        const contentType = "mocked-content-type";
        const url = "mocked-url";
        const data = Buffer.from("mocked-data", "utf8");
        const contentLength = 11;
        const partNumber = 23;
        const billingTag = "mocked-billingTag";

        const mockedApiResponse = {
            headers: new Map().set("ETag", "mocked-id")
        };

        blobApiStub = vi
            .spyOn(BlobApi, "doUploadPart")
            .mockResolvedValue(mockedApiResponse as unknown as Response);

        const request = new BlobV1UploadRequest(mockedRequestBuilder);
        const result = await request.uploadPart({
            url,
            data,
            contentType,
            contentLength,
            partNumber,
            billingTag
        });

        expect(result.partId).equals("mocked-id");
        expect(result.partNumber).equals(23);

        expect(blobApiStub).toHaveBeenCalledWith(mockedRequestBuilder, {
            url,
            body: data,
            contentType,
            contentLength,
            partNumber,
            billingTag
        });

        const mockedApiBadResponse = {
            headers: new Map()
        };
        blobApiStub.mockRestore();
        blobApiStub = vi
            .spyOn(BlobApi, "doUploadPart")
            .mockResolvedValue(mockedApiBadResponse as unknown as Response);

        await request
            .uploadPart({
                url,
                data,
                contentType,
                contentLength,
                partNumber,
                billingTag
            })
            .catch((e) => {
                expect(e.message).eqls(
                    "Error uploading chunk 23, can not read ETag from the response headers."
                );
            });
    });

    it("completeMultipartUpload", async function () {
        const url = "mocked-url";
        const billingTag = "mocked-billingTag";
        const parts = [
            {
                id: "part1",
                number: 1
            },
            {
                id: "part2",
                number: 2
            }
        ];

        blobApiStub = vi
            .spyOn(BlobApi, "doCompleteMultipartUpload")
            .mockReturnValue(undefined as any);

        const request = new BlobV1UploadRequest(mockedRequestBuilder);
        await request.completeMultipartUpload({
            url,
            parts,
            billingTag
        });

        expect(blobApiStub).toHaveBeenCalledWith(mockedRequestBuilder, {
            url,
            parts: {
                parts: [
                    {
                        etag: "part1",
                        number: 1
                    },
                    {
                        etag: "part2",
                        number: 2
                    }
                ]
            },
            billingTag
        });
    });
});
