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

import { ConfigApi, MetadataApi } from "@here/olp-sdk-dataservice-api";
import {
    CatalogLayer,
    DataRequest,
    DataStoreContext,
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings,
    PartitionsRequest,
    QuadKey,
    VersionedLayerClient,
    VolatileLayerClient
} from "@here/olp-sdk-dataservice-read";

/**
 * Interface of parameters fo DatastoreClient constructor.
 */
export interface CatalogClientParams {
    /**
     * The context of the data store with shared and cached data (base urls, for example)
     */
    context: DataStoreContext;

    /**
     * Parameter to configure the behaviour of the OlpClient
     */
    settings: OlpClientSettings;

    /**
     * The catalog HRN
     */
    hrn: string;

    /**
     * (optional) The version of the catalog to obtain. If not specified, the latest available catalog is fetched.
     */
    version?: number;
}

/**
 * The `CatalogClient` class is the class to interact with a DataStore catalog.
 */
export class CatalogClient {
    private readonly context: DataStoreContext;
    private readonly settings: OlpClientSettings;
    private readonly hrn: string;

    // Catalog version
    private readonly version: number;

    /**
     * Magic number to define latest or undefined version for the requests.
     */
    private readonly MAGIC_VERSION = -1;

    /**
     * The layers this catalog contains. You can also use [[getLayer]] as a convenience function to
     * obtain layers.
     */

    // tslint:disable-next-line: deprecation
    readonly layers = new Map<string, CatalogLayer>();

    /**
     * Constructs a new `CatalogClient`
     */
    constructor(params: CatalogClientParams) {
        // context will be replaced after OLPEDGE-935
        this.context = params.context;
        this.settings = params.settings;
        this.hrn = params.hrn;
        this.version = params.version || this.MAGIC_VERSION;
    }

    /**
     * Loads and cache the full catalog configuration for the requested catalog.
     * The catalog configuration contains descriptive and structural
     * information such as layer definitions and layer types.
     *
     * @summary Gets the details of a catalog.
     */
    public async loadAndCacheCatalogConfiguration(): Promise<
        ConfigApi.Catalog
    > {
        const configBaseUrl = await this.context.getBaseUrl("config");
        const configuration: ConfigApi.Catalog = await ConfigApi.getCatalog(
            new DataStoreRequestBuilder(
                this.context.dm,
                configBaseUrl,
                this.context.getToken
            ),
            { catalogHrn: this.hrn }
        ).catch((err: Response) =>
            Promise.reject(
                `Can't load catalog configuration. HRN: ${this.hrn}, error: ${err}`
            )
        );

        return Promise.resolve(configuration);
    }

    /**
     * @deprecated
     * Convenience function to obtain a layer object from this catalog.
     *
     * Rejects an Error if the layer does not exist in this catalog or if the layer type is not
     * versioned or volatile.
     *
     * @param layerName The name of the layer to look for.
     * @returns The promise with the layer object.
     */
    public async getVolatileOrVersionedLayer(
        layerName: string
        // tslint:disable-next-line: deprecation
    ): Promise<CatalogLayer> {
        const data = await this.findLayer(layerName);
        if (data === null) {
            return Promise.reject(
                new Error(`Layer '${layerName}' not found in catalog`)
            );
        }

        return Promise.resolve(data);
    }

    /**
     * Get the latest version of the catalog.
     *
     * @param startVersion Catalog start version (exclusive). Default is -1. By convention -1
     * indicates the virtual initial version before the first publication which will have version 0.
     * @returns A promise of the http response that contains the payload with latest version.
     */
    async getLatestVersion(
        startVersion: number = -1
    ): Promise<MetadataApi.VersionResponse> {
        const metadataBaseUrl = await this.context.getBaseUrl(
            "metadata",
            this.hrn
        );
        return MetadataApi.latestVersion(
            new DataStoreRequestBuilder(
                this.context.dm,
                metadataBaseUrl,
                this.context.getToken
            ),
            { startVersion }
        );
    }

    /**
     * Get the information about specific catalog versions. Maximum number of versions to be
     * returned per call is 1000 versions. If range is bigger than 1000 versions 400 Bad Request
     * will be returned.
     *
     * @param startVersion Catalog start version (exclusive). Default is -1. By convention -1
     * indicates the virtual initial version before the first publication which will have version 0.
     * @param endVersion Catalog end version (inclusive). If not defined, then the latest catalog
     * version will be fethced and used.
     * @returns A promise of the http response that contains the payload with versions in requested
     * range.
     */
    async getVersions(
        startVersion: number = -1,
        endVersion?: number
    ): Promise<MetadataApi.VersionInfos> {
        if (endVersion === undefined) {
            const latestVersionRS = await this.getLatestVersion(startVersion);
            endVersion = latestVersionRS.version;
        }

        const metadataBaseUrl = await this.context.getBaseUrl(
            "metadata",
            this.hrn
        );
        return MetadataApi.listVersions(
            new DataStoreRequestBuilder(
                this.context.dm,
                metadataBaseUrl,
                this.context.getToken
            ),
            { startVersion, endVersion }
        );
    }

