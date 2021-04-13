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

/**
 * An abstraction for `BlobData` instances.
 *
 * The wrapper of data (`Blob`, `Buffer`, `File`, string, and so on)
 * that allows to read a specific range of bytes and get data size.
 */
export abstract class BlobData {
    /**
     * Gets buffer from a range of data.
     *
     * @param offset The first byte of the data range for reading.
     * @param count The number of bytes to read from the underlying data.
     * This value will be trimmed if the count exceeded the EOF or end of the stream.
     *
     * @returns The `Promise` object with the buffer.
     */
    abstract readBytes(offset: number, count: number): Promise<ArrayBufferLike>;

    /**
     * Gets the size of the data.
     *
     * @returns The length of the data in bytes.
     */
    abstract size(): number;
}
