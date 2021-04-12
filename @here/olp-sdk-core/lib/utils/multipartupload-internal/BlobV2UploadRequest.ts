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

import { DataStoreRequestBuilder } from "@here/olp-sdk-core";
import { ObjectStoreApi } from "@here/olp-sdk-dataservice-api";
import { UploadRequest, UploadPartResponse } from "./interfaces";

export class BlobV2UploadRequest implements UploadRequest {
    constructor(private readonly requestBuilder: DataStoreRequestBuilder) {}

    async startMultipartUpload(opts: {
        layerId: string;
        handle: string;
        contentType: string;
        contentEncoding?: string;
    }): Promise<{
        multipartToken: string;
    }> {
        const result = await ObjectStoreApi.startMultipartUploadByKey(
            this.requestBuilder,
            {
                key: opts.handle,
                layerId: opts.layerId,
                body: {
                    contentType: opts.contentType,
                    contentEncoding: opts.contentEncoding
                }
            }
        );
        return Promise.resolve({ multipartToken: result.multipartToken });
    }

    async uploadPart(opts: {
        data: ArrayBuffer;
        layerId: string;
        multipartToken: string;
        partNumber: number;
        contentLength?: number;
        contentType?: string;
    }): Promise<UploadPartResponse> {
        const result = await ObjectStoreApi.uploadPartByKey(
            this.requestBuilder,
            {
                layerId: opts.layerId,
                body: opts.data,
                multipartToken: opts.multipartToken,
                partNumber: opts.partNumber,
                contentLength: opts.contentLength,
                contentType: opts.contentType
            }
        );
        return { id: result.id };
    }

    async completeMultipartUpload(opts: {
        parts: {
            id: string;
            number: number;
        }[];
        layerId: string;
        multipartToken: string;
    }): Promise<Response> {
        return ObjectStoreApi.completeMultipartUploadByKey(
            this.requestBuilder,
            {
                layerId: opts.layerId,
                multipartToken: opts.multipartToken,
                body: {
                    parts: opts.parts
                }
            }
        );
    }
}
