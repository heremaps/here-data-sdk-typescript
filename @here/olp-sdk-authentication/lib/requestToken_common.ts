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

/**
 * Platform specific parts of signing a request using cryptographically
 * strong algorithms.
 */
export interface Signer {
    /**
     * Signs the data using the secret key and returns the string.
     */
    sign: (data: ArrayBufferLike, secretKey: string) => Promise<string>;
    /**
     * Returns a uid that can be used for the nonce parameter of oauth.
     */
    getRandomValues: (data: Uint8Array) => Uint8Array;
}

export interface OAuthArgs {
    url: string;
    consumerKey: string;
    secretKey: string;
    nonce?: string;
    timestamp?: number;
    expiresIn?: number;
    scope?: string;
}

/**
 * Interface for access token.
 * @param accessToken Token for access.
 * @param tokenType Type of token.
 * @param expiresIn Expiration time in miliseconds.
 */
export interface Token {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

const UID_SIZE = 16;
const MINS_PER_HOUR = 60;
const SECS_PER_MIN = 60;
const MILLISECS_PER_SEC = 1000;

async function signLatin1(
    data: string,
    secretKey: string,
    tokenSigner: Signer
): Promise<string> {
    const buf = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
        buf[i] = data.charCodeAt(i);
    }
    return tokenSigner.sign(buf.buffer, secretKey);
}

function generateUid(randomValues: Uint8Array): string {
    const pad2 = (str: string) => (str.length === 1 ? "0" + str : str);
    return randomValues.reduce(
        (result, byte) => (result += pad2(byte.toString(UID_SIZE))),
        ""
    );
}

async function getOAuthAuthorization(
    args: OAuthArgs,
    tokenSigner: Signer
): Promise<string> {
    if (args.timestamp === undefined) {
        args.timestamp = Math.floor(Date.now() / MILLISECS_PER_SEC);
    }
    if (args.nonce === undefined) {
        args.nonce = generateUid(
            tokenSigner.getRandomValues(new Uint8Array(UID_SIZE))
        );
    }

    const signatureBase =
        "POST&" +
        encodeURIComponent(args.url) +
        "&" +
        encodeURIComponent(
            `oauth_consumer_key=${args.consumerKey}&oauth_nonce=${
                args.nonce
            }&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${args.timestamp}&oauth_version=1.0`);

    const signature = await signLatin1(
        signatureBase,
        args.secretKey + "&",
        tokenSigner
    );

    return `OAuth oauth_consumer_key="${encodeURIComponent(
        args.consumerKey
    )}",oauth_nonce="${encodeURIComponent(
        args.nonce
    )}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${
        args.timestamp
    }",oauth_version="1.0",oauth_signature="${encodeURIComponent(signature)}"`;
}

export async function requestToken_common(
    args: OAuthArgs,
    tokenSigner: Signer
): Promise<Token> {
    const authorization = await getOAuthAuthorization(args, tokenSigner);

    const body = {
        grantType: "client_credentials",
        scope: args.scope,
        expiresIn:
            args.expiresIn === undefined
                ? SECS_PER_MIN * MINS_PER_HOUR
                : args.expiresIn
    };

    const headers = new Headers({
        Authorization: authorization,
        "Content-Type": "application/json"
    });

    const requestInit: any = {
        method: "POST",
        body: JSON.stringify(body) as BodyInit,
        headers
    };

    const request = await fetch(args.url, requestInit);

    if (!request.ok) {
        throw new Error(request.statusText);
    }

    return request.json();
}
