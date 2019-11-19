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

import { validateBillingTag } from "@here/olp-sdk-dataservice-read";

/**
 * A class that prepare information for calls to getCatalogs from ConfigAPI.
 */
export class CatalogsRequest {
    private schemaHrn?: string;
    private billingTag?: string;

    public getSchema(): string | undefined {
        return this.schemaHrn;
    }

    /**
     * Set value of layer schema HRN to use in method getCatalogs from ConfigClient.
     * If schema is setted, then getCatalogs will return filtered response by the specified layer schema HRN.
     * If schema is not setted, then filter will return search for all.
     * @param schemaHrn layer schema HRN
     */
    public withSchema(schemaHrn: string): CatalogsRequest {
        this.schemaHrn = schemaHrn;
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
