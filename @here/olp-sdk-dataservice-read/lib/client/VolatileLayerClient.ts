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
    mortonCodeFromQuadKey,
    OlpClientSettings,
    PartitionsRequest,
    QuadKeyPartitionsRequest,
    QuadTreeIndexRequest,
    QueryClient,
    RequestFactory
} from "..";

export class VolatileLayerClient {
    private readonly apiVersion: string = "v1";
    readonly hrn: string;

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
                    dataRequest.getBillingTag(),
                    abortSignal
                ).catch((error: Response) => Promise.reject(error));
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
     * Fetch all or by some IDs partitions metadata from layer
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
                "volatile"
            )
                .withQuadKey(quadKey)
                .withDepth(request.getDepth());

            const quadTreeIndex = await queryClient.fetchQuadTreeIndex(
                quadTreeIndexRequest,
                abortSignal
            );

            const result: MetadataApi.Partitions = {
                partitions: quadTreeIndex.subQuads.map(subQuad => ({
                    dataHandle: subQuad.dataHandle,
                    version: subQuad.version,
                    partition: mortonCodeFromQuadKey(quadKey).toString()
                }))
            };

            return Promise.resolve(result);
        }

        const metaRequestBilder = await this.getRequestBuilder(
            "metadata",
            HRN.fromString(this.hrn)
        );
        return MetadataApi.getPartitions(metaRequestBilder, {
            layerId: this.layerId,
            billingTag: request.getBillingTag()
        });
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
        );
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
        hrn?: HRN,
        abortSignal?: AbortSignal
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            builderType,
            this.apiVersion,
            this.settings,
            hrn,
            abortSignal
        ).catch(err =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.hrn}" and api: "${builderType}.\n${err}"`
            )
        );
    }

    /**
     * Fetch and returns partition metadata
     * @param partitionId The name of the partition to fetch.
     * @returns A promise of partition metadata which used to get partition data
     */
    private async getDataHandleByPartitionId(
        partitionId: string,
        billingTag?: string,
        abortSignal?: AbortSignal
    ): Promise<string> {
        const queryRequestBilder = await this.getRequestBuilder(
            "query",
            HRN.fromString(this.hrn)
        );
        const partitions = await QueryApi.getPartitionsById(
            queryRequestBilder,
            {
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
}
