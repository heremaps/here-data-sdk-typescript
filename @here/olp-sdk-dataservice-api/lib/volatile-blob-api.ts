/*
 * Copyright (C) 2019-2022 HERE Europe B.V.
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
 * Volatile Blob API v1
 * The `volatile-blob` service supports the upload and retrieval of volatile data from the storage of a catalog.
 * Each discrete chunk of data is stored as a blob (Binary Large Object).
 * Each blob has its own unique id (data handle) which is stored as partition metadata.
 * To get a partition's data, you first use `metadata` service to retrieve
 * the partition's metadata (data handle) with the addresses of the relevant blobs.
 * You then use those addresses to pull the data using the `volatile-blob` service.
 * Unlike the `blob` service, data handles can be overwritten. Hence the volatile aspect.
 *
 * OpenAPI spec version: 1.0.1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Do not edit the class manually.
 */

import { RequestBuilder, RequestOptions, UrlBuilder } from "./RequestBuilder";

/**
 * HTTP unauthenticated error message thrown by the service.
 */
export interface AuthenticationMessage {
    /**
     * Error message
     */
    error?: string;
    /**
     * Error description
     */
    errorDescription?: string;
}

/**
 * HTTP unauthorized error message thrown by the service.
 */
export interface AuthorizationMessage {
    /**
     * Error message
     */
    error?: string;
    /**
     * Error description
     */
    errorDescription?: string;
}

/* ===================================================================
 * VolatileBlobApi
 */

/**
 * Checks if a volatile blob exists for the requested data handle.
 *
 * @summary Checks if a data handle exists
 * @param layerId The ID of the layer that the volatile blob belongs to.
 * @param dataHandle The data handle identifies a specific volatile blob so that you can get that blob&#39;s contents.
 * @param billingTag Billing Tag is an optional free-form tag which is used for grouping billing records together.
 * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters  [A-Za-z0-9].
 * Grouping billing records by billing tag will be available in future releases.
 */
export async function checkHandleExists(
    builder: RequestBuilder,
    params: {
        layerId: string;
        dataHandle: string;
        billingTag?: string;
    }
): Promise<string> {
    const baseUrl = "/layers/{layerId}/data/{dataHandle}"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{dataHandle}", UrlBuilder.toString(params["dataHandle"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("billingTag", params["billingTag"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "HEAD",
        headers
    };

    return builder.request<string>(urlBuilder, options);
}

/**
 * Deletes a volatile data blob from the underlying storage mechanism (volume).
 *
 * @summary Deletes a volatile data blob
 * @param layerId The ID of the layer that the volatile data blob belongs to.
 * @param dataHandle The data handle (ID) represents an identifier for the volatile data blob which contents will be deleted.
 * @param billingTag Billing Tag is an optional free-form tag which is used for grouping billing records together.
 * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters  [A-Za-z0-9].
 * Grouping billing records by billing tag will be available in future releases.
 */
export async function deleteVolatileBlob(
    builder: RequestBuilder,
    params: {
        layerId: string;
        dataHandle: string;
        billingTag?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/data/{dataHandle}"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{dataHandle}", UrlBuilder.toString(params["dataHandle"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("billingTag", params["billingTag"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "DELETE",
        headers
    };

    return builder.requestBlob(urlBuilder, options);
}

/**
 * Retrieves a volatile data blob from storage.
 *
 * @summary Gets a volatile blob
 * @param layerId The ID of the parent layer for this volatile data blob.
 * @param dataHandle The data handle identifies a specific volatile data blob so that you can get that blob&#39;s contents.
 * @param billingTag Billing Tag is an optional free-form tag which is used for grouping billing records together.
 * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
 * Grouping billing records by billing tag will be available in future releases.
 */
export async function getVolatileBlob(
    builder: RequestBuilder,
    params: {
        layerId: string;
        dataHandle: string;
        billingTag?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/data/{dataHandle}"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{dataHandle}", UrlBuilder.toString(params["dataHandle"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("billingTag", params["billingTag"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.requestBlob(urlBuilder, options);
}

/**
 * Persists the volatile data blob in the underlying storage mechanism (volume).
 *
 * @summary Publishes a volatile data blob
 * @param layerId The ID of the layer that the volatile data blob belongs to.
 * @param dataHandle The data handle (ID) represents an identifier for the volatile data blob.
 * @param body The data to upload as part of the blob. Size limit: 2 MB
 * @param billingTag Billing Tag is an optional free-form tag which is used for grouping billing records together.
 * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters  [A-Za-z0-9].
 * Grouping billing records by billing tag will be available in future releases.
 */
export async function putVolatileBlob(
    builder: RequestBuilder,
    params: {
        layerId: string;
        dataHandle: string;
        body: string;
        billingTag?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/data/{dataHandle}"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{dataHandle}", UrlBuilder.toString(params["dataHandle"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("billingTag", params["billingTag"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "PUT",
        headers
    };
    headers["Content-Type"] = "application/json";
    if (params["body"] !== undefined) {
        options.body = JSON.stringify(params["body"]);
    }

    return builder.requestBlob(urlBuilder, options);
}
