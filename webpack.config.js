const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/lib/index.js",
  output: {
    path: path.resolve(__dirname, "dash_tabulator"),
    filename: "dash_tabulator.min.js",
    library: "dash_tabulator",
    libraryTarget: "window",
  },
  devtool: "source-map",
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "prop-types": "PropTypes",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader"},
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
