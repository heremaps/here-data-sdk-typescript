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
    STATUS_CODES
} from "@here/olp-sdk-core";
import { BlobData } from "@here/olp-sdk-dataservice-write";
import { BlobV1UploadRequest } from "./multipartupload-internal/BlobV1UploadRequest";
import { BlobV2UploadRequest } from "./multipartupload-internal/BlobV2UploadRequest";
import { BufferData } from "./multipartupload-internal/BufferData";
import { NodeFileData } from "./multipartupload-internal/NodeFileData";
import { UploadRequest } from "./multipartupload-internal/UploadRequest";
import { WebData } from "./multipartupload-internal/WebData";

/**
 * Contains information about the uploaded chunk and the overall progress.
 */
export interface UploadStatus {
    /**
     * The total count of the uploaded chunks.
     */
    uploadedChunks: number;

    /**
     * The total count of the chunks.
     */
    totalChunks: number;

    /**
     * The size of the chunk in bytes.
     */
    chunkSize: number;

    /**
     * The number of the uploaded chunk.
     */
    chunkNumber: number;

    /**
     * The ID of the chunk.
     */
    chunkId: string;
}

/**
 * Contains information about the size of the data to upload
 * and the multipartToken or multipart url, depends of the using Blob version.
 */
export interface StartUploadStatus {
    /**
     * The total size of the uploading data in bytes.
     */
    dataSize: number;

    /**
     *  The identifier of the multipart upload (token).
     *  `undefined` for Blob V1.
     */
    multipartToken?: string;

    /**
     * The link for uploading parts.
     * `undefined` for Blob V2.
     */
    multipartUrl?: string;

    /**
     * The link for getting status.
     * `undefined` for Blob V2.
     */
    multipartStatusUrl?: string;
}

/**
 * The options for uploading.
 */
export interface UploadOptions {
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
    blobVersion: BlobVersion;

    /**
     * The data key to use for uploading.
     *
     * If you use Blob API v1, the key is the data handle.
     */
    handle: string;

    /**
     * The content type of the object being uploaded.
     *
     * Must be equal to the layer content type.
     */
    contentType: string;

    /**
     * Specifies how many parallel requests should be used
     * for uploading chunks.
     *
     * Default value: 6.
     */
    parallelRequests?: number;

    /**
     * The size of each chunk.
     *
     * The minimum size is 5 MB, maximum – 5 GB.
     * The default value is 5 MB.
     * When an out-of-range value is provided, it is trimmed
     * to the default value of 5 MB.
     */
    chunkSizeMB?: number;

    /**
     * The content encoding of the object being uploaded.
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
     * Callback, triggered on multipart upload process starts.
     */
    onStart?: (status: StartUploadStatus) => void;

    /**
     * Callback, triggered on each successfully uploaded chunk of data.
     */
    onStatus?: (status: UploadStatus) => void;
}

/**
 * The version of the blob storage.
 */
type BlobVersion = "v1" | "v2";

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
 *
 * If you want to read data from a different place,
 * implement and set the `BlobData` class.
 */
export class MultiPartUploadWrapper {
    constructor(
        private readonly opts: UploadOptions,
        private readonly settings: OlpClientSettings
    ) {}

