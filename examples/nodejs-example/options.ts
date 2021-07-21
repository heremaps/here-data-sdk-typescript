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

import yargs from "yargs";
const homedir = require("os").homedir();
const path = require("path");

export const options = yargs
  .usage(`Usage: -c <catalog> -l <layer> ...optional params`)
  .option("creds", {
    alias: "credentials",
    describe: "Path to your credentials file",
    type: "string",
    default: path.join(homedir, ".here", "credentials.properties")
  })
  .option("c", {
    alias: "catalog",
    describe: "The catalog HRN",
    type: "string",
    demandOption: true
  })
  .option("l", {
    alias: "layer",
    describe: "The layer ID",
    type: "string",
    demandOption: true
  })
  .option("o", {
    alias: "output",
    describe: "Output folder for saving downloaded files",
    type: "string",
    default: process.cwd()
  })
  .option("p", {
    alias: "partitions",
    describe: "Partition IDs, separated by comma.",
    type: "string"
  })
  .option("pf", {
    alias: "partitionsFile",
    describe:
      "Path of a file which contains Partition IDs. One Partition ID per line",
    type: "string"
  })
  .option("q", {
    alias: "quadkey",
    describe:
      "For HEREtile partitioning, specify Partition by quad key in format row,column,level",
    type: "string"
  })
  .option("v", {
    alias: "catalogVersion",
    describe:
      "The version of catalog to use. The latest version is used by default",
    type: "number"
  }).argv;
