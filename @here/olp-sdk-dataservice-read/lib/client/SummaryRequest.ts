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

import { HRN, validateBillingTag } from "..";

/**
 * Prepares information for calls to get a summary from the OLP Statistics Service.
 */
export class SummaryRequest {
    private catalogHrn?: string;
    private layerId?: string;
    private billingTag?: string;

    /**
     * Gets the configured [[HRN]] string of the catalog HERE Resource Name(HRN) for the request.
     *
     * @return The configured [[HRN]] string.
     */
    public getCatalogHrn(): string | undefined {
        return this.catalogHrn;
    }

    /**
     * Gets a layer ID for the request.
     *
     * @return The layer ID string.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * A setter for the provided catalog HERE Resource Name (HRN).
     *
     * @param hrn The catalog HRN.
     * @returns The [[SummaryRequest]] instance that you can use to chain methods.
     */
    public withCatalogHrn(hrn: HRN): SummaryRequest {
        this.catalogHrn = hrn.toString();
        return this;
    }

    /**
     * A setter for the provided `layerId` string.
     *
     * @param layerId The ID of the layer.
     * @returns The [[SummaryRequest]] instance that you can use to chain methods.
     */
    public withLayerId(layerId: string): SummaryRequest {
        this.layerId = layerId;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[SummaryRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): SummaryRequest {
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