    /**
     * Convenience function to obtain a layer object from this catalog.
     *
     * @param layerName The name of the layer to look for.
     * @returns Promise with the layer object or with null if the layer is not part of this catalog.
     */
    // tslint:disable-next-line: deprecation
    private async findLayer(layerName: string): Promise<CatalogLayer | null> {
        if (!this.layers.size) {
            await this.loadVolatileOrVersionedLayersFromConfig().catch(err =>
                Promise.reject(`Can't find layer: ${layerName}. Error: ${err}`)
            );
        }
        return Promise.resolve(this.layers.get(layerName) || null);
    }

    /**
     * Loads to the cache Versioned or Volatile layers
     */
    private async loadVolatileOrVersionedLayersFromConfig(): Promise<{
        ok: boolean;
        message?: string;
    }> {
        const catalogConfiguration: ConfigApi.Catalog = await this.loadAndCacheCatalogConfiguration().catch(
            err => Promise.reject(err)
        );

        if (!catalogConfiguration) {
            return Promise.reject(
                "Can't load layers from catalog configuration"
            );
        }

        const layersConfigurations: ConfigApi.Layer[] =
            catalogConfiguration.layers;

        const metadataBaseUrl = await this.context.getBaseUrl(
            "metadata",
            this.hrn
        );
        const metadataRequestBuilder = new DataStoreRequestBuilder(
            this.context.dm,
            metadataBaseUrl,
            this.context.getToken
        );

        let catalogExactVersion = this.version;
        if (catalogExactVersion === this.MAGIC_VERSION) {
            const catalogLatestVersionInfo = await MetadataApi.latestVersion(
                metadataRequestBuilder,
                { startVersion: this.MAGIC_VERSION }
            );

            if (
                catalogLatestVersionInfo.version === undefined ||
                catalogLatestVersionInfo.version === -1
            ) {
                throw new Error(
                    "Invalid version received from latest version call, cannot proceed. Instance: " +
                        this.hrn
                );
            }
            catalogExactVersion = catalogLatestVersionInfo.version;
        }

        const layerVersionsFromApi = await MetadataApi.getLayerVersion(
            metadataRequestBuilder,
            { version: catalogExactVersion }
        );

        const layerVersions = new Map<string, number>(
            layerVersionsFromApi.layerVersions.map(
                v => [v.layer, v.version] as [string, number]
            )
        );

        for (const layerConfig of layersConfigurations) {
            // tslint:disable-next-line: deprecation
            const layer: CatalogLayer | null = this.buildCatalogLayer(
                layerConfig,
                layerVersions.get(layerConfig.id)
            );
            if (layer) {
                this.layers.set(layerConfig.id, layer);
            }
        }

        return Promise.resolve({ ok: true });
    }

    private buildCatalogLayer(
        config: ConfigApi.Layer,
        version?: number
        // tslint:disable-next-line: deprecation
    ): CatalogLayer | null {
        // we're interesting only for versioned or volatile layers.
        if (
            config.layerType !== "versioned" &&
            config.layerType !== "volatile"
        ) {
            return null;
        }

        let layerClient: VersionedLayerClient | VolatileLayerClient;

        if (config.layerType === "versioned") {
            layerClient = new VersionedLayerClient(
                HRN.fromString(this.hrn),
                config.id,
                this.settings
            );
        } else {
            layerClient = new VolatileLayerClient({
                context: this.context,
                hrn: this.hrn,
                layerId: config.id
            });
        }

        // add required methods for interface (all required methods means that methods are in both Layer clients)
        // tslint:disable-next-line: deprecation
        const result: CatalogLayer = {
            ...config,
            apiVersion: 2,
            getIndex: async (rootKey: QuadKey) =>
                layerClient.getIndexMetadata(rootKey)
        };

        // @todo temporary solution. Will be removed in scope of OLPEDGE-938
        if (layerClient instanceof VersionedLayerClient) {
            // make TS happy
            const versionedLayerClient = layerClient as VersionedLayerClient;
            result.getData = async (dataRequest: DataRequest) =>
                versionedLayerClient.getData(dataRequest);
            result.getPartitions = async (
                partitionsRequest: PartitionsRequest
            ) => versionedLayerClient.getPartitions(partitionsRequest);
        }

        // @todo temporary solution. Will be removed in scope of OLPEDGE-938
        if (layerClient instanceof VolatileLayerClient) {
            // make TS happy
            const volatileLayerClient = layerClient as VolatileLayerClient;
            result.getPartition = async (
                partitionId: string,
                requestInit?: RequestInit
            ) => volatileLayerClient.getPartition(partitionId, requestInit);
            result.getTile = async (quadKey: QuadKey) =>
                volatileLayerClient.getTile(quadKey);
            result.getPartitionsIndex = async () =>
                volatileLayerClient.getPartitionsMetadata();
        }

        return result;
    }
}
