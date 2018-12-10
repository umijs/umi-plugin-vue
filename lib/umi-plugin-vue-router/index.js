const path = require('path')
const pageWatcher = require('./pageWatcher')
const updateWebpackEntry = require('./updateWebpackEntry')
const commonChunk = require('./commonChunk')
const updatePages = require('./updatePages')

const cwd = process.cwd()
const pageDir = path.resolve(cwd, 'src/pages')
const debug = require('debug')('umi-plugin-vue-router')

let pages

module.exports = (api, opts = {}) => {
  if (process.env.NODE_ENV === 'development') {
    pageWatcher(api, pageDir)
  }

  api.chainWebpackConfig(config => {
    pages = updatePages(pageDir)
    debug(pages)
    updateWebpackEntry(config, { pages })
    commonChunk(config)
  })

  api.modifyHTMLWithAST(($, { route, getChunkPath }) => {
    const page = pages.find(p => p.path === route.path)
    if (page) {
      $('head').append(`<style href="${getChunkPath(`${page.pageName}.css`)}"></style>`)
      $('body').append(`<script src="${getChunkPath('vendor.js')}"></script>`)
      $('body').append(`<script src="${getChunkPath(`${page.pageName}.js`)}"></script>`)
    }
  })

  api.modifyRoutes(() => {
    return pages
  })

  api.modifyHTMLChunks(() => {
    return []
  })

  api.modifyDefaultConfig(memo => {
    return Object.assign(memo, {
      exportStatic: {
        htmlSuffix: true
      },
    })
  })
}

