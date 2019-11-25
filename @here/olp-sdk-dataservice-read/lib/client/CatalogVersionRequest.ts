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
 * A class that prepare information for calls to the Artifact API.
 */
export class CatalogVersionRequest {
    private startVersion?: number;
    private endVersion?: number;
    private billingTag?: string;

    public getStartVersion(): number | undefined {
        return this.startVersion;
    }

    public getEndVersion(): number | undefined {
        return this.endVersion;
    }

    /**
     * Set startVersion value to use in methods getVersions and getLatestVersion from [[CatalogClient]].
     *
     * @param startVersion Specify the catalog version or set to undefined to use the latest catalog version.
     * @returns The updated [[CatalogVersionRequest]] instance
     */
    public withStartVersion(version?: number): CatalogVersionRequest {
        this.startVersion = version;
        return this;
    }

    /**
     * Set endVersion value to use in method getVersions from [[CatalogClient]].
     *
     * @param endVersion Specify the end catalog version or set to undefined to use the latest catalog version.
     * @returns The updated [[CatalogVersionRequest]] instance
     */
    public withEndVersion(version?: number): CatalogVersionRequest {
        this.endVersion = version;
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
