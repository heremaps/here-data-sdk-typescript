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
import { BlobV2UploadRequest } from "../../lib/utils/multipartupload-internal/BlobV2UploadRequest";
import { ObjectStoreApi } from "@here/olp-sdk-dataservice-api";

describe("BlobV2UploadRequest", function () {
    const mockedRequestBuilder: any = {
        id: "mocked-request-builder"
    };

    let blobApiStub: any;

    afterEach(() => {
        blobApiStub.mockRestore();
    });

    it("startMultipartUpload", async function () {
        const contentType = "mocked-content-type";
        const handle = "mocked-key";
        const layerId = "mocked-layer-id";
        const contentEncoding = "mocked-contentEncoding";

        const mockedApiResponse = {
            multipartToken: "mocked-multipartToken"
        };

        blobApiStub = vi
            .spyOn(ObjectStoreApi, "startMultipartUploadByKey")
            .mockResolvedValue(mockedApiResponse);

        const request = new BlobV2UploadRequest(mockedRequestBuilder);
        const result = await request.startMultipartUpload({
            contentType,
            handle,
            layerId,
            contentEncoding
        });

        expect(result.multipartToken).equals(mockedApiResponse.multipartToken);

        expect(blobApiStub).toHaveBeenCalledWith(mockedRequestBuilder, {
            key: handle,
            layerId,
            body: {
                contentType,
                contentEncoding
            }
        });

        const mockedApiBadResponse = {
            multipartToken: undefined as any
        };
        blobApiStub.mockRestore();
        blobApiStub = vi
            .spyOn(ObjectStoreApi, "startMultipartUploadByKey")
            .mockResolvedValue(mockedApiBadResponse);

        await request
            .startMultipartUpload({
                contentType,
                handle,
                layerId,
                contentEncoding
            })
            .catch((e) => {
                expect(e.message).eqls(
                    "Failed to start the multipart upload to Blob V2. Bad response."
                );
            });
    });

    it("uploadPart", async function () {
        const contentType = "mocked-content-type";
        const multipartToken = "mocked-multipartToken";
        const data = Buffer.from("mocked-data", "utf8");
        const contentLength = 11;
        const partNumber = 23;
        const layerId = "mocked-layerId";

        const mockedApiResponse = {
            id: "mocked-part-id"
        };

        blobApiStub = vi
            .spyOn(ObjectStoreApi, "uploadPartByKey")
            .mockResolvedValue(mockedApiResponse);

        const request = new BlobV2UploadRequest(mockedRequestBuilder);
        const result = await request.uploadPart({
            layerId,
            data,
            multipartToken,
            contentType,
            contentLength,
            partNumber
        });

        expect(result.partId).equals("mocked-part-id");
        expect(result.partNumber).equals(23);

        expect(blobApiStub).toHaveBeenCalledWith(mockedRequestBuilder, {
            layerId,
            body: data,
            multipartToken,
            contentType,
            contentLength,
            partNumber
        });

        const mockedApiBadResponse = {
            id: undefined as any
        };

        blobApiStub.mockRestore();
        blobApiStub = vi
            .spyOn(ObjectStoreApi, "uploadPartByKey")
            .mockResolvedValue(mockedApiBadResponse);

        await request
            .uploadPart({
                layerId,
                data,
                multipartToken,
                contentType,
                contentLength,
                partNumber
            })
            .catch((e) => {
                expect(e.message).eqls(
                    "Error uploading chunk 23, can not get the part ID from the response"
                );
            });
    });

    it("completeMultipartUpload", async function () {
        const multipartToken = "mocked-multipartToken";
        const layerId = "mocked-layerId";
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
            .spyOn(ObjectStoreApi, "completeMultipartUploadByKey")
            .mockReturnValue(undefined as any);

        const request = new BlobV2UploadRequest(mockedRequestBuilder);
        await request.completeMultipartUpload({
            multipartToken,
            parts,
            layerId
        });

        expect(blobApiStub).toHaveBeenCalledWith(mockedRequestBuilder, {
            layerId,
            body: {
                parts
            },
            multipartToken
        });
    });
});
