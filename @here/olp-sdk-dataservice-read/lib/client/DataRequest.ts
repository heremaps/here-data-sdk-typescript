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

import { FetchOptions } from "@here/olp-sdk-core";
import { QuadKey, validateBillingTag } from "@here/olp-sdk-dataservice-read";

/**
 *  Prepares information for calls to get data from the HERE Blob Service.
 */
export class DataRequest {
    private dataHandle?: string;
    private partitionId?: string;
    private quadKey?: QuadKey;
    private version?: number;
    private billingTag?: string;
    private fetchOption = FetchOptions.OnlineIfNotFound;

    /**
     * Gets a data handle for the request.
     *
     * The data handle identifies a specific blob so that you can get the contents of that blob.
     *
     * @return The `DataHandle` string.
     */
    public getDataHandle(): string | undefined {
        return this.dataHandle;
    }

    /**
     * Sets the provided data handle.
     *
     * @param dataHandle The `DataHandler` string.
     * @return The updated [[DataRequest]] instance that you can use to chain methods.
     */
    public withDataHandle(dataHandle: string): DataRequest {
        this.dataHandle = dataHandle;
        return this;
    }

    /**
     * Gets a partition ID for the request.
     *
     * @return The `partitionID` string.
     */
    public getPartitionId(): string | undefined {
        return this.partitionId;
    }

    /**
     * Sets the provided partition ID.
     *
     * @param partitionId The `partitionID` string.
     * @returns The updated [[DataRequest]] instance that you can use to chain methods.
     */
    public withPartitionId(partitionId: string): DataRequest {
        this.partitionId = partitionId;
        return this;
    }

    /**
     * @deprecated This method will be removed by 02.2021. Please use [[getAggregatedData]] method
     * if you need to get data using a quadkey.
     * You can also use the [[getPartitions]] method to get datahandle using a quadkey.
     *
     * Gets a quadkey for the request.
     *
     * @return The [[QuadKey]] object.
     */
    public getQuadKey(): QuadKey | undefined {
        return this.quadKey;
    }

    /**
     * @deprecated This method will be removed by 02.2021. Please use [[getAggregatedData]] method
     * if you need to get data using a quadkey.
     * You can also use the [[getPartitions]] method to get datahandle using a quadkey.
     *
     * Sets the provided quadkey.
     *
     * @param quadKey The [[QuadKey]] object.
     * @returns The updated [[DataRequest]] instance that you can use to chain methods.
     */
    public withQuadKey(quadKey: QuadKey): DataRequest {
        this.quadKey = quadKey;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[DataRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): DataRequest {
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
     * Sets the fetch option that you can use to set the source from
     * which data should be fetched.
     *
     * @see `getFetchOption()` for information on usage and format.
     *
     * @param option The `FetchOption` enum.
     *
     * @return A reference to the updated `DataRequest` instance.
     */
    public withFetchOption(option: FetchOptions): DataRequest {
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
