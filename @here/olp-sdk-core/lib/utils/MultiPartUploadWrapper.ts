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

import {
    HRN,
    OlpClientSettings,
    RequestFactory,
    TypedEvent
} from "@here/olp-sdk-core";
import { BlobData } from "./multipartupload-internal/BlobData";
import { BlobV1UploadRequest } from "./multipartupload-internal/BlobV1UploadRequest";
import { BlobV2UploadRequest } from "./multipartupload-internal/BlobV2UploadRequest";
import { BufferData } from "./multipartupload-internal/BufferData";
import { Data, UploadRequest } from "./multipartupload-internal/interfaces";
import { NodeFileData } from "./multipartupload-internal/NodeFileData";

export interface UploadChunkEvent {
    size: number;
    number: number;
    partId: string;
}

export class MultiPartUploadWrapper {
    private data: Data;
    private settings: OlpClientSettings;
    private cachedUploadRequests: Map<string, UploadRequest>;

    constructor(opts: {
        data: string | File | Blob | ArrayBufferLike;
        settings: OlpClientSettings;
    }) {
        this.data = this.buildData(opts.data);
        this.settings = opts.settings;
        this.cachedUploadRequests = new Map();
    }

    async upload(opts: {
        catalogHrn: string;
        layerId: string;
        blobVersion: number;
        handle: string;
        contentType: string;
        parallelRequests?: number;
        chunkSizeMB?: number;
        contentEncoding?: string;
        billingTag?: string;
        startUploadEvent?: TypedEvent<void>;
        uploadChunkEvent?: TypedEvent<UploadChunkEvent>;
        doneUploadEvent?: TypedEvent<void>;
    }) {
        const PARALLEL_REQUESTS = 6;
        const parts: { id: string; number: number }[] = [];
        const request = await this.getUploadRequest({
            blobVersion: opts.blobVersion,
            catalogHrn: opts.catalogHrn
        });

        const startMultipartResponse = await request.startMultipartUpload({
            contentType: opts.contentType,
            handle: opts.handle,
            layerId: opts.layerId,
            billingTag: opts.billingTag,
            contentEncoding: opts.contentEncoding
        });

        opts.startUploadEvent && opts.startUploadEvent.emit();

        const chunkSize = this.validateChunkSize(opts.chunkSizeMB);
        const parallelRequests = opts.parallelRequests || PARALLEL_REQUESTS;
        const dataSize = this.data.size();

        let unreadBytes = dataSize;
        let readBytes = 0;
        let chunkNumber = 0;

        while (unreadBytes > 0) {
            const promises = [];

            while (promises.length < parallelRequests) {
                const buffer = await this.data.readBytes(
                    readBytes,
                    readBytes + chunkSize
                );

                if (buffer.byteLength === 0) {
                    break;
                }

                chunkNumber++;
                readBytes += buffer.byteLength;
                unreadBytes -= buffer.byteLength;

                promises.push(
                    request
                        .uploadPart({
                            data: buffer,
                            layerId: opts.layerId,
                            multipartToken:
                                startMultipartResponse.multipartToken,
                            billingTag: opts.billingTag,
                            contentLength: buffer.byteLength,
                            contentType: opts.contentType,
                            partNumber: chunkNumber,
                            url: startMultipartResponse.uploadPart?.href
                        })
                        .then(uploadPartResponse => {
                            parts.push({
                                id: uploadPartResponse.id,
                                number: chunkNumber
                            });

                            opts.uploadChunkEvent &&
                                opts.uploadChunkEvent.emit({
                                    number: chunkNumber,
                                    partId: uploadPartResponse.id,
                                    size: buffer.byteLength
                                });
                        })
                );
            }

            await Promise.all(promises);
        }

        await request.completeMultipartUpload({
            parts,
            url: startMultipartResponse.complete?.href,
            multipartToken: startMultipartResponse.multipartToken,
            layerId: opts.layerId,
            billingTag: opts.billingTag
        });

        opts.doneUploadEvent && opts.doneUploadEvent.emit();
    }

    private validateChunkSize(size = 0): number {
        const minChunkSizeMiB = 5;
        const mmxChunkSizeMiB = 5120;
        const bytesInMiB = 1048576;
        return size >= minChunkSizeMiB && size <= mmxChunkSizeMiB
            ? size * bytesInMiB
            : minChunkSizeMiB * bytesInMiB;
    }

    private buildData(input: any): Data {
        if (typeof input === "string") {
            return new NodeFileData(input);
        }

        if (input.arrayBuffer) {
            // arrayBuffer exists only in browser's File or Blob objects
            return new BlobData(input);
        }

        return new BufferData(input);
    }

    private async getUploadRequest(opts: {
        blobVersion: number;
        catalogHrn: string;
    }): Promise<UploadRequest> {
        const cacheKey = `request::blob::v${opts.blobVersion}::catalog::${opts.catalogHrn}`;
        const cachedRequest = this.cachedUploadRequests.get(cacheKey);
        if (cachedRequest) {
            return cachedRequest;
        }

        const supportedBlobVersions: { [key: string]: boolean } = {
            v1: true,
            v2: true
        };

        if (!supportedBlobVersions[`v${opts.blobVersion}`]) {
            return Promise.reject(
                `Unsupported Blob version: ${opts.blobVersion}`
            );
        }

        const requestBuilder = await RequestFactory.create(
            "blob",
            `v${opts.blobVersion}`,
            this.settings,
            HRN.fromString(opts.catalogHrn)
        );

        const result =
            opts.blobVersion === 1
                ? new BlobV1UploadRequest(requestBuilder)
                : new BlobV2UploadRequest(requestBuilder);

        this.cachedUploadRequests.set(cacheKey, result);
        return result;
    }
}
