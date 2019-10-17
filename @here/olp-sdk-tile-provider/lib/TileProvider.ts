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
  CatalogClient,  
  DataStoreContext,
  mortonCodeFromQuadKey,
  NotFoundError,
  QuadKey
} from "@here/olp-sdk-dataservice-read/";

/**
 * Specify the options of the Hype datasource.
 */
export interface TileProviderOptions {
  /**
   * Specify which layer to use.
   */
  layerId: string;

  /**
   * Specify the environment, select from "here", "here-dev", "here-cn" or "here-cn-dev".
   */
  environment: string;

  /**
   * Specify which version of CatalogClient should be used.
   */
  catalogVersion?: number;

  /**
   * HRN to the catalog, where a requested layer with tiles is.
   */
  catalogHrn: string;

  /**
   * Return async promise with token from authentication module.
   */
  getToken: () => Promise<string>;
}

/**
 * The `TileProvider` is a [[DataProvider]] which retrieves heretiles (partition id in any of the specified
 * versions of the catalog) by the DataServiceRead.
 *
 */
export class TileProvider {
  // tslint:disable-next-line: deprecation
  private m_catalogClient?: CatalogClient;

  /**
   * Construct a new `TileProvider` with the specified options.
   *
   * @param m_options Specify options like layer, URL and version.
   *
   */
  constructor(private readonly m_options: TileProviderOptions) {}

  /**
   * Returns the underlying catalog client.
   *
   * **Note**: The data provider must be connected before this method can be called, so make sure
   * that `ready()` returns `true` before calling it.
   *
   * @returns The catalog client this data provider uses.
   */
  catalogClient(): CatalogClient | undefined {
    return this.m_catalogClient;
  }


}
