/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
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

import { AdditionalFields } from "@here/olp-sdk-dataservice-api";
import { QuadKey } from "@here/olp-sdk-core";
import {
    QuadTreeIndexDepth,
    validateBillingTag
} from "@here/olp-sdk-dataservice-read";

/**
 * Prepares information for calls to get quadtree metadata from the Query Service API.
 *
 * This class works only with versioned and volatile layers where the partitioning scheme is HERE Tile.
 */
export class QuadKeyPartitionsRequest {
    private quadKey?: QuadKey;
    private depth?: QuadTreeIndexDepth;
    private billingTag?: string;
    private additionalFields?: AdditionalFields;

    /**
     * A geometric area represented as a HERE tile.
     *
     * @param quadKey Addresses a tile in the quadtree.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     */
    public withQuadKey(quadKey: QuadKey): QuadKeyPartitionsRequest {
        this.quadKey = quadKey;
        return this;
    }

    /**
     * The recursion depth of the response.
     * The maximum allowed value for the depth parameter is 4.
     *
     * @param depth The recursion depth of the response.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     *
     * If set to 0, the response includes only data from the quadkey specified in the request.
     * In this way, the depth describes the maximum length of the subQuadKeys in the response.
     */
    public withDepth(depth: QuadTreeIndexDepth): QuadKeyPartitionsRequest {
        this.depth = depth;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): QuadKeyPartitionsRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * A setter for the provided additional fields
     *
     * @param additionalFields Array of strings. Array could contain next values "dataSize" | "checksum" | "compressedDataSize | "crc"".
     * This values could be useful for getPartitions method from versionedLayerClient and volatileLayerClient.
     *
     * @returns The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     */
    public withAdditionalFields(
        additionalFields: AdditionalFields
    ): QuadKeyPartitionsRequest {
        this.additionalFields = additionalFields;
        return this;
    }

    /**
     * Gets the configured [[QuadKey]] object for the request.
     *
     * @return The the configured [[QuadKey]] object.
     */
    public getQuadKey(): QuadKey | undefined {
        return this.quadKey;
    }

    /**
     * Gets the configured depth for the request.
     *
     * @return The number of the configured depth.
     */
    public getDepth(): QuadTreeIndexDepth {
        return this.depth || 0;
    }

    /**
     * Gets a billing tag to group billing records together.
     *
     * @return The `BillingTag` string.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }

    /**
     * Gets the additional fields for the request.
     *
     * @return Additional fields.
     */
    public getAdditionalFields(): AdditionalFields | undefined {
        return this.additionalFields;
    }
}
