/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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
    BlobApi,
    HttpError,
    MetadataApi,
    QueryApi
} from "@here/olp-sdk-dataservice-api";
import {
    ApiName,
    DataRequest,
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings,
    PartitionsRequest,
    QuadKeyPartitionsRequest,
    QuadTreeIndexRequest,
    QueryClient,
    RequestFactory
} from "..";
import { MetadataCacheRepository } from "../cache";
import { FetchOptions } from "./FetchOptions";

// tslint:disable: deprecation

/**
 * Parameters for use to initialize VersionLayerClient.
 */
export interface VersionedLayerClientParams {
    // HRN of the catalog.
    catalogHrn: HRN;
    // The ID of the layer.
    layerId: string;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
    // Layer version. If it is not defined, then latest version will be used.
    version?: number;
}

/**
 * Describes a versioned layer and provides the possibility to get partitions metadata and data.
 */
export class VersionedLayerClient {
    private readonly apiVersion: string = "v1";

    /**
     * HRN of the catalog.
     * @deprecated This field will be marked as private by 08.2020.
     */
    hrn: string;

    /**
     * The ID of the layer.
     * @deprecated This field will be marked as private by 08.2020.
     */
    layerId: string;

    /**
     * The [[OlpClientSettings]] instance.
     * @deprecated This field will be marked as private by 08.2020.
     */
    settings: OlpClientSettings;

    // Layer version.
    private version?: number;

    /**
     * @deprecated Please use the overloaded constructor of VersionLayerClient.
     *
     * Creates the [[VersionedLayerClient]] instance.
     *
     * @param catalogHrn The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
     * @param layerId The ID of the layer.
     * @param settings The [[OlpClientSettings]] instance.
     */
    constructor(catalogHrn: HRN, layerId: string, settings: OlpClientSettings);

    /**
     * Creates the [[VersionedLayerClient]] instance with VersionedLayerClientParams.
     *
     * @param params parameters for use to initialize VersionLayerClient.
     */
    constructor(params: VersionedLayerClientParams);

    /**
     * Implementation for handling both constuctors.
     */
    constructor(
        paramsOrHrn: VersionedLayerClientParams | HRN,
        layerId?: string,
        settings?: OlpClientSettings
    ) {
        if (paramsOrHrn instanceof HRN) {
            this.hrn = paramsOrHrn.toString();
            if (layerId && settings instanceof OlpClientSettings) {
                this.layerId = layerId;
                this.settings = settings;
            } else {
                throw new Error("Unsupported parameters");
            }
        } else {
            this.hrn = paramsOrHrn.catalogHrn.toString();
            this.layerId = paramsOrHrn.layerId;
            this.settings = paramsOrHrn.settings;

            if (paramsOrHrn.version !== undefined && paramsOrHrn.version >= 0) {
                this.version = paramsOrHrn.version;
            }
        }
    }

