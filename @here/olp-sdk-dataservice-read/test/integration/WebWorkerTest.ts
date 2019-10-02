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

const url =
    "https://hype-ci-map.catalogs.datastore.sit.api.here.com" +
    "/v2/catalog/versions/latest" +
    "?startVersion=-1" +
    "&app_id=inxaFrAWuwRedan8stuc" +
    "&app_code=duf7nLX8P4G5cKeOLlmKSg";

const script = `
    fetch("${url}").then(result => {
        self.postMessage(result.status);
    }).catch(err => {
        self.postMessage(-1);
    });
`;

const workerDefined =
    typeof Worker !== "undefined" && typeof Blob !== "undefined";
const describeWithWorker = workerDefined ? describe : xdescribe;

describeWithWorker(
    "[Integration tests] WebWorker, external network call test",
    function() {
        this.timeout(10000);

        it("fetchCatalog", done => {
            assert.isDefined(Blob);

            const blob = new Blob([script], { type: "application/javascript" });
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
    }
);
