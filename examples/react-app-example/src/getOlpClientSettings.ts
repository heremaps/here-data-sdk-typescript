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

import { requestToken, UserAuth } from "@here/olp-sdk-authentication";
import { OlpClientSettings } from "@here/olp-sdk-core";

function getOlpClientSettings() {
  return fetch("/credentials.json")
    .then(res => res.json())
    .then(credentials => {
      const userAuth = new UserAuth({
        tokenRequester: requestToken,
        env: "here",
        credentials
      });

      return new OlpClientSettings({
        environment: "here",
        getToken: () => userAuth.getToken()
      });
    })
    .catch(_ => {
      throw new Error(`Please create file ./public/credentials.json and add your credentials in format: { 
            "accessKeyId": "your access key id",
            "accessKeySecret": "your access key secret"
          }. 
          For more info please visit https://developer.here.com/documentation/sdk-typescript/dev_guide/topics/authenticate.html`);
    });
}

export default getOlpClientSettings;
