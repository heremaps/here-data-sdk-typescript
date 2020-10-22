# Authenticate to the HERE Platform

You can use an access token to authenticate to the HERE platform and start working with HERE Data SDK for Typescript. You can receive it using a default token provider, local authorization, or project authentication.

>Note: Keep your credentials secure and do not disclose them. Make sure that your credentials are not stored in a way that enables others to access them.

**To get an access token:**

1. Create your application and get your API key.

   For instructions, see the [Manage Apps](https://developer.here.com/documentation/access-control/user_guide/topics/manage-apps.html) section in the Terms and Permissions User Guide.

2. Get your platform credentials.

   For instructions, see the [Get Credentials](https://developer.here.com/olp/documentation/access-control/user-guide/topics/get-credentials.html) section in the Terms and Permissions User Guide.

   You get the `credentials.properties` file.

3. Set your credentials in one of the following ways:

   - (For Node.js only) Get your credentials from the file using the `loadCredentialsFromFile` helper method.

     ```typescript
     const credentials = loadCredentialsFromFile("Path");
     ```

   - (For browser and Node.js) Set credentials manually using the **here.access.key.іd** and **here.access.key.secret** from the `credentials.properties` file.

     ```typescript
     const credentials = {
       accessKeyId: "replace-with-your-access-key-id",
       accessKeySecret: "replace-with-your-access-key-secret",
     };
     ```

4. Import the `requestToken` method and the `UserAuth` module from the `olp-sdk-authentication` module.

   ```typescript
   import { UserAuth, requestToken } from "@here/olp-sdk-authentication";
   ```

5. Create the `UserAuth` instance in one of the following ways:

   - For token authentication, specify the `tokenRequester` method and your credentials.

     ```typescript
     const userAuth = new UserAuth({
       tokenRequester: requestToken,
       credentials: credentials,
     });
     ```

   - To authenticate with local authorization, specify the environment in which you work, your credentials, and the `tokenRequester` method.

     > Note: Depending on the environment that you use, specify one of the following parameters: `env` or `customUrl`.

     ```typescript
     const userAuth = new UserAuth({
       env: "here | here-dev | here-cn | here-cn-dev",
       customUrl: "http://YourCustomEnvironment",
       credentials: credentials,
       tokenRequester: requestToken,
     });
     ```

   - For project authentication, specify the `tokenRequester` method, your project name, and credentials.

   ```typescript
     const userAuth = new UserAuth({
       tokenRequester: requestToken,
       scope: "your-project-name"
       credentials: credentials,
     });
   ```

6. Get the OAuth 2.0 token from the HERE platform using the `getToken` method.

   ```typescript
   const token: string = await userAuth.getToken();
   ```

You can now use the access token to create the `OlpClientSettings` object and work with layers. For instructions, see the [related](https://developer.here.com/documentation/sdk-typescript/dev_guide/topics/create-olp-client-settings.html) section in our Developer Guide.

The token expires after an hour. To always have a valid access token when you get or publish data, use the `UserAuth` instance with the `getToken` method to create the `OlpClientSettings` object.
