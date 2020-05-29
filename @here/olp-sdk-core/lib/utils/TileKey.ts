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

/**
 * The `TileKey` instances are used to address a tile in a Quad Tree.
 *
 * A tile key is defined by a row, a column, and a level. The tree has a root at level 0, with one
 * single tile. On every level, each tile is divided into four children (therefore the name
 * quadtree).
 *
 * Within each [[level]], any particular tile is addressed with [[row]] and [[column]]. The number
 * of rows and columns in each level is 2 to the power of the level. This means: On level 0, only
 * one tile exists, [[columnsAtLevel]]() and [[rowsAtLevel]]() are both 1. On level 1, 4 tiles
 * exist, in 2 rows and 2 columns. On level 2 we have 16 tiles, in 4 rows and 4 columns. And so on.
 *
 * A tile key is usually created using [[fromRowColumnLevel]]() method.
 *
 * `TileKey` instances are immutable, all members return new instances of `TileKey` and do not
 * modify the original object.
 *
 * Tile keys can be created from and converted into various alternative formats:
 *
 *  - [[toQuadKeyString]]() / [[fromQuadKeyString]]() - string representation 4-based
 *  - [[toMortonCode]]() / [[fromMortonCode]]() - number representation
 *
 * @note As JavaScript's number type can hold 53 bits in its mantissa, only levels up to 26 can be
 * represented in the number representation returned by [[mortonCode]]().
 */
export class TileKey implements QuadKey {
    private m_mortonCode?: number;

    /**
     * Constructs a new immutable instance of a `TileKey`.
     *
     * For the better readability, [[TileKey.fromRowColumnLevel]] should be preferred.
     *
     * Note - row and column must not be greater than the maximum rows/columns for the given level.
     *
     * @param row Represents the row in the quadtree.
     * @param column Represents the column in the quadtree.
     * @param level Represents the level in the quadtree.
     */
    constructor(
        readonly row: number,
        readonly column: number,
        readonly level: number
    ) {}

    /**
     * Creates a tile key.
     *
     * @param row The requested row. Must be less than 2 to the power of level.
     * @param column The requested column. Must be less than 2 to the power of level.
     * @param level The requested level.
     */
    static fromRowColumnLevel(
        row: number,
        column: number,
        level: number
    ): TileKey {
        return new TileKey(row, column, level);
    }

    /**
     * Creates a tile key from a quad string.
     *
     * The quad string can be created with [[toQuadKey]].
     *
     * @param quadkey The quadkey to convert.
     * @returns A new instance of `TileKey`.
     */
    static fromQuadKeyString(key: string): TileKey {
        if (key === "-") {
            return TileKey.fromRowColumnLevel(0, 0, 0);
        }

        const level = key.length;
        let row = 0;
        let column = 0;
        // tslint:disable:no-bitwise
        for (let i = 0; i < key.length; ++i) {
            const mask = 1 << i;
            const d = parseInt(key.charAt(level - i - 1), 10);
            if (d & 0x1) {
                column |= mask;
            }
            if (d & 0x2) {
                row |= mask;
            }
        }
        // tslint:enable:no-bitwise
        return TileKey.fromRowColumnLevel(row, column, level);
    }

    /**
     * Creates a tile key from a numeric Morton code representation.
     *
     * You can convert a tile key into a numeric Morton code with [[mortonCode]].
     *
     * @param key The Morton code to be converted.
     * @returns A new instance of [[TileKey]].
     */
    static fromMortonCode(key: number): TileKey {
        let level = 0;
        let row = 0;
        let column = 0;
        let quadKey = key;
        // tslint:disable:no-bitwise
        while (quadKey > 1) {
            const mask: number = 1 << level;

            if (quadKey & 0x1) {
                column |= mask;
            }
            if (quadKey & 0x2) {
                row |= mask;
            }

            level++;
            // tslint:disable-next-line: no-magic-numbers
            quadKey = (quadKey - (quadKey & 0x3)) / SUBTILES_COUNT;
        }
        // tslint:enable:no-bitwise
        const result = TileKey.fromRowColumnLevel(row, column, level);
        result.m_mortonCode = key;
        return result;
    }

    /**
     * Returns the number of available columns at a given level.
     *
     * This is 2 to the power of the level.
     *
     * @param level The level for which to return the number of columns.
     * @returns The available columns at the given level.
     */
    static columnsCount(level: number): number {
        // tslint:disable-next-line: no-bitwise
        return 1 << level;
    }

    /**
     * Returns the number of available rows at a given level.
     *
     * This is 2 to the power of the level.
     *
     * @param level The level for which to return the number of rows.
     * @returns The available rows at the given level.
     */
    static rowsCount(level: number): number {
        // tslint:disable-next-line: no-bitwise
        return 1 << level;
    }

