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

/**
 * A class that prepare information for calls to get Partitions metadata from MetadataAPI.
 */
export class PartitionsRequest {
    private version: number | undefined;

    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * Setter for the provided version.
     * Method is optional. If the version does not specified the last layer version will be used
     * @param version Required. Specify the layer version.
     * @returns this to have ability to chain methods
     */
    public withVersion(version: number): PartitionsRequest {
        this.version = version;
        return this;
    }
}
