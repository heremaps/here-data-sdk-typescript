/*
 * Copyright (C) 2020 HERE Global B.V. and its affiliate(s).
 * All rights reserved.
 *
 * This software and other materials contain proprietary information
 * controlled by HERE and are protected by applicable copyright legislation.
 * Any use and utilization of this software and other materials and
 * disclosure to any third parties is conditional upon having a separate
 * agreement with HERE for the access, use, utilization or disclosure of this
 * software. In the absence of such agreement, the use of the software is not
 * allowed.
 */

/**
 * Stream API v2
 * The `stream` service provides the ability to consume data from a stream layer.
 * With this service you can subscribe to a stream layer and consume messages.
 *
 * OpenAPI spec version: 2.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Do not edit the class manually.
 */

import { RequestBuilder, RequestOptions, UrlBuilder } from "./RequestBuilder";

export interface BootstrapServer {
    hostname: string;
    port: number;
}

export interface CommitOffsetsRequest {
    offsets?: StreamOffset[];
}

export interface ConsumeDataResponse {
    messages: Message[];
}

export interface ConsumerSubscribeResponse {
    /**
     * A subscription/Kafka Consumer is created in a specific server instance.
     * This base URL represents the specific server node on which this subscription/Kafka Consumer was created.
     * This base URL should be used instead of the base URL returned by the `lookup` service when making requests to these
     * endpoints: /partitions, /offsets, /seek and /subscribe (DELETE).
     */
    nodeBaseURL?: string;
    subscriptionId?: string;
}

export interface ErrorResponse {
    title: string;
    status: number;
    code: string;
    cause: string;
    action: string;
    correlationId: string;
}

export interface InlineResponse401 {
    error?: string;
    errorDescription?: string;
}

export interface InlineResponse403 {
    error?: string;
    errorDescription?: string;
}

export interface ConsumerProperties {
    [key: string]: string | number | boolean;
}

export type AutoOffsetResetEnum = "latest" | "earliest" | "none";
export interface Message {
    metaData: Metadata;
    offset: StreamOffset;
}

export interface Metadata {
    /**
     * A key that specifies which
     * [Partition](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html)
     * the content is related to. This is provided by the user while producing to the stream layer.
     * The maximum length of the partition key is 500 characters.
     */
    partition: string;
    /**
     * The checksum of the content. The algorithm used to calculate the checksum is user specific.
     * Algorithms that can be used are, for example, MD5 or SHA1. This is not a secure hash, it's used only to detect changes in content.
     */
    checksum?: string;
    /**
     * The compressed size of the content in bytes.
     *  Applicable also when `Content-Encoding` is set to gzip when uploading and downloading data.
     * Note: This will be present only if ‘_dataHandle_’ field is present.
     */
    compressedDataSize?: number;
    /**
     * The nominal size in bytes of the content. When compression is enabled, this is the size of the uncompressed content.
     * Note: This will be present only if the ‘dataHandle’ field is present.
     */
    dataSize?: number;
    /**
     * The content published directly in the metadata and encoded in base64.
     * The size of the content is limited. Either `data` or `dataHandle` must be present.
     * Data Handle Example: 1b2ca68f-d4a0-4379-8120-cd025640510c.
     * Note: This will be present only if the message size is less than or equal to 1 MB.
     */
    data?: string;
    /**
     * The handle created when uploading the content. It is used to retrieve the content at a later stage.
     * Either `data` or `dataHandle` must be present. Note: This will be present only if the message size is greater than 1 MB.
     */
    dataHandle?: string;
    /**
     * The timestamp of the content, in milliseconds since the Unix epoch.
     * This can be provided by the user while producing to the stream layer.
     * Refer to [NewPartition Object](https://developer.here.com/olp/documentation/data-client-library/api_reference_scala/index.html).
     * If not provided by the user, this is the timestamp when the message was produced to the stream layer
     */
    timestamp?: number;
}

export interface SeekOffsetsRequest {
    offsets?: StreamOffset[];
}

/**
 * Information to use to connect to the stream layer.
 */
export interface StreamLayerEndpointResponse {
    kafkaProtocolVersion: KafkaProtocolVersionEnum[];
    topic: string;
    clientId: string;
    /**
     * If present, this should be used as the prefix of `group.id`
     * [Kafka Consumer properties](https://kafka.apache.org/11/documentation.html#newconsumerconfigs).
     */
    consumerGroupPrefix: string;
    bootstrapServers: BootstrapServer[];
    bootstrapServersInternal?: BootstrapServer[];
}

