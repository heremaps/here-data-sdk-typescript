# Work with an interactive map layer

This example shows how to read data from and write it to an interactive map layer on Node.js using HERE Data SDK for TypeScript.

## Build and run an app on Node.js

Before you build an app, make sure that you installed all of the <a href="https://github.com/heremaps/here-data-sdk-typescript#dependencies" target="_blank">dependencies</a>.

**To build and run an app on Node.js:**

1. Create an npm project.

   ```shell
   mkdir example-app && cd example-app && npm init
   ```

2. Initialize a TypeScript project.

   ```shell
   tsc --init
   ```

3. Install node types.

   ```shell
   npm install --save-dev @types/node
   ```

4. Install the SDK modules.

   ```shell
   npm install --save @here/olp-sdk-authentication @here/olp-sdk-dataservice-api
   ```

   Now, everything is set to create the app.

5. Create the `index.ts` file and app skeleton.

   ```typescript
   /**
    * An example of the Node.js app used for reading data from and writing it to an interactive map layer in the datastore.
    */

   class App {
     run() {
       console.log("App works!");
     }
   }

   const app = new App();
   app.run();
   ```

6. Compile and run the app.

   ```shell
   tsc && node .
   ```

After a successful run, the console displays the following message:

```shell
App works!
```

## Create `RequestBuilder`

You need `RequestBuilder` to use the `InteractiveApi` functions from `@here/olp-sdk-dataservice-api`.
You can use the `InteractiveApi` functions to request any data from an [interactive map layer](https://developer.here.com/documentation/data-user-guide/user_guide/portal/layers/layers.html#interactive-map-layers).

**To create the `RequestBuilder` instance:**

1. Create the `OlpClientSettings` object.

   For instructions, see <a href="https://github.com/heremaps/here-data-sdk-typescript/blob/master/docs/create-platform-client-settings.md" target="_blank">Create platform client settings</a>.

2. Create the `RequestBuilder` instance with `RequestFactory` that contains the catalog HRN, platform client settings from step 1, API name, and API version.

   ```typescript
   const requestBuilder = await RequestFactory.create(
     "interactive",
     "v1",
     settings,
     HRN.fromString("your-catalog-HRN")
   );
   ```

## Get data from an interactive map layer

Each [interactive map layer](https://developer.here.com/documentation/data-user-guide/user_guide/portal/layers/layers.html#object-store-layers) has a different set of features that you can request and use to work with map data.

You can request one or several features of the interactive map layer using their IDs, tiles that contain them, a bounding box, spatial search, search, iteration, and statistics.

> #### Note
>
> When you request features from the interactive map layer, you get `FeatureCollection` even if the request returns only one feature or there are no features found.

The interactive API supports the following tile types:

- `web` – for the Mercator projection (used by OpenStreetMap, Google Maps, and Bing Maps). Format: `level_x_y`. For example, `10_100_100` means level 10, x-coordinate 100, and y-coordinate 100.

- `tms` – for the Tile Map Service specification developed by the Open Source Geospatial Foundation. Format: `level_x_y`. For example, `10_100_100` means level 10, x-coordinate 100, y-coordinate 100.

- `quadkey` – for quadtree keys used by Bing Maps (formerly Virtual Earth). For example, 0123031233 is a quadkey for the level 10 tile.

- `here` – for the HERE tiling schema.

**To get features from the interactive layer:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Depending on what you want to use to get features, do one of the following:

   - To get one feature using its ID, call the `getFeature` function with the request builder, feature ID, and layer ID.

     ```typescript
     const result = await InteractiveApi.getFeature(requestBuilder, {
       id: "your-feature-id",
       layerId: "your-layer-id",
     });
     ```

   - To get more than one feature using their IDs, call the `getFeatures` function with the request builder, feature IDs, and layer ID.

     ```typescript
     const result = await InteractiveApi.getFeatures(requestBuilder, {
       id: "your-feature1-id,your-feature2-id",
       layerId: "your-layer-id",
     });
     ```

   - To get features using a bounding box, call the `getFeaturesByBBox` function with the request builder, feature IDs, and layer ID.

     ```typescript
     const result = await InteractiveApi.getFeaturesByBBox(requestBuilder, {
       bbox: "13.082,52.416,13.628,52.626", // Bounding box of Berlin
       layerId: "your-layer-id",
     });
     ```

   - To get features using a tile, call the `getFeaturesByTile` function with the request builder, feature IDs, and layer ID.

     ```typescript
     const result = await InteractiveApi.getFeaturesByTile(requestBuilder, {
       tileType: "your tile type",
       layerId: "your-layer-id",
       tileId: "your-tileId",
       params: "your-params-string",
     });
     ```

   - To get features using the spatial search, call the `getFeaturesBySpatial` or `getFeaturesBySpatialPost` functions.

     With the spatial search, you can find all features around a given position or in a given region. For more information, see [Spatial search for features](https://developer.here.com/documentation/data-api/data_dev_guide/rest/getting-interactive-spatial.html) in the Data API Guide.

   - To get features using the search, call the `searchFeatures` function.

     For more information, see [Searching for features](https://developer.here.com/documentation/data-api/data_dev_guide/rest/getting-interactive-search.html) in the Data API Guide.

   - To get features using iteration, call the `iterateFeatures` function.

     You get an ordered set of features, and none of them is returned twice. For more information, see [Iterating features](https://developer.here.com/documentation/data-api/data_dev_guide/rest/getting-interactive-iterate.html) in the Data API Guide.

   - To get features using statistics, call the `getStatistics` function with the ID of the layer.

     ```typescript
     const result = await InteractiveApi.getStatistics(requestBuilder, {
       layerId: "your-layer-id",
     });
     ```

## Update data in and publish it to an interactive map layer

You can update existing features in an interactive map layer or publish new ones.

**To update and publish features:**

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Call the `patchFeature`, `postFeatures`, `putFeature`, or `putFeatures` functions.

   For more information, see [Update data in an interactive map layer](https://developer.here.com/documentation/data-api/data_dev_guide/rest/updating-data-interactive.html) and [Publish to an interactive map layer](https://developer.here.com/documentation/data-api/data_dev_guide/rest/publishing-data-interactive.html) in the Data API Guide.

## Delete data from an interactive map layer

You can delete features from an interactive map layer when you no longer need them.

1. Create the `RequestBuilder` object.

   For instructions, see [Create RequestBuilder](#create-requestbuilder).

2. Call the `deleteFeature` or `deleteFeatures` functions.

   For more information, see [Delete data from an interactive map layer](https://developer.here.com/documentation/data-api/data_dev_guide/rest/deleting-data-interactive.html) in the Data API Guide.
