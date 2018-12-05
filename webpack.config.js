const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'docs/src/app.js'),
  output: {
    filename: 'app.[contenthash:8].js',
    path: path.resolve(__dirname, 'docs')
  },
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true,
    minimizer: [
      new TerserPlugin()
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'docs/src/index.html')
    })
  ]
}
