/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  devServer: {
    hot: false,
  },
  // chainWebpack: config => {
  //   config.module
  //     .rule('vue')
  //     .use('vue-loader')
  //       .tap(options => {
  //         console.log(options);
  //         // modify the options...
  //         options.hotReload = false
  //         return options
  //       })
  // }
  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.vue$/,
  //         loader: 'vue-loader',
  //         options: {
  //           hotReload: false, // disables Hot Reload
  //         },
  //       },
  //     ],
  //   },

  // devServer: {
  //  hot: false
  // },
  // },
  // devServer: {
  //   port: 8100,
  //   hot: false,
  //   //     hotOnly: false,
  // },
  //   chainWebpack: (config) => {
  //     // config.module
  //     //   .rule('entry')
  //     //     .tap(options => {
  //     //       console.log(options)
  //     //       // modify the options...
  //     //       return options
  //     //     })
  //     config.plugins.delete('hmr');
  //     return config;
  //   },
};
