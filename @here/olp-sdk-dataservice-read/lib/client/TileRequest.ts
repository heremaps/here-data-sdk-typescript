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

import {
    FetchOptions,
    HRN,
    OlpClientSettings
} from "@here/olp-sdk-core";
import { QuadKey, validateBillingTag } from "..";

// tslint:disable: deprecation

/**
 * Parameters used to get a tile.
 */
export interface TileRequestParams {
    catalogHrn: HRN;
    settings: OlpClientSettings;
    layerId: string;
    layerType: "versioned" | "volatile";

    /**
     * @deprecated This parameter will be removed by 10.2020. Please use withCatalogVersion().
     */
    catalogVersion?: number;
}

/**
 * Prepares information for calls to get the tile blob data by the tile key.
 *
 * This class works only with versioned and volatile layers where the partitioning scheme is HERE Tile.
 *
 * You can initialize the request class once for a specific catalog, layer, and version (@see [[TileRequestParams]])
 * and use it many times to get the a tile.
 *
 * @example
 *
 * ```
 *  const params: TileRequestParams = {
 *       settings: "% your `OlpClientSettings` instance % ",
 *       catalogHrn: "% the HRN instance of your catalog %",
 *       layerId: "% your layer ID %",
 *       layerType: "% versioned or volatile %"
 *   }
 *
 *  const request = new TileRequest(params);
 *
 *  const requestForTile1 = request.withTileKey(yourTileKey1);
 *  const requestForTile2 = request.withTileKey(yourTileKey2);
 *
 * ```
 */
export class TileRequest {
    private quadKey?: QuadKey;
    private billingTag?: string;

    private fetchOption = FetchOptions.OnlineIfNotFound;
    private catalogVersion?: number;

    /**
     * @deprecated This parameter will be removed by 10.2020.
     * Please set parrams to the getTile function directly as a second argument.
     *
     * @param params Parameters for TileRequest
     */
    constructor(private params?: TileRequestParams) {
        if (params && params.catalogVersion !== undefined) {
            this.catalogVersion = params.catalogVersion;
        }
    }

    /**
     * Gets the catalog version provided by the [[TileRequestParams]].
     *
     * @return The catalog version provided by the [[TileRequestParams]].
     */
    public async getCatalogVersion(): Promise<number | undefined> {
        return Promise.resolve(this.catalogVersion);
    }

    /**
     * Gets the tile request parameters.
     *
     * @return The [[TileRequestParams]] instance.
     */
    public getParams(): TileRequestParams | undefined {
        return this.params;
    }

    /**
     * Sets the catalogVersion.
     * The latest version will be used for versioned layer if not set.
     *
     * @return The [[TileRequestParams]] instance.
     */
    public withCatalogVersion(version: number) {
        this.catalogVersion = version;
        return this;
    }

    /**
     * A geometric area represented as a HERE tile.
     *
     * @param quadKey Addresses a tile in the quadtree.
     * @returns The updated [[TileRequest]] instance that you can use to chain methods.
     */
    public withTileKey(quadKey: QuadKey): TileRequest {
        this.quadKey = quadKey;
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[TileRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): TileRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * Gets the configured [[QuadKey]] object for the request.
     *
     * @return The configured [[QuadKey]] object.
     */
    public getTileKey(): QuadKey | undefined {
        return this.quadKey;
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
     * Sets the fetch option that you can use to set the source from
     * which data should be fetched.
     *
     * @see `getFetchOption()` for information on usage and format.
     *
     * @param option The `FetchOption` enum.
     *
     * @return A reference to the updated `PartitionsRequest` instance.
     */
    public withFetchOption(option: FetchOptions): TileRequest {
        this.fetchOption = option;
        return this;
    }

    /**
     * Gets the fetch option that controls how requests are handled.
     *
     * The default option is `OnlineIfNotFound`. It queries the network if
     * the requested resource is not in the cache.
     *
     * @return The fetch option.
     */
    public getFetchOption(): FetchOptions {
        return this.fetchOption;
    }
}
