/*
 * Self-contained build for offline use.
 *
 * `vite build` alone still leaves absolute `/images/...` strings inside the JS bundle,
 * which break when the folder is opened over file://. This plugin rewrites those to
 * relative `images/...` at build time (no runtime patching, no dev-server-only tricks).
 */
const IMAGE_REWRITE = /(['"`])\/images\//g

function relativiseImages() {
  let isBuild = false
  return {
    name: 'kapaya-relative-images',
    apply: 'build',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    transform(code, id) {
      if (!isBuild) return null
      if (!id.includes('/src/')) return null
      if (!code.includes('/images/')) return null
      return { code: code.replace(IMAGE_REWRITE, '$1images/'), map: null }
    },
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.css')) continue
        if (typeof file.source !== 'string') continue
        file.source = file.source.replace(/url\(\/images\//g, 'url(images/')
      }
    },
  }
}

export default relativiseImages
