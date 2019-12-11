/*
 * Copyright (C) 2019 HERE Europe B.V.
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

import { validateBillingTag, validatePartitionsIdsList } from "..";

/**
 * Prepares information for calls to get partitions metadata from the OLP Metadata Service.
 */
export class PartitionsRequest {
    private version?: number;
    private billingTag?: string;
    private partitionIds?: string[];

    /**
     * Gets a layer version for the request.
     *
     * @return The layer version number.
     */
    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * An optional method that sets the provided layer version.
     * If the layer version is not specified, the last layer version is used.
     *
     * @param version Specify the layer version or, if you want to use the latest layer version, set to undefined.
     * @returns The updated [[PartitionsRequest]] instance that you can use to chain methods.
     */
    public withVersion(version?: number): PartitionsRequest {
        this.version = version;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[PartitionsRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): PartitionsRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * Gets a billing tag to group billing records together.
     *
     * @return The `BillingTag` string.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }

    /**
     * A setter for the provided partition IDs.
     *
     * @param ids The ID of partitions from which you want to get metadata.
     *
     * The required quantity is between 1 and 100.
     * If partition IDs are not provided, all partitions are retrieved.
     * If the quantity of partition IDs is less than 1 (empty array) or more than 100, an error is thrown.
     * @returns The updated [[PartitionsRequest]] instance that you can use to chain methods.
     */
    public withPartitionIds(ids: string[]): PartitionsRequest {
        this.partitionIds = validatePartitionsIdsList(ids);
        return this;
    }

    /**
     * Gets partition IDs for the request.
     *
     * @return The `partitionIds` string.
     */
    public getPartitionIds(): string[] | undefined {
        return this.partitionIds;
    }
}
