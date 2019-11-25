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

import { QuadKey, QuadTreeIndexDepth, validateBillingTag } from "..";

/**
 * A class that prepare information for calls to get Quad Tree metadata from Query API.
 * Works only with versioned or volatile layers where the partitioning scheme is `heretile`
 */
export class QuadKeyPartitionsRequest {
    private version?: number;
    private quadKey?: QuadKey;
    private depth?: QuadTreeIndexDepth;
    private billingTag?: string;

    /**
     * The version of the catalog against which to run the query.
     * Must be a valid catalog version.
     * @param version Specify the catalog version or set to undefined to use the latest catalog version.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance
     */
    public withVersion(version?: number): QuadKeyPartitionsRequest {
        this.version = version;
        return this;
    }

    /**
     * The geometric area, represented as a HERE tile.
     * @param quadKey The `QuadKey` are used to address a tile in a quad tree.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance
     */
    public withQuadKey(quadKey: QuadKey): QuadKeyPartitionsRequest {
        this.quadKey = quadKey;
        return this;
    }

    /**
     * The recursion depth of the response.
     * If set to 0, the response includes only data for the quadKey specified in the request.
     * In this way, depth describes the maximum length of the subQuadKeys in the response.
     * The maximum allowed value for the depth parameter is 4.
     *
     * @param depth The recursion depth of the response.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance
     */
    public withDepth(depth: QuadTreeIndexDepth): QuadKeyPartitionsRequest {
        this.depth = depth;
        return this;
    }

    /**
     * The configured catalog version for the request
     */
    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * The configured QuadKey for the request
     */
    public getQuadKey(): QuadKey | undefined {
        return this.quadKey;
    }

    /**
     * The configuret depth for the request
     */
    public getDepth(): QuadTreeIndexDepth {
        return this.depth || 0;
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
