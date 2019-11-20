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

import sinon = require("sinon");
import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { PartitionsRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("PartitionsRequest", () => {
    const mockedVersion = 42;

    it("Should initialize", () => {
        const partitionsRequest = new PartitionsRequest();

        assert.isDefined(partitionsRequest);
        expect(partitionsRequest).be.instanceOf(PartitionsRequest);
    });

    it("Should set parameters", () => {
        const partitionsRequest = new PartitionsRequest();
        const partitionsRequestWithVersion = partitionsRequest.withVersion(
            mockedVersion
        );

        expect(partitionsRequestWithVersion.getVersion()).to.be.equal(
            mockedVersion
        );
    });

    it("Should get parameters with chain", () => {
        const partitionsRequest = new PartitionsRequest().withVersion(
            mockedVersion
        );

        expect(partitionsRequest.getVersion()).to.be.equal(mockedVersion);
    });
});
