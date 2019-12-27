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

import assert = require("assert");
import { requestToken, UserAuth } from "@here/olp-sdk-authentication";

export const OlpSdkAuthenticationTestCases: {
    it: string;
    callback: () => void;
}[] = [
        {
            it: "UserAuth should be defined",
            callback: () => {
                assert(UserAuth !== undefined);
            }
        },
        {
            it: "UserAuth should be initialised",
            callback: () => {
                const userAuth = new UserAuth({
                    credentials: {
                        accessKeyId: "mocked-id",
                        accessKeyScrt: "mocked-str"
                    },
                    tokenRequester: requestToken
                });

                assert(userAuth.getToken !== undefined);
                assert(userAuth.getUserInfo !== undefined);
                assert(userAuth.validateAccessToken !== undefined);
            }
        },
        {
            it: "requestToken should be defined",
            callback: () => {
                assert(requestToken !== undefined);
            }
        }
    ];
