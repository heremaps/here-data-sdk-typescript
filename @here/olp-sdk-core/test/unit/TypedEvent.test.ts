/*
 * Copyright (C) 2021 HERE Europe B.V.
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
import { TypedEvent } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

describe("TypedEvent", function() {
    it("on", function() {
        const event = new TypedEvent<number>();
        const subscribtion = event.on(res => {
            expect(res).equals(4);
        });

        expect(subscribtion.dispose).not.to.be.undefined;

        event.emit(4);
    });

    it("off", function() {
        const event = new TypedEvent<number>();
        let handlerCalls = 0;
        const subscribtion = event.on(() => {
            handlerCalls++;
        });

        event.emit(4);
        subscribtion.dispose();
        event.emit(4);

        expect(handlerCalls).equals(1);
    });

    it("off with empty listeners should not be crashed", function() {
        const event = new TypedEvent<number>();
        event.off(() => true);
        assert(event !== undefined);
    });
});
