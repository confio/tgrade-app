// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  plugins: [{ plugin: new MiniCssExtractPlugin() }, { plugin: require("craco-antd") }],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  webpack: {
    configure: (webpackConfig) => ({
      ...webpackConfig,
      optimization: {
        ...webpackConfig.optimization,
        // Workaround for CircleCI bug caused by the number of CPUs shown
        // https://github.com/facebook/create-react-app/issues/8320
        minimizer: webpackConfig.optimization.minimizer.map((item) => {
          if (item instanceof TerserPlugin) {
            item.options.parallel = 0;
          }

          return item;
        }),
      },
    }),
  },
};