export type KafkaProtocolVersionEnum = "0.10";
/**
 * An offset in a specific partition of the stream layer.
 */
export interface StreamOffset {
    /**
     * The partition of the stream layer for which this offset applies. It is not the same as
     * [Partitions object](https://developer.here.com/olp/documentation/data-user-guide/portal/layers/partitions.html).
     */
    partition: number;
    /**
     * The offset in the partition of the stream layer.
     */
    offset: number;
}

/**
 * ===================================================================
 *                           StreamApi
 */

/**
 * @deprecated This function will be removed by 09.2020. Please use doCommitOffsets.
 * After reading data, you should commit the offset of the last message read from each partition so
 * that your application can resume reading new messages from the correct partition in the event that there is a
 * disruption to the subscription, such as an application crash. An offset can also be useful if you delete a subscription
 * then recreate a subscription for the same layer, because the new subscription can start reading data from the offset.
 * To read messages already committed, use the /seek endpoint, then use /partitions.
 * The base path to use is the value of 'nodeBaseURL' returned from /subscribe POST request.
 *
 * @summary Commits offsets of the last message read
 * @param layerId The ID of the stream layer.
 * @param commitOffsets The offsets to commit. It should be same as the offset of the message you wish to commit.
 * Do not pass offset + 1 as mentioned in Kafka Consumer documentation. The service adds one to the offset you specify.
 * @param subscriptionId The subscriptionId received in the response of the /subscribe request (required if mode&#x3D;parallel).
 * @param mode The subscription mode of this subscriptionId (as provided in /subscribe POST API).
 * @param xCorrelationId The correlation-id (value of Response Header &#39;X-Correlation-Id&#39;) from prior step in process.
 *  See the [API Reference](https://developer.here.com/olp/documentation/data-api/api-reference.html) for the &#x60;stream&#x60; API
 */
