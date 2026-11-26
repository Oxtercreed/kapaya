// Inlines the 2x screenshots into code.js so the plugin works offline.
const fs = require('fs')
const path = require('path')

const IMG_DIR = path.join(__dirname, 'img')
const files = {
  '05-login': '05-login.b64',
  '06-home': '06-home.b64',
  '07-shop': '07-shop.b64',
  '08-product': '08-product.b64',
  '09-bag': '09-bag.b64',
  '10-checkout': '10-checkout.b64',
  '11-order-confirmed': '11-order-confirmed.b64',
  '12-account': '12-account.b64',
  '13-chat': '13-chat.b64',
}

const entries = Object.entries(files).map(([key, file]) => {
  const b64 = fs.readFileSync(path.join(IMG_DIR, file), 'utf8').trim()
  return `  '${key}': '${b64}'`
})

const src = fs.readFileSync(path.join(__dirname, 'src', 'code.js'), 'utf8')
const out = src.replace('__IMAGES__', `{\n${entries.join(',\n')}\n}`)
fs.writeFileSync(path.join(__dirname, 'code.js'), out)
console.log('code.js —', (out.length / 1048576).toFixed(2), 'MB')
