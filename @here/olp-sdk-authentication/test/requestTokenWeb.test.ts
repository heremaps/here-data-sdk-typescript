/*
 * Copyright (C) 2019-2026 HERE Europe B.V.
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

import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
    assert
} from "vitest";
import { requestToken } from "../index.web";

import { SENT_WITH_PARAM } from "@here/olp-sdk-core/lib";
import fetchMock from "fetch-mock";

const REPLY_TIMEOUT_MS = 600;

/**
 * Mock browsers features, used in requestToken for web.
 * @see ../lib/requestToken.web.ts
 */
declare var global: any;
Object.defineProperty(global, "crypto", {
    configurable: true,
    writable: true,
    value: {
        subtle: {
            importKey: () => "mocked-key",
            sign: () => Promise.resolve(new ArrayBuffer(162))
        },
        getRandomValues: () => new Uint8Array()
    }
});

global.btoa = () => "mocked-btoa-string";

describe("oauth-request-offline", function () {
    const mock_token = "eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsIm";

    beforeEach(function () {
        fetchMock.mockGlobal();
        fetchMock.post(
            "https://account.api.here.com/oauth2/token?" + SENT_WITH_PARAM,
            {
                accessToken: mock_token,
                tokenType: "bearer",
                expiresIn: 3599
            }
        );
    });

    afterEach(function () {
        fetchMock.hardReset();
    });

    it("requestTokenWeb", async function () {
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

    it("requestTokenWebInsecureContext", async function () {
        const secureCrypto = global.crypto;
        // Browsers expose `crypto.subtle` only over https, and the request
        // cannot be signed without it.
        Object.defineProperty(global, "crypto", {
            configurable: true,
            writable: true,
            value: {
                getRandomValues: () => new Uint8Array()
            }
        });

        try {
            await expect(
                requestToken({
                    url: "https://account.api.here.com/oauth2/token",
                    consumerKey: "key",
                    secretKey: "secret"
                })
            ).rejects.toThrow(
                "Failed to sign request: 'crypto.subtle' is undefined in insecure contexts."
            );
        } finally {
            Object.defineProperty(global, "crypto", {
                configurable: true,
                writable: true,
                value: secureCrypto
            });
        }
    });
});
