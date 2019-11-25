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
 * A class that prepare information for calls to get Statistics from CoverageAPI
 */
export class SummaryRequest {
    private catalogHrn?: string;
    private layerId?: string;
    private billingTag?: string;

    public getCatalogHrn(): string | undefined {
        return this.catalogHrn;
    }

    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * Setter for the provided hrn
     * @param hrn Required. Specify the catalog hrn
     * @returns this to have ability to chain methods
     */
    public withCatalogHrn(hrn: HRN): SummaryRequest {
        this.catalogHrn = hrn.toString();
        return this;
    }

    /**
     * Setter for the provided layerId
     * @param layerId Required. Specify the LayerId
     * @returns this to have ability to chain methods
     */
    public withLayerId(layerId: string): SummaryRequest {
        this.layerId = layerId;
        return this;
    }

    /**
     * Billing Tag is an optional free-form tag which is used for grouping billing records together.
     * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     */
    public withBillingTag(tag: string) {
        this.billingTag = validateBillingTag(tag);
    }

    /**
     * Billing Tag for grouping billing records together
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
