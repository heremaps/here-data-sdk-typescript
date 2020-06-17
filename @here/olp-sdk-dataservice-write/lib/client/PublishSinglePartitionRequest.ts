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
 * @brief PublishSinglePartitionRequest is used to upload single partition.
 */
export class PublishSinglePartitionRequest {
    private publicationId?: string;
    private billingTag?: string;
    private layerId?: string;
    private data?: Blob | Buffer;
    private metaData?: PublishPartition;

    /**
     * @brief set the ID of the publication to upload.
     * @param id the ID of the publication to upload.
     * @note Required.
     * @returns reference to this object
     */
    public withPublicationId(id: string): PublishSinglePartitionRequest {
        this.publicationId = id;
        return this;
    }

    /**
     * @brief get the ID of the publication to upload.
     * @returns The ID of the publication to upload, required.
     */
    public getPublicationId(): string | undefined {
        return this.publicationId;
    }

    /**
     * @brief set the ID of the layer.
     * @param id the ID of the layer.
     * @note Required.
     * @returns reference to this object
     */
    public withLayerId(id: string): PublishSinglePartitionRequest {
        this.layerId = id;
        return this;
    }

    /**
     * @brief get the ID of the layer.
     * @returns The ID of the layer, required.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * Optionally use embedded data in PublishPartition or uploadBlob() API
     * @param data The content published directly in the metadata and encoded in base64.
     * The size of the content is limited.
     * @note Optional. This will be use in stream layers and present only if the message size is less than or equal to 1 MB.
     * @returns reference to this object
     */
    public withData(data: Blob | Buffer): PublishSinglePartitionRequest {
        this.data = data;
        return this;
    }

    /**
     * @return data previously set or undefined.
     */
    public getData(): Blob | Buffer | undefined {
        return this.data;
    }

    /**
     * @brief set the metadata of the partition to upload.
     * @param metaData  The metadata to be published for the blob data.
     * @note Required.
     * @returns reference to this object
     */
    public withMetaData(
        metaData: PublishPartition
    ): PublishSinglePartitionRequest {
        this.metaData = metaData;
        return this;
    }

    /**
     * @brief get the the metadata of the partition.
     * @returns The the metadata of the partition.
     */
    public getMetadata(): PublishPartition | undefined {
        return this.metaData;
    }

    /**
     * @brief set the billing tag.
     * @param billing_tag An optional free-form tag which is used for grouping
     * billing records together. If supplied, it must be between 4 - 16
     * characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     * @note Optional.
     */
    public withBillingTag(tag: string): PublishSinglePartitionRequest {
        this.billingTag = tag;
        return this;
    }

    /**
     * @return Billing Tag previously set or undefined.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
