/*
 * Copyright (C) 2021 HERE Europe B.V.
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

// tslint:disable: no-magic-numbers

import * as chai from "chai";
import sinonChai = require("sinon-chai");

import { InteractiveApi, RequestOptions } from "@here/olp-sdk-dataservice-api";
import { MockedRequestBuilder } from "./MockedRequestBuilder";

chai.use(sinonChai);

const expect = chai.expect;

describe("InteractiveApi", function() {
    it("getApiVersion", async function() {
        expect(
            await InteractiveApi.getApiVersion(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equal("http://mocked.url/version");
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                })
            )
        ).eqls("success");
    });

    it("getHealth", async function() {
        expect(
            await InteractiveApi.getHealth(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equal("http://mocked.url/health");
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                })
            )
        ).eqls("success");
    });

    it("getFeature", async function() {
        expect(
            await InteractiveApi.getFeature(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features/mocked-featureId?selection=p.name,p.capacity,p.color&force2D=true`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    featureId: "mocked-featureId",
                    selection: ["p.name", "p.capacity", "p.color"],
                    force2D: true
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeature(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    featureId: "mocked-featureId"
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeature(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features/mocked-featureId?force2D=false`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    featureId: "mocked-featureId",
                    force2D: false
                }
            )
        ).eqls("success");
    });

    it("getFeatures", async function() {
        expect(
            await InteractiveApi.getFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features?id=value1&selection=p.name,p.capacity,p.color&force2D=true`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    id: "value1",
                    selection: ["p.name", "p.capacity", "p.color"],
                    force2D: true
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features?id=value1,value2&force2D=false`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    id: ["value1", "value2"],
                    force2D: false
                }
            )
        ).eqls("success");
    });

    it("getFeaturesByBBox", async function() {
        expect(
            await InteractiveApi.getFeaturesByBBox(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/bbox?bbox=13.082,52.416,13.628,52.626&clip=true&limit=100&p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1&selection=p.name,p.capacity,p.color&skipCache=true&clustering=hexbin&clustering.resolution=3&clustering.testProperty=a.nest&clustering.testProperty2=testProperty2Value&force2D=true`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    bbox: [13.082, 52.416, 13.628, 52.626],
                    clip: true,
                    limit: 100,
                    params: [
                        {
                            key: "p.property_name_1",
                            value: "property_value_1",
                            operator: "="
                        },
                        {
                            key: "f.special_property_name_1",
                            value: "special_property_value_1",
                            operator: "="
                        }
                    ],
                    selection: ["p.name", "p.capacity", "p.color"],
                    skipCache: true,
                    clustering: "hexbin",
                    clusteringParams: {
                        resolution: 3,
                        testProperty: "a.nest",
                        testProperty2: "testProperty2Value"
                    },
                    force2D: true
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesByBBox(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/bbox?clip=false&skipCache=false&force2D=false`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    clip: false,
                    skipCache: false,
                    force2D: false
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesByBBox(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/bbox`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId"
                }
            )
        ).eqls("success");
    });

    it("getFeaturesBySpatial", async function() {
        expect(
            await InteractiveApi.getFeaturesBySpatial(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/spatial?lat=-90&lng=45&refCatalogHrn=mocked-refCatalogHrn&refLayerId=mocked-refLayerId&refFeatureId=mocked-refFeatureId&radius=40&limit=100&p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1&selection=p.name,p.capacity,p.color&skipCache=true&force2D=true`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    lat: -90,
                    lng: 45,
                    refCatalogHrn: "mocked-refCatalogHrn",
                    refLayerId: "mocked-refLayerId",
                    refFeatureId: "mocked-refFeatureId",
                    radius: 40,
                    limit: 100,
                    params: [
                        {
                            key: "p.property_name_1",
                            value: "property_value_1",
                            operator: "="
                        },
                        {
                            key: "f.special_property_name_1",
                            value: "special_property_value_1",
                            operator: "="
                        }
                    ],
                    selection: ["p.name", "p.capacity", "p.color"],
                    skipCache: true,
                    force2D: true
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesBySpatial(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/spatial?skipCache=false&force2D=false`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    skipCache: false,
                    force2D: false
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesBySpatial(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/spatial`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId"
                }
            )
        ).eqls("success");
    });

    it("getFeaturesBySpatialPost", async function() {
        expect(
            await InteractiveApi.getFeaturesBySpatialPost(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/spatial?radius=40&limit=100&p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1&selection=p.name,p.capacity,p.color&skipCache=true&force2D=true`
                        );
                        expect(options?.body).to.be.equals(
                            `{"type":"mocked-geojson","bbox":[1,2,3,4]}`
                        );
                        expect(options?.method).to.be.equal("POST");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    body: {
                        type: "mocked-geojson",
                        bbox: [1, 2, 3, 4]
                    },
                    radius: 40,
                    limit: 100,
                    params: [
                        {
                            key: "p.property_name_1",
                            value: "property_value_1",
                            operator: "="
                        },
                        {
                            key: "f.special_property_name_1",
                            value: "special_property_value_1",
                            operator: "="
                        }
                    ],
                    selection: ["p.name", "p.capacity", "p.color"],
                    skipCache: true,
                    force2D: true
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesBySpatialPost(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/spatial?skipCache=false&force2D=false`
                        );
                        expect(options?.body).to.be.equals(
                            `{"type":"FeatureCollection","bbox":[1,2,3,4],"features":[{"type":"Feature","bbox":[1,2,3,4]}]}`
                        );
                        expect(options?.method).to.be.equal("POST");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    body: {
                        type: "FeatureCollection",
                        bbox: [1, 2, 3, 4],
                        features: [{ type: "Feature", bbox: [1, 2, 3, 4] }]
                    },
                    skipCache: false,
                    force2D: false
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesBySpatialPost(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/spatial`
                        );
                        expect(options?.body).to.be.equals(
                            `{"type":"FeatureCollection","bbox":[1,2,3,4],"coordinates":[[1,2],[3,4]],"properties":{"test":"lorem"}}`
                        );
                        expect(options?.method).to.be.equal("POST");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    body: {
                        type: "FeatureCollection",
                        bbox: [1, 2, 3, 4],
                        coordinates: [
                            [1, 2],
                            [3, 4]
                        ],
                        properties: { test: "lorem" }
                    }
                }
            )
        ).eqls("success");
    });

    it("getFeaturesByTile", async function() {
        expect(
            await InteractiveApi.getFeaturesByTile(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/tile/here/mocked-tile-id?clip=true&p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1&selection=p.name,p.capacity,p.color&skipCache=true&clustering=hexbin&clustering.resolution=3&clustering.testProperty=a.nest&clustering.testProperty2=testProperty2Value&margin=12&limit=100&force2D=true`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    tileType: "here",
                    tileId: "mocked-tile-id",
                    clip: true,
                    limit: 100,
                    params: [
                        {
                            key: "p.property_name_1",
                            value: "property_value_1",
                            operator: "="
                        },
                        {
                            key: "f.special_property_name_1",
                            value: "special_property_value_1",
                            operator: "="
                        }
                    ],
                    selection: ["p.name", "p.capacity", "p.color"],
                    skipCache: true,
                    clustering: "hexbin",
                    clusteringParams: {
                        resolution: 3,
                        testProperty: "a.nest",
                        testProperty2: "testProperty2Value"
                    },
                    force2D: true,
                    margin: 12
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getFeaturesByTile(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/tile/here/mocked-tile-id`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    tileType: "here",
                    tileId: "mocked-tile-id"
                }
            )
        ).eqls("success");
    });

    it("getStatistics", async function() {
        expect(
            await InteractiveApi.getStatistics(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/statistics?skipCache=false`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    skipCache: false
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.getStatistics(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/statistics`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId"
                }
            )
        ).eqls("success");
    });

    it("iterateFeatures", async function() {
        expect(
            await InteractiveApi.iterateFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/iterate?limit=123&pageToken=mocked-pageToken&part=7,9&selection=p.name,p.capacity,p.color&sort=p.name%3Aasc,p.color%3Adesc&skipCache=true&force2D=false`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    limit: 123,
                    pageToken: "mocked-pageToken",
                    part: [7, 9],
                    sort: ["p.name:asc", "p.color:desc"],
                    selection: ["p.name", "p.capacity", "p.color"],
                    skipCache: true,
                    force2D: false
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.iterateFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/iterate`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId"
                }
            )
        ).eqls("success");
    });

    it("searchFeatures", async function() {
        expect(
            await InteractiveApi.searchFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/search?limit=123&f.id!=123&p.testProp>32&p.name!=.null&p.test2Prop=test2propValue&selection=p.name,p.capacity,p.color&skipCache=true&force2D=true`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    limit: 123,
                    selection: ["p.name", "p.capacity", "p.color"],
                    params: [
                        {
                            key: "f.id",
                            operator: "!=",
                            value: "123"
                        },
                        {
                            key: "p.testProp",
                            operator: ">",
                            value: "32"
                        },
                        {
                            key: "p.name",
                            operator: "!=",
                            value: ".null"
                        },
                        {
                            key: "p.test2Prop",
                            operator: "=",
                            value: "test2propValue"
                        }
                    ],
                    skipCache: true,
                    force2D: true
                }
            )
        ).eqls("success");

        expect(
            await InteractiveApi.searchFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/search`
                        );
                        expect(options?.method).to.be.equal("GET");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId"
                }
            )
        ).eqls("success");
    });

    it("deleteFeature", async function() {
        expect(
            await InteractiveApi.deleteFeature(
                new MockedRequestBuilder({
                    requestBlob: (
                        url: string,
                        options?: RequestOptions
                    ): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                        );
                        expect(options?.method).to.be.equal("DELETE");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    featureId: "mocked-featureId"
                }
            )
        ).eqls("success");
    });

    it("deleteFeatures", async function() {
        expect(
            await InteractiveApi.deleteFeatures(
                new MockedRequestBuilder({
                    requestBlob: (
                        url: string,
                        options?: RequestOptions
                    ): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features?id=mocked-featureId,mocked-featureId-2`
                        );
                        expect(options?.method).to.be.equal("DELETE");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    id: ["mocked-featureId", "mocked-featureId-2"]
                }
            )
        ).eqls("success");
    });

    it("patchFeature", async function() {
        expect(
            await InteractiveApi.patchFeature(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                        );

                        expect(options?.body).to.be.equal(
                            `{"type":"mocked-feature","bbox":[1,2,3,4]}`
                        );

                        expect(options?.method).to.be.equal("PATCH");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    featureId: "mocked-featureId",
                    body: {
                        type: "mocked-feature",
                        bbox: [1, 2, 3, 4]
                    }
                }
            )
        ).eqls("success");
    });

    it("postFeatures", async function() {
        expect(
            await InteractiveApi.postFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features`
                        );

                        expect(options?.body).to.be.equal(
                            `{"type":"mocked-features","features":[{"type":"mocked-feature-1","bbox":[1,2,3,4]},{"type":"mocked-feature-2","bbox":[4,3,2,1]}]}`
                        );

                        expect(options?.method).to.be.equal("POST");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    body: {
                        type: "mocked-features",
                        features: [
                            { type: "mocked-feature-1", bbox: [1, 2, 3, 4] },
                            { type: "mocked-feature-2", bbox: [4, 3, 2, 1] }
                        ]
                    }
                }
            )
        ).eqls("success");
    });

    it("putFeature", async function() {
        expect(
            await InteractiveApi.putFeature(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                        );

                        expect(options?.body).to.be.equal(
                            `{"type":"mocked-feature-1","bbox":[1,2,3,4]}`
                        );

                        expect(options?.method).to.be.equal("PUT");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    featureId: "mocked-featureId",
                    body: { type: "mocked-feature-1", bbox: [1, 2, 3, 4] }
                }
            )
        ).eqls("success");
    });

    it("putFeatures", async function() {
        expect(
            await InteractiveApi.putFeatures(
                new MockedRequestBuilder({
                    request: (url: string, options?: RequestOptions): any => {
                        expect(url).to.be.equals(
                            `http://mocked.url/layers/mocked-layerId/features`
                        );

                        expect(options?.body).to.be.equal(
                            `{"type":"mocked-features","features":[{"type":"mocked-feature-1","bbox":[1,2,3,4]},{"type":"mocked-feature-2","bbox":[4,3,2,1]}]}`
                        );

                        expect(options?.method).to.be.equal("PUT");
                        return Promise.resolve("success");
                    }
                }),
                {
                    layerId: "mocked-layerId",
                    body: {
                        type: "mocked-features",
                        features: [
                            { type: "mocked-feature-1", bbox: [1, 2, 3, 4] },
                            { type: "mocked-feature-2", bbox: [4, 3, 2, 1] }
                        ]
                    }
                }
            )
        ).eqls("success");
    });
});
