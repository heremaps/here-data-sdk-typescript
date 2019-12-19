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

import {
    ConfigApi,
    CoverageApi,
    MetadataApi,
    QueryApi
} from "@here/olp-sdk-dataservice-api";
import {
    ArtifactClient,
    DataRequest,
    HRN,
    OlpClientSettings,
    PartitionsRequest,
    QuadKeyPartitionsRequest,
    SchemaDetailsRequest,
    SchemaRequest,
    StatisticsClient,
    StatisticsRequest,
    SummaryRequest,
    VersionedLayerClient,
    VolatileLayerClient
} from "..";

export class CatalogLayer {
    constructor(
        private readonly model: ConfigApi.Layer,
        private readonly settings: OlpClientSettings,
        private readonly hrn: HRN,
        private readonly layerId: string
    ) {}

    /**
     * Getter for layer configuration
     * @returns current layer configuration
     */
    public getModel(): ConfigApi.Layer {
        return this.model;
    }

    public async getData(
        dataRequest: DataRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        let client: VersionedLayerClient | VolatileLayerClient;
        if (this.model.layerType === "versioned") {
            client = new VersionedLayerClient(this.hrn, this.layerId, this.settings);
            return client.getData(dataRequest, abortSignal);
        }
        if (this.model.layerType === "volatile") {
            client = new VolatileLayerClient(this.hrn, this.layerId, this.settings);
            return client.getData(dataRequest, abortSignal);
        }
        return Promise.reject(new Error(`Error. Only Versioned amd Volatile layers are supported.`));
    }

    public async getPartitions(
        request: QuadKeyPartitionsRequest | PartitionsRequest,
        abortSignal?: AbortSignal
    ): Promise<QueryApi.Index | MetadataApi.Partitions | QueryApi.Partitions> {
        let client: VersionedLayerClient | VolatileLayerClient;
        if (this.model.layerType === "versioned") {
            client = new VersionedLayerClient(this.hrn, this.layerId, this.settings);
            return client.getPartitions(request as any, abortSignal);
        }
        if (this.model.layerType === "volatile") {
            client = new VolatileLayerClient(this.hrn, this.layerId, this.settings);
            return client.getPartitions(request as any, abortSignal);
        }
        return Promise.reject(new Error(`Error. Only Versioned amd Volatile layers are supported.`));
    }

    public async getSummary(summaryRequest: SummaryRequest): Promise<CoverageApi.LayerSummary> {
        if (this.model.layerType !== "versioned") {
            return Promise.reject(new Error(`Error. This method is allowed only for versioned layers.`));
        }

        const statisticsClient = new StatisticsClient(this.settings);
        return statisticsClient.getSummary(summaryRequest);
    }

    public async getStatistics(statisticsRequest: StatisticsRequest) {
        if (this.model.layerType !== "versioned") {
            return Promise.reject(new Error(`Error. This method is allowed only for versioned layers.`));
        }

        const statisticsClient = new StatisticsClient(this.settings);
        return statisticsClient.getStatistics(statisticsRequest);
    }

    public async getSchemaDetails(schemaDetailsRequest: SchemaDetailsRequest) {
        const artifactClient = new ArtifactClient(this.settings);
        return artifactClient.getSchemaDetails(schemaDetailsRequest);
    }

    public async getSchema(schemaRequest: SchemaRequest) {
        const artifactClient = new ArtifactClient(this.settings);
        return artifactClient.getSchema(schemaRequest);
    }
}
