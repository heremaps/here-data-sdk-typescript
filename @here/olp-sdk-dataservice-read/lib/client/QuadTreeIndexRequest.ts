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

import { HRN, QuadKey } from "@here/olp-sdk-dataservice-read";

// tslint:disable-next-line: no-magic-numbers
export type QuadTreeIndexDepth = 0 | 1 | 2 | 3 | 4;

/**
 * A class that prepare information for calls to get Quad Tree metadata from Query API.
 * Works only with versioned or volatile layers where the partitioning scheme is `heretile`
 */
export class QuadTreeIndexRequest {
    private version?: number;
    private quadKey?: QuadKey;
    private depth?: number;

    /**
     * Constructs the [[QuadTreeIndexRequest]] for fetching Quad tree index from Query API
     * for volatile or versioned layers
     *
     * @param catalogHrn The [[HRN]] instance represents the catalog hrn
     * @param layerId The id of the layer
     * @param layerType The type of layer wich be used for request. The versioned is by default
     */
    constructor(
        private catalogHrn: HRN,
        private layerId: string,
        private layerType: "versioned" | "volatile" = "versioned"
    ) {}

    /**
     * The version of the catalog against which to run the query.
     * Must be a valid catalog version.
     * @param version A valid catalog version. The latest catalog version uses if not set.
     * @returns The updated [[QuadTreeIndexRequest]] instance
     */
    public withVersion(version?: number): QuadTreeIndexRequest {
        this.version = version;
        return this;
    }

    /**
     * The geometric area, represented as a HERE tile.
     * @param quadKey The `QuadKey` are used to address a tile in a quad tree.
     * @returns The updated [[QuadTreeIndexRequest]] instance
     */
    public withQuadKey(quadKey: QuadKey): QuadTreeIndexRequest {
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
     * @returns The updated [[QuadTreeIndexRequest]] instance
     */
    public withDepth(depth: QuadTreeIndexDepth): QuadTreeIndexRequest {
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
    public getDepth(): number {
        return this.depth || 0;
    }

    /**
     * The configured type of layer for request
     */
    getLayerType() {
        return this.layerType;
    }

    /**
     * The configured [[HRN]] instance of the catalog hrn for request
     */
    getCatalogHrn(): HRN {
        return this.catalogHrn;
    }

    /**
     * The layer id for request
     */
    getLayerId(): string | undefined {
        return this.layerId;
    }
}
