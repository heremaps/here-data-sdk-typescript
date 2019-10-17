const path = require("path");
const packageInfo = require('./package.json');

module.exports = env => {
  const isProd = env.NODE_ENV === "production";

  return {
    mode: env.NODE_ENV,
    devtool: isProd ? undefined : "source-map",
    resolve: {
      extensions: [".ts", ".js"]
    },
    entry: "./index.ts",
    output: {
      filename: `olp-sdk-tile-provider.${packageInfo.version}${isProd ? '.min' : '.dev'}.js`,
      path: path.resolve(__dirname, `dist/bundle`),
      libraryTarget: "umd",
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "awesome-typescript-loader",
          exclude: /node_modules/,
          options: {
              onlyCompileBundledFiles: true
          }
        }
      ]
    },
    node: {
        fs: 'empty'
      }
  };
};