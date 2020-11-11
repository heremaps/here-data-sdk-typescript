/*
 * Copyright (C) 2020 HERE Europe B.V.
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
  UserAuth,
  requestToken,
  loadCredentialsFromFile
} from "@here/olp-sdk-authentication";

/**
 * Returns the configured instance of `UserAuth`.
 *
 * @param pathToCredentials The path to the credential.properties.
 * For instructions, see the [Register Your Application](https://developer.here.com/documentation/identity-access-management/dev_guide/topics/plat-token.html#step-1-register-your-application)
 * section in the Identity & Access Management Developer Guide.
 *
 * @returns `UserAuth` instance.
 */
export function getUserAuth(pathToCredentials: string): UserAuth {
  const credentials = loadCredentialsFromFile(pathToCredentials);
  return new UserAuth({
    tokenRequester: requestToken,
    credentials
  });
}
