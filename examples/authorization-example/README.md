# Authorization Web App

It is a web app with configured compiling of TS into JS and bundling with webpack.
The app shows how to use the APIs from `@here/olp-sdk-dataservice-api`.

You can use all the `AuthorizationAPI` functions in the same way as in this example.

## Setup

1. Download the current folder to your PC.
2. Add your app key and secret to your enviropment.
    ```
    export OLP_APP_KEY=<your app key>
    export OLP_APP_SECRET=<your app secret>
    ```
3. Install the dependencies.

    ```
    npm install
    ```

## Build and run

1. Compile TS into JS.

    ```
    npm run compile
    ```

2. Bundle with webpack.

    ```
    npm run build
    ```

3. Start the web server.

    ```
    npm start
    ```

4. Open in your favorite browser http://localhost:8080