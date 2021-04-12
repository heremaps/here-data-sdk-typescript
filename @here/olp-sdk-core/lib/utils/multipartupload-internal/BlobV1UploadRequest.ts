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
import { BlobApi } from "@here/olp-sdk-dataservice-api";
import { UploadRequest } from "./interfaces";

export class BlobV1UploadRequest implements UploadRequest {
    constructor(private readonly requestBuilder: DataStoreRequestBuilder) {}

    async startMultipartUpload(opts: {
        layerId: string;
        handle: string;
        contentType: string;
        contentEncoding?: string;
        billingTag?: string;
    }): Promise<{
        complete?: {
            href?: string;
            method?: string;
        };
        _delete?: {
            href?: string;
            method?: string;
        };
        status?: {
            href?: string;
            method?: string;
        };
        uploadPart?: {
            href?: string;
            method?: string;
        };
    }> {
        const result = await BlobApi.startMultipartUpload(this.requestBuilder, {
            dataHandle: opts.handle,
            layerId: opts.layerId,
            billingTag: opts.billingTag,
            body: {
                contentType: opts.contentType,
                contentEncoding: opts.contentEncoding as any
            }
        });
        return {
            _delete: result.links?._delete,
            complete: result.links?.complete,
            status: result.links?.status,
            uploadPart: result.links?.uploadPart
        };
    }

    async uploadPart(opts: {
        url: string;
        data: ArrayBuffer;
        contentType: string;
        partNumber: number;
        contentLength: number;
        billingTag?: string;
    }): Promise<{ id: string }> {
        const result = await BlobApi.doUploadPart(this.requestBuilder, {
            body: opts.data,
            contentLength: opts.contentLength,
            contentType: opts.contentType,
            partNumber: opts.partNumber,
            url: opts.url,
            billingTag: opts.billingTag
        });

        const id = result.headers.get("ETag");
        if (!id) {
            return Promise.reject(
                new Error(
                    `Error uploading chunk ${opts.partNumber}, can't read ETag from headers.`
                )
            );
        }

        return { id };
    }

    async completeMultipartUpload(opts: {
        parts: {
            id: string;
            number: number;
        }[];
        url: string;
        billingTag?: string;
    }): Promise<Response> {
        return BlobApi.doCompleteMultipartUpload(this.requestBuilder, {
            parts: {
                parts: opts.parts.map(item => ({
                    etag: item.id,
                    number: item.number
                }))
            },
            url: opts.url,
            billingTag: opts.billingTag
        });
    }
}
