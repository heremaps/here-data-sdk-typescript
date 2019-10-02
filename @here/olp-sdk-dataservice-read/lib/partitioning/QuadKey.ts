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
 * The `QuadKey` instances are used to address a tile in a quad tree.
 *
 * A quad key is defined by a row, a column, and a level. The tree has a root at level 0, with one
 * single tile. On every level, each tile is divided into four children (therefore the name
 * quad tree).
 *
 * Within each [[level]], any particular tile is addressed with [[row]] and [[column]]. The number
 * of rows and columns in each level is 2 to the power of the level. This means: On level 0, only
 * one tile exists, columns and rows are both 1. On level 1, 4 tiles exist, in 2 rows and 2 columns.
 * On level 2 we have 16 tiles, in 4 rows and 4 columns. And so on.
 *
 * Note - as JavaScript's number type can hold 53 bits in its mantissa, only levels up to 26 can be
 * represented in the number representation returned by [[mortonCode]]().
 */
export interface QuadKey {
    readonly row: number;
    readonly column: number;
    readonly level: number;
}
