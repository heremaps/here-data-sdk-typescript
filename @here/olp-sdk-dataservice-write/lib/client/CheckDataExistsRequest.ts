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

/**
 * Checks if a structure of a data existence request holds all necessary information.
 */
export class CheckDataExistsRequest {
    private layerId?: string;
    private dataHandle?: string;
    private billingTag?: string;

    /**
     * Sets the ID of the layer to check if data exist.
     * 
     * @param layerId The ID of the layer.
     *
     * @returns A reference to this object.
     */
    public withLayerId(layerId: string): CheckDataExistsRequest {
        this.layerId = layerId;
        return this;
    }

    /**
     * Gets the ID of the layer that you want to check.
     * 
     * @returns The layer ID.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * Sets the data handle to check if data exist.
     * 
     * @param dataHandele The data handle. Can be any unique number or a hash of the content or metadata.
     * Data handles must be unique within the layer across all versions.
     *
     * @returns A reference to this object.
     */
    public withDataHandle(dataHandle: string): CheckDataExistsRequest {
        this.dataHandle = dataHandle;
        return this;
    }

    /**
     * Gets the data handle (if it was set).
     * 
     * @returns The data handle or `undefined` if it was not set.
     */
    public getDataHandle(): string | undefined {
        return this.dataHandle;
    }

    /**
     * Sets the billing tag.
     * 
     * @param tag he free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     * 
     * @returns A reference to this object.
     */
    public withBillingTag(tag: string): CheckDataExistsRequest {
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
