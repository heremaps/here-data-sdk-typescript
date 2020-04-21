/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

import { PartitionsRequest } from "../../";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("PartitionsRequest", () => {
    const billingTag = "billingTag";
    const mockedVersion = 42;
    const mockedIds = ["1", "2", "13", "42"];
    const mockedAdditionalFields = [
        "dataSize",
        "checksum",
        "compressedDataSize",
        "crc"
    ];

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
        const partitionsRequestWithBillTag = partitionsRequest.withBillingTag(
            billingTag
        );
        const partitionsRequestWithIds = partitionsRequest.withPartitionIds(
            mockedIds
        );
        const partitionsAdditionalFields = partitionsRequest.withAdditionalFields(
            ["dataSize", "checksum", "compressedDataSize", "crc"]
        );

        expect(partitionsRequestWithVersion.getVersion()).to.be.equal(
            mockedVersion
        );
        expect(partitionsRequestWithBillTag.getBillingTag()).to.be.equal(
            billingTag
        );
        expect(partitionsRequestWithIds.getPartitionIds()).to.be.equal(
            mockedIds
        );
        assert.isDefined(partitionsAdditionalFields.getAdditionalFields());
    });

    it("Should get parameters with chain", () => {
        const partitionsRequest = new PartitionsRequest()
            .withVersion(mockedVersion)
            .withBillingTag(billingTag)
            .withPartitionIds(mockedIds)
            .withAdditionalFields([
                "dataSize",
                "checksum",
                "compressedDataSize",
                "crc"
            ]);

        expect(partitionsRequest.getVersion()).to.be.equal(mockedVersion);
        expect(partitionsRequest.getBillingTag()).to.be.equal(billingTag);
        expect(partitionsRequest.getPartitionIds()).to.be.equal(mockedIds);
        assert.isDefined(partitionsRequest.getAdditionalFields());
    });

    it("Should be thrown error if additional fields are empty", () => {
        try {
            const partitionsRequest = new PartitionsRequest().withAdditionalFields(
                []
            );
        } catch (error) {
            assert.equal(
                error.message,
                "Error. Parameter 'additionalFields' could not contain empty array. Add value or do not use this method."
            );
        }
    });
});
