const webpack = require("webpack");

module.exports = {
  cache: true,
  entry: {
    entry: "./src/entry.js"
  },
  output: {
    filename: "./dist/main.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  },
  devtool: "#inline-source-map"
};
