const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  entry: "./src/CensorNSFW.ts",
  output: {
    filename: "bundle.js",
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: false,
          output: {
            comments: /(#####)/i,
            beautify: true,
          },
        },
        extractComments: false,
      }),
    ],
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  module: {
    rules: [
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" },
    ],
  },

  plugins: [new webpack.BannerPlugin({ banner: "Your copyright notice" })],
};
