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

import { QuadKey } from "./QuadKey";

/** @hidden */
// tslint:disable:no-magic-numbers
const powerOfTwo = [
    0x1,
    0x2,
    0x4,
    0x8,
    0x10,
    0x20,
    0x40,
    0x80,
    0x100,
    0x200,
    0x400,
    0x800,
    0x1000,
    0x2000,
    0x4000,
    0x8000,
    0x10000,
    0x20000,
    0x40000,
    0x80000,
    0x100000,
    0x200000,
    0x400000,
    0x800000,
    0x1000000,
    0x2000000,
    0x4000000,
    0x8000000,
    0x10000000,
    0x20000000,
    0x40000000,
    0x80000000,
    0x100000000,
    0x200000000,
    0x400000000,
    0x800000000,
    0x1000000000,
    0x2000000000,
    0x4000000000,
    0x8000000000,
    0x10000000000,
    0x20000000000,
    0x40000000000,
    0x80000000000,
    0x100000000000,
    0x200000000000,
    0x400000000000,
    0x800000000000,
    0x1000000000000,
    0x2000000000000,
    0x4000000000000,
    0x8000000000000,
    0x10000000000000 // Math.pow(2, 52), highest bit that can be set correctly.
];
// tslint:enable:no-magic-numbers

/**
 * Creates a quad key from a numeric or string Morton code representation.
 *
 * @param code The Morton code to be converted.
 * @returns A new instance of [[QuadKey]].
 */
export function quadKeyFromMortonCode(code: number | string): QuadKey {
    if (typeof code === "string") {
        code = parseInt(code, 10);
    }

    let level = 0;
    let row = 0;
    let column = 0;
    // tslint:disable:no-bitwise
    while (code > 1) {
        const mask: number = 1 << level;
        if (code & 0x1) {
            column |= mask;
        }
        if (code & 0x2) {
            row |= mask;
        }
        level++;
        // tslint:disable-next-line:no-magic-numbers
        code = (code - (code & 0x3)) / 4;
    }
    // tslint:enable:no-bitwise
    return { row, column, level } as QuadKey;
}

/**
 * Converts the quad key into a morton code numeric representation.
 *
 * @returns A number representing morton code of [[QuadKey]].
 */
export function mortonCodeFromQuadKey(key: QuadKey): number {
    let column = key.column;
    let row = key.row;
    // tslint:disable:no-bitwise
    let result = powerOfTwo[key.level << 1];
    for (let i = 0; i < key.level; ++i) {
        if (column & 0x1) {
            result += powerOfTwo[2 * i];
        }
        if (row & 0x1) {
            result += powerOfTwo[2 * i + 1];
        }
        column >>>= 1;
        row >>>= 1;
    }
    // tslint:enable:no-bitwise
    return result;
}

/**
 * Compute a new quad key that is result of appending a `subKey` (relative) quad key to the current.
 *
 * This function treats the current quad key as a root for a relative quad key,
 * the result quad key level is computed as current level plus relative level.
 *
 * @param subKey A relative quad key to use as a relative quad key.
 * @returns A new instance of [[QuadKey]].
 */
export function addQuadKeys(root: QuadKey, subKey: QuadKey): QuadKey {
    // tslint:disable:no-bitwise
    const row = (root.row << subKey.level) + subKey.row;
    const column = (root.column << subKey.level) + subKey.column;
    // tslint:enable:no-bitwise
    const level = root.level + subKey.level;
    return { row, column, level } as QuadKey;
}

/**
 * Compute a new quad key that is a parent of a current quad key.
 *
 * By default it will return the first ancestor, `delta` parameter is used to return the N one.
 *
 * If the result level is negative the root quad key is returned.
 *
 * @param delta The numeric difference between the current level and the ancestor level.
 * @returns A new instance of [[QuadKey]].
 */
export function computeParentKey(key: QuadKey, delta: number = 1): QuadKey {
    if (delta < 0) {
        throw new Error("Operation is not supported");
    }
    // tslint:disable:no-bitwise
    const row = key.row >>> delta;
    const column = key.column >>> delta;
    // tslint:enable:no-bitwise
    const level = Math.max(0, key.level - delta);
    return { row, column, level } as QuadKey;
}

/**
 * Checks that quad key is valid.
 *
 * Row and column must not be greater than the maximum rows/columns for the given level.
 * Maximum rows/columns for level is computed as 2 to the power of level.
 * Note - as JavaScript's number type can hold 53 bits in its mantissa, only levels up to 26 can be
 * represented in the number representation returned by [[mortonCodeFromQuadKey]]().
 * Level must be positive, level can't be greater than 26.
 *
 * @returns True if the QuadKey is valid, false otherwise.
 */
export function isValid(key: QuadKey): boolean {
    // tslint:disable-next-line:no-magic-numbers
    if (key.level < 0 || key.level > 26) {
        return false;
    }
    const dimensionAtLevel = Math.pow(2, key.level);
    const rowValid = key.row >= 0 && key.row < dimensionAtLevel;
    const columnValid = key.column >= 0 && key.column < dimensionAtLevel;
    return rowValid && columnValid;
}
