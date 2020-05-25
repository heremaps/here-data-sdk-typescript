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
 * Contains all the fields that make up a HERE Resource Name (HRN).
 */
export interface HRNData {
    /**
     * One of the following string partitions:
     * * `"here"`
     * * `"here-dev"`
     * * `"here-cn"`
     * * `"here-cn-dev"`
     */
    partition: string;
    /**
     * The name of the API service.
     *
     * @example `"data"`.
     */
    service: string;
    /** The region of the HRN. */
    region?: string;
    /** The account of the HRN. */
    account?: string;
    /**
     * The resource of the HRN.
     *
     * @example The catalog name of the `datastore` HRNs.
     */
    resource: string;
}

/**
 * Contains a HERE Resource Name (HRN) &ndash; a unique identifier for resources such as catalogs, schemas, and pipelines.
 */
export class HRN {
    private static PARTITION_POS = 1;
    private static SERVICE_POS = 2;
    private static REGION_POS = 3;
    private static ACCOUNT_POS = 4;
    private static RESOURCE_POS = 5;
    private static ENTRIES_COUNT = HRN.RESOURCE_POS + 1;

    /**
     * Returns a new HRN from a string representation of an HRN.
     *
     * @example `hrn:here:data:::example-catalog`
     *
     * @param hrn The HRN string
     * @return The new HRN.
     */
    static fromString(hrn: string): HRN {
        // special case - also allow http and https as 'catalog-url' local URLs
        if (hrn.startsWith("http:") || hrn.startsWith("https:")) {
            return new HRN({
                partition: "catalog-url",
                service: "datastore",
                region: "",
                account: "",
                resource: encodeURIComponent(hrn)
            });
        }

        const entries = hrn.split(":");
        if (entries.length < this.ENTRIES_COUNT || entries[0] !== "hrn") {
            throw new Error("Invalid HRN");
        }

        return new HRN({
            partition: entries[this.PARTITION_POS],
            service: entries[this.SERVICE_POS],
            region: entries[this.REGION_POS],
            account: entries[this.ACCOUNT_POS],
            resource: entries.slice(this.RESOURCE_POS).join(":")
        });
    }

    /**
     * Creates a new HRN based on the fields of the given [[HRNData]].
     *
     * @example
     * ```TypeScript
     * const myHrn = new HRN({
     *     partition: 'here-dev',
     *     service: 'data',
     *     resource: 'example-catalog'
     * });
     * ```
     *
     * Uses [[fromString]] to create an HRN from the string representation.
     *
     * @param data The data from this HRN.
     * @return The [[HRN]] instance.
     */
    constructor(readonly data: HRNData) {}

    /**
     * Converts the specified HRN to its string representation.
     *
     * @example
     * `hrn:partition:service:region:account:resource`.
     *
     * @return The string representation of the HRN.
     */
    toString(): string {
        return (
            "hrn:" +
            this.data.partition +
            ":" +
            this.data.service +
            ":" +
            (this.data.region === undefined ? "" : this.data.region) +
            ":" +
            (this.data.account === undefined ? "" : this.data.account) +
            ":" +
            this.data.resource
        );
    }
}
