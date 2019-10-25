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

import { CoverageApi } from "@here/olp-sdk-dataservice-api";
import { ErrorHTTPResponse } from "./CatalogClientCommon";
import { DataStoreContext } from "./DataStoreContext";
import { DataStoreRequestBuilder } from "./DataStoreRequestBuilder";
import { SummaryRequest } from "./SummaryRequest";

/**
 * A class that provides possibility to get Statistic Metadata and Data for Versioned layer
 */
export class StatisticsClient {
    constructor(private readonly context: DataStoreContext) {}

    /**
     * Fetch and return layer summary from the Statistics service.
     *
     * @param summaryRequest Options which are needed to fetch summary.
     * Includes @catalogHrn and @layerId
     *
     * @returns A promise with the layer summary.
     */
    async getSummary(summaryRequest: SummaryRequest): Promise<CoverageApi.LayerSummary> {
        const layerId = summaryRequest.getLayerId();
        const catalogHrn = summaryRequest.getCatalogHrn();

        if (catalogHrn === undefined) {
            return Promise.reject(new Error(`No catalogHrn provided`));
        }
        if (layerId === undefined) {
            return Promise.reject(new Error(`No layerId provided`));
        }
        const coverageRequestBuilder = await this.getRequestBuilder(catalogHrn)
            .catch(error => Promise.reject(new Error(error)));
        return CoverageApi.getDataCoverageSummary(coverageRequestBuilder, {
            layerId
        }).catch(this.errorHandler);
    }

    private async errorHandler(error: Response) {
        return Promise.reject(
            new Error(
                `Statistic Service error: HTTP ${error.status}, ${error.statusText || ""}`
            )
        );
    }

    private async getRequestBuilder(hrn: string): Promise<DataStoreRequestBuilder> {
        const url = await this.context
            .getBaseUrl("statistics", hrn)
            .catch(err =>
                Promise.reject(
                    `Error retrieving from cache builder for resource "${hrn}" and api: Statistic".\n${err}"`
                )
            );
        return new DataStoreRequestBuilder(
            this.context.dm,
            url,
            this.context.getToken
        );
    }
}
