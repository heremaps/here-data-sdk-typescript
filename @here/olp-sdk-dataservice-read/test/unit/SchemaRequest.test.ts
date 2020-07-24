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

import { SchemaRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SchemaRequest", function() {
    const billingTag = "billingTag";
    const mockedVersion = {
        id: "42",
        url: "http://fake.url"
    };

    it("Should initialize", function() {
        const schemaRequest = new SchemaRequest();

        assert.isDefined(schemaRequest);
        expect(schemaRequest).be.instanceOf(SchemaRequest);
    });

    it("Should set parameters", function() {
        const schemaRequest = new SchemaRequest();

        const schemaRequestWithVariant = schemaRequest.withVariant(
            mockedVersion
        );
        const schemaRequestWithBilTag = schemaRequest.withBillingTag(
            billingTag
        );

        assert.isDefined(schemaRequestWithVariant);
        assert.isDefined(schemaRequestWithBilTag);
        expect(schemaRequestWithVariant.getVariant()).to.be.equal(
            mockedVersion
        );
        expect(schemaRequestWithBilTag.getBillingTag()).to.be.equal(billingTag);
    });

    it("Should set parameters with chain", function() {
        const schemaRequest = new SchemaRequest()
            .withVariant(mockedVersion)
            .withBillingTag(billingTag);

        expect(schemaRequest.getVariant()).to.be.equal(mockedVersion);
        expect(schemaRequest.getBillingTag()).to.be.equal(billingTag);
    });
});
