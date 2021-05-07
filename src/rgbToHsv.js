import getHueFromRgb from "./getHueFromRgb"
/**
 * Convert rgb to HSV
 * @param {number} r - red value [0- 255]
 * @param {number} g - red value [0- 255]
 * @param {number} b - red value [0- 255]
 * @return {[hue: number, saturation: number, value: number]} hsv - [h, s, v]
 */
function rgbToHsv(r, g, b) {
  r = r / 255
  g = g / 255
  b = b / 255
  const M = Math.max(r, g, b)
  const m = Math.min(r, g, b)
  const c = M - m
  let sat = 0
  if (M !== 0) {
    sat = (c / M) * 100
  }
  const hue = getHueFromRgb(r, g, b)
  const v = Math.max(r, g, b) * 100
  return [hue, Math.round(sat), Math.round(v)]
}

export default rgbToHsv
