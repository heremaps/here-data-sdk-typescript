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
 * Abstraction for data instance.
 *
 * The wrapper of some data (Blob, Buffer, File, string, etc...),
 * alows to read bytes with specific range and get the size
 * of the data.
 */
export abstract class Data {
    /**
     * The method for getting `Buffer` from data by specific range.
     *
     * @param from first byte of reading.
     * @param to last byte of reading.
     *
     * @returns the `Promise` with the `Buffer` of the data.
     */
    abstract readBytes(from: number, to: number): Promise<ArrayBufferLike>;

    /**
     * The method for getting the size of the data.
     *
     * @returns the bytes length of the data.
     */
    abstract size(): number;
}
