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

import { HRN, validateBillingTag } from "..";

export enum CoverageDataType {
    BITMAP = "tilemap",
    SIZEMAP = "heatmap/size",
    TIMEMAP = "heatmap/age"
}

/**
 * A class that prepare information for calls to get Statistics from CoverageAPI
 */
export class StatisticsRequest {
    private catalogHrn?: string;
    private layerId?: string;
    private typemap?: CoverageDataType;
    private dataLevel?: string;
    private billingTag?: string;

    constructor() {}

    public getCatalogHrn(): string | undefined {
        return this.catalogHrn;
    }

    public getLayerId(): string | undefined {
        return this.layerId;
    }

    public getTypemap(): CoverageDataType | undefined {
        return this.typemap;
    }

    public getDataLevel(): string | undefined {
        return this.dataLevel;
    }

    /**
     * Setter for the provided hrn
     * @param hrn Required. Specify the catalog hrn
     * @returns this to have ability to chain methods
     */
    public withCatalogHrn(hrn: HRN): StatisticsRequest {
        this.catalogHrn = hrn.toString();
        return this;
    }

    /**
     * Setter for the provided layerId
     * @param layerId Required. Specify the LayerId
     * @returns this to have ability to chain methods
     */
    public withLayerId(layerId: string): StatisticsRequest {
        this.layerId = layerId;
        return this;
    }

    /**
     * Setter for the provided coverageDataType
     * @param coverageDataType Required. This parameter points to appropriate StatisticAPI endpoint.
     * BITMAP to fetch bitmap representing availability of data in partitions,
     * SIZEMAP to fetch HeatMap representing partition size,
     * TIMEMAP to fetch HeatMap representing partition update time
     * @returns this to have ability to chain methods
     */
    public withTypemap(coverageDataType: CoverageDataType): StatisticsRequest {
        this.typemap = coverageDataType;
        return this;
    }

    /**
     * Setter for the provided dataLevel
     * @param dataLevel Required. Specify the tile level you want to get coverage data about
     * @returns this to have ability to chain methods
     */
    public withDataLevel(dataLevel: string): StatisticsRequest {
        this.dataLevel = dataLevel;
        return this;
    }

    /**
     * Billing Tag is an optional free-form tag which is used for grouping billing records together.
     * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     */
    public withBillingTag(tag: string): StatisticsRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * Billing Tag for grouping billing records together
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
