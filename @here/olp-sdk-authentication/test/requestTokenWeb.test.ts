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
import { requestToken } from "../index.web";

import fetchMock = require("fetch-mock");

const REPLY_TIMEOUT_MS = 600;

/**
 * Mock browsers features, used in requestToken for web.
 * @see ../lib/requestToken.web.ts
 */
declare var global: any;
global.crypto = {
    subtle: {
        importKey: () => "mocked-key",
        // tslint:disable-next-line: no-magic-numbers
        sign: () => Promise.resolve(new ArrayBuffer(162))
    },
    getRandomValues: () => new Uint8Array()
};

global.btoa = () => "mocked-btoa-string";

describe("oauth-request-offline", () => {
    const mock_token = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsIm";
    const mock_id = "Tt7wZRTAar";
    const mock_secret = "khcy1LMBtMZsRVn1-dn7riw9x8";

    beforeEach(() => {
        fetchMock.config.overwriteRoutes = true;
        fetchMock.post("https://account.api.here.com/oauth2/token", {
            accessToken: mock_token,
            tokenType: "bearer",
            expiresIn: 3599
        });
    });

    afterEach(() => {
        fetchMock.reset();
    });

    it("requestTokenWeb", async () => {
        const consumerKey = "key";
        const secretKey = "secret";

        const reply = await requestToken({
            url: "https://account.api.here.com/oauth2/token",
            consumerKey,
            secretKey
        });

        assert.strictEqual(reply.tokenType, "bearer");
        assert.isAbove(reply.expiresIn, REPLY_TIMEOUT_MS);
        assert.isNotEmpty(reply.accessToken);
    });
});
