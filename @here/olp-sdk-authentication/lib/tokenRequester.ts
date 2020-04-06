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

import * as fs from "fs";
import * as os from "os";
import { requestToken } from "./requestToken";

/*
 * Command line token requester
 * Usage: ./olp-sdk-authentication [server] [consumer key] [secret key]
 */

const ARG_COUNT = 3;
const HOURS_PER_DAY = 24;
const MINS_PER_HOUR = 60;
const SECS_PER_MIN = 60;

const args = process.argv.slice(2);

let url = "";
let consumerKey = "";
let secretKey = "";

function getProperty(property: string, config: string): string {
    const re = new RegExp(`^\\s*${property}\\s*=\\s*(.*)$`, "m");
    const matches = config.match(re);
    if (matches === null) {
        console.error(`Property ${property} not found in config!`);
        process.exit(1);
    }
    return matches![1];
}

if (args[0] === undefined || args[0] === "--config") {
    const configFile =
        args[0] === undefined
            ? `${os.homedir}/.here/credentials.properties`
            : args[1];
    const config = fs.readFileSync(configFile, "utf8");
    url = getProperty("here\\.token\\.endpoint\\.url", config);
    consumerKey = getProperty("here\\.access\\.key\\.id", config);
    secretKey = getProperty("here\\.access\\.key\\.secret", config);
} else if (args.length === ARG_COUNT) {
    url = args[0];
    consumerKey = args[1];
    secretKey = args[2];
} else {
    console.error("Usage: [server] [consumer key] [secret key]");
    console.error("Usage: [--config <filename>]");
    console.error(
        "<filename> : defaults to $HOME/.here/credentials.properties"
    );
    process.exit(1);
}

requestToken({
    url,
    consumerKey,
    secretKey,
    expiresIn: HOURS_PER_DAY * MINS_PER_HOUR * SECS_PER_MIN
})
    // tslint:disable-next-line:no-console
    .then(result => {
        console.log(result.accessToken);
    })
    .catch(err => {
        console.error("ERROR:", err);
        process.exit(1);
    });
