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

import { KeyValueCache } from "@here/olp-sdk-core";
import { AdditionalFields, MetadataApi } from "@here/olp-sdk-dataservice-api";
import { PartitionsRequest } from "../client";

/**
 * Caches the partitions metadata using a key-value pair.
 */
export class MetadataCacheRepository {
    /**
     * Generates the [[MetadataCacheRepository]] instance.
     *
     * @param cache The [[KeyValueCache]] instance.
     * @return The [[MetadataCacheRepository]] instance.
     */
    constructor(private readonly cache: KeyValueCache) {}

    /**
     * @deprecated This signature will be removed by 04.2021. Please set the version as the last argument.
     * Stores a key-value pair in the cache.
     *
     * @return True if the operation is successful, false otherwise.
     */
    public put(
        rq: PartitionsRequest,
        hrn: string,
        layerId: string,
        partitions: MetadataApi.Partition[]
    ): boolean;

    /**
     * Stores a key-value pair in the cache.
     *
     * @return True if the operation is successful, false otherwise.
     */
    public put(
        rq: PartitionsRequest,
        hrn: string,
        layerId: string,
        partitions: MetadataApi.Partition[],
        // tslint:disable-next-line: unified-signatures
        version?: number
    ): boolean;
    public put(
        rq: PartitionsRequest,
        hrn: string,
        layerId: string,
        partitions: MetadataApi.Partition[],
        version?: number
    ): boolean {
        const partitionsIds = rq.getPartitionIds();
        let key: string;
        if (partitionsIds) {
            for (const metadata of partitions) {
                key = this.createKey({
                    hrn,
                    layerId,
                    version: version !== undefined ? version : rq.getVersion(),
                    partitionId: metadata.partition
                });
                this.cache.put(key, JSON.stringify(metadata));
            }

            return true;
        }

        key = this.createKey({
            hrn,
            layerId,
            version: version !== undefined ? version : rq.getVersion()
        });
        return this.cache.put(key, JSON.stringify(partitions));
    }

    /**
     * @deprecated This signature will be removed by 04.2021. Please set the version as the last argument.
     * Gets a metadata from the cache.
     *
     * @param service The name of the API service for which you want to get the base URL.
     * @param serviceVersion The service version.
     * @return The base URL of the service, or undefined if the base URL does not exist.
     */
    public get(
        rq: PartitionsRequest,
        hrn: string,
        layerId: string
    ): MetadataApi.Partition[] | undefined;

    /**
     * Gets a metadata from the cache.
     *
     * @param service The name of the API service for which you want to get the base URL.
     * @param serviceVersion The service version.
     * @return The base URL of the service, or undefined if the base URL does not exist.
     */
    public get(
        rq: PartitionsRequest,
        hrn: string,
        layerId: string,
        // tslint:disable-next-line: unified-signatures
        version?: number
    ): MetadataApi.Partition[] | undefined;
    public get(
        rq: PartitionsRequest,
        hrn: string,
        layerId: string,
        version?: number
    ): MetadataApi.Partition[] | undefined {
        const partitionsIds = rq.getPartitionIds();
        let key: string;
        if (partitionsIds) {
            const availablePartitions: MetadataApi.Partition[] = [];
            for (const partitionId of partitionsIds) {
                key = this.createKey({
                    hrn,
                    layerId,
                    version: version !== undefined ? version : rq.getVersion(),
                    partitionId
                });

                const serializedPartition = this.cache.get(key);
                if (serializedPartition) {
                    availablePartitions.push(JSON.parse(serializedPartition));
                }
            }

            if (
                partitionsIds.length !== availablePartitions.length ||
                this.checkAdditionalFieldsAvailable(
                    availablePartitions,
                    rq.getAdditionalFields()
                )
            ) {
                /**
                 * In the case when not all partitions are available, or some of partition has not requested a some of additional field,
                 * we fail the cache lookup.
                 * This can be enhanced in the future.
                 */
                return undefined;
            }

            return availablePartitions;
        }

        key = this.createKey({
            hrn,
            layerId,
            version: version !== undefined ? version : rq.getVersion()
        });

        const serializedPartitions = this.cache.get(key);
        return serializedPartitions
            ? JSON.parse(serializedPartitions)
            : undefined;
    }

    private createKey(params: {
        hrn: string;
        layerId: string;
        partitionId?: string;
        version?: number;
    }): string {
        return (
            `${params.hrn}::${params.layerId}::` +
            (params.version ? `${params.version}::` : "") +
            (params.partitionId
                ? `${params.partitionId}::partition`
                : "partitions")
        );
    }

    /**
     * Checks all cached partitions with additional fields.
     *
     * @param cachedPartitions The array of the cached partitions
     * @param additionalFields the array of the requested additional fields.
     * @returns True if some of the cached partition does not have some additional field.
     * False otherwise or if any additionalFields has not been requested.
     */
    private checkAdditionalFieldsAvailable(
        cachedPartitions: MetadataApi.Partition[],
        additionalFields?: AdditionalFields
    ) {
        if (additionalFields === undefined) {
            return false;
        }

        for (const cachedPartition of cachedPartitions) {
            for (const additionalField of additionalFields) {
                if (!cachedPartition.hasOwnProperty(additionalField)) {
                    return true;
                }
            }
        }
        return false;
    }
}
