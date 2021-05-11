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

import * as chai from "chai";
import sinonChai = require("sinon-chai");
import { WebData } from "../../lib/utils/multipartupload-internal/WebData";

chai.use(sinonChai);
const expect = chai.expect;

describe("WebData", function() {
    let mockedBlob: Blob;
    const mockedDataSize = 9;
    beforeEach(() => {
        mockedBlob = {
            slice: (from: number, to: number) => {
                return {
                    arrayBuffer: () =>
                        Promise.resolve(
                            Buffer.from("test-data", "utf8").slice(from, to)
                        )
                };
            },
            size: mockedDataSize
        } as any;
    });

    it("readBytes", async function() {
        const data = new WebData(mockedBlob);
        const bytes = await data.readBytes(2, 3);
        expect(bytes.byteLength).eqls(3);
        expect(bytes.toString()).eqls("st-");
    });

    it("size", function() {
        const data = new WebData(mockedBlob);
        expect(data.size()).eqls(9);
    });
});
