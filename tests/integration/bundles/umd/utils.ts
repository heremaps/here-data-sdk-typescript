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
 * Extended window object for types
 */
interface ExtendedWindow extends Window {
    puppeteerCommand(arg: {
      type: string;
      args: {
        [key: string]: string
      }[]
    }): Promise<any>;
  }

declare var window: ExtendedWindow;

/**
 * A factory for callback function for using in mocha `before` or `beforeEach` hooks.
 * Gets the path to the js file (local or web path) and injects this file to the html page, runned in the chromium.
 *
 * @param pathToJs an object with the path to the js file that should be injected.
 * It can be a local file or located on the web.
 *
 * @returns async function to be used in `before` or `beforeEach` hooks of the mocha.
 */
export function jsLoaderFactory(pathToJs: {path: string} | {url: string}): () => Promise<void> {
    return async () => {
        await window.puppeteerCommand({
            type: "addScriptTag",
            args: [pathToJs]
        });
    }
}