    /**
     * Fetches partition data using one of the following methods: ID, quadkey, or data handle.
     *
     * @param dataRequest The [[DataRequest]] instance of the configured request parameters.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @return The data from the requested partition.
     */
    async getData(
        dataRequest: DataRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const dataHandle = dataRequest.getDataHandle();

        if (dataHandle) {
            return this.downloadPartition(
                dataHandle,
                abortSignal,
                dataRequest.getBillingTag()
            );
        }

        const partitionId = dataRequest.getPartitionId();
        let usingVersion: number | undefined;
        const dataRequestVersion = dataRequest.getVersion();

        if (dataRequestVersion !== undefined) {
            usingVersion = dataRequestVersion;
        } else {
            usingVersion = this.version;
        }

        if (usingVersion === undefined) {
            // fetch the latest version and lock it to the instance.
            usingVersion = await this.getLatestVersion(
                dataRequest.getBillingTag()
            ).catch(error => Promise.reject(error));

            this.version = usingVersion;
        }

        if (usingVersion === undefined) {
            return Promise.reject(
                new Error(
                    `Unable to retrieve latest version. Please provide version to the DataRequest or lock version in the constructor`
                )
            );
        }

        if (partitionId) {
            const partitionIdDataHandle = await this.getDataHandleByPartitionId(
                partitionId,
                usingVersion,
                dataRequest.getFetchOption(),
                dataRequest.getBillingTag()
            ).catch(error => Promise.reject(error));
            return this.downloadPartition(
                partitionIdDataHandle,
                abortSignal,
                dataRequest.getBillingTag()
            );
        }

        const quadKey = dataRequest.getQuadKey();
        if (quadKey) {
            const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest()
                .withQuadKey(quadKey)
                .withVersion(usingVersion);

            const quadTreeIndexResponse = await this.getPartitions(
                quadKeyPartitionsRequest
            ).catch(error => Promise.reject(error));

            if (
                quadTreeIndexResponse.status &&
                quadTreeIndexResponse.status === 400
            ) {
                return Promise.reject(quadTreeIndexResponse);
            }

            return quadTreeIndexResponse.subQuads &&
                quadTreeIndexResponse.subQuads.length
                ? this.downloadPartition(
                      quadTreeIndexResponse.subQuads[0].dataHandle,
                      abortSignal,
                      dataRequest.getBillingTag()
                  )
                : Promise.reject(
                      new HttpError(
                          204,
                          `No dataHandle for quadKey {column: ${quadKey.column}, row: ${quadKey.row}, level: ${quadKey.level}}. HRN: ${this.hrn}`
                      )
                  );
        }

        return Promise.reject(
            new Error(
                `No data provided. Add dataHandle, partitionId or quadKey to the DataRequest object`
            )
        );
    }

