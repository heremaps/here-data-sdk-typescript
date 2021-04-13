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
import { MultiPartUploadWrapper, OlpClientSettings } from "@here/olp-sdk-core";

chai.use(sinonChai);

const assert = chai.assert;
const expect = chai.expect;

const OlpClientSettingsStub = {} as OlpClientSettings;

describe("MultiPartUploadWrapper", function() {
    it("upload", async () => {
        const wrapper = new MultiPartUploadWrapper({
            data: "test-data",
            settings: OlpClientSettingsStub
        });

        wrapper.upload({
            blobVersion: 1,
            catalogHrn: "mocked-catalog",
            contentType: "text/plain",
            handle: "mmocked-datahandle",
            layerId: "mocked-layer-id"
        });

        assert(wrapper.upload !== undefined);
    });
});
