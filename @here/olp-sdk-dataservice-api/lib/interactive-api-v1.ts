/*
 * Copyright (C) 2021 HERE Europe B.V. and its affiliate(s).
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
 * Interactive API v1
 * Interactive API v1 is a REST API for simple access to geo data.
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 */

// tslint:disable:array-type

import { UrlBuilder, RequestBuilder, RequestOptions } from "./RequestBuilder";

export interface ApiHealthStatus {
    /**
     * Health status of API.
     */
    status?: string;
}

export interface ApiVersion {
    /**
     * Version of API.
     */
    apiVersion?: string;
}

export interface Feature extends GeoJSON {
    /**
     * The unique identifier of the feature.
     */
    id?: string;
    geometry?: GeoJSON;
    properties?: { [key: string]: any };
}

export interface FeatureCollection extends GeoJSON {
    /**
     * Features included in the collection.
     */
    features: Array<Feature>;
}

export interface FeatureCollectionIterable extends FeatureCollection {
    /**
     * The handle of the next batch.
     */
    handle?: string;
    /**
     * The token of the next batch.
     */
    nextPageToken?: string;
}

export interface FeatureCollectionModification extends FeatureCollection {
    /**
     * List of inserted feature IDs.
     */
    inserted?: Array<string>;
    /**
     * List of updated features IDs.
     */
    updated?: Array<string>;
    /**
     * List of deleted features IDs.
     */
    deleted?: Array<string>;
}

/**
 * The base type for all possible GeoJSON objects.
 */
export interface GeoJSON {
    type: string;
    /**
     * Describes the coordinate range of the GeoJSON object.
     */
    bbox?: Array<number>;
}

export interface LineString extends GeoJSON {
    coordinates?: Array<Array<number>>;
}

export interface ModelError {
    title?: string;
    status?: number;
    code?: string;
    cause?: string;
    action?: string;
    correlationId?: string;
}

export interface MultiLineString extends GeoJSON {
    coordinates?: Array<Array<Array<number>>>;
}

export interface MultiPoint extends GeoJSON {
    coordinates?: Array<Array<number>>;
}

export interface MultiPolygon extends GeoJSON {
    coordinates?: Array<Array<Array<Array<number>>>>;
}

export interface Point extends GeoJSON {
    coordinates?: Array<number>;
}

export interface Polygon extends GeoJSON {
    coordinates?: Array<Array<Array<number>>>;
}

export interface Statistics {
    count?: StatisticsCount;
    byteSize?: StatisticsCount;
    bbox?: StatisticsBbox;
    geometryTypes?: StatisticsGeometryTypes;
    properties?: StatisticsProperties;
    tags?: StatisticsTags;
    searchable?: string;
}

export interface StatisticsBbox {
    value?: Array<number>;
    estimated?: boolean;
}

export interface StatisticsCount {
    value?: number;
    estimated?: boolean;
}

export interface StatisticsGeometryTypes {
    value?: Array<string>;
    estimated?: boolean;
}

export interface StatisticsProperties {
    value?: Array<StatisticsPropertiesValue>;
    estimated?: boolean;
}

export interface StatisticsPropertiesValue {
    key?: string;
    count?: number;
    searchable?: boolean;
}

export interface StatisticsTags {
    value?: Array<StatisticsTagsValue>;
    estimated?: boolean;
}

export interface StatisticsTagsValue {
    key?: string;
    count?: number;
}

/**
 * Retrieves API Specification version information.
 */
export async function getApiVersion(
    builder: RequestBuilder
): Promise<ApiVersion> {
    const baseUrl = "/version";

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<ApiVersion>(urlBuilder, options);
}

/**
 * Tests basic health of the service.
 */
export async function getHealth(
    builder: RequestBuilder
): Promise<ApiHealthStatus> {
    const baseUrl = "/health";

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<ApiHealthStatus>(urlBuilder, options);
}

/**
 * Retrieves the feature with the provided identifier.
 *
 * @summary Get a feature by ID.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param featureId The unique identifier of a feature in the layer.
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param force2D If set to `true` the features in the response will have only X's and Y's as coordinates.
 */