    /**
     * Computes the parent TileKey.
     *
     * Note: The parent key of the root key is the root key itself.
     *
     * @returns The TileKey of the parent tile.
     */
    public parent(): TileKey {
        return this.changedLevelBy(-1);
    }

    /**
     * Converts the tile key into a string for using in REST API calls.
     *
     * @returns If the tile is the root tile, the quadkey is '-'. Otherwise the string is a number to the
     * base of 4, but without the leading 1, with the following properties:
     *  1. the number of digits equals the level.
     *  2. removing the last digit gives the parent tile's quadkey string, i.e. appending 0,1,2,3
     *     to a quadkey string gives the tiles's children.
     *
     * You can convert back from a quadkey string with [[fromQuadKeyString]].
     */
    public toQuadKeyString(): string {
        if (this.level === 0) {
            return "-";
        }

        let result = "";

        // tslint:disable:no-bitwise
        for (let i = this.level; i > 0; --i) {
            const mask = 1 << (i - 1);

            const col = (this.column & mask) !== 0;
            const row = (this.row & mask) !== 0;

            if (col && row) {
                result += "3";
            } else if (row) {
                result += "2";
            } else if (col) {
                result += "1";
            } else {
                result += "0";
            }
        }
        // tslint:enable:no-bitwise

        return result;
    }

    /**
     * Returns the absolute quadkey that is constructed from its sub quadkey.
     *
     * @param sub The sub key.
     * @returns The absolute tile key in the quadtree.
     */
    public addedSubKey(sub: string): TileKey {
        const subQuad = TileKey.fromQuadKeyString(sub.length === 0 ? "-" : sub);
        const child = this.changedLevelBy(subQuad.level);
        return TileKey.fromRowColumnLevel(
            child.row + subQuad.row,
            child.column + subQuad.column,
            child.level
        );
    }

    /**
     * Returns a new tile key at a level that differs from this tile's level by delta.
     *
     * Note - root key is returned if `delta` is smaller than the level of this tile key.
     *
     * @param delta The numeric difference between the current level and the requested level.
     */
    public changedLevelBy(delta: number): TileKey {
        if (delta === 0) {
            return this;
        }

        const level = Math.max(0, this.level + delta);
        let row = this.row;
        let column = this.column;

        // tslint:disable:no-bitwise
        if (delta >= 0) {
            row <<= delta;
            column <<= delta;
        } else {
            row >>>= -delta;
            column >>>= -delta;
        }
        // tslint:enable:no-bitwise
        return TileKey.fromRowColumnLevel(row, column, level);
    }

    /**
     * Converts the tile key to a numeric code representation.
     *
     * You can create a tile key from a numeric Morton code with [[fromMortonCode]].
     *
     * Note - only levels <= 26 are supported.
     */
    public toMortonCode(): number {
        if (this.m_mortonCode === undefined) {
            let column = this.column;
            let row = this.row;

            // tslint:disable:no-bitwise
            let result = powerOfTwo[this.level << 1];
            for (let i = 0; i < this.level; ++i) {
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

            this.m_mortonCode = result;
        }
        return this.m_mortonCode;
    }

    /**
     * Returns a sub quadkey that is relative to its parent.
     *
     * This function can be used to generate sub keys that are relative to a parent that is delta
     * levels up in the quadtree.
     *
     * This function can be used to create shortened keys for quads on lower levels if the parent is
     * known.
     *
     * Note - the sub quadkeys fit in a 16-bit unsigned integer if the `delta` is smaller than 8. If
     * `delta` is smaller than 16, the sub quadkey fits into an unsigned 32-bit integer.
     *
     * Deltas larger than 16 are not supported.
     *
     * @param delta The number of levels relative to its parent quadkey. Must be greater or equal to
     * 0 and smaller than 16.
     * @returns The quadkey relative to its parent that is `delta` levels up the tree.
     */
    public getSubHereTile(delta: number): string {
        const key = this.toMortonCode();
        // tslint:disable-next-line:no-bitwise
        const msb = 1 << (delta * 2);
        const mask = msb - 1;
        // tslint:disable-next-line:no-bitwise
        const result = (key & mask) | msb;
        return result.toString();
    }

    /**
     * Equality operator.
     *
     * @param qnr The tile key to compare to.
     * @returns `true` if this tile key has identical row, column and level, `false` otherwise.
     */
    equals(qnr: TileKey): boolean {
        return (
            this.row === qnr.row &&
            this.column === qnr.column &&
            this.level === qnr.level
        );
    }
}

/** @hidden */
const SUBTILES_COUNT = 4;

/** @hidden */
const powerOfTwo = [
    // tslint:disable: no-magic-numbers
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
