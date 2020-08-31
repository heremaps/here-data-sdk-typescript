/*
 * Copyright (C) 2020 HERE Europe B.V.
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

import { PublishPartition } from "@here/olp-sdk-dataservice-api/lib/publish-api-v2";

/**
 * @brief Uploads a single partition.
 */
export class PublishSinglePartitionRequest {
    private publicationId?: string;
    private billingTag?: string;
    private layerId?: string;
    private data?: ArrayBuffer | Buffer;
    private metaData?: PublishPartition;
    private contentType?: string;
    private contentEncoding?: string;

    /**
     * Sets the ID of the publication that you want to upload.
     * 
     * @param id The ID of the publication that you want to upload.
     * 
     * @returns A reference to this object.
     */
    public withPublicationId(id: string): PublishSinglePartitionRequest {
        this.publicationId = id;
        return this;
    }

    /**
     * Gets the ID of the publication that you want to upload.
     * 
     * @returns The ID of the publication that you want to upload.
     */
    public getPublicationId(): string | undefined {
        return this.publicationId;
    }

    /**
     * Sets the ID of the layer.
     * 
     * @param id The layer ID.
     * 
     * @returns A reference to this object.
     */
    public withLayerId(id: string): PublishSinglePartitionRequest {
        this.layerId = id;
        return this;
    }

    /**
     * Gets the ID of the layer.
     * 
     * @returns The ID of the layer.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * Uses embedded data in the `PublishPartition` or `uploadBlob()` API.
     * 
     * @param data The content published directly to the metadata and encoded in Base64.
     * The size of the content is limited.
     * @note It will be used in stream layers and present only if the message size is less than or equal to 1 MB.
     * 
     * @returns A reference to this object.
     */
    public withData(data: ArrayBuffer | Buffer): PublishSinglePartitionRequest {
        this.data = data;
        return this;
    }

    /**
     * Gets the data (if it was set).
     * 
     * @return The data or `undefined` if it was not set.
     */
    public getData(): ArrayBuffer | Buffer | undefined {
        return this.data;
    }

    /**
     * Set the content encoding of the data to upload.
     * 
     * Can be `gzip` or identity.
     * 
     * @param contentEncoding The content encoding of the data to upload.
     * 
     * @returns A reference to this object
     */
    public withContentEncoding(
        contentEncoding: string
    ): PublishSinglePartitionRequest {
        this.contentEncoding = contentEncoding;
        return this;
    }

    /**
     * @brief Gets the content encoding of the data to upload.
     * 
     * @returns The content encoding of the data to upload.
     */
    public getContentEncoding(): string | undefined {
        return this.contentEncoding;
    }

    /**
     * @brief Sets the content type of the data to upload.
     * 
     * @param contentType The content type of the data to upload.
     * 
     * @returns A reference to this object
     */
    public withContentType(contentType: string): PublishSinglePartitionRequest {
        this.contentType = contentType;
        return this;
    }

    /**
     * @brief Gets the content type of the data to upload.
     * @returns The content type of the data to upload.
     */
    public getContentType(): string | undefined {
        return this.contentType;
    }

    /**
     * Sets the metadata of the partition that you want to publish.
     * 
     * @param metaData The metadata for the blob data that you want to publish.
     * 
     * @returns A reference to this object.
     */
    public withMetaData(
        metaData: PublishPartition
    ): PublishSinglePartitionRequest {
        this.metaData = metaData;
        return this;
    }

    /**
     * Gets the metadata of the partition.
     * 
     * @returns The metadata of the partition.
     */
    public getMetadata(): PublishPartition | undefined {
        return this.metaData;
    }

    /**
     * Sets the billing tag.
     * 
     * @param tag The free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     * 
     * @returns A reference to this object.
     */
    public withBillingTag(tag: string): PublishSinglePartitionRequest {
        this.billingTag = tag;
        return this;
    }

    /**
     * Gets the billing tag (if it was set).
     * 
     * @return The billing tag or `undefined` if it was not set.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
