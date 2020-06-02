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
 * Provides more usable errors from the HERE platform Services.
 * 
 * This class is used in the methods
 * to propagate errors with an HTTP status code and with a message
 * if something goes wrong during the request.
 * The `HttpError` class extends generic `Error` class from V8 and
 * adds property code to the HTTP statuses.
 */
export class HttpError extends Error {
    /** A name of the error type. The initial value is `Error`. */
    public readonly name: string;

    /**
     * Constructs the `HttpError` instance.
     *
     * @param status The error status number.
     * @param message A human-readable description of the error.
     */
    constructor(public status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }

    /**
     * Checks if the given error is an HTTP error.
     *
     * @param error The `Error` object that is checked.
     * @returns True is the given error is an HTTP error; false otherwise.
     */
    public static isHttpError(error: any): error is HttpError {
        return error.name === "HttpError";
    }
}
