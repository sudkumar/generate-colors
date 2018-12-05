const rgbToHsv = require('./rgbToHsv')
const hsvToRgb = require('./hsvToRgb')

// cache the calculated colors
let colorForString = {
  '': [0, 0, 0]
}

function getColorForString (str = '') {
  if (colorForString[str]) {
    return colorForString[str]
  }
  if (!str) {
    return colorForString['']
  }
  const letters = str.split('');
  // get the hash
  const hash = letters.reduce((hash, l) => {
    const val = l.charCodeAt()
    return val * val * val * val + hash
  }, 0)
  // int to rgb
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
  const hex = "000000".substring(0, 6 - c.length) + c
  const int = parseInt(hex, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = (int) & 255

  const [hue, sat, val] = rgbToHsv(r, g, b)
  // value to 35 for contrast
  const rgb = hsvToRgb(hue, sat, Math.min(val, 35))
  colorForString[str] = rgb
  return rgb
}

module.exports = getColorForString
