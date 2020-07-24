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

import { QuadKeyPartitionsRequest } from "../../";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("QuadKeyPartitionsRequest", function() {
    const billingTag = "billingTag";
    const mockedVersion = 42;
    const mockedDepth = 3;
    const mockedQuadKey = {
        row: 1,
        column: 2,
        level: 3
    };

    it("Should initialize", function() {
        const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest();

        assert.isDefined(quadKeyPartitionsRequest);
        expect(quadKeyPartitionsRequest).be.instanceOf(
            QuadKeyPartitionsRequest
        );
    });

    it("Should set parameters", function() {
        const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest();
        const quadKeyPartitionsRequestWithVersion = quadKeyPartitionsRequest.withVersion(
            mockedVersion
        );
        const quadKeyPartitionsRequestWithDepth = quadKeyPartitionsRequest.withDepth(
            mockedDepth
        );
        const quadKeyPartitionsRequestWithQuadKey = quadKeyPartitionsRequest.withQuadKey(
            mockedQuadKey
        );
        const quadKeyPartitionsRequestWithBillTag = quadKeyPartitionsRequest.withBillingTag(
            billingTag
        );
        const quadKeyPartitionsRequestWithAddFields = quadKeyPartitionsRequest.withAdditionalFields(
            ["dataSize", "checksum", "compressedDataSize", "crc"]
        );

        expect(quadKeyPartitionsRequestWithVersion.getVersion()).to.be.equal(
            mockedVersion
        );
        expect(quadKeyPartitionsRequestWithDepth.getDepth()).to.be.equal(
            mockedDepth
        );
        expect(quadKeyPartitionsRequestWithQuadKey.getQuadKey()).to.be.equal(
            mockedQuadKey
        );
        expect(quadKeyPartitionsRequestWithBillTag.getBillingTag()).to.be.equal(
            billingTag
        );
        assert.isDefined(
            quadKeyPartitionsRequestWithAddFields.getAdditionalFields()
        );
    });

    it("Should get parameters with chain", function() {
        const quadKeyPartitionsRequest = new QuadKeyPartitionsRequest()
            .withVersion(mockedVersion)
            .withDepth(mockedDepth)
            .withQuadKey(mockedQuadKey)
            .withBillingTag(billingTag)
            .withAdditionalFields([
                "dataSize",
                "checksum",
                "compressedDataSize",
                "crc"
            ]);

        expect(quadKeyPartitionsRequest.getVersion()).to.be.equal(
            mockedVersion
        );
        expect(quadKeyPartitionsRequest.getDepth()).to.be.equal(mockedDepth);
        expect(quadKeyPartitionsRequest.getQuadKey()).to.be.equal(
            mockedQuadKey
        );
        expect(quadKeyPartitionsRequest.getBillingTag()).to.be.equal(
            billingTag
        );
        assert.isDefined(quadKeyPartitionsRequest.getAdditionalFields());
    });
});
