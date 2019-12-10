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

import { HRN, QuadKey, validateBillingTag } from "..";

/**
 * The recursion depth of the quadtree.
 * If set to 0, the response includes only data for the quadKey specified in the request.
 * In this way, depth describes the maximum length of the subQuadKeys in the response.
 * The maximum allowed value for the depth parameter is 4.
 */
// tslint:disable-next-line: no-magic-numbers
export type QuadTreeIndexDepth = 0 | 1 | 2 | 3 | 4;

/**
 * Prepares information for calls to get quadtree metadata from the OLP Query Service.
 * This class works only with versioned or volatile layers where the partitioning scheme is HERE Tile.
 */
export class QuadTreeIndexRequest {
    private version?: number;
    private quadKey?: QuadKey;
    private depth?: number;
    private billingTag?: string;
    

    /**
     * Constructs the [[QuadTreeIndexRequest]] instance for fetching the quadtree index from the OLP Query Service
     * for volatile or versioned layers
     *
     * @param catalogHrn The catalog HERE Resource Name ([[HRN]]).
     * @param layerId The ID of the layer.
     * @param layerType The type of layer that you want to use for the request. By default, a layer of the versioned type is used.
     * @return The [[QuadTreeIndexRequest]] instance
     */
    constructor(
        private catalogHrn: HRN,
        private layerId: string,
        private layerType: "versioned" | "volatile" = "versioned"
    ) {}

    /**
     * The version of the catalog against which you want to run the query.
     * It must be a valid catalog version.
     * 
     * @param version Specify the catalog version or, if you want to use the latest catalog version, set to undefined.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     */
    public withVersion(version?: number): QuadTreeIndexRequest {
        this.version = version;
        return this;
    }

    /**
     * A geometric area represented as a HERE tile.
     * 
     * @param quadKey Addresses a tile in the quadtree.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     */
    public withQuadKey(quadKey: QuadKey): QuadTreeIndexRequest {
        this.quadKey = quadKey;
        return this;
    }

    /**
     * The recursion depth of the response.
     * The maximum allowed value for the depth parameter is 4.
     *
     * @param depth The recursion depth of the response.
     * @returns The updated [[QuadKeyPartitionsRequest]] instance that you can use to chain methods.
     * If set to 0, the response includes only data from the quadkey specified in the request.
     * In this way, the depth describes the maximum length of the subQuadKeys in the response.
     */
    public withDepth(depth: QuadTreeIndexDepth): QuadTreeIndexRequest {
        this.depth = depth;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     * 
     * @param tag The `BillingTag` string.
     * @return The updated [[QuadTreeIndexRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): QuadTreeIndexRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * The configured catalog version for the request.
     * 
     * @return The catalog version number.
     */
    public getVersion(): number | undefined {
        return this.version;
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
    public getDepth(): number {
        return this.depth || 0;
    }

    /**
     * Gets the configured type of the layer for the request.
     * By default, a layer of the versioned type is used.
     * 
     * @return The layer type.
     */
    public getLayerType() {
        return this.layerType;
    }

    /**
     * Gets the configured [[HRN]] instance of the catalog HERE Resource Name(HRN) for the request.
     * 
     * @return The configured [[HRN]] instance.
     */
    public getCatalogHrn(): HRN {
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
     * Gets a billing tag to group billing records together.
     * 
     * @return The `BillingTag` string.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
