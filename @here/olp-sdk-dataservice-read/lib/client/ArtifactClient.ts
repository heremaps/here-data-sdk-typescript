/*
 * Copyright (C) 2019-2020 HERE Europe B.V.
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

import { OlpClientSettings, RequestFactory } from "@here/olp-sdk-core";
import { ArtifactApi } from "@here/olp-sdk-dataservice-api";
import {
    SchemaDetailsRequest,
    SchemaRequest
} from "@here/olp-sdk-dataservice-read";

/**
 * Gets schema metadata and data from the platform Artifact Service.
 */
export class ArtifactClient {
    private readonly apiVersion = "v1";

    /**
     * Constructs a new client to work with schemas data in the platform Artifact Service.
     *
     * @param settings The [[OlpClientSettings]] instance.
     * @return The [[ArtifactClient]] instance.
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Gets schema metadata.
     *
     * @param schemaDetailsRequest The [[SchemaDetailsRequest]] instance.
     * @return An object with the schema metadata.
     */
    public async getSchemaDetails(
        schemaDetailsRequest: SchemaDetailsRequest
    ): Promise<ArtifactApi.GetSchemaResponseObj> {
        const hrn = schemaDetailsRequest.getSchema();

        if (!hrn) {
            return Promise.reject(
                new Error(
                    `Please provide the schema HRN by schemaDetailsRequest.withSchema()`
                )
            );
        }

        const hrnStr = hrn.toString();
        const request = await RequestFactory.create(
            "artifact",
            this.apiVersion,
            this.settings
        ).catch(error => Promise.reject(error));

        return ArtifactApi.getSchemaUsingGET(request, {
            schemaHrn: hrnStr
        }).catch(err => Promise.reject(err));
    }

    /**
     * Gets schema data.
     *
     * @param schemaRequest The [[SchemaRequest]] instance.
     * @return A blob with the schema.
     */
    public async getSchema(schemaRequest: SchemaRequest): Promise<ArrayBuffer> {
        const variant = schemaRequest.getVariant();
        if (!variant) {
            return Promise.reject(
                new Error(
                    `Please provide the schema variant by schemaRequest.withVariant()`
                )
            );
        }
        const request = await RequestFactory.create(
            "artifact",
            this.apiVersion,
            this.settings
        ).catch(error => Promise.reject(error));
        const response = await ArtifactApi.getArtifactUsingGET(request, {
            artifactHrn: variant.url
        }).catch(async error => {
            const messages: { [key: number]: string } = {
                400: "Bad request",
                401: "You are not authorized to view the schema",
                403: "Accessing the schema is forbidden",
                404: "The schema was not found",
                500: "Internal server error"
            };
            const message = error.statusText || messages[error.status];
            return Promise.reject(
                new Error(
                    `Artifact Service error: HTTP ${error.status}: ${message}`
                )
            );
        });
        return response.arrayBuffer();
    }
}
