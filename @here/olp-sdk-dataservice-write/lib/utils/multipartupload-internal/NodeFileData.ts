/*
 * Copyright (C) 2021 HERE Europe B.V.
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

import { BlobData } from "@here/olp-sdk-dataservice-write";

// @ts-ignore disable typechecking for this line
import { fs } from "@here/olp-sdk-core";

/**
 * @internal
 * Implementation of reading bytes from file by filepath
 * in Node.js.
 */
export class NodeFileData implements BlobData {
    private readonly fileHandle: fs.promises.FileHandle;
    private readonly fileStats: fs.Stats;

    constructor(opts: {
        fileHandle: fs.promises.FileHandle;
        fileStats: fs.Stats;
    }) {
        this.fileHandle = opts.fileHandle;
        this.fileStats = opts.fileStats;
    }

    static async fromPath(filePath: string): Promise<BlobData> {
        const fileHandle = await fs.promises.open(filePath, "r");
        const fileStats = await fileHandle.stat();
        return new NodeFileData({ fileStats, fileHandle });
    }

    async readBytes(offset: number, count: number): Promise<ArrayBuffer> {
        const fileSize = this.size();

        const bufferLength =
            offset + count > fileSize ? fileSize - offset : count;

        const buffer = Buffer.alloc(bufferLength);
        const chunk = await this.fileHandle.read(
            buffer,
            0,
            bufferLength,
            offset
        );
        return chunk.buffer;
    }

    size(): number {
        return this.fileStats.size;
    }

    async finally() {
        await this.fileHandle.close();
    }
}
