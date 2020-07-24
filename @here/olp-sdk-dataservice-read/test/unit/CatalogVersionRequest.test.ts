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

import { CatalogVersionRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("CatalogVersionRequest", function() {
    const billingTag = "billingTag";
    const mockedStartVersion = 13;
    const mockedEndVersion = 42;

    it("Should initialize", function() {
        const catalogVersionRequest = new CatalogVersionRequest();

        assert.isDefined(catalogVersionRequest);
        expect(catalogVersionRequest).be.instanceOf(CatalogVersionRequest);
    });

    it("Should set parameters", function() {
        const catalogVersionRequest = new CatalogVersionRequest();

        const catalogStartVersion = catalogVersionRequest.withStartVersion(
            mockedStartVersion
        );
        const catalogEndVersion = catalogVersionRequest.withEndVersion(
            mockedEndVersion
        );
        const catalogBillTag = catalogVersionRequest.withBillingTag(billingTag);

        expect(catalogStartVersion.getStartVersion()).to.be.equal(
            mockedStartVersion
        );
        expect(catalogEndVersion.getEndVersion()).to.be.equal(mockedEndVersion);
        expect(catalogBillTag.getBillingTag()).to.be.equal(billingTag);
    });

    it("Should get parameters with chain", function() {
        const catalogVersionRequest = new CatalogVersionRequest()
            .withStartVersion(mockedStartVersion)
            .withEndVersion(mockedEndVersion)
            .withBillingTag(billingTag);

        expect(catalogVersionRequest.getStartVersion()).to.be.equal(
            mockedStartVersion
        );
        expect(catalogVersionRequest.getEndVersion()).to.be.equal(
            mockedEndVersion
        );
        expect(catalogVersionRequest.getBillingTag()).to.be.equal(billingTag);
    });
});
