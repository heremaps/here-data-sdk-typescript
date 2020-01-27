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
 * HttpError class used to be able to provide for consumers
 * a more usable errors from services. Would be used in the methods
 * to propagate error with http status code and with a message in
 * case if something went wrong during the request.
 * The HttpError class extends generic Error class from V8 and
 * adds property code for http status.
 */
export class HttpError extends Error {
    public readonly name: string;

    /**
     * Constructs a new HttpError.
     *
     * @param status
     * @param message
     */
    constructor(public status: number, public message: string) {
        super(message);
        this.name = "HttpError";
    }
}
