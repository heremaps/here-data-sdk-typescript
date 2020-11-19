const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    main: "./build/main.js",
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name]-bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "credentials": JSON.stringify({
        appKey: process.env.OLP_APP_KEY,
        appSecret: process.env.OLP_APP_SECRET
      })
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "index.html",
        },
      ],
    }),
  ],
};
