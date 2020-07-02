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

import { PublishPartitions } from "@here/olp-sdk-dataservice-api/lib/publish-api-v2";

/**
 * @brief UploadPartitionsRequest is used to upload multiple partitions at once.
 */
export class UploadPartitionsRequest {
    private publicationId?: string;
    private billingTag?: string;
    private layerId?: string;
    private publishPartitions?: PublishPartitions;

    /**
     * @brief set the ID of the publication to upload.
     * @param id the ID of the publication to upload.
     * @note Required.
     * @returns reference to this object
     */
    public withPublicationId(id: string): UploadPartitionsRequest {
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
    public withLayerId(id: string): UploadPartitionsRequest {
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
     * @brief set the metadata of the partitions to upload.
     * @param publishPartitions  The partitions metadata to be published.
     * @note Required.
     * @returns reference to this object
     */
    public withPartitions(
        publishPartitions: PublishPartitions
    ): UploadPartitionsRequest {
        this.publishPartitions = publishPartitions;
        return this;
    }

    /**
     * @brief get the the partitions.
     * @returns The the partition metatada.
     */
    public getPartitions(): PublishPartitions | undefined {
        return this.publishPartitions;
    }

    /**
     * @brief set the billing tag.
     * @param billing_tag An optional free-form tag which is used for grouping
     * billing records together. If supplied, it must be between 4 - 16
     * characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     * @note Optional.
     */
    public withBillingTag(tag: string): UploadPartitionsRequest {
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
