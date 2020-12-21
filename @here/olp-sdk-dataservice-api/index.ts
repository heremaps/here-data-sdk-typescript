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

export * from "./lib/RequestBuilder";
export * from "./lib/HttpError";

import * as ArtifactApi from "./lib/artifact-api";
import * as AuthorizationAPI from "./lib/authorization-api-v1.1";
import * as BlobApi from "./lib/blob-api";
import * as ConfigApi from "./lib/config-api";
import * as CoverageApi from "./lib/coverage-api";
import * as IndexApi from "./lib/index-api";
import * as LookupApi from "./lib/lookup-api";
import * as MetadataApi from "./lib/metadata-api";
import * as PublishApi from "./lib/publish-api-v2";
import * as QueryApi from "./lib/query-api";
import * as StreamApi from "./lib/stream-api";
import * as VolatileBlobApi from "./lib/volatile-blob-api";

// tslint:disable-next-line: array-type
export type AdditionalFields = Array<
    "dataSize" | "checksum" | "compressedDataSize" | "crc"
>;

export {
    AuthorizationAPI,
    LookupApi,
    MetadataApi,
    ConfigApi,
    ArtifactApi,
    QueryApi,
    CoverageApi,
    BlobApi,
    VolatileBlobApi,
    IndexApi,
    StreamApi,
    PublishApi
};
