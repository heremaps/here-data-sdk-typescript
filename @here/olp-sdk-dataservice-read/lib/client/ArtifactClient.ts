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

import { ArtifactApi } from "@here/olp-sdk-dataservice-api";
import {
    OlpClientSettings,
    RequestFactory,
    SchemaRequest
} from "@here/olp-sdk-dataservice-read";

export class ArtifactClient {
    private readonly apiVersion = "v1";

    /**
     * Constructs a new client to work with data
     * about schemas in the Artifact API.
     *
     * @param settings The instance of [[OlpClientSettings]]
     */
    constructor(private readonly settings: OlpClientSettings) {}

    /**
     * Get schema details.
     *
     * @param schemaHrn String representing schema HRN.
     * @returns Object with schema details.
     */
    public async getSchemaDetails(
        schemaRequest: SchemaRequest
    ): Promise<ArtifactApi.GetSchemaResponse> {
        const hrn = schemaRequest.getSchema();

        if (!hrn) {
            return Promise.reject(
                `Please provide the schema HRN by SchemaRequest.withScema()`
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
        }).catch(() => Promise.reject(`Cannot get schema details: ${hrnStr}`));
    }

    /**
     * Get schema.
     *
     * @param schemaHrn String representing schema HRN.
     * schema.
     * @returns Archive with schema.
     */
    public async getSchema(schemaRequest: SchemaRequest): Promise<ArrayBuffer> {
        const hrn = schemaRequest.getSchema();

        if (!hrn) {
            return Promise.reject(
                `Please provide the schema HRN by SchemaRequest.withScema()`
            );
        }

        const schemaDetails = await this.getSchemaDetails(schemaRequest);
        const schemaVariant = schemaDetails.variants!.find(
            variant => variant.id === "ds"
        );
        if (schemaVariant === undefined) {
            return Promise.reject(
                `URL of the schema bundle is not found: ${schemaDetails}`
            );
        }

        const hrnStr = hrn.toString();
        const request = await RequestFactory.create(
            "artifact",
            this.apiVersion,
            this.settings
        ).catch(error => Promise.reject(error));
        const response = await ArtifactApi.getArtifactUsingGET(request, {
            artifactHrn: schemaVariant.url
        }).catch(() =>
            Promise.reject(`Cannot download schema bundle: ${hrnStr}`)
        );

        if (response.status === 200) {
            return response.arrayBuffer();
        }

        const messages: { [key: number]: string } = {
            401: "You are not authorized to view the schema",
            403: "Accessing the schema is forbidden",
            404: "The schema was not found",
            500: "Internal server error"
        };
        const message = response.statusText || messages[response.status];
        return Promise.reject(
            `Artifact Service error: HTTP ${response.status}: ${message}, HRN: ${hrnStr}`
        );
    }
}
