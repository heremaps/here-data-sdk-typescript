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
 * Prepares information for calls to the platform Artifact Service.
 */
export class CatalogVersionRequest {
    private startVersion?: number;
    private endVersion?: number;
    private billingTag?: string;

    /**
     * Gets a catalog start version (exclusive) for the request. Default is -1. By convention -1
     * indicates the virtual initial version before the first publication that has version 0.
     * 
     * @return The catalog start version.
     */
    public getStartVersion(): number | undefined {
        return this.startVersion;
    }

    /**
     * Gets a catalog end version (inclusive) for the request. If not defined, then the latest catalog
     * version is fethced and used.
     * 
     * @return The catalog end version.
     */
    public getEndVersion(): number | undefined {
        return this.endVersion;
    }

    /**
     * Sets the `startVersion` value that is used in the `getVersions and `getLatestVersion` methods of [[CatalogClient]].
     *
     * @param startVersion Specify the end catalog version or, if you want to use the latest catalog version, set to undefined.
     * @returns The updated [[CatalogVersionRequest]] instance that you can use to chain methods.
     */
    public withStartVersion(version?: number): CatalogVersionRequest {
        this.startVersion = version;
        return this;
    }

    /**
     * Sets the `endVersion` value that is used in the `getVersions` method of [[CatalogClient]].
     *
     * @param version Specify the end catalog version or, if you want to use the latest catalog version, set to undefined.
     * @returns The updated [[CatalogVersionRequest]] instance that you can use to chain methods.
     */
    public withEndVersion(version?: number): CatalogVersionRequest {
        this.endVersion = version;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     * 
     * @param tag The `BillingTag` string.
     * @return The updated [[CatalogVersionRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): CatalogVersionRequest {
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
