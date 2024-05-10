const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = env => {
  const isProd = env.NODE_ENV === "production";

  return {
    target: "web",
    mode: env.NODE_ENV,
    devtool: isProd ? undefined : "inline-source-map",
    resolve: {
      extensions: [".js"]
    },
    entry: "./index.js",
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
