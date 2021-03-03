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
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings,
    RequestFactory
} from "@here/olp-sdk-core";
import { BlobApi, ObjectStoreApi } from "@here/olp-sdk-dataservice-api";

interface MultiPartUploadParams {
    /**
     * The instance of OlpClientSettings.
     */
    settings: OlpClientSettings;
    /**
     * The version od Blob API to upload.
     */
    blobVersion: "v1" | "v2";
    /**
     * The Layer ID to upload.
     */
    layerId: string;
    /**
     * If you're uploading to Blob V1, set the datahandle
     * and set the key for Blob V2.
     */
    keyOrDatahandle: string;
    /**
     * The Catalog HRN to upload.
     */
    catalogHrn: HRN;
    /**
     * The content type of a uploaded data.
     * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17
     */
    contentType: string;
    /**
     * The Content Encoding of the data
     * @note Optional
     */
    contentEncoding?: string;
}

interface UploadParams {
    file: File | string;
    chunkSize: number;
    abortSignal?: AbortSignal;
}

/**
 * A helper class for uploading a large volumes of data to the storage.
 *
 * You can use it for upload a large files chunk by chunk in Browser or in NodeJS app
 * to the Blob V1 and to the Blob V2 APIs.
 */
export class MultiPartUpload {
    private requestBuilder?: DataStoreRequestBuilder;
    constructor(private readonly params: MultiPartUploadParams) {}

    /**
     * Upload a file to the Blob API.
     *
     * If you need to upload a large file in Browser, set the
     * File instance as a `file` parameter.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/File
     *
     * For NodeJS - set the path to the file as a `file` parameter.
     *
     * @param params UploadParams object
     *
     * @returns promise success or rejects if errors.
     */
    async upload(params: UploadParams): Promise<void> {
        if (typeof params.file === "string") {
            return this.params.blobVersion === "v1"
                ? this.uploadToBlobV1Node(params)
                : this.uploadToBlobV2Node(params);
        } else {
            return this.params.blobVersion === "v1"
                ? this.uploadToBlobV1Web(params)
                : this.uploadToBlobV2Web(params);
        }
    }

    private async uploadToBlobV2Web(params: UploadParams) {
        // @todo
    }

    private async uploadToBlobV1Web(params: UploadParams) {
        // @todo
    }

    private async uploadToBlobV2Node(params: UploadParams) {
        // @todo
    }

    private async uploadToBlobV1Node(params: UploadParams) {
        // @todo
    }

    private async getRequestBuilder(
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return this.requestBuilder
            ? this.requestBuilder
            : RequestFactory.create(
                  "blob",
                  this.params.blobVersion,
                  this.params.settings,
                  this.params.catalogHrn,
                  abortSignal
              );
    }
}