    /**
     * Fetches partitions metadata from the Query API using a quadkey.
     *
     * @param quadKeyPartitionsRequest The [[QuadKeyPartitionsRequest]] instance.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The quadtree index for the requested partitions.
     */
    async getPartitions(
        quadKeyPartitionsRequest: QuadKeyPartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index>;

    /**
     * Fetches all partitions metadata from a layer using the partition ID from the [[PartitionsRequest]] instance.
     *
     * @param partitionsRequest The [[PartitionsRequest]] instance.
     * @param abortSignal A signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns A list of metadata for each of the partitions from the requested layer.
     *
     * If the partition IDs are not set, you get metadata from all of the partitions of the requested layer
     * from the platform Metadata Service.
     * If the IDs are set, you get data from the platform Query Service.
     */
    async getPartitions(
        partitionsRequest: PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<MetadataApi.Partitions>;

    async getPartitions(
        request: QuadKeyPartitionsRequest | PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index | MetadataApi.Partitions | QueryApi.Partitions> {
        let usingVersion: number | undefined;
        const requestVersion = request.getVersion();

        if (requestVersion !== undefined) {
            usingVersion = requestVersion;
        } else {
            usingVersion = this.version;
        }

        if (usingVersion === undefined) {
            // fetch the latest version and lock it to the instance.
            usingVersion = await this.getLatestVersion(
                request.getBillingTag()
            ).catch(error => Promise.reject(error));

            this.version = usingVersion;
        }

        if (usingVersion === undefined) {
            return Promise.reject(
                new Error(
                    `Unable to retrieve latest version. Please provide version to the Request or lock version in the constructor`
                )
            );
        }

        if (request instanceof QuadKeyPartitionsRequest) {
            const quadKey = request.getQuadKey();
            if (!quadKey) {
                return Promise.reject(
                    new Error("Please provide correct QuadKey")
                );
            }

            const queryClient = new QueryClient(this.settings);

            const quadTreeIndexRequest = new QuadTreeIndexRequest(
                HRN.fromString(this.hrn),
                this.layerId,
                "versioned"
            )
                .withQuadKey(quadKey)
                .withVersion(usingVersion)
                .withDepth(request.getDepth())
                .withAdditionalFields(request.getAdditionalFields());

            return queryClient.fetchQuadTreeIndex(
                quadTreeIndexRequest,
                abortSignal
            );
        }

        if (request.getPartitionIds()) {
            const queryClient = new QueryClient(this.settings);

            request.withVersion(usingVersion);
            return queryClient.getPartitionsById(
                request,
                this.layerId,
                HRN.fromString(this.hrn),
                abortSignal
            );
        }

        const cache = new MetadataCacheRepository(this.settings.cache);
        if (request.getFetchOption() !== FetchOptions.OnlineOnly) {
            const partitions = cache.get(
                request,
                this.hrn.toString(),
                this.layerId
            );
            if (partitions) {
                const additionalFields = request.getAdditionalFields();
                let existFields;
                if (additionalFields) {
                    existFields = additionalFields.filter(
                        (
                            field:
                                | "dataSize"
                                | "checksum"
                                | "compressedDataSize"
                                | "crc"
                        ) => {
                            return partitions.every(
                                partition => partition[field] !== undefined
                            );
                        }
                    );
                }
                if (
                    !additionalFields ||
                    !existFields ||
                    additionalFields.length === existFields.length
                ) {
                    return Promise.resolve({ partitions });
                }
            }
        }

        const metaRequestBilder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));

        const metadata = await MetadataApi.getPartitions(metaRequestBilder, {
            version: usingVersion,
            layerId: this.layerId,
            additionalFields: request.getAdditionalFields(),
            billingTag: request.getBillingTag()
        }).catch(error => Promise.reject(error));

        if (
            request.getFetchOption() !== FetchOptions.OnlineOnly &&
            metadata.partitions.length
        ) {
            cache.put(
                request,
                this.hrn.toString(),
                this.layerId,
                metadata.partitions
            );
        }
        return Promise.resolve(metadata);
    }

    /**
     * Fetch and returns partition metadata
     * @param partitionId The name of the partition to fetch.
     * @param version The version of the layer to fetch
     * @param fetchOption The option of caching (online only or return from cache if exist)
     * @returns A promise of partition metadata which used to get partition data
     */
    private async getDataHandleByPartitionId(
        partitionId: string,
        version: number,
        fetchOption: FetchOptions,
        billingTag?: string
    ): Promise<string> {
        const queryClient = new QueryClient(this.settings);

        const partitionsRequest = new PartitionsRequest()
            .withPartitionIds([partitionId])
            .withVersion(version)
            .withFetchOption(fetchOption);

        if (billingTag) {
            partitionsRequest.withBillingTag(billingTag);
        }

        const metadata = await queryClient.getPartitionsById(
            partitionsRequest,
            this.layerId,
            HRN.fromString(this.hrn)
        );
        return metadata.partitions &&
            metadata.partitions[0] &&
            metadata.partitions[0].dataHandle
            ? metadata.partitions[0].dataHandle
            : Promise.reject(
                  new HttpError(
                      404,
                      `No partition dataHandle for partition ${partitionId}. HRN: ${this.hrn}`
                  )
              );
    }

    /**
     * Gets the latest available catalog version what can be used as latest layer version
     */
    private async getLatestVersion(billingTag?: string): Promise<number> {
        const builder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn)
        ).catch(error => Promise.reject(error));
        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion: -1,
            billingTag
        }).catch(error => Promise.reject(error));
        return Promise.resolve(latestVersion.version);
    }

    private async downloadPartition(
        dataHandle: string,
        abortSignal?: AbortSignal,
        billingTag?: string
    ): Promise<Response> {
        const builder = await this.getRequestBuilder(
            "blob",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));
        return BlobApi.getBlob(builder, {
            dataHandle,
            layerId: this.layerId,
            billingTag
        });
    }

    /**
     * Fetch baseUrl and create requestBuilder for sending requests to the API Lookup Service.
     * @param builderType endpoint name is needed to create propriate requestBuilder
     *
     * @returns requestBuilder
     */
    private async getRequestBuilder(
        builderType: ApiName,
        hrn?: HRN,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            builderType,
            this.apiVersion,
            this.settings,
            hrn,
            abortSignal
        );
    }
}
