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

/**
 * Describes a index layer and provides the possibility to get partitions metadata and data.
 */
export class IndexLayerClient {
    /**
     * Creates the [[IndexLayerClient]] instance.
     *
     * @param catalogHrn The HERE Resource Name (HRN) of the catalog from which you want to get partitions metadata and data.
     * @param layerId The ID of the layer.
     * @param settings The [[OlpClientSettings]] instance.
     * @return The [[IndexLayerClient]] instance.
     */
    constructor(
        readonly catalogHrn: HRN,
        readonly layerId: string,
        readonly settings: OlpClientSettings
    ) {}
}
