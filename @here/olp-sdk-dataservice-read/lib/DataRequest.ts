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

import { QuadKey } from "@here/olp-sdk-dataservice-read";

/**
 * A class that prepare information for calls to get Data from BlobAPI
 */
export class DataRequest {
    private dataHandle: string | undefined;
    private partitionId: string | undefined;
    private quadKey: QuadKey | undefined;
    private version: number | undefined;

    public getDataHandle(): string | undefined {
        return this.dataHandle;
    }

    /**
     * Method sets the provided dataHandle
     * @param dataHandle
     * @returns this to have ability to chain methods
     */
    public withDataHandle(dataHandle: string): DataRequest {
        this.dataHandle = dataHandle;
        return this;
    }

    public getPartitionId(): string | undefined {
        return this.partitionId;
    }

    /**
     * Method sets the provided partitionId
     * @param partitionId
     * @returns this to have ability to chain methods
     */
    public withPartitionId(partitionId: string): DataRequest {
        this.partitionId = partitionId;
        return this;
    }

    public getQuadKey(): QuadKey | undefined {
        return this.quadKey;
    }

    /**
     * Method sets the provided quadKey
     * @param quadKey
     * @returns this to have ability to chain methods
     */
    public withQuadKey(quadKey: QuadKey): DataRequest {
        this.quadKey = quadKey;
        return this;
    }

    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * Method sets the provided version
     * @param version
     * @returns this to have ability to chain methods
     */
    public withVersion(version: number): DataRequest {
        this.version = version;
        return this;
    }
}
