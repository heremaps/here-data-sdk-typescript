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
    TypedEvent,
    Data
} from "@here/olp-sdk-core";
import { BlobData } from "./multipartupload-internal/BlobData";
import { BlobV1UploadRequest } from "./multipartupload-internal/BlobV1UploadRequest";
import { BlobV2UploadRequest } from "./multipartupload-internal/BlobV2UploadRequest";
import { BufferData } from "./multipartupload-internal/BufferData";
import { UploadRequest } from "./multipartupload-internal/interfaces";
import { NodeFileData } from "./multipartupload-internal/NodeFileData";

/**
 * The object of the event received when the
 * a chunk of data uploaded to the storage.
 */
export interface ChunkInfo {
    size: number;
    number: number;
    partId: string;
}

/**
 * Uploads data to the blob storage in chunks.
 *
 * You can use this class in browsers and
 * Node.js to upload large files.
 *
 * A file is not loaded in RAM but is read
 * and uploaded in chunks.
 * It enables uploading large files.
 *
 * You can create an instance of this class in browser or Node.js.
 * If you want to read data from a different place,
 * implement and set the `Data` class.
 */
export class MultiPartUploadWrapper {
    private data: Data;
    private settings: OlpClientSettings;
    private cachedUploadRequests: Map<string, UploadRequest>;

    constructor(opts: {
        /**
         * The data to upload.
         *
         * Use the following values:
         * - In browsers: File | `Blob` | `ArrayBufferLike` | `Data`.
         * - In Node.js: string (the path of the file) | `ArrayBufferLike` | [[Data]].
         */
        data: string | File | Blob | ArrayBufferLike | Data;

        /**
         * The `OlpClientSettings` instance.
         */
        settings: OlpClientSettings;
    }) {
        this.data =
            opts.data instanceof Data ? opts.data : this.buildData(opts.data);
        this.settings = opts.settings;
        this.cachedUploadRequests = new Map();
    }

    /**
     * Uploads data in chunks to the blob storage.
     *
     * Starts the `MultiPartUpload` process,
     * uploads the data in chunks,
     * and then completes the `MultiPart Upload` process.
     * The data is uploaded to Blob API v1 or v2.
     */
    async upload(opts: {
        /**
         * The HRN string of the catalog to upload.
         */
        catalogHrn: string;

        /**
         * The ID of the layer to upload.
         */
        layerId: string;

        /**
         * The version of the blob storage.
         *
         * Supports Blob API v1 and v2.
         */
        blobVersion: number;

        /**
         * The data key to use for uploading.
         *
         * If you use Blob API v1, the key is the data handle.
         */
        handle: string;

        /**
         * The content type of the uploaded object.
         *
         * Must be equal to the layer content type.
         */
        contentType: string;

        /**
         * The parallel requests for uploading chunks.
         *
         * Default value: 6.
         */
        parallelRequests?: number;

        /**
         * The size of each chunk.
         * Minimum 5M, maximum 5GB.
         * The default is 5MB.
         * The default chunk size will be used in case,
         * you set the out-of-range size.
         */
        chunkSizeMB?: number;

        /**
         * The content encoding of the uploaded object.
         *
         * Must be equal to the layer content encoding.
         */
        contentEncoding?: string;

        /**
         * An optional free-form tag
         * used for grouping billing records together.
         */
        billingTag?: string;

        /**
         * Gets the uploading events.
         *
         * Use it to subscribe to the following events:
         * - `startUpload`, which starts the `MultiPart Upload` process.
         * - `doneUpload`, which completes the `MultiPart Upload` process.
         * - `uploadChunk`, which uploads each chunk.
         */
        getEvents?: (events: {
            startUpload: TypedEvent<void>;
            uploadChunk: TypedEvent<ChunkInfo>;
            doneUpload: TypedEvent<void>;
        }) => any;
    }) {
        const startUpload = new TypedEvent<void>();
        const uploadChunk = new TypedEvent<ChunkInfo>();
        const doneUpload = new TypedEvent<void>();

        opts.getEvents &&
            opts.getEvents({ startUpload, uploadChunk, doneUpload });

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

        startUpload.emit();

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

                            uploadChunk.emit({
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

        doneUpload.emit();
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
