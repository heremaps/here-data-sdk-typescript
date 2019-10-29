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

export enum CoverageDataType {
    BITMAP = "tilemap",
    SIZEMAP = "heatmap/size",
    TIMEMAP = "heatmap/age",
    SUMMARY = "summary"
}

/**
 * A class that prepare information for calls to get Statistics from CoverageAPI
 */
export class StatisticsRequest {
    private catalogHrn: string | undefined;
    private layerId: string | undefined;
    private typemap: CoverageDataType | undefined;
    private dataLevel: string | undefined;

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

    public withCatalogHrn(hrn: string) {
        this.catalogHrn = hrn;
        return this;
    }

    public withLayerId(layerId: string) {
        this.layerId = layerId;
        return this;
    }

    public withTypemap(type: CoverageDataType) {
        this.typemap = type;
        return this;
    }

    public withDataLevel(dataLevel: string) {
        this.dataLevel = dataLevel;
        return this;
    }
}
