# Authentication library

## Overview

This repository contains all methods and classes that are required to request an access token for the OAuth authentication.

## `UserAuth`

### Description

You can use the `UserAuth` class instance with your authentication data to get a client access token.

### Configure

To create the `UserAuth` class, pass the configuration object to the constructor.

```typescript
const auth = new UserAuth(config);
```

### Use with Local Authorization

To use the `UserAuth` class with local authorization:

1. Create the `UserAuth` class instance before instantiating any data sources.

    ```typescript
    /**
     * The function gets the access token.
     *
     * You can provide your own implementation or use one from `@here/olp-sdk-authentication`.
     *
     * There are two functions that work for the browser and Node.js.
     * For the browser, `UserAuth` uses `requestToken()` from requestToken.web.ts.
     * For Node.js,`UserAuth` uses `requestToken()` from requestToken.ts.
     *
     * When a function imports a function using `import { requestToken }` from "@here/olp-sdk-authentication"`,
     * the code automatically applies to the corresponding function.
     *
     * The following code is applicable only for Node.js.
     */

    import { UserAuth, requestToken } from "@here/olp-sdk-authentication";

    const userAuth = new UserAuth({
        env: "here",
        credentials: {
            accessKeyId: "replace-with-your-access-key-id",
            accessKeySecret: "replace-with-your-access-key-secret"
        },
        tokenRequester: requestToken
    });
    ```

2. Get the access token.

    ```typescript
    const token: string = await userAuth.getToken();
    ```

### Use with Credentials Imported from a File (Node.js)

In Node.js, you can use the `UserAuth` class with credentials imported from the **credentials.properties** file.

To use the `UserAuth` class with the credentials imported from the file:

1. Download your **credentials.properties** file from the HERE platform [website](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html).
2. Create the `UserAuth` class instance and set the path to the file with your credentials.

    ```typescript
    import {
        UserAuth,
        requestToken,
        loadCredentialsFromFile
    } from "@here/olp-sdk-authentication";
    const credentials = loadCredentialsFromFile(
        "replace-with-your-path-to-credentials.properties"
    );
    const userAuth = new UserAuth({
        credentials,
        tokenRequester: requestToken
    });
    ```

    Your **credentials.properties** file should match the following format:

    ```txt
    here.user.id = "your-here-user-id"
    here.client.id = "your-here-client-id"
    here.access.key.id = "your-here-access-key-id"
    here.access.key.secret = "your-here-access-key-secret"
    here.token.endpoint.url = "your-here-token-endpoint-url"
    ```

3. Get the access token.

    ```typescript
    const token: string = await userAuth.getToken();
    ```

### Generate a Bundle

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `@here/olp-sdk-authentication` folder from the root folder, you get the JavaScript bundled files.

To get bundled files with a source map, run:

```sh
npm run bundle
```

To get a minified version for production, run:

```sh
npm run bundle:prod
```

To get bundled and minified JavaScript files, run:

```sh
npm run prepublish-bundle
```

### Use a Bundle from CDN

Add the minified JavaScript file to your `HTML` and create the `userAuth` object.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://unpkg.com/@here/olp-sdk-fetch/bundle.umd.min.js"></script>
        <script src="https://unpkg.com/@here/olp-sdk-authentication/bundle.umd.min.js"></script>
    </head>
    <body>
        <script>
            const userAuth = new UserAuth({
                env: "here",
                credentials: {
                    accessKeyId: "replace-with-your-access-key-id",
                    accessKeySecret: "replace-with-your-access-key-secret"
                },
                tokenRequester: requestToken
            });
            userAuth.getToken().then(token => {
                // your token here
            });
        </script>
    </body>
</html>
```

## LICENSE

Copyright (C) 2019–2020 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).
