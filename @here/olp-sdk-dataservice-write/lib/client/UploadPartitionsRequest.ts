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
 * @brief Uploads multiple partitions at once.
 */
export class UploadPartitionsRequest {
    private publicationId?: string;
    private billingTag?: string;
    private layerId?: string;
    private publishPartitions?: PublishPartitions;

    /**
     * Sets the ID of the publication to upload.
     * 
     * @param id The ID of the publication to upload.
     * 
     * @returns A reference to this object.
     */
    public withPublicationId(id: string): UploadPartitionsRequest {
        this.publicationId = id;
        return this;
    }

    /**
     * Gets the ID of the publication to upload.
     * 
     * @returns The ID of the publication to upload.
     */
    public getPublicationId(): string | undefined {
        return this.publicationId;
    }

    /**
     * Sets the ID of the layer.
     * 
     * @param id The ID of the layer.
     * 
     * @returns A reference to this object.
     */
    public withLayerId(id: string): UploadPartitionsRequest {
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
     * Sets the metadata of the partitions to upload.
     * 
     * @param publishPartitions The partitions metadata to upload.
     * 
     * @returns A reference to this object.
     */
    public withPartitions(
        publishPartitions: PublishPartitions
    ): UploadPartitionsRequest {
        this.publishPartitions = publishPartitions;
        return this;
    }

    /**
     * Gets the metadata of partitions.
     * 
     * @returns The metadata of partitions.
     */
    public getPartitions(): PublishPartitions | undefined {
        return this.publishPartitions;
    }

    /**
     * Sets the billing tag.
     * 
     * @param tag The free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     * 
     * @returns A reference to this object.
     */
    public withBillingTag(tag: string): UploadPartitionsRequest {
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
