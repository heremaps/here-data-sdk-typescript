const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = env => {
  const isProd = env.NODE_ENV === "production";

  return {
    mode: env.NODE_ENV,
    target: "web",
    devtool: isProd ? undefined : "inline-source-map",
    resolve: {
      extensions: [".js"]
    },
    entry: "./index.web.js",
    output: {
      filename: `bundle.umd${isProd ? '.min' : '.dev'}.js`,
      path: path.resolve(__dirname),
      libraryTarget: "umd",
      globalObject: 'this'
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    }
  };
};
