module.exports = function (api, pageDir) {
  const chokidar = require('chokidar')
  const pagesWatcher = chokidar.watch([
    '*.vue',
    '**/index.vue'
  ], {
    cwd: pageDir,
    ignoreInitial: true
  })

  pagesWatcher.on('add', res => api.restart(`added ${res}`))
  pagesWatcher.on('unlink', res => api.restart(`unlinked ${res}`))
  pagesWatcher.on('addDir', res => api.restart(`added ${res}`))
  pagesWatcher.on('unlinkDir', res => api.restart(`unlink ${res}`))
}
