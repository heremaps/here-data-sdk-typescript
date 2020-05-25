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
    HttpError,
    MetadataApi,
    QueryApi,
    VolatileBlobApi
} from "@here/olp-sdk-dataservice-api";
import {
    ApiName,
    DataRequest,
    DataStoreRequestBuilder,
    HRN,
    MetadataCacheRepository,
    OlpClientSettings,
    PartitionsRequest,
    QuadKeyPartitionsRequest,
    QuadTreeIndexRequest,
    QueryClient,
    RequestFactory
} from "..";
import { FetchOptions } from "./FetchOptions";

/**
 * Parameters for use to initialize VolatileLayerClient.
 */
export interface VolatileLayerClientParams {
    // HRN of the catalog.
    catalogHrn: HRN;
    // The ID of the layer.
    layerId: string;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
}

/**
 * Describes a voaltile layer and provides the possibility to get partitions metadata and data.
 */
export class VolatileLayerClient {
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

    /**
     * @deprecated Please use the overloaded constructor of VolatileLayerClient.
     *
     * Creates the [[VolatileLayerClient]] instance.
     *
     * @param catalogHrn The HERE Resource Name of the catalog from which you want to get partitions metadata and data.
     * @param layerId The ID of the layer.
     * @param settings The [[OlpClientSettings]] instance.
     */
    constructor(catalogHrn: HRN, layerId: string, settings: OlpClientSettings);

    /**
     * Creates the [[VolatileLayerClient]] instance with VolatileLayerClientParams.
     *
     * @param params parameters for use to initialize VolatileLayerClient.
     */
    constructor(params: VolatileLayerClientParams);

    /**
     * Implementation for handling both constuctors.
     */
    constructor(
        paramsOrHrn: VolatileLayerClientParams | HRN,
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
        const partitionId = dataRequest.getPartitionId();
        const quadKey = dataRequest.getQuadKey();

        if (
            dataHandle !== undefined ||
            partitionId !== undefined ||
            quadKey !== undefined
        ) {
            if (dataHandle) {
                return this.downloadPartition(
                    dataHandle,
                    abortSignal,
                    dataRequest.getBillingTag()
                );
            }

            if (partitionId) {
                const partitionIdDataHandle = await this.getDataHandleByPartitionId(
                    partitionId,
                    dataRequest.getFetchOption(),
                    dataRequest.getBillingTag()
                ).catch(error => Promise.reject(error));

                return this.downloadPartition(
                    partitionIdDataHandle,
                    abortSignal,
                    dataRequest.getBillingTag()
                );
            }

            if (quadKey) {
                const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest().withQuadKey(
                    quadKey
                );
                const quadTreeIndex = await this.getPartitions(
                    quadKeyPartitionsRequest
                ).catch(error => Promise.reject(error));

                if (quadTreeIndex.status && quadTreeIndex.status === 400) {
                    return Promise.reject(quadTreeIndex);
                }

                return quadTreeIndex.subQuads && quadTreeIndex.subQuads.length
                    ? this.downloadPartition(
                          quadTreeIndex.subQuads[0].dataHandle,
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
                "volatile"
            )
                .withQuadKey(quadKey)
                .withDepth(request.getDepth())
                .withAdditionalFields(request.getAdditionalFields());

            return queryClient.fetchQuadTreeIndex(
                quadTreeIndexRequest,
                abortSignal
            );
        }

        if (request.getPartitionIds()) {
            const queryClient = new QueryClient(this.settings);

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
            HRN.fromString(this.hrn)
        ).catch(error => Promise.reject(error));

        const metadata = await MetadataApi.getPartitions(metaRequestBilder, {
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

    private async downloadPartition(
        dataHandle: string,
        abortSignal?: AbortSignal,
        billingTag?: string
    ): Promise<Response> {
        const builder = await this.getRequestBuilder(
            "volatile-blob",
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(error => Promise.reject(error));
        return VolatileBlobApi.getVolatileBlob(builder, {
            dataHandle,
            layerId: this.layerId,
            billingTag
        });
    }

    /**
     * Fetches baseUrl and creates requestBuilder for sending requests to the API Lookup Service.
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

    /**
     * Fetch and returns partition metadata
     * @param partitionId The name of the partition to fetch.
     * @param fetchOption The option of caching (online only or return from cache if exist)
     * @returns A promise of partition metadata which used to get partition data
     */
    private async getDataHandleByPartitionId(
        partitionId: string,
        fetchOption: FetchOptions,
        billingTag?: string
    ): Promise<string> {
        const queryClient = new QueryClient(this.settings);

        const partitionsRequest = new PartitionsRequest()
            .withPartitionIds([partitionId])
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
}
