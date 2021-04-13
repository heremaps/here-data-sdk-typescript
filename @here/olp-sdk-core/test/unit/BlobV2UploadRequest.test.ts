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

import { BlobV2UploadRequest } from "../../lib/utils/multipartupload-internal/BlobV2UploadRequest";
import { ObjectStoreApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);
const expect = chai.expect;

describe("BlobV2UploadRequest", function() {
    const mockedRequestBuilder: any = {
        id: "mocked-request-builder"
    };

    let blobApiStub: sinon.SinonStub;

    afterEach(() => {
        blobApiStub.restore();
    });

    it("startMultipartUpload", async function() {
        const contentType = "mocked-content-type";
        const handle = "mocked-key";
        const layerId = "mocked-layer-id";
        const contentEncoding = "mocked-contentEncoding";
        const billingTag = "mocked-billingTag";

        const mockedApiResponse = {
            multipartToken: "mocked-multipartToken"
        };

        blobApiStub = sinon
            .stub(ObjectStoreApi, "startMultipartUploadByKey")
            .resolves(mockedApiResponse);

        const request = new BlobV2UploadRequest(mockedRequestBuilder);
        const result = await request.startMultipartUpload({
            contentType,
            handle,
            layerId,
            contentEncoding
        });

        expect(result.multipartToken).equals(mockedApiResponse.multipartToken);

        expect(blobApiStub).calledWith(mockedRequestBuilder, {
            key: handle,
            layerId,
            body: {
                contentType,
                contentEncoding
            }
        });
    });

    it("uploadPart", async function() {
        const contentType = "mocked-content-type";
        const multipartToken = "mocked-multipartToken";
        const data = Buffer.from("mocked-data", "utf8");
        const contentLength = 11;
        const partNumber = 23;
        const layerId = "mocked-layerId";

        const mockedApiResponse = {
            id: "mocked-part-id"
        };

        blobApiStub = sinon
            .stub(ObjectStoreApi, "uploadPartByKey")
            .resolves(mockedApiResponse);

        const request = new BlobV2UploadRequest(mockedRequestBuilder);
        const result = await request.uploadPart({
            layerId,
            data,
            multipartToken,
            contentType,
            contentLength,
            partNumber
        });

        expect(result.id).equals("mocked-part-id");

        expect(blobApiStub).calledWith(mockedRequestBuilder, {
            layerId,
            body: data,
            multipartToken,
            contentType,
            contentLength,
            partNumber
        });
    });

    it("completeMultipartUpload", async function() {
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

        blobApiStub = sinon.stub(
            ObjectStoreApi,
            "completeMultipartUploadByKey"
        );

        const request = new BlobV2UploadRequest(mockedRequestBuilder);
        await request.completeMultipartUpload({
            multipartToken,
            parts,
            layerId
        });

        expect(blobApiStub).calledWith(mockedRequestBuilder, {
            layerId,
            body: {
                parts
            },
            multipartToken
        });
    });
});
