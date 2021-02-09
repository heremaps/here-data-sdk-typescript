/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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
 * @deprecated This interface will be removed by 02.2021. Please use the same from  the `@here/olp-sdk-core` package.
 * Addresses a tile in a quadtree.
 *
 * A quadkey is defined by a row, a column, and a level. The tree has a root at level 0 that contains one
 * single tile. On every level, each tile is divided into four children (hence, the name "quadtree").
 *
 * Within each [[level]], a tile is addressed with a [[row]] and [[column]]. The number
 * of rows and columns in each level is 2 to the power of the level. This means that on level 0, only
 * one tile exists, so there is 1 column and 1 row. On level 1, 4 tiles exist in 2 rows and 2 columns.
 * On level 2, we have 16 tiles in 4 rows and 4 columns. And so on.
 *
 * @note As the JavaScript number type can hold 53 bits in its mantissa, only levels up to 26 can be
 * represented in the number representation returned by [[`mortonCodeFromQuadKey`]].
 */
export interface QuadKey {
    /** The row that contains the tile. */
    readonly row: number;
    /** The column that contains the tile. */
    readonly column: number;
    /** The level that contains the tile. */
    readonly level: number;
}

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
 * @deprecated This function will be removed by 08.2021.
 * Please use the same method from [[TileKey]] class, imported from `@here/olp-sdk-core` package.
 *
 * Creates a quadkey from a numeric or string Morton code representation.
 *
 * @param code The Morton code that you want to convert.
 * @returns The [[QuadKey]] instance.
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
 * @deprecated This function will be removed by 02.2021.
 * Please use the same method from [[TileKey]] class, imported from `@here/olp-sdk-core` package.
 *
 * Converts a quadkey into a Morton code numeric representation.
 *
 * @param key The quadkey that you need to convert to the Morton code.
 * @returns The number representing the Morton code of [[QuadKey]].
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
 * @deprecated This function will be removed by 02.2021.
 * Please use the same method from [[TileKey]] class, imported from `@here/olp-sdk-core` package.
 *
 * Computes a new quadkey that is a result of appending the `subKey` (relative) quadkey to the current quadkey.
 *
 * This function treats the current quadkey as a root for a relative quadkey.
 * The quadkey level of the result is computed as the current level plus the relative level.
 * @param root The current quadkey.
 * @param subKey The relative quadkey.
 * @returns The [[QuadKey]] instance.
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
 * @deprecated This function will be removed by 02.2021.
 * Please use the same method from [[TileKey]] class, imported from `@here/olp-sdk-core` package.
 *
 * Computes a new quadkey that is the parent of the current quadkey.
 *
 * If the result level is negative, the root quadkey is returned.
 * @param key The current quadkey.
 * @param delta The numeric difference between the current level and the ancestor level.
 * @note If the ancestor level is not specified, the function returns the first ancestor.
 * @returns The [[QuadKey]] instance.
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
 * @deprecated This function will be removed by 02.2021.
 * Please use the same method from [[TileKey]] class, imported from `@here/olp-sdk-core` package.
 *
 * Checks if a quadkey is valid.
 *
 * The number of rows and columns must not be greater than the maximum number of rows and columns in the given level.
 * The maximum number of rows and columns in a level is computed as 2 to the power of the level.
 *
 * @note As the JavaScript number type can hold 53 bits in its mantissa, only levels up to 26 can be
 * represented in the number representation returned by [[mortonCodeFromQuadKey]].
 * A level must be positive and can't be greater than 26.
 *
 * @param key The current quadkey.
 * @return True if the quadkey is valid, false otherwise.
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
