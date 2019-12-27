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

import * as PropertiesReader from "properties-reader";
import { AuthCredentials } from "./UserAuth";

/**
 * Parses the **credentials.properties** file from the
 * Open Location Platform (OLP)
 * [website](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html)
 * and retrieves an object with user credentials.
 *
 * @param path The path to the **credentials.properties** file.
 * @throws An error if the parsing is not successful.
 * @return The object with the access key ID and access key secret.
 */
export function loadCredentialsFromFile(path: string): AuthCredentials {
    const config = PropertiesReader(path);
    const configAccessKeyIdValueName = "here.access.key.id";
    const configAccessKeySecretValueName = "here.access.key.secret";

    const parseValueFromConfig = (
        value: string | number | boolean | null,
        valueName: string
    ): string => {
        if (!value) {
            throw new Error(
                `Error parsing value ${valueName} from configuration`
            );
        }

        return value.toString();
    };

    return {
        accessKeyId: parseValueFromConfig(
            config.get(configAccessKeyIdValueName),
            configAccessKeyIdValueName
        ),
        accessKeyScrt: parseValueFromConfig(
            config.get(configAccessKeySecretValueName),
            configAccessKeySecretValueName
        )
    };
}
