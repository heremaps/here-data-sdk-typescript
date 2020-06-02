/*
 * Copyright (C) 2020 HERE Europe B.V.
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
import { StartBatchRequest } from "@here/olp-sdk-dataservice-write";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("StartBatchRequest", () => {
    it("Should initialize", () => {
        const request = new StartBatchRequest();

        assert.isDefined(request);
        expect(request).be.instanceOf(StartBatchRequest);
    });

    it("Should set and get parameters", () => {
        const mockedLayers = ["layer-0", "layer-1", "layer-2"];
        const mockedBillingTag = "mocked-billing-tag";
        const mockedVersionDependencies = [
            {
                direct: true,
                hrn: "mocked-hrn-0",
                version: 0
            },
            {
                direct: false,
                hrn: "mocked-hrn-1",
                version: 123
            }
        ];

        const request = new StartBatchRequest()
            .withLayers(mockedLayers)
            .withVersionDependencies(mockedVersionDependencies)
            .withBillingTag(mockedBillingTag);

        expect(request.getLayers()).to.be.equal(mockedLayers);
        expect(request.getBillingTag()).to.be.equal(mockedBillingTag);
        expect(request.getVersionDependencies()).to.be.equal(
            mockedVersionDependencies
        );
    });
});
