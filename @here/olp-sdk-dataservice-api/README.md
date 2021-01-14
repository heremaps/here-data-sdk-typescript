# DataService API Library

## Overview

This API is generated directly from the official OpenAPI (former Swagger) definition of the [Data API](https://developer.here.com/documentation/data-api/data_dev_guide/index.html).

## Generate a Bundle

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `@here/olp-sdk-dataservice-api` folder from the root folder, you get the JavaScript bundled files.

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

## Use a Bundle from CDN

Add minified JavaScript files to your `html`:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://unpkg.com/@here/olp-sdk-dataservice-api/bundle.umd.min.js"></script>
    </head>
    <body></body>
</html>
```

## LICENSE

Copyright (C) 2019-2020 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).
