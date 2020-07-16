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

/**
 * Splits Blob or Buffer for chunks. Each chunk will
 * have size = chunkSize, the last one will have size <= chunkSize.
 *
 * @param data The data to be splitted.
 * @param chunkSize The size for chunk in bytes.
 * @returns array of chunks.
 */
export function splitDataToChunks(data: Blob | Buffer, chunkSize: number) {
    const dataSize = data instanceof Buffer ? data.length : data.size;
    const dataChunks = [];

    for (let start = 0; start < dataSize; start += chunkSize) {
        dataChunks.push(data.slice(start, start + chunkSize));
    }

    return dataChunks;
}
