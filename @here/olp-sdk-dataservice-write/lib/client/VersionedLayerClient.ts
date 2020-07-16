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
 * Parameters for use to initialize VolatileLayerClient.
 */
export interface VersionedLayerClientParams {
    // [[HRN]] instance of the catalog hrn.
    catalogHrn: HRN;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
}

/**
 * Describes a versioned layer and provides the possibility to push the data to the versioned layers.
 */
export class VersionedLayerClient {
    private readonly apiVersion = "v1";

    /**
     * Creates the [[VersionedLayerClient]] instance with VersionedLayerClientParams.
     *
     * @param params parameters for use to initialize VersionedLayerClient.
     */
    constructor(private readonly params: VersionedLayerClientParams) {}

    /**
     * Checks that the datahandle is not used.
     * Data handles must be unique within the layer across all versions.
     * In case data handle exists, a new one needs to be generated and checked again until
     * one is found that is not present in the blob store.
     * @param request CheckDataExistsRequest with required params.
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns A promise void if data handle exists.
     * Rejects with http response if DataHandle is not exists (404 status) or any http error.
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
     * Gets the latest version of a catalog.
     *
     * The default value is -1. By convention -1 indicates the virtual initial version before
     * the first publication that has version 0.
     *
     * @param billingTag An optional free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns A promise of the HTTP response that contains the payload with the latest version.
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
     * Initializes a new publication for publishing metadata.
     * Determines the publication type based on the provided layer IDs.
     * A publication can only consist of layer IDs that have the same layer type.
     * For example, you can have a publication for multiple layers of type versioned,
     * but you cannot have a single publication that publishes to both versioned and stream layers.
     *
     * In addition, you may only have one versioned publication in process at a time.
     * You cannot have multiple active publications to the same catalog for versioned layer types.
     * The request field versionDependencies is optional and is used for versioned layers to declare version dependencies.
     *
     * @param request details of the batch operation to start
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
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
     * @breaf Gives the user the possibility to upload one partition blob and metadata at once
     * @param request PublishSinglePartitionRequest with needed params
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Promise resolves if the operation was successful. Rejects if unsuccessful.
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
     * Cancels a publication if it has not yet been submitted.
     * Will fail if attempting to cancel a submitted publication.
     * This allows the specified publication to be abandoned.
     *
     * @param request details of the cancel operation.
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns True if the operation was successful. Rejects error if unsuccessful.
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
     * Retrieves the publication details.
     *
     * @param request details of the retrieve operation.
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
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
     * Submits the publication, resp. a batch, and initiates post processing if necessary.
     *
     * Publication state becomes `Submitted` directly after submission and `Succeeded` after successful processing.
     * Users can only complete a publication which is in state `Initialized`.
     *
     * Once the user triggered to complete a publication,
     * he must request the status of the publication regularly until the status becomes `Succeeded`.
     *
     * After submitting the publication, the metadata processing will begin.
     * You will be unable to modify or interrupt the publication process so make sure that you are ready before submitting the publication.
     *
     * @param request details of the complete publish.
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Promise resolves if the operation was successful. Rejects if unsuccessful.
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
     * Uploads data to the service
     *
     * If you are uploading more than 50 MB of data,
     * the data splits into parts and uploads each part individually.
     * The size of each part is 5 MB, except the last part.
     *
     * @param request details of the uploading data.
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Promise resolves with UploadBlobResult.
     */
    public async uploadBlob(
        request: UploadBlobRequest,
        abortSignal?: AbortSignal
    ): Promise<UploadBlobResult> {
        /**
         * If data size is less then 50Mb we can upload all data in one request
         * If more than 50Mb, we should split the data by 5Mb chunks and upload
         * chunk by chunk, colloeting ETags from responses and than submit all tags by PUT request.
         */
        const chunkSize = 5242880; // 1024 * 1024 * 5 = 5MB
        const maxDataSizeForOneRequestUpload = 52428800; // 1024 * 1024 * 50 = 50Mb

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

        const data = request.getData();
        if (!data) {
            return Promise.reject(
                new Error("Please set data to the UploadBlobRequest")
            );
        }

        let dataHandle = request.getDataHandle();
        if (!dataHandle) {
            dataHandle = await this.generateDatahandle(layerId, billingTag);
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
            const etags = [];
            let unreadBytes = dataSize;
            let readBytes = 0;
            let chunkNumber = 0;

            const multipartUploadParams: BlobApi.MultipartUploadMetadata = {
                contentType
            };

            const contentEncoding = request.getContentEncoding() as
                | BlobApi.ContentEncodingEnum
                | undefined;
            if (contentEncoding !== undefined) {
                multipartUploadParams.contentEncoding = contentEncoding;
            }

            const multipartUploadMeta = (await BlobApi.startMultipartUpload(
                blobRequestBuilder,
                {
                    dataHandle,
                    layerId,
                    body: multipartUploadParams
                }
            )) as any;

            while (unreadBytes > 0) {
                const chunk = data.slice(readBytes, readBytes + chunkSize);
                chunkNumber++;

                const uploadPartResponse = await BlobApi.doUploadPart(
                    blobRequestBuilder,
                    {
                        url: multipartUploadMeta.links.uploadPart.href,
                        body: chunk,
                        partNumber: chunkNumber,
                        contentType,
                        contentLength: chunk.byteLength
                    }
                ).catch(error => Promise.reject(error));

                const etag = uploadPartResponse.headers.get("ETag");
                if (etag) {
                    etags.push(etag);
                } else {
                    return Promise.reject(
                        new Error(
                            `Error uploading chunk ${chunkNumber}, can't read ETag from headers.`
                        )
                    );
                }
                readBytes += chunkSize;
                unreadBytes -= chunkSize;
            }

            await BlobApi.doCompleteMultipartUpload(blobRequestBuilder, {
                url: multipartUploadMeta.links.complete.href,
                parts: {
                    parts: etags.map((etag, index) => ({
                        etag,
                        number: index + 1
                    }))
                }
            });
        } else {
            await BlobApi.putData(blobRequestBuilder, {
                layerId,
                body: data,
                contentType,
                dataHandle,
                contentLength: dataSize
            });
        }

        return new UploadBlobResult().withDataHandle(dataHandle);
    }

    /**
     * Uploads metadata to the service.
     *
     * When all data have been uploaded,
     * you need to generate the metadata which will be used to represent
     * your data inside the HERE platform.
     * At a minimum, your metadata must consist of a partition ID and the data handle you used to upload your data.
     * For a complete description of the fields you can set, @see [[PublishPartition]].
     *
     * The maximum number of partitions you can upload and publish in one request is 1,000.
     * If you have more than 1,000 partitions you want to upload,
     * upload the data for the first 1,000 partitions
     * then upload the metadata for those 1,000 partitions.
     * Then, continue to the next set of partitions.
     * Do not wait until all data is uploaded before uploading metadata.
     * Doing so will result in poor performance.
     * Instead, upload data, then metadata, and repeat as needed until all your data and corresponding metadata is uploaded.
     *
     * @param request details of the uploading metadata.
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns Promise resolves with 204 status if success.
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
     * Generates the UUID and use it as datahandle.
     * A retry logic in case datahandle is already present is a loop of 3 tries
     * and each time we generate a new UUID and retry.
     *
     * If all thies was not success, the method rejects the promise with Error.
     *
     * @param layerId The id of layer to check if data exist
     * @param billingTag An optional free-form tag which is used for grouping
     * billing records together. If supplied, it must be between 4 - 16
     * characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     *
     * @returns A promise with generated datahandle or rejects if was not succeed.
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
