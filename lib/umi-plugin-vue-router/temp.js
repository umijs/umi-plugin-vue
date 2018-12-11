const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const debug = require('debug')('umi-plugin-vue-router:createTemp')

function createTemp(tempPath) {
  if (!tempPath) {
    tempPath = path.resolve(process.cwd(), 'src/pages/.umi')
  } else {
    tempPath = path.resolve(tempPath)
  }

  debug(`Temp directory: ${chalk.gray(tempPath)}`)
  const tempCache = new Map()

  function writeTemp(file, content) {
    const destPath = path.join(tempPath, file)
    const dir = path.parse(destPath).dir
    fs.ensureDirSync(dir)
    // cache write to avoid hitting the dist if it didn't change
    const cached = tempCache.get(file)
    if (cached !== content) {
      fs.writeFileSync(destPath, content)
      tempCache.set(file, content)
    }
    return destPath
  }

  return { writeTemp, tempPath }
}

module.exports = createTemp()
