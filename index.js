const debug = require('debug')('umi-plugin-vue')

function getId(id) {
  return `umi-plugin-vue:${id}`;
}

module.exports = (api, opts = {}) => {
  opts = Object.assign({
    sfc: {}
  }, opts)

  const plugins = {
    sfc: () => require('./lib/umi-plugin-vue-sfc'),
    router: () => require('./lib/umi-plugin-vue-router'),
    external: () => require('./lib/umi-plugin-vue-external'),
  }

  Object.keys(plugins).forEach(key => {
    const id = getId(key)
    if (opts[key]) {
      const pluginOptions = typeof opts[key] === 'object'
        ? opts[key]
        : {}
      debug(`Enable ${id} with options ${JSON.stringify(pluginOptions)}`)
      api.registerPlugin({
        id,
        apply: plugins[key](),
        opts: pluginOptions,
      });
    } else {
      debug(`Disable ${id}`)
    }
  });
}
