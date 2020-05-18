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
import {
    CoverageDataType,
    DataStoreRequestBuilder,
    HRN,
    OlpClientSettings,
    RequestFactory,
    StatisticsRequest,
    SummaryRequest
} from "..";

/**
 * A client for the platform Statistics Service.
 */
export class StatisticsClient {
    private readonly apiVersion: string = "v1";

    /**
     * Creates the [[StatisticsClient]] instance.
     *
     * @param settings The [[OlpClientSettings]] instance.
     *
     * @return The [[StatisticsClient]] instance.
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Fetches and returns a layer summary from the platform Statistics Service.
     *
     * @param summaryRequest Parameters that are needed to fetch the layer summary.
     * Includes [[catalogHrn]] and [[layerId]].
     *
     * @returns A promise with the layer summary.
     */
    public async getSummary(
        summaryRequest: SummaryRequest
    ): Promise<CoverageApi.LayerSummary> {
        const layerId = summaryRequest.getLayerId();
        const catalogHrn = summaryRequest.getCatalogHrn();

        if (catalogHrn === undefined) {
            return Promise.reject(new Error(`No catalogHrn provided`));
        }
        if (layerId === undefined) {
            return Promise.reject(new Error(`No layerId provided`));
        }
        const coverageRequestBuilder = await this.getRequestBuilder(
            catalogHrn
        ).catch(error => Promise.reject(error));
        return CoverageApi.getDataCoverageSummary(coverageRequestBuilder, {
            layerId
        });
    }

    /**
     * Depending on the map type that you specify in the [[StatisticsRequest]] instance, gets the [[StatisticsRequest]] instance
     * with one of the following settings:
     * * BITMAP &ndash; fetches a bitmap that represents the availability of data in partitions.
     * * SIZEMAP &ndash; fetches a heatmap that represents a partition size.
     * * TIMEMAP &ndash; fetches a heatmap that represents partition update time.
     *
     * @param statisticsRequest The [[StatisticsRequest]] instance with the requested settings.
     *
     * @return The [StatisticsRequest]] instance with the requested settings.
     */
    public async getStatistics(
        statisticsRequest: StatisticsRequest
    ): Promise<Response> {
        const layerId = statisticsRequest.getLayerId();
        const catalogHRN = statisticsRequest.getCatalogHrn();
        const typemap = statisticsRequest.getTypemap();
        const datalevel = statisticsRequest.getDataLevel();

        if (catalogHRN === undefined) {
            return Promise.reject(new Error(`No catalogHrn provided`));
        }
        if (layerId === undefined) {
            return Promise.reject(new Error(`No layerId provided`));
        }
        if (typemap === undefined) {
            return Promise.reject(new Error(`No typemap provided`));
        }
        const coverageRequestBuilder = await this.getRequestBuilder(
            catalogHRN
        ).catch(error => Promise.reject(error));

        let request;
        switch (typemap) {
            case CoverageDataType.BITMAP:
                request = CoverageApi.getDataCoverageTile;
                break;
            case CoverageDataType.SIZEMAP:
                request = CoverageApi.getDataCoverageSizeMap;
                break;
            case CoverageDataType.TIMEMAP:
                request = CoverageApi.getDataCoverageTimeMap;
                break;
            default:
                return Promise.reject(
                    new Error(`Incorrect typemap provided: ${typemap}`)
                );
        }

        return request(coverageRequestBuilder, {
            layerId,
            datalevel,
            catalogHRN
        });
    }

    private async getRequestBuilder(
        hrn: string
    ): Promise<DataStoreRequestBuilder> {
        return RequestFactory.create(
            "statistics",
            this.apiVersion,
            this.settings,
            HRN.fromString(hrn)
        );
    }
}
