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

import { SeekRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SubscribeRequest", function() {
    it("Should initialize", function() {
        const seekRequest = new SeekRequest();

        assert.isDefined(seekRequest);
        expect(seekRequest).be.instanceOf(SeekRequest);
    });

    it("Should set parameters", function() {
        const mockMode = "parallel";
        const mockSubId = "1111111111";
        const mockOffsets = {
            offsets: [
                {
                    partition: 1,
                    offset: 1
                },
                {
                    partition: 2,
                    offset: 2
                }
            ]
        };

        const seekRequest = new SeekRequest();
        const seekRequestWithMode = seekRequest.withMode(mockMode);
        const seekRequestWithSub = seekRequest.withSubscriptionId(mockSubId);
        const seekRequestWithOffsets = seekRequest.withSeekOffsets(mockOffsets);

        expect(seekRequestWithMode.getMode()).to.be.equal(mockMode);
        expect(seekRequestWithSub.getSubscriptionId()).to.be.equal(mockSubId);
        expect(seekRequestWithOffsets.getSeekOffsets()).to.be.equal(
            mockOffsets
        );
    });

    it("Should get parameters with chain", function() {
        const mockMode = "parallel";
        const mockSubId = "1111111111";
        const mockOffsets = {
            offsets: [
                {
                    partition: 1,
                    offset: 1
                },
                {
                    partition: 2,
                    offset: 2
                }
            ]
        };

        const seekRequest = new SeekRequest()
            .withMode(mockMode)
            .withSubscriptionId(mockSubId)
            .withSeekOffsets(mockOffsets);

        expect(seekRequest.getMode()).to.be.equal(mockMode);
        expect(seekRequest.getSubscriptionId()).to.be.equal(mockSubId);
        expect(seekRequest.getSeekOffsets()).to.be.equal(mockOffsets);
    });
});
