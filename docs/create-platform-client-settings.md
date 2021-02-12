# Create platform client settings

You need to create the `OlpClientSettings` object to publish data and get catalog and partition metadata, as well as layer data from the HERE platform.

**To create the `OlpClientSettings` object:**

1. [Authenticate](authenticate.md) to the HERE platform.

2. Import the `OlpClientSettings` class from the `olp-sdk-dataservice-read` module.

   ```typescript
   import { OlpClientSettings } from "@here/olp-sdk-dataservice-read";
   ```

3. Create the `olpClientSettings` instance using the environment in which you work and the `getToken` method.

   ```typescript
   const olpClientSettings = new OlpClientSettings({
     environment:
       "here | here-dev | here-cn | here-cn-dev | http://YourLocalEnvironment",
     getToken: () => userAuth.getToken()
   });
   ```
