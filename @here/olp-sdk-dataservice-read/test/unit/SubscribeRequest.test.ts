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

import { SubscribeRequest } from "../../lib";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("SubscribeRequest", function() {
    it("Should initialize", function() {
        const subscriptionRequest = new SubscribeRequest();

        assert.isDefined(subscriptionRequest);
        expect(subscriptionRequest).be.instanceOf(SubscribeRequest);
    });

    it("Should set parameters", function() {
        const mockMode = "parallel";
        const mockSubId = "1111111111";
        const mockConsumerId = "123e4567-e89b-12d3-a456-556642440000";
        const mockSubscriptionProperties = {
            enableAutoCommit: true,
            groupId: "mock-group-id",
            maxPollRecords: 42
        };

        const subscriptionRequest = new SubscribeRequest();
        const subscriptionRequestWithMode = subscriptionRequest.withMode(
            mockMode
        );
        const subscriptionRequestWithSub = subscriptionRequest.withSubscriptionId(
            mockSubId
        );
        const subscriptionRequestWithConsumerId = subscriptionRequest.withConsumerId(
            mockConsumerId
        );
        const subscriptionRequestWithSubscriptionProperties = subscriptionRequest.withSubscriptionProperties(
            mockSubscriptionProperties
        );

        expect(subscriptionRequestWithMode.getMode()).to.be.equal(mockMode);
        expect(subscriptionRequestWithSub.getSubscriptionId()).to.be.equal(
            mockSubId
        );
        expect(subscriptionRequestWithConsumerId.getConsumerId()).to.be.equal(
            mockConsumerId
        );
        expect(
            subscriptionRequestWithSubscriptionProperties.getSubscriptionProperties()
        ).to.be.equal(mockSubscriptionProperties);
    });

    it("Should get parameters with chain", function() {
        const mockMode = "parallel";
        const mockSubId = "1111111111";
        const mockConsumerId = "123e4567-e89b-12d3-a456-556642440000";
        const mockSubscriptionProperties = {
            enableAutoCommit: true,
            groupId: "mock-group-id",
            maxPollRecords: 42
        };

        const subscriptionRequest = new SubscribeRequest()
            .withMode(mockMode)
            .withSubscriptionId(mockSubId)
            .withConsumerId(mockConsumerId)
            .withSubscriptionProperties(mockSubscriptionProperties);

        expect(subscriptionRequest.getMode()).to.be.equal(mockMode);
        expect(subscriptionRequest.getSubscriptionId()).to.be.equal(mockSubId);
        expect(subscriptionRequest.getConsumerId()).to.be.equal(mockConsumerId);
        expect(subscriptionRequest.getSubscriptionProperties()).to.be.equal(
            mockSubscriptionProperties
        );
    });
});
