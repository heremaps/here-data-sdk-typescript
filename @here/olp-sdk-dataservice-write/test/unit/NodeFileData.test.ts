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

import * as sinon from "sinon";
import * as chai from "chai";
import * as fs from "fs";
import sinonChai = require("sinon-chai");
import { NodeFileData } from "../../lib/utils/multipartupload-internal/NodeFileData";

chai.use(sinonChai);
const expect = chai.expect;

describe("NodeFileData", function() {
    let fsOpen: sinon.SinonStub;

    afterEach(() => {
        fsOpen.restore();
    });

    it("readBytes", async function() {
        fsOpen = sinon.stub(fs.promises, "open").returns({
            stat: () => Promise.resolve({ size: 9 }),
            read: (
                buffer: Buffer,
                offset?: number | null,
                length?: number | null,
                position?: number | null
            ) => {
                expect(buffer.length).eqls(5);
                expect(offset).eqls(0);
                expect(length).eqls(5);
                expect(position).eqls(2);
                return Promise.resolve({
                    buffer: Buffer.from("12345", "utf-8")
                });
            }
        } as any);

        const data = await NodeFileData.fromPath("fake-filepath");
        const bytes = await data.readBytes(2, 5);
        expect(bytes.toString()).eqls("12345");

        fsOpen.restore();
        fsOpen = sinon.stub(fs.promises, "open").returns({
            stat: () => Promise.resolve({ size: 9 }),
            read: (
                buffer: Buffer,
                offset?: number | null,
                length?: number | null,
                position?: number | null
            ) => {
                expect(buffer.length).eqls(4);
                expect(offset).eqls(0);
                expect(length).eqls(4);
                expect(position).eqls(5);
                return Promise.resolve({
                    buffer: Buffer.from("12345", "utf-8")
                });
            }
        } as any);
        const data2 = await NodeFileData.fromPath("fake-filepath");
        await data2.readBytes(5, 6);
    });

    it("size", async function() {
        fsOpen = sinon.stub(fs.promises, "open").returns({
            stat: () => Promise.resolve({ size: 9 })
        } as any);
        const data = await NodeFileData.fromPath("fake-filepath");
        expect(data.size()).eqls(9);
    });

    it("closing file handle", async function() {
        let closeCalls = 0;
        fsOpen = sinon.stub(fs.promises, "open").returns({
            close: () => {
                closeCalls++;
                return Promise.resolve();
            },
            stat: () => Promise.resolve({ size: 9 })
        } as any);
        const data = await NodeFileData.fromPath("fake-filepath");
        expect(data.size()).not.undefined;
        expect(data.finally).not.undefined;

        data.finally && (await data.finally());
        expect(closeCalls).eqls(1);
    });

    it("negative test, catch wrong file path", async function() {
        try {
            await NodeFileData.fromPath("fake-filepath");
        } catch (error) {
            expect(error.message).eqls(
                "ENOENT: no such file or directory, open 'fake-filepath'"
            );
            expect(error.code).eqls("ENOENT");
        }
    });
});
