// Shared headless-Chromium launcher for the probes in this folder.
// Chromium itself is a single self-contained binary kept out of git
// (see .gitignore); fetch it with tools/fetch-chromium.sh.
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const BIN = process.env.CHROMIUM_PATH || path.join(__dirname, '.chromium', 'chromium');

function launch(opts = {}) {
  if (!fs.existsSync(BIN)) {
    throw new Error(
      'Chromium binary not found at ' + BIN + '\n' +
      'Run:  bash tools/fetch-chromium.sh'
    );
  }
  return puppeteer.launch({
    executablePath: BIN,
    env: { ...process.env, LD_LIBRARY_PATH: path.join(__dirname, 'node_modules/@achingbrain/nss/linux') },
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
    ...opts,
  });
}

const APP = 'file://' + path.join(__dirname, '..', 'docs', 'mockup', 'index.html');
const OUT = process.env.SHOT_DIR || '/tmp/red';

module.exports = { launch, APP, OUT };
