/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

import { AdditionalFields } from "@here/olp-sdk-dataservice-api";
import { validateBillingTag, validatePartitionsIdsList } from "..";
import { FetchOptions } from "./FetchOptions";

/**
 * Prepares information for calls to get partitions metadata from the HERE Metadata Service.
 */
export class PartitionsRequest {
    private version?: number;
    private billingTag?: string;
    private partitionIds?: string[];
    private additionalFields?: AdditionalFields;
    private fetchOption = FetchOptions.OnlineIfNotFound;

    /**
     * This method is deprecated and is not used. If you need to set the version,
     * initialize the version client with the new constructor. Otherwise, the latest version will be used.
     *
     * Gets a layer version for the request.
     *
     * @return The layer version number.
     */
    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * This method is deprecated and is not used. If you need to set the version,
     * initialize the version client with the new constructor. Otherwise, the latest version will be used.
     *
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
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
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
     * Sets the provided partition IDs.
     *
     * @param ids The IDs of partitions from which you want to get metadata.
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

    /**
     * Sets the provided additional fields: `dataSize`, `checksum`, `compressedDataSize`, and `crc`.
     *
     * @param additionalFields The array of strings.
     * The array can contain the following values: `dataSize`, `checksum`, `compressedDataSize`, and `crc`.
     *
     * @returns The updated [[PartitionsRequest]] instance that you can use to chain methods.
     */
    public withAdditionalFields(
        additionalFields: AdditionalFields
    ): PartitionsRequest {
        if (additionalFields.length) {
            this.additionalFields = additionalFields;
            return this;
        } else {
            throw new Error(
                "Error. Parameter 'additionalFields' could not contain empty array. Add value or do not use this method."
            );
        }
    }

    /**
     * Gets additional fields for the request.
     *
     * @return The `partitionIds` string.
     */
    public getAdditionalFields(): AdditionalFields | undefined {
        return this.additionalFields;
    }

    /**
     * Sets the fetch option that you can use to set the source from
     * which data should be fetched.
     *
     * @see `getFetchOption()` for information on usage and format.
     *
     * @param option The `FetchOption` enum.
     *
     * @return A reference to the updated `PartitionsRequest` instance.
     */
    public withFetchOption(option: FetchOptions): PartitionsRequest {
        this.fetchOption = option;
        return this;
    }

    /**
     * Gets the fetch option that controls how requests are handled.
     *
     * The default option is `OnlineIfNotFound`. It queries the network if
     * the requested resource is not in the cache.
     *
     * @return The fetch option.
     */
    public getFetchOption(): FetchOptions {
        return this.fetchOption;
    }
}
