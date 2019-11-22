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

import { BlobApi, MetadataApi, QueryApi } from "@here/olp-sdk-dataservice-api";
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
} from "@here/olp-sdk-dataservice-read";

/**
 * A class that describes versioned layer
 * and provides possibility to get layer Metadata and Partitions.
 */
export class VersionedLayerClient {
    private readonly apiVersion: string = "v1";
    private readonly hrn: string;

    constructor(
        catalogHrn: HRN,
        readonly layerId: string,
        readonly settings: OlpClientSettings
    ) {
        this.hrn = catalogHrn.toString();
    }

    /**
     * Fetch partition by id or quadKey or dataHandle
     * @param dataRequest Instance of the configuret request params [[DataRequest]]
     * @param abortSignal A signal object that allows you to communicate with a request (such as a Fetch)
     * and abort it if required via an AbortController object
     *  @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
     */
    async getData(
        dataRequest: DataRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const dataHandle = dataRequest.getDataHandle();
        const partitionId = dataRequest.getPartitionId();
        const quadKey = dataRequest.getQuadKey();
        const version = dataRequest.getVersion();

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
                    version,
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
                ).withVersion(version);
                const quadTreeIndex = await this.getPartitions(
                    quadKeyPartitionsRequest
                ).catch(error => Promise.reject(error));
                return this.downloadPartition(
                    quadTreeIndex.subQuads[0].dataHandle,
                    abortSignal,
                    dataRequest.getBillingTag()
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
     * Fetch partitions metadata from Query API by QuadKey
     * @returns Quad Tree Index for partition
     */
    async getPartitions(
        quadKeyPartitionsRequest: QuadKeyPartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index>;

    /**
     * Fetch all partitions metadata from layer
     * @returns list of partittions metadata
     */
    async getPartitions(
        partitionsRequest: PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<MetadataApi.Partitions>;

    async getPartitions(
        request: QuadKeyPartitionsRequest | PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index | MetadataApi.Partitions> {
        if (request instanceof QuadKeyPartitionsRequest) {
            const quadKey = request.getQuadKey();
            if (!quadKey) {
                return Promise.reject("Please provide correct QuadKey");
            }

            const queryClient = new QueryClient(this.settings);

            const quadTreeIndexRequest = new QuadTreeIndexRequest(
                HRN.fromString(this.hrn),
                this.layerId,
                "versioned"
            )
                .withQuadKey(quadKey)
                .withVersion(request.getVersion())
                .withDepth(request.getDepth());

            const forSpecificCatalogVersion = request.getVersion();
            if (forSpecificCatalogVersion) {
                quadTreeIndexRequest.withVersion(forSpecificCatalogVersion);
            }

            return queryClient.fetchQuadTreeIndex(
                quadTreeIndexRequest,
                abortSignal
            );
        }

        const metaRequestBilder = await this.getRequestBuilder(
            "metadata",
            abortSignal
        );
        const version =
            request.getVersion() ||
            (await this.getLatestVersion(request.getBillingTag()));
        return MetadataApi.getPartitions(metaRequestBilder, {
            version,
            layerId: this.layerId,
            billingTag: request.getBillingTag()
        });
    }

    /**
     * Fetch and returns partition metadata
     * @param partitionId The name of the partition to fetch.
     * @param version The version of the layer to fetch
     * @returns A promise of partition metadata which used to get partition data
     */
    private async getDataHandleByPartitionId(
        partitionId: string,
        version?: number,
        billingTag?: string
    ): Promise<string> {
        const queryRequestBilder = await this.getRequestBuilder("query");
        const latestVersion =
            version || (await this.getLatestVersion(billingTag));
        const partitions = await QueryApi.getPartitionsById(
            queryRequestBilder,
            {
                version: `${latestVersion}`,
                layerId: this.layerId,
                partition: [partitionId],
                billingTag
            }
        );
        const partition = partitions.partitions.find(element => {
            return element.partition === partitionId;
        });

        return partition && partition.dataHandle
            ? partition.dataHandle
            : Promise.reject(
                  `No partition dataHandle for partition ${partitionId}. HRN: ${this.hrn}`
              );
    }

    /**
     * Gets the latest available catalog version what can be used as latest layer version
     */
    private async getLatestVersion(billingTag?: string): Promise<number> {
        const builder = await this.getRequestBuilder("metadata").catch(error =>
            Promise.reject(error)
        );
        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion: -1,
            billingTag
        }).catch(async (error: Response) =>
            Promise.reject(
                new Error(
                    `Metadata Service error: HTTP ${
                        error.status
                    }, ${error.statusText || ""}`
                )
            )
        );
        return latestVersion.version;
    }

    private async downloadPartition(
        dataHandle: string,
        abortSignal?: AbortSignal,
        billingTag?: string
    ): Promise<Response> {
        const builder = await this.getRequestBuilder("blob", abortSignal);
        return BlobApi.getBlob(builder, {
            dataHandle,
            layerId: this.layerId,
            billingTag
        }).catch(async error => Promise.reject(error));
    }

    /**
     * Fetch baseUrl and create requestBuilder for sending requests to the look-up API
     * @param builderType endpoint name is needed to create propriate requestBuilder
     *
     * @returns requestBuilder
     */
    private async getRequestBuilder(
        builderType: ApiName,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            builderType,
            this.apiVersion,
            this.settings,
            HRN.fromString(this.hrn),
            abortSignal
        ).catch(err =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
            )
        );
    }
}
