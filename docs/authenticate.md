# Authenticate to the HERE Platform

You can use an access token to authenticate to the HERE platform and start working with HERE Data SDK for Typescript. You can receive it using a default token provider, local authorization, or project authentication.

> #### Note
> Keep your credentials secure and do not disclose them. Make sure that your credentials are not stored in a way that enables others to access them.

**To get an access token:**

1. Create your app and get your API key.

   For instructions, see the [Manage apps](https://www.here.com/docs/bundle/identity-and-access-management-developer-guide/page/topics/manage-apps.html) section in the Identity and Access Management Developer Guide.

2. Get your platform credentials.

   For instructions, see the [Register your application](https://www.here.com/docs/bundle/identity-and-access-management-developer-guide/page/topics/plat-token.html#step-1-register-your-application) section in the Identity and Access Management Developer Guide.

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

5. Create the `UserAuth` instance and, if needed, specify the token expiration time in one of the following ways:

    > #### Note
    > The token expiration time parameter is optional. The default value is 24 hours. If you want to change it, specify the new time in seconds. The token expiration time should be equal to or more than zero. Ignored if it is zero or greater than the default expiration time supported by the access token endpoint.

   - For token authentication, specify the `tokenRequester` method, your credentials, and the token expiration time.

     ```typescript
     const userAuth = new UserAuth({
       tokenRequester: requestToken,
       credentials: credentials,
       expiresIn?: number;
     });
     ```

   - To authenticate with local authorization, specify the environment in which you work, your credentials, the `tokenRequester` method, and the token expiration time.

     > #### Note
     > Depending on the environment that you use, specify one of the following parameters: `env` or `customUrl`.

     ```typescript
     const userAuth = new UserAuth({
       env: "here | here-dev | here-cn | here-cn-dev",
       customUrl: "http://YourCustomEnvironment",
       credentials: credentials,
       tokenRequester: requestToken,
       expiresIn?: number;
     });
     ```

   - For project authentication, specify the `tokenRequester` method, your project name, credentials, and the token expiration time.

      ```typescript
      const userAuth = new UserAuth({
        tokenRequester: requestToken,
        scope: "your-project-name".
        credentials: credentials,
        expiresIn?: number;
      });
      ```

6. Get the OAuth 2.0 token from the HERE platform using the `getToken` method.

   ```typescript
   const token: string = await userAuth.getToken();
   ```

You can now use the access token to create the `OlpClientSettings` object and work with layers. For instructions, see the [related](create-platform-client-settings.md) section.
