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

import { assert } from "chai";

const workerScript = `
    setTimeout( () => {
        const msg = 200;
        self.postMessage(msg);
    }, 200);
`;

const workerDefined =
    typeof Worker !== "undefined" && typeof Blob !== "undefined";
const describeWithWorker = workerDefined ? describe : xdescribe;

describeWithWorker("WebWorker without external network call ", () => {
    it("#fetchCatalog simulated", done => {
        // Arrange / Act
        assert.isDefined(Blob);
        const blob = new Blob([workerScript], {
            type: "application/javascript"
        });
        assert.isTrue(blob.size > 0);

        const worker = new Worker(URL.createObjectURL(blob));
        worker.addEventListener("message", msg => {
            if (msg.data === 200) {
                done();
            } else {
                done(new Error(JSON.stringify(msg.data)));
            }
        });
    });
});
