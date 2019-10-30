const path = require("path");
const packageInfo = require('./package.json');


module.exports = env => {
  const isProd = env.NODE_ENV === "production";

  return {
    mode: env.NODE_ENV,
    target: "web",
    devtool: isProd ? undefined : "inline-source-map",
    resolve: {
      extensions: [".ts", ".js"]
    },
    entry: "./index.web.ts",
    output: {
      filename: `olp-sdk-authentification${isProd ? '.min' : '.dev'}.js`,
      path: path.resolve(__dirname, `dist`),
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
    }
  };
};
