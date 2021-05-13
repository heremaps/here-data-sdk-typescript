# Publish large data files in a browser

This example app uses an HTML and JS UI and an HTTP server with mocked routes to simulate the real `DataStore` class.
You can use this app to learn how to work with the `MultipartUploadWrapper` class and publish large files of more than 8 GB to a versioned layer without loading them in memory.

## Setup

This example does not need any setup. Nevertheless, make sure you installed Node.js.

## Run

1. Start the server.
   ```
   node server.js
   ```
2. In your favorite browser, open `http://localhost:8080/`.
