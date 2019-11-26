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

import { HRN, SchemaDetailsRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SchemaDetailsRequest", () => {
    const billingTag = "billingTag";
    const mockedHRN = HRN.fromString("hrn:here:data:::mocked-hrn");

    it("Should initialize", () => {
        const schemaDetailsRequest = new SchemaDetailsRequest();

        assert.isDefined(SchemaDetailsRequest);
        expect(schemaDetailsRequest).be.instanceOf(SchemaDetailsRequest);
    });

    it("Should set parameters", () => {
        const schemaDetailsRequest = new SchemaDetailsRequest();

        const schemaDetailsRequestWithSchema = schemaDetailsRequest.withSchema(mockedHRN);
        const schemaRequestWithBilTag = schemaDetailsRequest.withBillingTag(billingTag);

        assert.isDefined(schemaDetailsRequestWithSchema);
        assert.isDefined(schemaRequestWithBilTag);
        expect(schemaDetailsRequestWithSchema.getSchema()).to.be.equal(
            mockedHRN
        );
        expect(schemaRequestWithBilTag.getBillingTag()).to.be.equal(
            billingTag
        );
    });

    it("Should set parameters with chain", () => {
        const schemaDetailsRequest = new SchemaDetailsRequest()
            .withSchema(mockedHRN)
            .withBillingTag(billingTag);

        expect(schemaDetailsRequest.getSchema()).to.be.equal(mockedHRN);
        expect(schemaDetailsRequest.getBillingTag()).to.be.equal(billingTag);
    });
});