    /**
     * Uploads data in chunks to the blob storage.
     *
     * Starts the `MultiPartUpload` process,
     * uploads the data in chunks,
     * and then completes the `MultiPart Upload` process.
     * The data is uploaded to Blob API v1 or v2.
     *
     * @param data The data to upload.
     *
     * Use the following values:
     * - In browsers: File | `Blob` | `ArrayBufferLike`.
     * - In Node.js: string (the path of the file) | `ArrayBufferLike`.
     *
     * Also, you can provide your own implementation of the `BlobData` class,
     * which enables you to use various sources of data.
     *
     * @param abortControler A signal object that allows you to
     * communicate with a request and abort it
     * using the `AbortController` object.
     *
     * @resurns
     * The Promise with the HTTP status or rejects in case of errors.
     */
    async upload(
        data: string | File | Blob | ArrayBufferLike | BlobData,
        abotrSignal?: AbortSignal
    ): Promise<number> {
        /**
         * The method works in this way:
         * 1) Starts the MultipartUpload process by sending a request to Blob V1 or V2.
         * 2) Starts reading the chunk by chunk from data to upload in the main while loop.
         * 3) After reading the same count of the chunks as the configured maximum parallels upload requests,
         * the main loop waiting while the read chunks upload to the blob storage in the uploading loop.
         * 4) After uploading all chunks in the uploading loop, the main loop continues to read and upload
         * the next chunks of the data.
         * 5) After uploading all bytes the method submits the MultiPartUpload process by sending a request
         * with chunk numbers and ids to the Blob V1 or V2 and returns 204 if success
         * or rejects with an error if any.
         */
        const defaultParallelRequests = 6;
        const parallelRequests =
            this.opts.parallelRequests || defaultParallelRequests;

        const parts: { id: string; number: number }[] = [];

        const blobData = await this.getBlobData(data);

        const dataSize = blobData.size();

        const request = await this.getUploadRequest(abotrSignal);

        const startMultipartResponse = await request.startMultipartUpload({
            contentType: this.opts.contentType,
            handle: this.opts.handle,
            layerId: this.opts.layerId,
            billingTag: this.opts.billingTag,
            contentEncoding: this.opts.contentEncoding
        });

        if (
            this.opts.blobVersion === "v2" &&
            startMultipartResponse.multipartToken === undefined
        ) {
            throw new Error(
                "Multipart upload v2 failed, multipartToken missing"
            );
        }

        if (
            this.opts.blobVersion === "v1" &&
            (startMultipartResponse.uploadPartUrl === undefined ||
                startMultipartResponse.completeUrl === undefined)
        ) {
            throw new Error(
                `Missing ${["uploadPartUrl", "completeUrl"].filter(
                    p => !(p in startMultipartResponse)
                )}. Aborting upload.`
            );
        }

        this.opts.onStart &&
            this.opts.onStart({
                dataSize,
                multipartToken: startMultipartResponse.multipartToken,
                multipartUrl: startMultipartResponse.uploadPartUrl,
                multipartStatusUrl: startMultipartResponse.statusUrl
            });

        const chunkSize = this.validateChunkSize(this.opts.chunkSizeMB);
        const totalChunks = Math.ceil(dataSize / chunkSize);

        let unreadBytes = dataSize;
        let offset = 0;
        let chunkNumber = 0;
        let uploadedChunks = 0;

        while (unreadBytes > 0) {
            const promises = [];

            while (promises.length < parallelRequests) {
                const buffer = await blobData.readBytes(offset, chunkSize);

                if (buffer.byteLength === 0) {
                    break;
                }

                chunkNumber++;
                offset += buffer.byteLength;
                unreadBytes -= buffer.byteLength;

                promises.push(
                    request
                        .uploadPart({
                            data: buffer,
                            layerId: this.opts.layerId,
                            multipartToken:
                                startMultipartResponse.multipartToken,
                            billingTag: this.opts.billingTag,
                            contentLength: buffer.byteLength,
                            contentType: this.opts.contentType,
                            partNumber: chunkNumber,
                            url: startMultipartResponse.uploadPartUrl
                        })
                        .then(uploadPartResponse => {
                            parts.push({
                                id: uploadPartResponse.id,
                                number: chunkNumber
                            });

                            uploadedChunks++;

                            this.opts.onStatus &&
                                this.opts.onStatus({
                                    chunkId: uploadPartResponse.id,
                                    chunkNumber,
                                    chunkSize: buffer.byteLength,
                                    totalChunks,
                                    uploadedChunks
                                });
                        })
                );
            }

            await Promise.all(promises);
        }

        await request.completeMultipartUpload({
            parts,
            url: startMultipartResponse.completeUrl,
            multipartToken: startMultipartResponse.multipartToken,
            layerId: this.opts.layerId,
            billingTag: this.opts.billingTag
        });

        blobData.finally && blobData.finally();

        return STATUS_CODES.NO_CONTENT;
    }

    private isBlobData(input: any): boolean {
        return (
            typeof input.size === "function" &&
            typeof input.readBytes === "function"
        );
    }

    private async getBlobData(
        input: string | File | Blob | ArrayBufferLike | BlobData
    ): Promise<BlobData> {
        if (this.isBlobData(input)) {
            return input as BlobData;
        }

        if (typeof Buffer !== "undefined") {
            // node.js
            if (Buffer.isBuffer(input)) {
                return new BufferData(input);
            }

            if (typeof input === "string") {
                return NodeFileData.fromPath(input);
            }
        }

        // browser
        if (typeof input === "string") {
            throw new Error("Unsupported input");
        }

        return input instanceof Blob
            ? new WebData(input)
            : new BufferData(input as ArrayBuffer);
    }

    private validateChunkSize(size = 0): number {
        // tslint:disable:no-magic-numbers
        const minChunkSizeMiB = 5;
        const mmxChunkSizeMiB = 5 * 1024;
        const bytesInMiB = 1 * 1024 * 1024;
        // tslint:enable:no-magic-numbers
        return size >= minChunkSizeMiB && size <= mmxChunkSizeMiB
            ? size * bytesInMiB
            : minChunkSizeMiB * bytesInMiB;
    }

    private async getUploadRequest(
        abotrSignal?: AbortSignal
    ): Promise<UploadRequest> {
        if (this.opts.blobVersion !== "v1" && this.opts.blobVersion !== "v2") {
            return Promise.reject(
                new Error(`Unsupported Blob version: ${this.opts.blobVersion}`)
            );
        }

        const requestBuilder = await RequestFactory.create(
            "blob",
            this.opts.blobVersion,
            this.settings,
            HRN.fromString(this.opts.catalogHrn),
            abotrSignal
        );

        return this.opts.blobVersion === "v1"
            ? new BlobV1UploadRequest(requestBuilder)
            : new BlobV2UploadRequest(requestBuilder);
    }
}
