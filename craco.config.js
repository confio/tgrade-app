// eslint-disable-next-line @typescript-eslint/no-var-requires
const CracoAntDesignPlugin = require("craco-antd");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig = {
        ...webpackConfig,
        plugins: [
          ...webpackConfig.plugins.filter((element) => {
            if (element.options) {
              // eslint-disable-next-line no-prototype-builtins
              return !element.options.hasOwnProperty("ignoreOrder");
            }
            return true;
          }),
          new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css",
            moduleFilename: this.moduleFilename,
            ignoreOrder: true,
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
          }),
        ],
      };
      return webpackConfig;
    },
  },
  plugins: [{ plugin: CracoAntDesignPlugin }],
};
