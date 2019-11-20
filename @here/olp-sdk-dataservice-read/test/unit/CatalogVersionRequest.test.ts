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

import { CatalogVersionRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogVersionRequest", () => {
    const mockedStartVersion = 13;
    const mockedEndVersion = 42;

    it("Should initialize", () => {
        const catalogVersionRequest = new CatalogVersionRequest();

        assert.isDefined(catalogVersionRequest);
        expect(catalogVersionRequest).be.instanceOf(CatalogVersionRequest);
    });

    it("Should set parameters", () => {
        const catalogVersionRequest = new CatalogVersionRequest();

        const catalogStartVersion = catalogVersionRequest.withStartVersion(
            mockedStartVersion
        );
        const catalogEndVersion = catalogVersionRequest.withEndVersion(
            mockedEndVersion
        );

        expect(catalogStartVersion.getStartVersion()).to.be.equal(
            mockedStartVersion
        );
        expect(catalogEndVersion.getEndVersion()).to.be.equal(mockedEndVersion);
    });

    it("Should get parameters with chain", () => {
        const catalogVersionRequest = new CatalogVersionRequest()
            .withStartVersion(mockedStartVersion)
            .withEndVersion(mockedEndVersion);

        expect(catalogVersionRequest.getStartVersion()).to.be.equal(
            mockedStartVersion
        );
        expect(catalogVersionRequest.getEndVersion()).to.be.equal(
            mockedEndVersion
        );
    });
});
