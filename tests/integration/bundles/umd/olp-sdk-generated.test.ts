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

import { jsLoaderFactory } from "./utils";
import { OlpSdkDataserviceApiTestCases } from "./olp-sdk-dataservice-api-testCases";
import { OlpSdkAuthenticationTestCases } from "./olp-sdk-authentication-testCases";
import { OlpSdkDataserviceReadTestCases } from "./olp-sdk-dataservice-read-testCases";

describe("Test generated olp-edge-datastore-api", () => {
  before(jsLoaderFactory({path: "@here/olp-sdk-dataservice-api/bundle.umd.min.js"}));

  OlpSdkDataserviceApiTestCases.forEach(testCase => {
    it(testCase.it, testCase.callback);
  });
});

describe("Test generated olp-edge-datastore-read", () => {
  before(jsLoaderFactory({path: "@here/olp-sdk-dataservice-read/bundle.umd.min.js"}));

  OlpSdkDataserviceReadTestCases.forEach(testCase => {
    it(testCase.it, testCase.callback);
  });
});

describe("Test generated olp-sdk-authentication", () => {
  before(jsLoaderFactory({path: "@here/olp-sdk-authentication/bundle.umd.dev.js"}));

  OlpSdkAuthenticationTestCases.forEach(testCase => {
    it(testCase.it, testCase.callback);
  });
});
