// Shared headless-Chromium launcher for the probes in this folder.
// Chromium itself and its runtime libraries are kept out of git
// (see .gitignore); fetch them once with tools/fetch-chromium.sh.
const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_DIR = path.join(__dirname, '.chromium');
const CHROME_LIB = path.join(CHROME_DIR, 'lib');
const NSS_LIB = path.join(__dirname, 'node_modules/@achingbrain/nss/linux');
const BIN = process.env.CHROMIUM_PATH || path.join(CHROME_DIR, 'chromium');
const GRAPHICS_LIBS = [
  'libEGL.so',
  'libGLESv2.so',
  'libvk_swiftshader.so',
  'libvulkan.so.1',
  'vk_swiftshader_icd.json',
];

function ensureGraphicsRuntime() {
  // The npm-hosted Chromium build resolves these from the system temp dir.
  for (const name of GRAPHICS_LIBS) {
    const source = path.join(CHROME_DIR, name);
    const target = path.join(os.tmpdir(), name);
    if (fs.existsSync(source) && !fs.existsSync(target)) {
      fs.copyFileSync(source, target);
    }
  }
}

function launch(opts = {}) {
  if (!fs.existsSync(BIN)) {
    throw new Error(
      'Chromium binary not found at ' + BIN + '\n' +
      'Run:  bash tools/fetch-chromium.sh'
    );
  }
  ensureGraphicsRuntime();
  const libraryPath = [CHROME_LIB, NSS_LIB, process.env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(path.delimiter);
  return puppeteer.launch({
    executablePath: BIN,
    env: { ...process.env, LD_LIBRARY_PATH: libraryPath },
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    ...opts,
  });
}

const APP = 'file://' + path.join(__dirname, '..', 'docs', 'mockup', 'index.html');
const OUT = process.env.SHOT_DIR || '/tmp/red';

module.exports = { launch, APP, OUT };
