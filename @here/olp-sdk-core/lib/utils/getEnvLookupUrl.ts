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

/**
 * The name of the environment that you use for work.
 * You can also pass the URL string of your local or custom environment.
 */
export type EnvironmentName =
    | "here"
    | "here-dev"
    | "here-cn"
    | "here-cn-dev"
    | "local"
    | string;

/**
 * Gets the URL string of the API Lookup Service.
 *
 * @param env The environment that you use for work. You can also pass the URL string of your local or custom environment.
 * @return Based on the specified environment, the URL string of the API Lookup Service or the URL string of the custom service.
 */
export function getEnvLookUpUrl(env: EnvironmentName): string {
    function isURL(str: string) {
        const protocol = `(?:(?:[a-z]+:)?//)`;
        const ip = `(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}`;
        const host =
            "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
        const domain =
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
        const tld = `(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?`;
        const port = "(?::\\d{2,5})?";
        // tslint:disable-next-line: quotemark
        const path = '(?:[/?#][^\\s"]*)?';
        const regex = new RegExp(
            `(?:${protocol}|www\\.)(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`
        );

        return regex.test(str.trim());
    }

    if (isURL(env)) {
        return env;
    }

    switch (env) {
        case "here-dev":
            return "https://api-lookup.data.api.platform.in.here.com/lookup/v1";
        case "here-cn":
            return "https://api-lookup.data.api.platform.hereolp.cn/lookup/v1";
        case "here-cn-dev":
            return "https://api-lookup.data.api.platform.in.hereolp.cn/lookup/v1";
        case "local":
            return "http://localhost:31005/lookup/v1";
        default:
            return "https://api-lookup.data.api.platform.here.com/lookup/v1";
    }
}
