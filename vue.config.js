/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  chainWebpack: (config) => {
    config.hot = false;

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((args) => {
        args.hotReload = false;
        return args;
      });
  },
  devServer: {
    hot: false,
  },
};
