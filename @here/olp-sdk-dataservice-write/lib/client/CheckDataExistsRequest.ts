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
 * @brief Check data existence request structure holding all necessary information.
 */
export class CheckDataExistsRequest {
    private layerId?: string;
    private dataHandle?: string;
    private billingTag?: string;

    /**
     * @brief set the ID of the layer to check if data exist.
     * @param layerId the ID of the layer.
     * @note Required.
     *
     * @returns reference to this object
     */
    public withLayerId(layerId: string): CheckDataExistsRequest {
        this.layerId = layerId;
        return this;
    }

    /**
     * @brief get the ID of the layer.
     * @returns The ID of the layer to check.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * @brief set the DataHandle to check if data exist.
     * @param dataHandele string. Can be any unique number or a hash of the content or metadata.
     * Data handles must be unique within the layer across all versions.
     *
     * @note Required.
     *
     * @returns reference to this object
     */
    public withDataHandle(dataHandle: string): CheckDataExistsRequest {
        this.dataHandle = dataHandle;
        return this;
    }

    /**
     * @brief get the DataHandle.previously set or undefined
     * @returns The datahandle.
     */
    public getDataHandle(): string | undefined {
        return this.dataHandle;
    }

    /**
     * @param billing_tag An optional free-form tag which is used for grouping
     * billing records together. If supplied, it must be between 4 - 16
     * characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     *
     * @note Optional.
     */
    public withBillingTag(tag: string): CheckDataExistsRequest {
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
