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

import { OlpSdkDataserviceApiTestCases } from "./olp-sdk-dataservice-api-testCases";
import { OlpSdkAuthenticationTestCases } from "./olp-sdk-authentication-testCases";
import { OlpSdkDataserviceReadTestCases } from "./olp-sdk-dataservice-read-testCases";

const puppeteer = require("puppeteer");

let browser: any;
let page: any;

describe("Test generated olp-edge-datastore-api", function() {
  before(async function() {
    browser = await puppeteer.launch({
      args: ["no-sandbox", "disable-setuid-sandbox"]
    });
    page = await browser.newPage();
    await page.goto("http://localhost:8080", { waitUntil: "networkidle2" });
    await page.addScriptTag({
      path: "@here/olp-sdk-dataservice-api/bundle.umd.min.js"
    });
  });

  after(async function() {
    await browser.close();
  });

  OlpSdkDataserviceApiTestCases.forEach(testCase => {
    it(testCase.it, testCase.callback);
  });
});

describe("Test generated olp-edge-datastore-read", function() {
  before(async function() {
    browser = await puppeteer.launch({
      args: ["no-sandbox", "disable-setuid-sandbox"]
    });
    page = await browser.newPage();
    await page.addScriptTag({
      path: "@here/olp-sdk-dataservice-read/bundle.umd.min.js"
    });
    await page.goto("http://localhost:8080", { waitUntil: "networkidle2" });
  });

  after(async function() {
    await browser.close();
  });

  OlpSdkDataserviceReadTestCases.forEach(testCase => {
    it(testCase.it, testCase.callback);
  });
});

describe("Test generated olp-sdk-authentication", function() {
  before(async function() {
    browser = await puppeteer.launch({
      args: ["no-sandbox", "disable-setuid-sandbox"]
    });
    page = await browser.newPage();
    await page.addScriptTag({
      path: "@here/olp-sdk-authentication/bundle.umd.min.js"
    });
    await page.goto("http://localhost:8080", { waitUntil: "networkidle2" });
  });

  after(async function() {
    await browser.close();
  });

  OlpSdkAuthenticationTestCases.forEach(testCase => {
    it(testCase.it, testCase.callback);
  });
});