export async function commitOffsets(
    builder: RequestBuilder,
    params: {
        layerId: string;
        commitOffsets: CommitOffsetsRequest;
        subscriptionId?: string;
        mode?: "serial" | "parallel";
        xCorrelationId?: string;
    }
): Promise<any> {
    const baseUrl = "/layers/{layerId}/offsets".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("subscriptionId", params["subscriptionId"]);
    urlBuilder.appendQuery("mode", params["mode"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "PUT",
        headers
    };
    headers["Content-Type"] = "application/json";
    if (params["commitOffsets"] !== undefined) {
        options.body = JSON.stringify(params["commitOffsets"]);
    }
    if (params["xCorrelationId"] !== undefined) {
        headers["X-Correlation-Id"] = params["xCorrelationId"] as string;
    }
    return builder.request<any>(urlBuilder, options);
}

/**
 * After reading data, you should commit the offset of the last message read from each partition so
 * that your application can resume reading new messages from the correct partition in the event that there is a
 * disruption to the subscription, such as an application crash. An offset can also be useful if you delete a subscription
 * then recreate a subscription for the same layer, because the new subscription can start reading data from the offset.
 * To read messages already committed, use the /seek endpoint, then use /partitions.
 * The base path to use is the value of 'nodeBaseURL' returned from /subscribe POST request.
 *
 * @summary Commits offsets of the last message read
 * @param layerId The ID of the stream layer.
 * @param commitOffsets The offsets to commit. It should be same as the offset of the message you wish to commit.
 * Do not pass offset + 1 as mentioned in Kafka Consumer documentation. The service adds one to the offset you specify.
 * @param subscriptionId The subscriptionId received in the response of the /subscribe request (required if mode&#x3D;parallel).
 * @param mode The subscription mode of this subscriptionId (as provided in /subscribe POST API).
 * @param xCorrelationId The correlation-id (value of Response Header &#39;X-Correlation-Id&#39;) from prior step in process.
 *  See the [API Reference](https://developer.here.com/olp/documentation/data-api/api-reference.html) for the &#x60;stream&#x60; API
 */
export async function doCommitOffsets(
    builder: RequestBuilder,
    params: {
        layerId: string;
        commitOffsets: CommitOffsetsRequest;
        subscriptionId?: string;
        mode?: "serial" | "parallel";
        xCorrelationId?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/offsets".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("subscriptionId", params["subscriptionId"]);
    urlBuilder.appendQuery("mode", params["mode"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "PUT",
        headers
    };
    headers["Content-Type"] = "application/json";
    if (params["commitOffsets"] !== undefined) {
        options.body = JSON.stringify(params["commitOffsets"]);
    }
    if (params["xCorrelationId"] !== undefined) {
        headers["X-Correlation-Id"] = params["xCorrelationId"] as string;
    }
    return builder.requestBlob(urlBuilder, options);
}

/**
 * Consumes data from a layer. Returns messages from a stream layer formatted similar to a
 * [Partition object](https://developer.here.com/olp/documentation/data-client-library/api_reference_scala/index.html.Partition).
 * If the data size is less than 1 MB, the `data` field will be populated.
 * If the data size is greater than 1 MB, a data handle will be returned pointing to the object stored in the Blob store.
 * The base path to be used is the value of 'nodeBaseURL' returned from /subscribe POST request.
 *
 * @summary Consumes data from a layer
 * @param layerId The ID of the stream layer.
 * @param subscriptionId The subscriptionId received in the response of the /subscribe request (required if mode&#x3D;parallel).
 * @param mode The subscription mode of this subscriptionId (as provided in /subscribe POST API).
 * @param xCorrelationId The correlation-id (value of Response Header &#39;X-Correlation-Id&#39;) from prior step in process.
 * See the [API Reference](https://developer.here.com/olp/documentation/data-api/api-reference.html) for the &#x60;stream&#x60; API
 */
export async function consumeData(
    builder: RequestBuilder,
    params: {
        layerId: string;
        subscriptionId?: string;
        mode?: "serial" | "parallel";
        xCorrelationId?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/partitions".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("subscriptionId", params["subscriptionId"]);
    urlBuilder.appendQuery("mode", params["mode"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };
    if (params["xCorrelationId"] !== undefined) {
        headers["X-Correlation-Id"] = params["xCorrelationId"] as string;
    }

    return builder.requestBlob(urlBuilder, options);
}

/**
 * Deletes a subscription to a layer (topic). This operation removes the subscription from the service.
 * The base path to use is the value of 'nodeBaseURL' returned from /subscribe POST request.
 *
 * @summary Delete subscription to a layer
 * @param layerId The ID of the stream layer.
 * @param subscriptionId The subscriptionId received in the response of the /subscribe request (required if mode&#x3D;parallel).
 * @param mode The subscription mode of this subscriptionId (as provided in /subscribe POST API).
 * @param xCorrelationId A trace ID to use to associate this request with other requests in your process.
 * The correlation ID is the value of the response header &#x60;X-Correlation-Id&#x60; from the prior request in your process.
 * Once you use a correlation ID in a &#x60;/delete&#x60; request, do not use it again since &#x60;/delete&#x60; marks the end of a process.
 */
export async function deleteSubscription(
    builder: RequestBuilder,
    params: {
        layerId: string;
        subscriptionId?: string;
        mode?: "serial" | "parallel";
        xCorrelationId?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/subscribe".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("subscriptionId", params["subscriptionId"]);
    urlBuilder.appendQuery("mode", params["mode"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "DELETE",
        headers
    };
    if (params["xCorrelationId"] !== undefined) {
        headers["X-Correlation-Id"] = params["xCorrelationId"] as string;
    }

    return builder.requestBlob(urlBuilder, options);
}

/**
 * Returns a list of Kafka Broker URL's, client ID (required to enforce quotas), and Group ID prefix. Type is set to a consumer.
 *
 * @summary Expose the endpoint to consume the data of the layer directly
 * @param layerId The ID of the stream layer.
 */
export async function endpoint(
    builder: RequestBuilder,
    params: { layerId: string }
): Promise<StreamLayerEndpointResponse> {
    const baseUrl = "/layers/{layerId}/endpoint".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<StreamLayerEndpointResponse>(urlBuilder, options);
}

/**
 * Exposes the endpoint to use to produce and consume the data of the layer directly, per type of user - consumer or producer.
 * It returns a list of Kafka Broker URL's, client ID (required to enforce quotas), and Group ID prefix.
 *
 * @summary Exposes the endpoint to use to produce and consume the data of the layer directly
 * @param layerId The ID of the stream layer.
 * @param type Identifies whether the properties returned in the response are for a producer or consumer.
 */
export async function endpointByConsumer(
    builder: RequestBuilder,
    params: { layerId: string; type: "producer" | "consumer" }
): Promise<StreamLayerEndpointResponse> {
    const baseUrl = "/layers/{layerId}/{type}/endpoint"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{type}", UrlBuilder.toString(params["type"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<StreamLayerEndpointResponse>(urlBuilder, options);
}

/**
 * Enables you to start reading data from a specified offset.
 * You can move the message pointer to any offset in the layer (topic).
 * Message consumption will start from that offset.
 * Once you seek to an offset, there is no returning to the initial offset, unless the initial offset is saved.
 * The base path to use is the value of 'nodeBaseURL' returned from /subscribe POST request.
 *
 * @summary Seek to predefined offset.
 * @param layerId The ID of the stream layer.
 * @param seekOffsets List of offsets and offset partitions
 * @param subscriptionId The subscriptionId received in the response of the /subscribe request (required if mode&#x3D;parallel).
 * @param mode The subscription mode of this subscriptionId (as provided in /subscribe POST API).
 * @param xCorrelationId The correlation-id (value of Response Header &#39;X-Correlation-Id&#39;) from prior step in process.
 * See the [API Reference](https://developer.here.com/olp/documentation/data-store/api-reference.html) for the &#x60;stream&#x60; API
 */
export async function seekToOffset(
    builder: RequestBuilder,
    params: {
        layerId: string;
        seekOffsets: SeekOffsetsRequest;
        subscriptionId?: string;
        mode?: "serial" | "parallel";
        xCorrelationId?: string;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/seek".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("subscriptionId", params["subscriptionId"]);
    urlBuilder.appendQuery("mode", params["mode"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "PUT",
        headers
    };
    headers["Content-Type"] = "application/json";
    if (params["seekOffsets"] !== undefined) {
        options.body = JSON.stringify(params["seekOffsets"]);
    }
    if (params["xCorrelationId"] !== undefined) {
        headers["X-Correlation-Id"] = params["xCorrelationId"] as string;
    }

    return builder.requestBlob(urlBuilder, options);
}

/**
 * Enables message consumption from a specific stream layer (topic).
 * Use the base path returned from the API Lookup service. Note: For **mode = parallel**,
 * one unit of parallelism currently equals 1 MBps inbound or 2 MBps outbound, whichever is greater, rounded up to the nearest integer.
 * The number of subscriptions within the same group cannot exceed the parallelism allowed.
 * For more details see
 * [Get Data from a Stream Layer](https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/getting-data-stream.html).
 *
 * @summary Enable message consumption from a specific stream layer.
 * @param layerId The ID of the stream layer.
 * @param mode Specifies whether to use serial or parallel subscription mode. For more details see
 * [Get Data from a Stream Layer](https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/getting-data-stream.html).
 * @param subscriptionId Include this parameter if you want to look up the &#x60;nodeBaseURL&#x60; for a given subscriptionId.
 * @param consumerId The ID to use to identify this consumer. It must be unique within the consumer group.
 * If you do not provide one, the system will generate one.
 * @param subscriptionProperties One or more Kafka Consumer properties to use for this subscription. For more information, see
 * [Get Data from a Stream Layer](https://developer.here.com/olp/documentation/data-api/data_dev_guide/rest/getting-data-stream.html).
 */
export async function subscribe(
    builder: RequestBuilder,
    params: {
        layerId: string;
        mode?: "serial" | "parallel";
        subscriptionId?: string;
        consumerId?: string;
        subscriptionProperties?: ConsumerProperties;
    }
): Promise<Response> {
    const baseUrl = "/layers/{layerId}/subscribe".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("mode", params["mode"]);
    urlBuilder.appendQuery("subscriptionId", params["subscriptionId"]);
    urlBuilder.appendQuery("consumerId", params["consumerId"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "POST",
        headers
    };
    headers["Content-Type"] = "application/json";
    if (params["subscriptionProperties"] !== undefined) {
        options.body = JSON.stringify({
            kafkaConsumerProperties: params["subscriptionProperties"]
        });
    }

    return builder.requestBlob(urlBuilder, options);
}
