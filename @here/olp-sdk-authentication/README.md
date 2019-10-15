# Overview

This repository contains all required methods and classes to request access token for OAuth authentication.

## UserAuth

## Description

UserAuth class instance is used to obtain client token by providing authentication data.

## Configuration

Creating an instance of UserAuth class requires configuration object to be passed to the constructor:

```typescript
const auth = new UserAuth(config);
```

## Usage with local authorization

Create an instance of UserAuth class before instantiating any data sources:

```typescript
const userAuth = new UserAuth({
    env: "here",    
    credentials: {
        accessKeyId: "replace-with-your-access-key-id",
        accessKeySecret: "replace-with-your-access-key-secret"
    }
});
```

Get token:

```typescript
await userAuth.setCredentials();
const token: string = await userAuth.fetchToken();
 ```

## Usage with import credentials from file
Download your credentials.properties file from [OLP website](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html).
Create an instance of UserAuth class and set the path to the file with credentials:

```typescript

const userAuth = UserAuth.setCredentialsFromFile("replace-with-your-path-to-credentials.properties");

```

Notice that your credentials.properties file should match the following format:

```txt
here.user.id = "your-here-user-id"
here.client.id = "your-here-client-id"
here.access.key.id = "your-here-access-key-id"
here.access.key.secret = "your-here-access-key-secret"
here.token.endpoint.url = "your-here-token-endpoint-url"
 ```

Get token:

```typescript
const token: string = await userAuth.getToken();
```

## Usage of Bundle functionality:

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `@here/olp-sdk-authentication/dist/bundle` folder from the root folder, you get the JavaScript bundled files.

To get bundled files with a source map, run:

```sh
npm run bundle
```

To get minified version for production, run:

```sh
npm run bundle:prod
```

To get bundled and minified JavaScript files, run:

```sh
npm run prepublish-bundle
```

## Simple bundle

Add minified JavaScript file to your `html` and create an object of userAuth:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="olp-sdk-authentication.0.3.0.min.js"></script>
</head>
<body>
    <script>
    const userAuth = new UserAuth({
        env: "here",
        credentials: {
            accessKeyId: "replace-with-your-access-key-id",
            accessKeySecret: "replace-with-your-access-key-secret"
        }
    });

    userAuth.setCredentials().then((result) => {
        if (result.ok) {
            const token = await userauth.getToken();
        }
    });

    </script>
</body>
</html>
```

## LICENSE

Copyright (C) 2019 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).