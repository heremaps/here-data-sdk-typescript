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

import {
    HRN,
    OlpClientSettings,
    MultiPartUploadWrapper,
    RequestFactory,
    STATUS_CODES,
    Uuid
} from "@here/olp-sdk-core";
import {
    BlobApi,
    MetadataApi,
    PublishApi
} from "@here/olp-sdk-dataservice-api";
import {
    CancelBatchRequest,
    CheckDataExistsRequest,
    CompleteBatchRequest,
    GetBatchRequest,
    PublishSinglePartitionRequest,
    StartBatchRequest,
    UploadBlobRequest,
    UploadBlobResult,
    UploadPartitionsRequest
} from "@here/olp-sdk-dataservice-write";

/**
 * Parameters used to initialize `VersionedLayerClient`.
 */
export interface VersionedLayerClientParams {
    // An instance of the catalog [[HRN]].
    catalogHrn: HRN;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
}

/**
 * Describes a versioned layer and provides a possibility to publish data to it.
 */
export class VersionedLayerClient {
    private readonly apiVersion = "v1";

    /**
     * Creates the [[VersionedLayerClient]] instance with `VersionedLayerClientParams`.
     *
     * @param params The parameters that are used to initialize `VersionedLayerClient`.
     */
    constructor(private readonly params: VersionedLayerClientParams) {}

