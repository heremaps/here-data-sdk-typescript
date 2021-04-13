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

import { BlobData, OlpClientSettings, STATUS_CODES } from "@here/olp-sdk-core";

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
    blobVersion: number;

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
    onStart?: (multipartToken: string) => void;

    /**
     * Callback, triggered on each successfully uploaded chunk of data.
     */
    onStatus?: (status: UploadStatus) => void;
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
    constructor(opts: {
        /**
         * The data to upload.
         *
         * Use the following values:
         * - In browsers: File | `Blob` | `ArrayBufferLike`.
         * - In Node.js: string (the path of the file) | `ArrayBufferLike`.
         *
         * Also, you can provide your own implementation of the `BlobData` class.
         * For example, you can read the data for upload from the network.
         */
        data: string | File | Blob | ArrayBufferLike | BlobData;

        /**
         * The `OlpClientSettings` instance.
         */
        settings: OlpClientSettings;
    }) {}

    /**
     * Uploads data in chunks to the blob storage.
     *
     * Starts the `MultiPartUpload` process,
     * uploads the data in chunks,
     * and then completes the `MultiPart Upload` process.
     * The data is uploaded to Blob API v1 or v2.
     *
     * @param opts The options for uploading.
     * @param abortControler A signal object that allows you to
     * communicate with a request and abort it
     * using the `AbortController` object.
     *
     * @resurns
     * The Promise with the HTTP status or rejects in case of errors.
     */
    async upload(
        opts: UploadOptions,
        abotrSignal?: AbortSignal
    ): Promise<number> {
        return STATUS_CODES.NO_CONTENT;
    }
}
