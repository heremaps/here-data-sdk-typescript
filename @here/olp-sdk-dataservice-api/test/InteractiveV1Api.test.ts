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
});
