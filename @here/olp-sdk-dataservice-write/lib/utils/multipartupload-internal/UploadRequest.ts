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

/**
 * @internal
 * Interfaces for upload requests classes.
 */
export abstract class UploadRequest {
    abstract startMultipartUpload(opts: {
        layerId: string;
        handle: string;
        contentType: string;
        contentEncoding?: string;
        billingTag?: string;
    }): Promise<{
        multipartToken?: string;
        uploadPartUrl?: string;
        completeUrl?: string;
        statusUrl?: string;
    }>;

    abstract uploadPart(opts: {
        data: ArrayBuffer;
        multipartToken?: string;
        layerId?: string;
        url?: string;
        contentType?: string;
        partNumber?: number;
        contentLength?: number;
        billingTag?: string;
    }): Promise<{
        partNumber: number;
        partId: string;
    }>;

    abstract completeMultipartUpload(opts: {
        parts: {
            id: string;
            number: number;
        }[];
        layerId?: string;
        multipartToken?: string;
        url?: string;
        billingTag?: string;
    }): Promise<Response>;
}
