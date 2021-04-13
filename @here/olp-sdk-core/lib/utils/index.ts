/*
 * Copyright (C) 2020-2021 HERE Europe B.V.
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
 * Status codes of HTTP responses.
 */
export enum STATUS_CODES {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    FOUND = 302,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    TO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAIBLE = 503,
    NETWORK_CONNECT_TIMEOUT = 599
}

export * from "./DataStoreDownloadManager";
export * from "./DataStoreRequestBuilder";
export * from "./DownloadManager";
export * from "./RequestBuilderFactory";
export * from "./getEnvLookupUrl";
export * from "./HRN";
export * from "./getDataSizeUtil";
export * from "./HttpError";
export * from "./FetchOptions";
export * from "./TileKey";
export * from "./Uuid";
export * from "./userAgent";
export * from "./TypedEvent";
