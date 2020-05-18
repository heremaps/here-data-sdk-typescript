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

import { validateBillingTag } from "..";

/**
 * Prepares information for calls to get catalogs from the platform Config Service.
 */
export class CatalogsRequest {
    private schemaHrn?: string;
    private billingTag?: string;

    /**
     *  Gets a schema HERE Resource Name (HRN) for the request.
     * 
     * @return The schema HRN.
     */
    public getSchema(): string | undefined {
        return this.schemaHrn;
    }

    /**
     * Sets a value of a layer schema HERE Resource Name (HRN) that is used in the `getCatalogs` method of the [[ConfigClient]] instance.
     * If the schema is set, the `getCatalogs` method returns catalogs witch have a layer or layers with the specific schema HRN.
     * If the schema is not set, the filter returns all of the catalogs to which you have access.
     * 
     * @param schemaHrn The layer schema HRN.
     * @return The updated [[CatalogRequest]] instance that you can use to chain methods.
     */
    public withSchema(schemaHrn: string): CatalogsRequest {
        this.schemaHrn = schemaHrn;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     * 
     * @param tag The `BillingTag` string.
     * @return The updated [[CatalogsRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): CatalogsRequest {
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
