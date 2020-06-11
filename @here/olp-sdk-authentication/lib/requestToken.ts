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

import * as crypto from "crypto";
import { OAuthArgs, requestToken_common, Token } from "./requestToken_common";

async function sign(data: ArrayBufferLike, secretKey: string): Promise<string> {
    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(Buffer.from(data));
    return Promise.resolve(hmac.digest("base64"));
}

function getRandomValues(data: Uint8Array): Uint8Array {
    return crypto.randomFillSync(data);
}

/**
 * Creates an access token.
 *
 * @param args The arguments needed to get the access token.
 * @return The generated access token.
 */
export async function requestToken(args: OAuthArgs): Promise<Token> {
    return requestToken_common(args, { sign, getRandomValues });
}