    /**
     * Checks whether the data handle is not used.
     *
     * Data handles must be unique within a layer across all versions.
     * If the data handle exists, generate a new one and check it again
     * to be sure that it is not present in the blob store.
     *
     * @param request `CheckDataExistsRequest` with the required params.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The `Promise` void if the data handle exists.
     * If the data handle does not exist, rejects with an HTTP response (404 status) or an HTTP error.
     */
    public async checkDataExists(
        request: CheckDataExistsRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const billingTag = request.getBillingTag();
        const layerId = request.getLayerId();
        if (!layerId) {
            return Promise.reject(
                new Error(
                    "Please provide layer id for the CheckDataExistsRequest"
                )
            );
        }

        const dataHandle = request.getDataHandle();
        if (!dataHandle) {
            return Promise.reject(
                new Error(
                    "Please provide data handle for the CheckDataExistsRequest"
                )
            );
        }

        const requestBuilder = await RequestFactory.create(
            "blob",
            "v1",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch(error =>
            Promise.reject(
                new Error(
                    `Error retrieving from cache requestBuilder for resource "${this.params.catalogHrn}" and api: blob. ${error}`
                )
            )
        );

        return BlobApi.checkBlobExistsStatus(requestBuilder, {
            layerId,
            dataHandle,
            billingTag
        });
    }

    /**
     * Gets the latest version of the catalog.
     *
     * The default value is -1. By convention -1 indicates the virtual initial version before
     * the first publication that has version 0.
     *
     * @param billingTag The free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The `Promise` of the HTTP response that contains the payload with the latest version.
     */
    public async getBaseVersion(
        billingTag?: string,
        abortSignal?: AbortSignal
    ): Promise<number> {
        const startVersion = -1;

        const builder = await RequestFactory.create(
            "metadata",
            this.apiVersion,
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.params.catalogHrn}" 
                and api: metadata.\n${err}"`
            )
        );

        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion,
            billingTag
        }).catch(err => Promise.reject(err));

        return Promise.resolve(latestVersion.version);
    }

    /**
     * Starts a new publication.
     *
     * Determines the publication type based on the provided layer IDs.
     * A publication can only consist of layer IDs that have the same layer type.
     * For example, you can have a publication for multiple versioned layers,
     * but you cannot have a single publication that publishes data to both versioned and stream layers.
     *
     * Also, you can only have one versioned-layer publication in progress at a time.
     * You cannot have multiple active publications to the same catalog for versioned layers.
     * The version dependencies request field is optional and is used for versioned layers to declare version dependencies.
     *
     * @param request The details of the batch operation that you want to start.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     */
    public async startBatch(
        request: StartBatchRequest,
        abortSignal?: AbortSignal
    ) {
        const requestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                new Error(
                    `Error retrieving from cache builder for resource "${this.params.catalogHrn}" and api: publish. ${err}`
                )
            )
        );

        const layerIds = request.getLayers();
        if (!layerIds) {
            return Promise.reject(
                new Error(
                    "Please provide layer id or ids for the StartBatchRequest"
                )
            );
        }

        return PublishApi.initPublication(requestBuilder, {
            body: {
                layerIds,
                versionDependencies: request.getVersionDependencies()
            },
            billingTag: request.getBillingTag()
        });
    }

    /**
     * Uploads one partition blob and metadata at once.
     *
     * @param request The `PublishSinglePartitionRequest` object with the needed parameters.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The `Promise` resolves if the operation was successful; rejects otherwise.
     */
    public async publishToBatch(
        request: PublishSinglePartitionRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const publishRequestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        );

        const metadata = request.getMetadata();
        const billingTag = request.getBillingTag();

        if (!metadata) {
            return Promise.reject(
                new Error(
                    "Please set metadata to the PublishSinglePartitionRequest"
                )
            );
        }

        if (!metadata.partition) {
            return Promise.reject(new Error(`Partition ID is missing`));
        }

        const data = request.getData();
        if (!data) {
            return Promise.reject(
                new Error(
                    "Please set data to the PublishSinglePartitionRequest"
                )
            );
        }

        if (!metadata.dataSize) {
            metadata.dataSize = data.byteLength;
        }

        const layerId = request.getLayerId();
        if (!layerId) {
            return Promise.reject(
                new Error(
                    "Please set layerId to the PublishSinglePartitionRequest"
                )
            );
        }

        const publicationId = request.getPublicationId();
        if (!publicationId) {
            return Promise.reject(
                new Error(
                    "Please set publicationId to the PublishSinglePartitionRequest"
                )
            );
        }

        const contentType = request.getContentType();
        if (!contentType) {
            return Promise.reject(
                new Error("Please set contentType to the UploadBlobRequest")
            );
        }

        const uploadBlobRequest = new UploadBlobRequest()
            .withLayerId(layerId)
            .withData(data)
            .withContentType(contentType);

        if (metadata.dataHandle) {
            uploadBlobRequest.withDataHandle(metadata.dataHandle);
        }

        if (billingTag) {
            uploadBlobRequest.withBillingTag(billingTag);
        }

        const contentEncoding = request.getContentEncoding();
        if (contentEncoding) {
            uploadBlobRequest.withContentEncoding(contentEncoding);
        }

        const uploadBlobResult = await this.uploadBlob(
            uploadBlobRequest,
            abortSignal
        );

        metadata.dataHandle = uploadBlobResult.getDataHandle();

        return PublishApi.uploadPartitions(publishRequestBuilder, {
            layerId,
            publicationId,
            body: {
                partitions: [metadata]
            }
        });
    }

    /**
     * Cancels the publication if it has not been submitted.
     *
     * Fails if you attempt to cancel a submitted publication.
     * This allows the specified publication to be abandoned.
     *
     * @param request The details of the cancel operation.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns True if the operation was successful; rejects with an error otherwise.
     */
    public async cancelBatch(
        request: CancelBatchRequest,
        abortSignal?: AbortSignal
    ): Promise<Response> {
        const requestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                new Error(
                    `Error retrieving from cache builder for resource "${this.params.catalogHrn}" and api: publish. ${err}`
                )
            )
        );

        const publicationId = request.getPublicationId();
        if (!publicationId) {
            return Promise.reject(
                new Error(
                    "Please provide publication id for the CancelBatchRequest"
                )
            );
        }

        return PublishApi.cancelPublication(requestBuilder, {
            publicationId,
            billingTag: request.getBillingTag()
        });
    }

    /**
     * Gets the publication details.
     *
     * @param request The details of the `GET` operation.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The publication details.
     */
    public async getBatch(
        request: GetBatchRequest,
        abortSignal?: AbortSignal
    ): Promise<PublishApi.Publication> {
        const requestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                new Error(
                    `Error retrieving builder for resource "${this.params.catalogHrn}" and api: publish. ${err}`
                )
            )
        );

        const publicationId = request.getPublicationId();
        if (!publicationId) {
            return Promise.reject(
                new Error(
                    "Please provide publication id for the GetBatchRequest"
                )
            );
        }

        return PublishApi.getPublication(requestBuilder, {
            publicationId,
            billingTag: request.getBillingTag()
        });
    }

    /**
     * Submits the publication (that is a batch) and initiates post-processing if necessary.
     *
     * You cannot modify or interrupt the publication process, so double-check the publication details before submitting it.
     *
     * The publication state becomes `Submitted` directly after submission and `Succeeded` after successful processing.
     * You can only complete a publication that is in the `Initialized` state.
     *
     * Once you trigger to complete a publication,
     * request the status of the publication regularly until the status becomes `Succeeded`.
     *
     * When you submit the publication, the metadata processing starts.
     *
     * @param request The details of the publication completion.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The `Promise` resolves if the operation was successful; rejects otherwise.
     */
    public async completeBatch(
        request: CompleteBatchRequest,
        abortSignal?: AbortSignal
    ) {
        const requestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                new Error(
                    `Error retrieving from cache builder for resource "${this.params.catalogHrn}" and api: publish. ${err}`
                )
            )
        );

        const publicationId = request.getPublicationId();
        if (!publicationId) {
            return Promise.reject(
                new Error(
                    "Please provide publication id for the CompleteBatchRequest"
                )
            );
        }

        return PublishApi.submitPublication(requestBuilder, {
            publicationId,
            billingTag: request.getBillingTag()
        });
    }

    /**
     * Uploads data to the service.
     *
     * If you are upload more than 50 MB of data,
     * the data is split into parts, and each part is uploaded individually.
     * The size of each part is 5 MB, except the last part.
     *
     * @param request The details of the data upload process.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The `Promise` resolves with `UploadBlobResult`.
     */
    public async uploadBlob(
        request: UploadBlobRequest,
        abortSignal?: AbortSignal
    ): Promise<UploadBlobResult> {
        /**
         * If the data size is less then 50 MB, we can upload all data in one request.
         * If more than 50 MB, we split the data in chunks of 5 MB and upload chunk by chunk.
         * We collect ETags from responses, and then submit all tags using the `PUT` request.
         */
        const chunkSize = 5242880; // 1024 * 1024 * 5 = 5 MB
        const maxDataSizeForOneRequestUpload = 52428800; // 1024 * 1024 * 50 = 5 Mb

        const billingTag = request.getBillingTag();
        const layerId = request.getLayerId();
        if (!layerId) {
            return Promise.reject(
                new Error("Please set layerId to the UploadBlobRequest")
            );
        }

        const contentType = request.getContentType();
        if (!contentType) {
            return Promise.reject(
                new Error("Please set contentType to the UploadBlobRequest")
            );
        }

        let dataHandle = request.getDataHandle();
        if (!dataHandle) {
            dataHandle = await this.generateDatahandle(layerId, billingTag);
        }

        const data = request.getData();
        if (!data) {
            return Promise.reject(
                new Error("Please set data to the UploadBlobRequest")
            );
        }

        const blobRequestBuilder = await RequestFactory.create(
            "blob",
            "v1",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        );

        const dataSize = data.byteLength;
        if (dataSize >= maxDataSizeForOneRequestUpload) {
            const multipartUpload = new MultiPartUploadWrapper({
                data,
                settings: this.params.settings
            });

            await multipartUpload.upload({
                blobVersion: 1,
                catalogHrn: this.params.catalogHrn.toString(),
                contentType,
                handle: dataHandle,
                layerId,
                billingTag,
                chunkSizeMB: 5,
                contentEncoding: request.getContentEncoding()
            });
        } else {
            await BlobApi.putData(blobRequestBuilder, {
                layerId,
                body: data,
                contentType,
                dataHandle,
                contentLength: dataSize,
                contentEncoding: request.getContentEncoding()
            });
        }

        return new UploadBlobResult().withDataHandle(dataHandle);
    }

    /**
     * Uploads metadata to the service.
     *
     * When all data is uploaded, you need to
     * generate metadata to represent your data inside the HERE platform.
     * At a minimum, your metadata must consist of a partition ID and the data handle that you used to upload your data.
     * For a complete description of the fields that you can set, @see [[PublishPartition]].
     *
     * The maximum number of partitions you can upload and publish in one request is 1,000.
     * If you have more than 1,000 partitions that you want to upload,
     * upload the data for the first 1,000 partitions, and
     * then upload the metadata for these 1,000 partitions.
     * Then, continue with the next set of partitions.
     * Do not wait until all data is uploaded before uploading metadata.
     * Doing so will result in poor performance.
     * Instead, upload data, then metadata, and repeat if needed until all your data and corresponding metadata is uploaded.
     *
     * @param request The details of the metadata upload process.
     * @param abortSignal The signal object that allows you to communicate with the request
     * and, if required, abort it using the `AbortController` object.
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns The `Promise` resolves with the 204 status code if the upload was successful.
     */
    public async uploadPartitions(
        request: UploadPartitionsRequest,
        abortSignal?: AbortSignal
    ) {
        const publishRequestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                new Error(
                    `Error retrieving from cache builder for resource "${this.params.catalogHrn}" and api: publish. ${err}`
                )
            )
        );

        const layerId = request.getLayerId();
        if (!layerId) {
            return Promise.reject(
                new Error("Please set layerId to the UploadPartitionsRequest")
            );
        }

        const publicationId = request.getPublicationId();
        if (!publicationId) {
            return Promise.reject(
                new Error(
                    "Please set publicationId to the UploadPartitionsRequest"
                )
            );
        }

        const partitions = request.getPartitions();
        if (!partitions) {
            return Promise.reject(
                new Error(
                    "Please set partitions to the UploadPartitionsRequest"
                )
            );
        }
        return PublishApi.uploadPartitions(publishRequestBuilder, {
            layerId,
            publicationId,
            body: partitions
        });
    }

    /**
     * Generates the UUID and uses it as a data handle.
     * A retry logic in case the data handle is already present is a loop of 3 tries,
     * and each time we generate a new UUID and retry.
     *
     * If all tries are not successful, the method rejects the `Promise` with an error.
     *
     * @param layerId The ID of the layer to check if data exist.
     * @param billingTag The free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     *
     * @returns A `Promise` with the generated data handle; otherwise, the `Promise` rejects.
     */
    private async generateDatahandle(
        layerId: string,
        billingTag?: string
    ): Promise<string> {
        const timesToGenerate = 3;
        const checkDataExistsRequest = new CheckDataExistsRequest().withLayerId(
            layerId
        );
        if (billingTag) {
            checkDataExistsRequest.withBillingTag(billingTag);
        }

        for (
            let generatingCount = 0;
            generatingCount < timesToGenerate;
            generatingCount++
        ) {
            const generatedDatahandle = Uuid.create();
            const dataExist = await this.checkDataExists(
                checkDataExistsRequest.withDataHandle(generatedDatahandle)
            ).catch(response => response.status !== STATUS_CODES.NOT_FOUND);

            if (!dataExist) {
                return generatedDatahandle;
            }
        }

        return Promise.reject(
            new Error("Please set DataHandle to the request")
        );
    }
}
