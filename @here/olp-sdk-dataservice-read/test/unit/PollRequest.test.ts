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

import { PollRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("PollRequest", function() {
    it("Should initialize", function() {
        const pollRequest = new PollRequest();

        assert.isDefined(pollRequest);
        expect(pollRequest).be.instanceOf(PollRequest);
    });

    it("Should set parameters", function() {
        const mockMode = "parallel";
        const mockSubId = "1111111111";

        const pollRequest = new PollRequest();
        const pollRequestWithMode = pollRequest.withMode(mockMode);
        const pollRequestWithSub = pollRequest.withSubscriptionId(mockSubId);

        expect(pollRequestWithMode.getMode()).to.be.equal(mockMode);
        expect(pollRequestWithSub.getSubscriptionId()).to.be.equal(mockSubId);
    });

    it("Should get parameters with chain", function() {
        const mockMode = "parallel";
        const mockSubId = "1111111111";
        const pollRequest = new PollRequest()
            .withMode(mockMode)
            .withSubscriptionId(mockSubId);

        expect(pollRequest.getMode()).to.be.equal(mockMode);
        expect(pollRequest.getSubscriptionId()).to.be.equal(mockSubId);
    });
});
