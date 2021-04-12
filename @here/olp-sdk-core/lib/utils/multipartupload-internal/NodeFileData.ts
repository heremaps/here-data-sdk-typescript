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

import { fs } from "@here/olp-sdk-core";
import { Data } from "./interfaces";

export class NodeFileData implements Data {
    private readonly fileInfo: fs.Stats;

    constructor(private readonly filePath: string) {
        this.fileInfo = fs.statSync(this.filePath);
    }

    async readBytes(from: number, to: number): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(this.filePath, {
                start: from,
                end: to
            });

            stream.on("error", err => {
                reject(err);
            });

            stream.on("data", (chunk: Buffer) => {
                stream.destroy();
                resolve(chunk);
            });
        });
    }

    size(): number {
        return this.fileInfo.size;
    }
}