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

import fs from "fs";

/**
 * Saves data to the file.
 *
 * @param path The path to the file.
 * @param data `Buffer` that you want to save.
 */
export function writeToFile(path: string, data: Buffer) {
  fs.writeFile(path, data, err => {
    if (err) {
      return console.log(err);
    }
    console.log(`The file ${path} was saved!`);
  });
}
