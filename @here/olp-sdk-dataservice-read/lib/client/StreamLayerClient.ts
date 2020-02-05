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

import { HRN, OlpClientSettings } from "..";

export interface StreamLayerClientParams {
    // The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
    catalogHrn: HRN;
    // The ID of the layer.
    layerId: string;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
}

/**
 * Describes a stream layer.
 */
export class StreamLayerClient {
    readonly catalogHrn: HRN;
    readonly layerId: string;
    readonly settings: OlpClientSettings;

    /**
     * Creates the [[StreamLayerClient]] instance.
     *
     * @param params The [[StreamLayerClientParams]] instance.
     * @return The [[StreamLayerClient]] instance.
     */
    constructor(params: StreamLayerClientParams) {
        this.catalogHrn = params.catalogHrn;
        this.layerId = params.layerId;
        this.settings = params.settings;
    }
}
