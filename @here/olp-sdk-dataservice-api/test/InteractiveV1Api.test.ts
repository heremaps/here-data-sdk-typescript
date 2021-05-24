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

import { InteractiveApi } from "@here/olp-sdk-dataservice-api";

chai.use(sinonChai);

const expect = chai.expect;

describe("InteractiveApi", function() {
    it("getApiVersion", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equal("http://mocked.url/version");
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(await InteractiveApi.getApiVersion(builder)).eqls("success");
    });

    it("getHealth", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equal("http://mocked.url/health");
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(await InteractiveApi.getHealth(builder)).eqls("success");
    });

    it("getFeature", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features/mocked-featureId?selection=p.name%2Cp.capacity%2Cp.color&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getFeature(builder, {
                layerId: "mocked-layerId",
                featureId: "mocked-featureId",
                selection: "p.name,p.capacity,p.color",
                force2D: true
            })
        ).eqls("success");
    });

    it("getFeatures", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features?id=value1%2Cvalue2&selection=p.name%2Cp.capacity%2Cp.color&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getFeatures(builder, {
                layerId: "mocked-layerId",
                id: "value1,value2",
                selection: "p.name,p.capacity,p.color",
                force2D: true
            })
        ).eqls("success");
    });

    it("getFeaturesByBBox", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/bbox?bbox=13.082%2C52.416%2C13.628%2C52.626&clip=true&limit=100&params=p.property_name_1%3Dproperty_value_1%26f.special_property_name_1%3Dspecial_property_value_1&selection=p.name%2Cp.capacity%2Cp.color&skipCache=true&clustering=hexbin&clusteringParams=clustering.resolution%3D3%26clustering.property%3Da.nest&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getFeaturesByBBox(builder, {
                layerId: "mocked-layerId",
                bbox: "13.082,52.416,13.628,52.626",
                clip: true,
                limit: 100,
                params:
                    "p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1",
                selection: "p.name,p.capacity,p.color",
                skipCache: true,
                clustering: "hexbin",
                clusteringParams:
                    "clustering.resolution=3&clustering.property=a.nest",
                force2D: true
            })
        ).eqls("success");
    });

    it("getFeaturesBySpatial", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/spatial?lat=90&lng=45&refCatalogHrn=mocked-refCatalogHrn&refLayerId=mocked-refLayerId&refFeatureId=mocked-refFeatureId&radius=40&limit=100&params=p.property_name_1%3Dproperty_value_1%26f.special_property_name_1%3Dspecial_property_value_1&selection=p.name%2Cp.capacity%2Cp.color&skipCache=true&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getFeaturesBySpatial(builder, {
                layerId: "mocked-layerId",
                lat: 90,
                lng: 45,
                refCatalogHrn: "mocked-refCatalogHrn",
                refLayerId: "mocked-refLayerId",
                refFeatureId: "mocked-refFeatureId",
                radius: 40,
                limit: 100,
                params:
                    "p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1",
                selection: "p.name,p.capacity,p.color",
                skipCache: true,
                force2D: true
            })
        ).eqls("success");
    });

    it("getFeaturesBySpatialPost", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/spatial?radius=40&limit=100&params=p.property_name_1%3Dproperty_value_1%26f.special_property_name_1%3Dspecial_property_value_1&selection=p.name%2Cp.capacity%2Cp.color&skipCache=true&force2D=true`
                );
                expect(options.body).to.be.equals(
                    `{"type":"mocked-geojson","bbox":[1,2,3,4]}`
                );
                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getFeaturesBySpatialPost(builder, {
                layerId: "mocked-layerId",
                body: {
                    type: "mocked-geojson",
                    bbox: [1, 2, 3, 4]
                },
                radius: 40,
                limit: 100,
                params:
                    "p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1",
                selection: "p.name,p.capacity,p.color",
                skipCache: true,
                force2D: true
            })
        ).eqls("success");
    });

    it("getFeaturesByTile", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/tile/here/mocked-tile-id?clip=true&params=p.property_name_1%3Dproperty_value_1%26f.special_property_name_1%3Dspecial_property_value_1&selection=p.name%2Cp.capacity%2Cp.color&skipCache=true&clustering=hexbin&clusteringParams=clustering.resolution%3D3%26clustering.property%3Da.nest&margin=12&limit=100&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getFeaturesByTile(builder, {
                layerId: "mocked-layerId",
                tileType: "here",
                tileId: "mocked-tile-id",
                clip: true,
                limit: 100,
                params:
                    "p.property_name_1=property_value_1&f.special_property_name_1=special_property_value_1",
                selection: "p.name,p.capacity,p.color",
                skipCache: true,
                clustering: "hexbin",
                clusteringParams:
                    "clustering.resolution=3&clustering.property=a.nest",
                force2D: true,
                margin: 12
            })
        ).eqls("success");
    });

    it("getStatistics", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/statistics?skipCache=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.getStatistics(builder, {
                layerId: "mocked-layerId",
                skipCache: true
            })
        ).eqls("success");
    });

    it("iterateFeatures", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/iterate?limit=123&pageToken=mocked-pageToken&selection=p.name%2Cp.capacity%2Cp.color&skipCache=true&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.iterateFeatures(builder, {
                layerId: "mocked-layerId",
                limit: 123,
                pageToken: "mocked-pageToken",
                selection: "p.name,p.capacity,p.color",
                skipCache: true,
                force2D: true
            })
        ).eqls("success");
    });

    it("searchFeatures", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/search?limit=123&selection=p.name%2Cp.capacity%2Cp.color&skipCache=true&force2D=true`
                );
                expect(options.method).to.be.equal("GET");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.searchFeatures(builder, {
                layerId: "mocked-layerId",
                limit: 123,
                selection: "p.name,p.capacity,p.color",
                skipCache: true,
                force2D: true
            })
        ).eqls("success");
    });

    it("deleteFeature", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.deleteFeature(builder, {
                layerId: "mocked-layerId",
                featureId: "mocked-featureId"
            })
        ).eqls("success");
    });

    it("deleteFeatures", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features?id=mocked-featureId,mocked-featureId-2`
                );
                expect(options.method).to.be.equal("DELETE");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.deleteFeatures(builder, {
                layerId: "mocked-layerId",
                id: ["mocked-featureId", "mocked-featureId-2"]
            })
        ).eqls("success");
    });

    it("patchFeature", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                );

                expect(options.body).to.be.equal(
                    `{"type":"mocked-feature","bbox":[1,2,3,4]}`
                );

                expect(options.method).to.be.equal("PATCH");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.patchFeature(builder, {
                layerId: "mocked-layerId",
                featureId: "mocked-featureId",
                body: {
                    type: "mocked-feature",
                    bbox: [1, 2, 3, 4]
                }
            })
        ).eqls("success");
    });

    it("postFeatures", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features`
                );

                expect(options.body).to.be.equal(
                    `{"type":"mocked-features","features":[{"type":"mocked-feature-1","bbox":[1,2,3,4]},{"type":"mocked-feature-2","bbox":[4,3,2,1]}]}`
                );

                expect(options.method).to.be.equal("POST");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.postFeatures(builder, {
                layerId: "mocked-layerId",
                body: {
                    type: "mocked-features",
                    features: [
                        { type: "mocked-feature-1", bbox: [1, 2, 3, 4] },
                        { type: "mocked-feature-2", bbox: [4, 3, 2, 1] }
                    ]
                }
            })
        ).eqls("success");
    });

    it("putFeature", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features/mocked-featureId`
                );

                expect(options.body).to.be.equal(
                    `{"type":"mocked-feature-1","bbox":[1,2,3,4]}`
                );

                expect(options.method).to.be.equal("PUT");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.putFeature(builder, {
                layerId: "mocked-layerId",
                featureId: "mocked-featureId",
                body: { type: "mocked-feature-1", bbox: [1, 2, 3, 4] }
            })
        ).eqls("success");
    });

    it("putFeatures", async function() {
        const builder = {
            baseUrl: "http://mocked.url",
            request: async (urlBuilder: any, options: any) => {
                expect(urlBuilder.url).to.be.equals(
                    `http://mocked.url/layers/mocked-layerId/features`
                );

                expect(options.body).to.be.equal(
                    `{"type":"mocked-features","features":[{"type":"mocked-feature-1","bbox":[1,2,3,4]},{"type":"mocked-feature-2","bbox":[4,3,2,1]}]}`
                );

                expect(options.method).to.be.equal("PUT");
                return Promise.resolve("success");
            }
        } as any;

        expect(
            await InteractiveApi.putFeatures(builder, {
                layerId: "mocked-layerId",
                body: {
                    type: "mocked-features",
                    features: [
                        { type: "mocked-feature-1", bbox: [1, 2, 3, 4] },
                        { type: "mocked-feature-2", bbox: [4, 3, 2, 1] }
                    ]
                }
            })
        ).eqls("success");
    });
});
