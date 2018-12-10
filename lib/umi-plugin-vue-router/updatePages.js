const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const globby = require('globby')
const { writeTemp } = require('./temp')

module.exports = function updatePages(pageDir) {
  return globby
    .sync([
      '**',
      '!document.ejs',
      '!.umi',
      '!.umi-production'
    ], { cwd: pageDir, deep: 0, onlyFiles: false })

    .map(page => {
      if (page.endsWith('.vue')) {
        return {
          pageName: page.slice(0, page.lastIndexOf('.')),
          pageComponentPath: path.resolve(pageDir, page)
        }
      }
      const pageComponentPath = path.resolve(pageDir, `${page}/index.vue`)
      if (!fs.existsSync(pageComponentPath)) {
        console.log(`[${PLUGIN_NAME}] [Warn] Missing ${chalk.cyan('index.vue')} for page ${chalk.cyan(page)}`)
        return ''
      }
      return {
        pageName: page,
        pageComponentPath
      }
    })

    .filter(v => v)

    .map(({ pageName, pageComponentPath }) => {
      const entryCode = `
import Vue from 'vue'
import App from ${JSON.stringify(pageComponentPath)}
new Vue({
  el: '#root',
  render: h => h(App)
})
      `
      const tempPath = writeTemp(`umi-vue-pages/${pageName}.js`, entryCode)
      return {
        pageName,
        path: `/${pageName}.html`,
        component: tempPath,
        entry: tempPath
      }
    })
}
