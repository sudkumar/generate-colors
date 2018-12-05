const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'docs/src/app.js'),
  output: {
    filename: 'app.[contenthash:8].js',
    path: path.resolve(__dirname, 'docs')
  },
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'docs/src/index.html')
    })
  ]
}
