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

// tslint:disable:only-arrow-functions
//    Mocha discourages using arrow functions, see https://mochajs.org/#arrow-functions

import { assert } from "chai";
import { TileKey } from "@here/olp-sdk-core";

describe("TileKey", function() {
    it("largeNumberDivision", function() {
        // make sure that dividing by a large number by 2 actually produces correct results
        let x = Math.pow(2, 52);
        for (let i = 51; i > 0; --i) {
            x /= 2;
            assert.strictEqual(x, Math.pow(2, i), `power of ${i}`);
        }
    });

    it("getSubHereTile", function() {
        assert.strictEqual(
            "4",
            TileKey.fromRowColumnLevel(2, 2, 2).getSubHereTile(1)
        );
        assert.strictEqual(
            "5",
            TileKey.fromRowColumnLevel(2, 3, 2).getSubHereTile(1)
        );
        assert.strictEqual(
            "6",
            TileKey.fromRowColumnLevel(3, 2, 2).getSubHereTile(1)
        );
        assert.strictEqual(
            "7",
            TileKey.fromRowColumnLevel(3, 3, 2).getSubHereTile(1)
        );
    });

    it("toQuadKeyString", function() {
        assert.strictEqual(
            "30",
            TileKey.fromRowColumnLevel(2, 2, 2).toQuadKeyString()
        );
        assert.strictEqual(
            "31",
            TileKey.fromRowColumnLevel(2, 3, 2).toQuadKeyString()
        );
        assert.strictEqual(
            "32",
            TileKey.fromRowColumnLevel(3, 2, 2).toQuadKeyString()
        );
        assert.strictEqual(
            "33",
            TileKey.fromRowColumnLevel(3, 3, 2).toQuadKeyString()
        );
        assert.strictEqual(
            "1331132012123",
            TileKey.fromRowColumnLevel(3275, 8085, 13).toQuadKeyString()
        );
        assert.strictEqual(
            "-",
            TileKey.fromRowColumnLevel(0, 0, 0).toQuadKeyString()
        );
    });

    it("fromQuadKeyString", function() {
        assert.isTrue(
            TileKey.fromQuadKeyString("30").equals(
                TileKey.fromRowColumnLevel(2, 2, 2)
            )
        );
        assert.isTrue(
            TileKey.fromQuadKeyString("31").equals(
                TileKey.fromRowColumnLevel(2, 3, 2)
            )
        );
        assert.isTrue(
            TileKey.fromQuadKeyString("32").equals(
                TileKey.fromRowColumnLevel(3, 2, 2)
            )
        );
        assert.isTrue(
            TileKey.fromQuadKeyString("33").equals(
                TileKey.fromRowColumnLevel(3, 3, 2)
            )
        );
        assert.isTrue(
            TileKey.fromQuadKeyString("1331132012123").equals(
                TileKey.fromRowColumnLevel(3275, 8085, 13)
            )
        );
        assert.isTrue(
            TileKey.fromQuadKeyString("-").equals(
                TileKey.fromRowColumnLevel(0, 0, 0)
            )
        );
    });

    it("columnsCount", function() {
        assert.strictEqual(8, TileKey.columnsCount(3));
        assert.strictEqual(8192, TileKey.columnsCount(13));
    });

    it("rowsCount", function() {
        assert.strictEqual(8, TileKey.rowsCount(3));
        assert.strictEqual(8192, TileKey.rowsCount(13));
    });

    it("parent", function() {
        assert.isTrue(
            TileKey.fromRowColumnLevel(1637, 4042, 12).equals(
                TileKey.fromMortonCode(100000155).parent()
            )
        );
    });

    it("addedSubKey", function() {
        assert.isTrue(
            TileKey.fromRowColumnLevel(10, 15, 4).equals(
                TileKey.fromRowColumnLevel(2, 3, 2).addedSubKey("31")
            )
        );
    });

    it("changedLevelBy", function() {
        assert.isTrue(
            TileKey.fromRowColumnLevel(2, 3, 2).equals(
                TileKey.fromRowColumnLevel(2, 3, 2).changedLevelBy(0)
            )
        );
        assert.isTrue(
            TileKey.fromRowColumnLevel(40, 60, 6).equals(
                TileKey.fromRowColumnLevel(10, 15, 4).changedLevelBy(2)
            )
        );
        assert.isTrue(
            TileKey.fromRowColumnLevel(2, 3, 2).equals(
                TileKey.fromRowColumnLevel(10, 15, 4).changedLevelBy(-2)
            )
        );
    });

    it("fromMortonCode", function() {
        assert.isTrue(
            TileKey.fromRowColumnLevel(1637, 4042, 12).equals(
                TileKey.fromMortonCode(25000038)
            )
        );
        assert.isTrue(
            TileKey.fromRowColumnLevel(3275, 8085, 13).equals(
                TileKey.fromMortonCode(100000155)
            )
        );
    });
});