export async function getFeature(
    builder: RequestBuilder,
    params: {
        layerId: string;
        featureId: string;
        selection?: string;
        force2D?: boolean;
    }
): Promise<Feature> {
    const baseUrl = "/layers/{layerId}/features/{featureId}"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{featureId}", UrlBuilder.toString(params["featureId"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("force2D", params["force2D"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<Feature>(urlBuilder, options);
}

/**
 * Returns all of the features found for the provided list of ids.
 * The response is always a FeatureCollection, even if there are no features with the provided ids.
 *
 * @summary Get features by ID.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param id A comma separated list of unique feature identifiers.
 * These are the acceptable formats for this field:
 * ```
 * id=value1,value2
 * ```
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param force2D If set to `true` the features in the response will have only X's and Y's as coordinates.
 */
export async function getFeatures(
    builder: RequestBuilder,
    params: {
        layerId: string;
        id: string;
        selection?: string;
        force2D?: boolean;
    }
): Promise<FeatureCollection> {
    const baseUrl = "/layers/{layerId}/features".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("id", params["id"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("force2D", params["force2D"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<FeatureCollection>(urlBuilder, options);
}

/**
 * Return the features which are inside a bounding box stipulated by bbox parameter.
 *
 * @summary Get features by bounding box.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param bbox Both west, south, east and north coordinates separated by comma.
 * Example: `bbox=13.082,52.416,13.628,52.626` - Bounding box of Berlin.
 *
 * @param clip If set to true the features' geometries are clipped to the geometry of the
 * tile or bounding box. Default is false.
 *
 * @param limit The maximum number of features in the response. Default is 30000. Hard limit is 100000.
 *
 * @param params Additional feature filters which compares the feature's property's value with the one specified
 * in the query, resulting in a subset of features.
 * The usage of multiple property names represents an AND operation.
 * The usage of a comma (,) separating the properties values, represents an OR operation.
 * Properties initiated with 'f.' are used to access values which are added by default in the stored feature.
 * The possible values are: 'f.id', 'f.createdAt' and 'f.updatedAt'.
 * Properties initiated with 'p.' are used to access values in the stored feature which are under the 'properties' property.
 * Use it as a shorthand accessor for 'properties' values.
 * The format should follow the specification below
 * ```
 * ?p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1
 * ```
 *
 * For example, the above query, the Features will be filtered by 'property' AND 'special property' equals to their
 * respective values.
 *
 * While in the following example ```?p.property_name_1=value_1,value_2```
 * The resulting Features list will contain all elements having `value_1` OR `value_2`.
 *
 * Additionally to the operators used in the examples above, the query can be written, with the same semantic,
 * by using the long operators: `"=gte=", "=lte=", "=gt=", "=lt=" and "=cs="`.
 *
 * The below queries yield the same result:
 * ```
 * ?p.property_name_1>=10
 * ?p.property_name_1=gte=10
 * ```
 *
 * The available operators are:
 * "=" - equals
 * "!=" - not equals
 * ">=" or "=gte=" - greater than or equals
 * "<=" or "=lte=" - less than or equals
 * ">" or "=gt=" - greater than
 * "<" or "=lt=" - less than
 * "@>" or "=cs=" - contains
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param skipCache If set to true the response is not returned from cache. Default is false.
 *
 * @param clustering The clustering algorithm to apply to the data within the result.
 * Providing this query parameter the data will be returned in a clustered way.
 * This means the data won't necessarily be returned in its original shape or with its original properties.
 * Depending on the chosen clustering algorithm there could be different mandatory and/or optional parameters
 * to specify the behavior of the algorithm.
 * Possible values are:
 *
 * `hexbin` - The hexbin algorithm divides the world in hexagonal "bins" on a specified resolution.
 * Each hexagon has an address being described by the H3 addressing scheme.
 * For more information on that topic see: https://eng.uber.com/h3/.
 *
 * `quadbin` - The quadbin algorithm takes the geometry input from the request (e.g. quadkey / bbox..)
 * and count the features in it.
 * This clustering mode works also for very large layers and can be used for getting an overview
 * where data is present in a given layer. Furthermore, a property filter on one property is applicable.
 *
 * @param clusteringParams Some parameters for the chosen clustering algorithm.
 * Depending on the chosen clustering algorithm there could be different mandatory and/or optional parameters to specify
 * the behavior of the algorithm.
 *
 * Clustering-Parameter reference.
 * NOTE: The actual query parameters in the URL are looking like: `?clustering.aParameterName=aValue`.
 *
 * Clustering-type: "hexbin":
 * There are several parameters needed by the H3 based hexbin algorithm.
 * For more information on that topic see: https://eng.uber.com/h3/.
 *
 * =======================================================================================================
 * |      Parameter       |   Type   |   Mandatory   |                      Meaning                       |
 * ========================================================================================================
 * |  absoluteResolution  |  Number  |       NO      | The H3 hexagon resolution                          |
 * --------------------------------------------------------------------------------------------------------
 * |     resolution	      |  Number  |       NO      | deprecated, renamed to absoluteResolution          |
 * --------------------------------------------------------------------------------------------------------
 * | relativeResolution   |	 Number  |       NO      | integer value [0-4] to be added to current used    |
 * |                      |          |               | resolution                                         |
 * --------------------------------------------------------------------------------------------------------
 * |       property	      |  String  |       NO	     | A property of the original features for which to   |
 * |                      |          |               | calculate statistics                               |
 * --------------------------------------------------------------------------------------------------------
 * |       pointmode	  |  Boolean |       NO	     | retuns the centroid of hexagons as geojson feature |
 * --------------------------------------------------------------------------------------------------------
 *
 *
 * @param force2D If set to `true` the features in the response will have only X's and Y's as coordinates.
 */
export async function getFeaturesByBBox(
    builder: RequestBuilder,
    params: {
        layerId: string;
        bbox?: string;
        clip?: boolean;
        limit?: number;
        params?: string;
        selection?: string;
        skipCache?: boolean;
        clustering?: string;
        clusteringParams?: string;
        force2D?: boolean;
    }
): Promise<FeatureCollection> {
    const baseUrl = "/layers/{layerId}/bbox".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("bbox", params["bbox"]);
    urlBuilder.appendQuery("clip", "true");
    urlBuilder.appendQuery("limit", params["limit"]);
    urlBuilder.appendQuery("params", params["params"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("skipCache", "true");
    urlBuilder.appendQuery("clustering", params["clustering"]);
    urlBuilder.appendQuery("clusteringParams", params["clusteringParams"]);
    urlBuilder.appendQuery("force2D", "true");

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<FeatureCollection>(urlBuilder, options);
}

/**
 * List the features which are inside the specified radius. The origin radius point is calculated
 * based either on latitude & longitude or by specifying a feature's geometry.
 *
 * @summary Get features with radius search.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param lat The latitude in WGS'84 decimal degree (-90 to +90) of the center Point.
 *
 * @param lng The longitude in WGS'84 decimal degree (-180 to +180) of the center Point.
 *
 * @param refCatalogHrn The catalog HRN where the layer containing the referenced feature is stored.
 * Always to use in combination with refFeatureId.
 *
 * @param refLayerId As alternative for defining center coordinates,
 * it is possible to reference a geometry in a layer.
 * Therefore it is needed to provide the layer id where the referenced feature is stored.
 * Always to use in combination with refFeatureId.
 *
 * @param refFeatureId The unique identifier of a feature in the referenced layer.
 * The geometry of that feature gets used for the spatial query.
 * Always to use in combination with refCatalogHrn and refLayerId.
 *
 * @param radius Radius in meter which defines the diameter of the search request.
 *
 * @param limit The maximum number of features in the response. Default is 30000. Hard limit is 100000.
 *
 * @param params Additional feature filters which compares the feature's property's value with the one specified
 * in the query, resulting in a subset of features.
 * The usage of multiple property names represents an AND operation.
 * The usage of a comma (,) separating the properties values, represents an OR operation.
 * Properties initiated with 'f.' are used to access values which are added by default in the stored feature.
 * The possible values are: 'f.id', 'f.createdAt' and 'f.updatedAt'.
 * Properties initiated with 'p.' are used to access values in the stored feature which are under the 'properties' property.
 * Use it as a shorthand accessor for 'properties' values.
 * The format should follow the specification below
 * ```
 * ?p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1
 * ```
 *
 * For example, the above query, the Features will be filtered by 'property' AND 'special property' equals to their
 * respective values.
 *
 * While in the following example ```?p.property_name_1=value_1,value_2```
 * The resulting Features list will contain all elements having `value_1` OR `value_2`.
 *
 * Additionally to the operators used in the examples above, the query can be written, with the same semantic,
 * by using the long operators: `"=gte=", "=lte=", "=gt=", "=lt=" and "=cs="`.
 *
 * The below queries yield the same result:
 * ```
 * ?p.property_name_1>=10
 * ?p.property_name_1=gte=10
 * ```
 *
 * The available operators are:
 * "=" - equals
 * "!=" - not equals
 * ">=" or "=gte=" - greater than or equals
 * "<=" or "=lte=" - less than or equals
 * ">" or "=gt=" - greater than
 * "<" or "=lt=" - less than
 * "@>" or "=cs=" - contains
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param skipCache If set to true the response is not returned from cache. Default is false.
 *
 * @param force2D If set to `true` the features in the response will have only X's and Y's as coordinates.
 */
export async function getFeaturesBySpatial(
    builder: RequestBuilder,
    params: {
        layerId: string;
        lat?: number;
        lng?: number;
        refCatalogHrn?: string;
        refLayerId?: string;
        refFeatureId?: string;
        radius?: number;
        limit?: number;
        params?: string;
        selection?: string;
        skipCache?: boolean;
        force2D?: boolean;
    }
): Promise<FeatureCollection> {
    const baseUrl = "/layers/{layerId}/spatial".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("lat", params["lat"]);
    urlBuilder.appendQuery("lng", params["lng"]);
    urlBuilder.appendQuery("refCatalogHrn", params["refCatalogHrn"]);
    urlBuilder.appendQuery("refLayerId", params["refLayerId"]);
    urlBuilder.appendQuery("refFeatureId", params["refFeatureId"]);
    urlBuilder.appendQuery("radius", params["radius"]);
    urlBuilder.appendQuery("limit", params["limit"]);
    urlBuilder.appendQuery("params", params["params"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("skipCache", params["skipCache"]);
    urlBuilder.appendQuery("force2D", params["force2D"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<FeatureCollection>(urlBuilder, options);
}

/**
 * List the features which are inside the specified radius. The origin point is calculated based
 * on the geometry provided as payload.
 *
 * @summary Get features which intersects the provided geometry.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param body A geometry request.
 *
 * @param radius Radius in meter which defines the diameter of the search request.
 *
 * @param limit The maximum number of features in the response.
 * Default is 30000. Hard limit is 100000.
 *
 * @param params Additional feature filters which compares the feature's property's value with the one specified
 * in the query, resulting in a subset of features.
 * The usage of multiple property names represents an AND operation.
 * The usage of a comma (,) separating the properties values, represents an OR operation.
 * Properties initiated with 'f.' are used to access values which are added by default in the stored feature.
 * The possible values are: 'f.id', 'f.createdAt' and 'f.updatedAt'.
 * Properties initiated with 'p.' are used to access values in the stored feature which are under the 'properties' property.
 * Use it as a shorthand accessor for 'properties' values.
 * The format should follow the specification below
 * ```
 * ?p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1
 * ```
 *
 * For example, the above query, the Features will be filtered by 'property' AND 'special property' equals to their
 * respective values.
 *
 * While in the following example ```?p.property_name_1=value_1,value_2```
 * The resulting Features list will contain all elements having `value_1` OR `value_2`.
 *
 * Additionally to the operators used in the examples above, the query can be written, with the same semantic,
 * by using the long operators: `"=gte=", "=lte=", "=gt=", "=lt=" and "=cs="`.
 *
 * The below queries yield the same result:
 * ```
 * ?p.property_name_1>=10
 * ?p.property_name_1=gte=10
 * ```
 *
 * The available operators are:
 * "=" - equals
 * "!=" - not equals
 * ">=" or "=gte=" - greater than or equals
 * "<=" or "=lte=" - less than or equals
 * ">" or "=gt=" - greater than
 * "<" or "=lt=" - less than
 * "@>" or "=cs=" - contains
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param skipCache If set to true the response is not returned from cache. Default is false.
 *
 * @param force2D If set to `true` the features in the response will have only X's and Y's as coordinates.
 */
export async function getFeaturesBySpatialPost(
    builder: RequestBuilder,
    params: {
        layerId: string;
        body?: GeoJSON;
        radius?: number;
        limit?: number;
        params?: string;
        selection?: string;
        skipCache?: boolean;
        force2D?: boolean;
    }
): Promise<FeatureCollection> {
    const baseUrl = "/layers/{layerId}/spatial".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    urlBuilder.appendQuery("radius", params["radius"]);
    urlBuilder.appendQuery("limit", params["limit"]);
    urlBuilder.appendQuery("params", params["params"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("skipCache", params["skipCache"]);
    urlBuilder.appendQuery("force2D", params["force2D"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "POST",
        headers
    };
    headers["Content-Type"] = "application/json";
    if (params["body"] !== undefined) {
        options.body = JSON.stringify(params["body"]);
    }

    return builder.request<FeatureCollection>(urlBuilder, options);
}

/**
 * Get features in tile
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param tileType The type of tile identifier.
 * Default: "quadkey".
 * Enum: "quadkey" "web" "tms" "here".
 * "quadkey" - Virtual Earth,
 * "web" - Web Mercator,
 * "tms" - OSGEO Tile Map Service,
 * "here" - Here Tile Schema.
 *
 * @param tileId The tile identifier can be provided as quadkey (1),
 * Web Mercator level,x,y coordinates (1_1_0) or OSGEO Tile Map Service level,x,y (1_1_0).
 *
 * @param clip If set to true the features' geometries are clipped to the geometry of the tile or bounding box.
 * Default is false.
 *
 * @param params Additional feature filters which compares the feature's property's value with the one specified
 * in the query, resulting in a subset of features.
 * The usage of multiple property names represents an AND operation.
 * The usage of a comma (,) separating the properties values, represents an OR operation.
 * Properties initiated with 'f.' are used to access values which are added by default in the stored feature.
 * The possible values are: 'f.id', 'f.createdAt' and 'f.updatedAt'.
 * Properties initiated with 'p.' are used to access values in the stored feature which are under the 'properties' property.
 * Use it as a shorthand accessor for 'properties' values.
 * The format should follow the specification below
 * ```
 * ?p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1
 * ```
 *
 * For example, the above query, the Features will be filtered by 'property' AND 'special property' equals to their
 * respective values.
 *
 * While in the following example ```?p.property_name_1=value_1,value_2```
 * The resulting Features list will contain all elements having `value_1` OR `value_2`.
 *
 * Additionally to the operators used in the examples above, the query can be written, with the same semantic,
 * by using the long operators: `"=gte=", "=lte=", "=gt=", "=lt=" and "=cs="`.
 *
 * The below queries yield the same result:
 * ```
 * ?p.property_name_1>=10
 * ?p.property_name_1=gte=10
 * ```
 *
 * The available operators are:
 * "=" - equals
 * "!=" - not equals
 * ">=" or "=gte=" - greater than or equals
 * "<=" or "=lte=" - less than or equals
 * ">" or "=gt=" - greater than
 * "<" or "=lt=" - less than
 * "@>" or "=cs=" - contains
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param skipCache If set to true the response is not returned from cache. Default is false.
 *
 * @param clustering The clustering algorithm to apply to the data within the result.
 * Providing this query parameter the data will be returned in a clustered way.
 * This means the data won't necessarily be returned in its original shape or with its original properties.
 * Depending on the chosen clustering algorithm there could be different mandatory and/or optional parameters
 * to specify the behavior of the algorithm.
 * Possible values are:
 *
 * `hexbin` - The hexbin algorithm divides the world in hexagonal "bins" on a specified resolution.
 * Each hexagon has an address being described by the H3 addressing scheme.
 * For more information on that topic see: https://eng.uber.com/h3/.
 *
 * `quadbin` - The quadbin algorithm takes the geometry input from the request (e.g. quadkey / bbox..)
 * and count the features in it.
 * This clustering mode works also for very large layers and can be used for getting an overview
 * where data is present in a given layer. Furthermore, a property filter on one property is applicable.
 *
 * @param clusteringParams Some parameters for the chosen clustering algorithm.
 * Depending on the chosen clustering algorithm there could be different mandatory and/or optional parameters to specify
 * the behavior of the algorithm.
 *
 * Clustering-Parameter reference.
 * NOTE: The actual query parameters in the URL are looking like: `?clustering.aParameterName=aValue`.
 *
 * Clustering-type: "hexbin":
 * There are several parameters needed by the H3 based hexbin algorithm.
 * For more information on that topic see: https://eng.uber.com/h3/.
 *
 * =======================================================================================================
 * |      Parameter       |   Type   |   Mandatory   |                      Meaning                       |
 * ========================================================================================================
 * |  absoluteResolution  |  Number  |       NO      | The H3 hexagon resolution                          |
 * --------------------------------------------------------------------------------------------------------
 * |     resolution	      |  Number  |       NO      | deprecated, renamed to absoluteResolution          |
 * --------------------------------------------------------------------------------------------------------
 * | relativeResolution   |	 Number  |       NO      | integer value [0-4] to be added to current used    |
 * |                      |          |               | resolution                                         |
 * --------------------------------------------------------------------------------------------------------
 * |       property	      |  String  |       NO	     | A property of the original features for which to   |
 * |                      |          |               | calculate statistics                               |
 * --------------------------------------------------------------------------------------------------------
 * |       pointmode	  |  Boolean |       NO	     | retuns the centroid of hexagons as geojson feature |
 * --------------------------------------------------------------------------------------------------------
 *
 * @param margin Margin in pixels on the respective projected level around the tile. Default is 0.
 *
 * @param limit The maximum number of features in the response. Default is 30000. Hard limit is 100000.
 *
 * @param force2D If set to `true` the features in the response will have only X's and Y's as coordinates.
 */
export async function getFeaturesByTile(
    builder: RequestBuilder,
    params: {
        layerId: string;
        tileType: string;
        tileId: string;
        clip?: boolean;
        params?: string;
        selection?: string;
        skipCache?: boolean;
        clustering?: string;
        clusteringParams?: string;
        margin?: number;
        limit?: number;
        force2D?: boolean;
    }
): Promise<FeatureCollection> {
    const baseUrl = "/layers/{layerId}/tile/{tileType}/{tileId}"
        .replace("{layerId}", UrlBuilder.toString(params["layerId"]))
        .replace("{tileType}", UrlBuilder.toString(params["tileType"]))
        .replace("{tileId}", UrlBuilder.toString(params["tileId"]));

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    urlBuilder.appendQuery("clip", params["clip"]);
    urlBuilder.appendQuery("params", params["params"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("skipCache", params["skipCache"]);
    urlBuilder.appendQuery("clustering", params["clustering"]);
    urlBuilder.appendQuery("clusteringParams", params["clusteringParams"]);
    urlBuilder.appendQuery("margin", params["margin"]);
    urlBuilder.appendQuery("limit", params["limit"]);
    urlBuilder.appendQuery("force2D", params["force2D"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<FeatureCollection>(urlBuilder, options);
}

/**
 * Returns statistical information about this layer.
 *
 * @summary Get statistics.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param skipCache If set to true the response is not returned from cache.
 * Default is false.
 */
export async function getStatistics(
    builder: RequestBuilder,
    params: { layerId: string; skipCache?: boolean }
): Promise<Statistics> {
    const baseUrl = "/layers/{layerId}/statistics".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    urlBuilder.appendQuery("skipCache", params["skipCache"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<Statistics>(urlBuilder, options);
}

/**
 * Iterates all of the features in the layer. The features in the response are ordered so
 * that no feature is returned twice. If there are more features, which could be loaded,
 * the response FeatureCollection will contain the root attribute nextPageToken.
 * The value of this attribute can be passed as a query parameter for the following request
 * in order to continue the iteration from the marked position.
 *
 * @summary Iterate features in the layer.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param limit The maximum number of features in the response. Default is 30000. Hard limit is 100000.
 *
 * @param pageToken The page token where the iteration will continue.
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param skipCache If set to true the response is not returned from cache. Default is false.
 *
 * @param force2D If set to true the features in the response will have only X's and Y's as coordinates.
 */
export async function iterateFeatures(
    builder: RequestBuilder,
    params: {
        layerId: string;
        limit?: number;
        pageToken?: string;
        selection?: string;
        skipCache?: boolean;
        force2D?: boolean;
    }
): Promise<FeatureCollectionIterable> {
    const baseUrl = "/layers/{layerId}/iterate".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);
    urlBuilder.appendQuery("limit", params["limit"]);
    urlBuilder.appendQuery("pageToken", params["pageToken"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("skipCache", params["skipCache"]);
    urlBuilder.appendQuery("force2D", params["force2D"]);

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<FeatureCollectionIterable>(urlBuilder, options);
}

/**
 * Searches for features in the layer. The results are unordered and the request does not allow to continue
 * the search, which is the main difference when compared to the iterate request.
 *
 * @summary Search for features.
 *
 * @param layerId The unique identified for the Layer ID.
 *
 * @param limit The maximum number of features in the response. Default is 30000. Hard limit is 100000.
 *
 * @param params Additional feature filters which compares the feature's property's value with the one specified
 * in the query, resulting in a subset of features.
 * The usage of multiple property names represents an AND operation.
 * The usage of a comma (,) separating the properties values, represents an OR operation.
 * Properties initiated with 'f.' are used to access values which are added by default in the stored feature.
 * The possible values are: 'f.id', 'f.createdAt' and 'f.updatedAt'.
 * Properties initiated with 'p.' are used to access values in the stored feature which are under the 'properties' property.
 * Use it as a shorthand accessor for 'properties' values.
 * The format should follow the specification below
 * ```
 * ?p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1
 * ```
 *
 * For example, the above query, the Features will be filtered by 'property' AND 'special property' equals to their
 * respective values.
 *
 * While in the following example ```?p.property_name_1=value_1,value_2```
 * The resulting Features list will contain all elements having `value_1` OR `value_2`.
 *
 * Additionally to the operators used in the examples above, the query can be written, with the same semantic,
 * by using the long operators: `"=gte=", "=lte=", "=gt=", "=lt=" and "=cs="`.
 *
 * The below queries yield the same result:
 * ```
 * ?p.property_name_1>=10
 * ?p.property_name_1=gte=10
 * ```
 *
 * The available operators are:
 * "=" - equals
 * "!=" - not equals
 * ">=" or "=gte=" - greater than or equals
 * "<=" or "=lte=" - less than or equals
 * ">" or "=gt=" - greater than
 * "<" or "=lt=" - less than
 * "@>" or "=cs=" - contains
 *
 * @param selection A list of properties to be returned in the features result list.
 * Multiple attributes can be specified by using comma(,).
 * Example: `?selection=p.name,p.capacity,p.color`.
 *
 * @param skipCache If set to true the response is not returned from cache. Default is false.
 *
 * @param force2D If set to true the features in the response will have only X's and Y's as coordinates.
 */
export async function searchFeatures(
    builder: RequestBuilder,
    params: {
        layerId: string;
        limit?: number;
        params?: string;
        selection?: string;
        skipCache?: boolean;
        force2D?: boolean;
    }
): Promise<FeatureCollection> {
    const baseUrl = "/layers/{layerId}/search".replace(
        "{layerId}",
        UrlBuilder.toString(params["layerId"])
    );

    const urlBuilder = new UrlBuilder(builder.baseUrl + baseUrl);

    urlBuilder.appendQuery("limit", params["limit"]);
    urlBuilder.appendQuery("params", params["params"]);
    urlBuilder.appendQuery("selection", params["selection"]);
    urlBuilder.appendQuery("skipCache", "true");
    urlBuilder.appendQuery("force2D", "true");

    const headers: { [header: string]: string } = {};
    const options: RequestOptions = {
        method: "GET",
        headers
    };

    return builder.request<FeatureCollection>(urlBuilder, options);
}
