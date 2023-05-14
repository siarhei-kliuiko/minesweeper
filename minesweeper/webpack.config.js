const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = ({ develop }) => ({
  mode: develop ? 'development' : 'production',

  devtool: develop ? 'inline-source-map' : false,

  entry: path.join(__dirname, 'src', 'index.js'),

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[hash][ext]',
  },

  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },

      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Minesweeper',
      favicon: path.join(__dirname, 'src', 'assets', 'favicon.png'),
    }),

    new MiniCssExtractPlugin({
      filename: 'style-[contenthash].css',
    }),

    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
  ],

  devServer: develop ? { open: true, hot: true } : {},
  cache: false,
});
