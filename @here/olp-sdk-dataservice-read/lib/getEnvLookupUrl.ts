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
 * The name of environment
 * You can also pass the url string to your local or some custom environment
 */
export type EnvironmentName =
    | "here"
    | "here-dev"
    | "here-cn"
    | "here-cn-dev"
    | "local"
    | string;

/**
 * @param env Environment to use. You can also pass the url string to your local or some custom environment
 *
 * @returns the url string to the lookup api service, based on env or url string to the custom service if passed.
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
        const path = "(?:[/?#][^\\s\"]*)?";
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
