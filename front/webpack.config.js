"use strict";

var dotenv = require('dotenv')
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  // Set debugging source maps to be "inline" for
  // simplicity and ease of use
  devtool: "inline-source-map",
  
  // The application entry point
  entry: "./src/index.tsx",

  // Where to compile the bundle
  // By default the output directory is `dist`
  output: {
    filename: "bundle.js",
    publicPath: '/'
  },

  // Supported file loaders
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },

  // File extensions to support resolving
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins:[
    new HtmlWebpackPlugin({template: './public/index.html'}),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
  }),
  ]
};
