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

import { OAuthArgs, requestToken_common, Token } from "./requestToken_common";

function toBase64(buf: ArrayBuffer) {
    const buf8 = new Uint8Array(buf);
    const stringBuf = buf8.reduce(
        (data, value) => data + String.fromCharCode(value),
        ""
    );
    return btoa(stringBuf);
}

async function sign(data: ArrayBufferLike, secretKey: string): Promise<string> {
    if (crypto.subtle === undefined) {
        throw new Error(
            "Failed to sign request: 'crypto.subtle' is undefined in insecure contexts."
        );
    }

    const keyData = new ArrayBuffer(secretKey.length);
    const keyView = new Uint8Array(keyData);

    for (let i = 0; i < secretKey.length; ++i) {
        keyView[i] = secretKey.charCodeAt(i);
    }

    // tslint:disable-next-line: await-promise
    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        {
            name: "HMAC",
            hash: { name: "SHA-1" }
        },
        false,
        ["sign"]
    );

    // tslint:disable-next-line: await-promise
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        data as ArrayBuffer
    );

    return toBase64(signature);
}

function getRandomValues(data: Uint8Array): Uint8Array {
    return crypto.getRandomValues(data) as Uint8Array;
}

export async function requestToken(args: OAuthArgs): Promise<Token> {
    return requestToken_common(args, { sign, getRandomValues });
}
