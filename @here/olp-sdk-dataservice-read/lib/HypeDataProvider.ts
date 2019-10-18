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

import { CatalogClient } from "./CatalogClient";
import { CatalogLayer } from "./CatalogLayer";
import { DataStoreContext } from "./DataStoreContext";
import { DataStoreDownloadManager } from "./DataStoreDownloadManager";
import { NotFoundError } from "./error/NotFoundError";
import { QuadKey } from "./partitioning/QuadKey";
import * as utils from "./partitioning/QuadKeyUtils";

/**
 * Specify the options of the Hype datasource.
 */
export interface HypeDataProviderOptions {
    /**
     * Specify which layer to use.
     */
    layer: string;

    /**
     * Specify which version of CatalogClient should be used.
     */
    catalogVersion?: number;
}

/**
 * The `HypeDataProvider` is a [[DataProvider]] which retrieves Hype tiles in any of the specified
 * versions of the Hype DataStore.
 *
 * Implements `DataProvider` interface as defined in `@here/harp-mapview-decoder' package.
 */
export class HypeDataProvider {
    // tslint:disable-next-line: deprecation
    private m_layer?: CatalogLayer;
    private m_catalogClient?: CatalogClient;

    /**
     * Construct a new `HypeDataProvider` with the specified options.
     *
     * @param m_options Specify options like layer, URL and version.
     *
     * @todo remove any after catalog client will be refactored
     */
    constructor(private readonly m_options: any) {}

    ready(): boolean {
        return this.m_layer !== undefined;
    }

    /**
     * Returns the underlying catalog client.
     *
     * **Note**: The data provider must be connected before this method can be called, so make sure
     * that `ready()` returns `true` before calling it.
     *
     * @returns The catalog client this data provider uses.
     */
    catalogClient(): CatalogClient | undefined {
        return this.m_catalogClient;
    }

    async connect(): Promise<void> {
        const context = new DataStoreContext({
            dm: new DataStoreDownloadManager(),
            environment: this.m_options.hrn.data.partition,
            getToken: this.m_options.getToken
        });

        this.m_catalogClient = new CatalogClient({
            context,
            hrn: this.m_options.catalogHrn
        });

        // tslint:disable-next-line: deprecation
        const layer = await this.m_catalogClient
            .getVolatileOrVersionedLayer(this.m_options.layer)
            .catch(err =>
                Promise.reject(
                    new Error(
                        `Cannot connect to ${this.m_options.hrn.data.partition}.\nError: ${err}`
                    )
                )
            );
        this.m_layer = layer;
    }

    async getTile(quadKey: QuadKey): Promise<ArrayBufferLike> {
        if (this.m_layer === undefined || this.m_layer.getTile === undefined) {
            throw new Error(`Hype data provider not connected`);
        }
        const response = await this.m_layer.getTile(quadKey);
        if (!response.ok) {
            const errorMessage =
                `Error downloading tile ${utils.mortonCodeFromQuadKey(
                    quadKey
                )} from catalog ` +
                `${this.m_options.hrn.toString()}: ${response.status} ${
                    response.statusText
                }`;
            if (response.status === 404) {
                throw new NotFoundError(errorMessage);
            } else {
                throw new Error(errorMessage);
            }
        }
        return response.arrayBuffer();
    }
}
