/*
 * Copyright (C) 2019-2026 HERE Europe B.V.
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
import { AuthCredentials } from "./UserAuth";

/**
 * Reads the `key = value` pairs of a **.properties** file.
 *
 * Only the subset of the format that the HERE platform emits is recognized:
 * one pair per line, blank lines, and `#` or `!` comments. The value is
 * everything after the first `=` or `:`, so values that themselves contain a
 * separator (for example base64 padding in a secret) are kept intact.
 *
 * @param path The path to the file to read.
 * @return The parsed properties, keyed by property name.
 */
function readProperties(path: string): Map<string, string> {
    const properties = new Map<string, string>();

    for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
        const entry = line.trim();

        if (
            entry.length === 0 ||
            entry.startsWith("#") ||
            entry.startsWith("!")
        ) {
            continue;
        }

        const separator = entry.search(/[=:]/);

        if (separator === -1) {
            continue;
        }

        properties.set(
            entry.slice(0, separator).trim(),
            entry.slice(separator + 1).trim()
        );
    }

    return properties;
}

/**
 * Parses the **credentials.properties** file from the
 * [HERE platform](https://developer.here.com/documentation/access-control/user-guide/topics/get-credentials.html)
 * and retrieves an object with user credentials.
 *
 * @param path The path to the **credentials.properties** file.
 * @throws An error if the parsing is not successful.
 * @return The object with the access key ID and access key secret.
 */
export function loadCredentialsFromFile(path: string): AuthCredentials {
    const config = readProperties(path);
    const configAccessKeyIdValueName = "here.access.key.id";
    const configAccessKeySecretValueName = "here.access.key.secret";

    const parseValueFromConfig = (
        value: string | undefined,
        valueName: string
    ): string => {
        if (value === undefined || value.length === 0) {
            throw new Error(
                `Error parsing value ${valueName} from configuration`
            );
        }

        return value;
    };

    return {
        accessKeyId: parseValueFromConfig(
            config.get(configAccessKeyIdValueName),
            configAccessKeyIdValueName
        ),
        accessKeySecret: parseValueFromConfig(
            config.get(configAccessKeySecretValueName),
            configAccessKeySecretValueName
        )
    };
}
