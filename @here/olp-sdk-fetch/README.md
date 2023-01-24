# Fetch Library

## Overview

This module adds a subset of the [fetch](https://fetch.spec.whatwg.org/) API for [Node.js](https://nodejs.org/). This allows code written for the browser to also execute in `Node.js`.

The main goal of this module is to provide enough compatibility to allow running unit tests in `Node.js`. It is not 100% feature and behavior compatible with `fetch`.

The feature set is that of [node-fetch](https://www.npmjs.com/package/node-fetch) with the addition of a dummy `AbortController`.

## Usage

Import the module for its side-effects:

```JavaScript
import "@here/olp-sdk-fetch"
```

This adds `fetch` to the global `Node.js` namespace.

## Behavior in a Browser Context

When this module is used in a browser context, it does not perform any actions, nor adds any code.

## Generate a Bundle

If you want to have a compiled project, you can use bundle commands. After running each of the following commands in the `@here/olp-sdk-fetch` folder from the root folder, you get the JavaScript bundled files.

To have the bundled files with source map, run:

```sh
npm run bundle
```

To get a minified version for production, run:

```sh
npm run bundle:prod
```

To get a bundled and minified JavaScript files, run:

```sh
npm run prepublish-bundle
```

## Use a Bundle from CDN

Add minified JavaScript file to your `html` and create an object of userAuth:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://unpkg.com/@here/olp-sdk-fetch/bundle.umd.min.js"></script>
    </head>
    <body></body>
</html>
```

## LICENSE

Copyright (C) 2019-2023 HERE Europe B.V.

For license details, see the [LICENSE](LICENSE).
