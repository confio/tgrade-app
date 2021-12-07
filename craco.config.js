// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    { plugin: require("craco-antd") },
    {
      plugin: new MiniCssExtractPlugin({
        ignoreOrder: true,
      }),
    },
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
