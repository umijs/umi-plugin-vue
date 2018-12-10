module.exports = function (config, { pages, umiPath }) {
  // Delete umi default entry.
  config.entryPoints.delete('umi')

  for (const { pageName, entry } of pages) {
    config
      .entry(pageName)
      .add(entry)
  }
}
