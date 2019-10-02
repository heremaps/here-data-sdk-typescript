# Generated DataStore API

# Overview

This API is generated directly from the official OpenAPI (former swagger) definition of the [HERE Open Location Platform Data API](https://developer.here.com/olp/documentation/data-api/data_dev_guide/index.html).


## Usage of Bundle functionality

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `dist/@here/olp-sdk-dataservice-api/bundle` folder from the root folder, you get the JS bundled files.

To get bundled files with a source map, run:

```sh
npm run bundle
```

To get minified version for production, run:

```sh
npm run bundle:prod
```

To get bundled and minified js files, run:

```sh
npm run prepublish-bundle
```

## Simple bundle

Add minified js files to your `html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="olp-sdk-dataservice-api.0.3.0.min.js"></script>
</head>
    <body>    
    </body>
</html>
```

## LICENSE

Copyright (C) 2019 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE) file in the root of this project.