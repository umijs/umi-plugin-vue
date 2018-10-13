const { VueLoaderPlugin } = require('vue-loader');

module.exports = (api, opts = {}) => {
  const { vueLoaderOptions = {} } = opts
  api.chainWebpackConfig(config => {
    const rule = config.module
      .rule('vue')
      .test(/\.vue$/);

    rule
      .use('vue-loader')
        .loader('vue-loader')
        .options(Object.assign(vueLoaderOptions, {
          compilerOptions: {
            preserveWhitespace: true
          }
        }));

    config
      .resolve
        .extensions
          .merge(['.vue'])

    config
      .plugin('vue-loader')
        .use(VueLoaderPlugin);
  })

  api.modifyDefaultConfig(memo => {
    return Object.assign(memo, {
      urlLoaderExcludes: [/\.vue$/],
    });
  });
}
