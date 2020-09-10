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

import { validateBillingTag } from "@here/olp-sdk-dataservice-read";

/** Prepares information for calls to get layer versions of a specific catalog version. */
export class LayerVersionsRequest {
    private version: number | undefined;
    private billingTag?: string;

    /**
     * Gets a catalog version.
     *
     * @returns The catalog version.
     */
    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * Sets the catalog version value that is used in the 'getLayerVersions' method of [[CatalogClient]].
     *
     * @param version Specify the catalog version.
     * @returns The updated [[LayerVersionsRequest]] instance
     */
    public withVersion(version: number): LayerVersionsRequest {
        this.version = version;
        return this;
    }
    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[LayerVersionsRequest]] instance that you can use to chain methods.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     */
    public withBillingTag(tag: string): LayerVersionsRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }
}
