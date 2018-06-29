/**
 * Get the Hue from RGB
 * @param {Integer} r - red value [0- 255]
 * @param {Integer} g - red value [0- 255]
 * @param {Integer} b - red value [0- 255]
 * @return {Integer} - hue - 0 - 360
 */
function getHueFromRgb (r, g, b) {
  const M = Math.max(r, g, b)
  const m = Math.min(r, g, b)
  const c = M - m
  let hx = 0
  if (c === 0) {
    hx = 0
  } else if (M === r) {
    hx = ((g - b) / c) % 6
  } else if (M === g) {
    hx = ((b - r) / c) + 2
  } else if (M === b) {
    hx = ((r - g) / c) + 4
  }
  hx = hx * 60
  if (hx < 0) {
    hx = hx + 360
  }
  return Math.round(hx)
}

module.exports = getHueFromRgb
