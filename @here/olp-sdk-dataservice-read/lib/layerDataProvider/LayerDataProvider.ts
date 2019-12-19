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

import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import { CatalogClient, CatalogLayer, CatalogRequest, CatalogVersionRequest, HRN, OlpClientSettings } from "..";
import { ConfigCacheRepository } from "../cache";

export class LayerDataProvider {

    /**
     * Creates the [[LayerProvider]] instance.
     * @param settings The [[OlpClientSettings]] instance.
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Loads and caches the full catalog configuration for the requested catalog.
     * The catalog configuration contains descriptive and structural
     * information such as layer definitions and layer types.
     * 
     * @summary Gets details about the requested catalog.
     * Selects layer configuration from catalog configurastion by layerId 
     * and creates [[CatalogLayer]] instance with layer configuration
     * 
     * @param hrn The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
     * @param layerId The ID of the layer.
     * @param version The version of the layer to fetch. Optional
     * 
     * @returns The [[CatalogLayer]] instance.
     * 
     * @example 
     * ````typescript
     * // Create [[OlpClientSettings]] instance.
     * const settings = new OlpClientSettings({
     *      getToken: this.getBaerToken,
     *      environment: "here"
     *  });
     * // Create [[LayerProvider]] instance.
     * const layerDataProvider = new LayerDataProvider(settings);
     * // Create [[CatalogLayer]] instance.
     * const layerClient = await layerDataProvider.connect("mocked-hrn", "mocked-layer-id", 42);
     * 
     * // To get data by dataHandle create [[DataRequest]] instance and pass it to the method getData.
     * const dataHandle = new DataRequest().withDataHandle("123123mocked-datahandle.123");
     * const data = await layerClient.getData(dataHandle);
     * ```
     */
    public async connect(
        hrn: HRN,
        layerId: string,
        version?: number
    ): Promise<CatalogLayer> {
        const catalogConfig = await this.loadAndCacheCatalog(hrn, layerId, version);
        const layerConfig = catalogConfig.layers.find(layer => layer.id === layerId);

        if (layerConfig) {
            return new CatalogLayer(layerConfig, this.settings, hrn, layerId);
        }
        return Promise.reject(new Error(`Error. There is no layer ${layerId} in this catalog. HRN: ${hrn.toString()}`));
    }

    private async loadAndCacheCatalog(
        hrn: HRN,
        layerId: string,
        version?: number
    ): Promise<ConfigApi.Catalog> {
        const cache = new ConfigCacheRepository(this.settings.cache);
        const catalogClient = new CatalogClient(hrn, this.settings);
        const catalogVersionsRequest = new CatalogVersionRequest();
        const validVersion = version || (await catalogClient.getLatestVersion(catalogVersionsRequest));
        const catalog = cache.get(hrn.toString(), layerId, validVersion);

        if (catalog) {
            return Promise.resolve(catalog);
        }

        const catalogRequest = new CatalogRequest();
        const catalogConfig = await catalogClient.getCatalog(catalogRequest);
        cache.put(hrn.toString(), layerId, validVersion, catalogConfig);

        return Promise.resolve(catalogConfig);
    }
}
