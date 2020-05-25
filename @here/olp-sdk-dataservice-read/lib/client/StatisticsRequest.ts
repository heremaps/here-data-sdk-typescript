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

import { HRN } from "@here/olp-sdk-core";
import { validateBillingTag } from "..";

/**
 * A map type that is supported by the platform Statistics Service.
 */
export enum CoverageDataType {
    /** Represents the availability of data in partitions. */
    BITMAP = "tilemap",
    /** A heatmap that represents a partition size. */
    SIZEMAP = "heatmap/size",
    /** A heatmap that represents partition update time. */
    TIMEMAP = "heatmap/age"
}

/**
 *  Prepares information for calls to get statistics from the platform Statistics Service.
 */
export class StatisticsRequest {
    private catalogHrn?: string;
    private layerId?: string;
    private typemap?: CoverageDataType;
    private dataLevel?: number;
    private billingTag?: string;

    /**
     * Gets the configured [[HRN]] string of the catalog HERE Resource Name(HRN) for the request.
     *
     * @return The configured [[HRN]] string.
     */
    public getCatalogHrn(): string | undefined {
        return this.catalogHrn;
    }

    /**
     * Gets a layer ID for the request.
     *
     * @return The layer ID string.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * Gets a map type that is supported by the platform Statistics Service.
     *
     * @return The requested map type.
     */
    public getTypemap(): CoverageDataType | undefined {
        return this.typemap;
    }

    /**
     * Gets a tile level for the request.
     *
     * @return The requested tile level number.
     */
    public getDataLevel(): number | undefined;

    /**
     * Gets a tile level for the request.
     * @deprecated Please use getDataLevel(): number | undefined
     * @return The requested tile level string.
     */
    public getDataLevel(): string | undefined;
    public getDataLevel(): number | string | undefined {
        return this.dataLevel;
    }
    /**
     * A setter for the provided catalog HERE Resource Name (HRN).
     *
     * @param hrn The catalog HRN.
     * @returns The updated [[StatisticsRequest]] instance that you can use to chain methods.
     */
    public withCatalogHrn(hrn: HRN): StatisticsRequest {
        this.catalogHrn = hrn.toString();
        return this;
    }

    /**
     * A setter for the requested `layerId` string.
     *
     * @param layerId The ID of the layer.
     * @returns The updated [[StatisticsRequest]] instance that you can use to chain methods.
     */
    public withLayerId(layerId: string): StatisticsRequest {
        this.layerId = layerId;
        return this;
    }

    /**
     * A setter for the provided `coverageDataType` string.
     *
     * @param coverageDataType Points at one of the following Statistic API endpoints:
     * * BITMAP &ndash; fetches a bitmap that represents the availability of data in partitions.
     * * SIZEMAP &ndash; fetches a heatmap that represents a partition size.
     * * TIMEMAP &ndash; fetches a heatmap that represents partition update time.
     * @returns The updated [[StatisticsRequest]] instance that you can use to chain methods.
     */
    public withTypemap(coverageDataType: CoverageDataType): StatisticsRequest {
        this.typemap = coverageDataType;
        return this;
    }

    /**
     * A setter for the provided `dataLevel`.
     *
     * @param dataLevel By default, assets generated at deepest data level are returned.
     * Note that assets returned for data levels greater than 11 represent data at data level 11.
     * @returns The updated [[StatisticsRequest]] instance that you can use to chain methods.
     */
    public withDataLevel(dataLevel: number): StatisticsRequest;

    /**
     * A setter for the provided `dataLevel` string.
     *
     * @deprecated Please set dataLevel as a number
     * @param dataLevel dataLevel Specify the tile level about which you want to get statistical data.
     * @returns The updated [[StatisticsRequest]] instance that you can use to chain methods.
     */
    // tslint:disable-next-line: unified-signatures
    public withDataLevel(dataLevel: string): StatisticsRequest;

    public withDataLevel(dataLevel: string | number) {
        this.dataLevel = Number(dataLevel);
        return this;
    }

    /**
     * An optional free-form tag that is used for grouping billing records together.
     *
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param tag The `BillingTag` string.
     * @return The updated [[StatisticsRequest]] instance that you can use to chain methods.
     */
    public withBillingTag(tag: string): StatisticsRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }

    /**
     * Gets a billing tag to group billing records together.
     *
     * @return The `BillingTag` string.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
