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

import { QuadKey, validateBillingTag } from "..";

/**
 *  Prepares information for calls to get data from the OLP Blob Service.
 */
export class DataRequest {
    private dataHandle?: string;
    private partitionId?: string;
    private quadKey?: QuadKey;
    private version?: number;
    private billingTag?: string;

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
     * Gets a quadkey for the request.
     *
     * @return The [[QuadKey]] object.
     */
    public getQuadKey(): QuadKey | undefined {
        return this.quadKey;
    }

    /**
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
     * @deprecated This method is deprecated and is not used. If you need to set the version, then
     * initialize the version client with not deprecated constructor, in other case the latest version will be used.
     *
     * Gets a catalog version for the request.
     *
     * @return The catalog version number.
     */
    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * @deprecated This method is deprecated and is not used. If you need to set the version, then
     * initialize the version client with not deprecated constructor, in other case the latest version will be used.
     *
     * Sets the provided catalog version.
     *
     * @param version The catalog version number.
     * @returns The updated [[DataRequest]] instance that you can use to chain methods.
     */
    public withVersion(version: number): DataRequest {
        this.version = version;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
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
}
