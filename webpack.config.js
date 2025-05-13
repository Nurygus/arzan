const path = require("path");
const nodeExternals = require("webpack-node-externals");
const SwaggerJSDocWebpackPlugin = require("swagger-jsdoc-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.ts",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new SwaggerJSDocWebpackPlugin({
      definition: {
        openapi: "3.0.1",
        info: {
          title: "REST API for Swagger Documentation",
          version: "1.0.0",
        },
      },
      apis: ["./src/docs/admin/*.ts"],
      outputFile: "admin-swagger.json",
    }),
    new SwaggerJSDocWebpackPlugin({
      definition: {
        openapi: "3.0.1",
        info: {
          title: "REST API for Swagger Documentation",
          version: "1.0.0",
        },
      },
      apis: ["./src/docs/public/*.ts"],
      outputFile: "swagger.json",
    }),
  ],
  externals: [nodeExternals()],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./bundle"),
  },
};
