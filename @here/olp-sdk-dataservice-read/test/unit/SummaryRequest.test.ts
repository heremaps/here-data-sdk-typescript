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

import { HRN, SummaryRequest } from "@here/olp-sdk-dataservice-read";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SummaryRequest", () => {
    const mockedHRN = HRN.fromString("hrn:here:data:::mocked-hrn");
    const mockedLayerId = "mocked-layed-id";

    it("Should initialize", () => {
        const summaryRequest = new SummaryRequest();

        assert.isDefined(summaryRequest);
        expect(summaryRequest).be.instanceOf(SummaryRequest);
    });

    it("Should set parameters", () => {
        const summaryRequest = new SummaryRequest();
        const summaryRequestWithCatalogHrn = summaryRequest.withCatalogHrn(
            mockedHRN
        );
        const summaryRequestWithLAyerId = summaryRequest.withLayerId(
            mockedLayerId
        );

        expect(summaryRequestWithCatalogHrn.getCatalogHrn()).to.be.equal(
            mockedHRN.toString()
        );
        expect(summaryRequestWithLAyerId.getLayerId()).to.be.equal(
            mockedLayerId
        );
    });

    it("Should get parameters with chain", () => {
        const summaryRequest = new SummaryRequest()
            .withCatalogHrn(mockedHRN)
            .withLayerId(mockedLayerId);

        expect(summaryRequest.getCatalogHrn()).to.be.equal(mockedHRN.toString());
        expect(summaryRequest.getLayerId()).to.be.equal(mockedLayerId);
    });
});
