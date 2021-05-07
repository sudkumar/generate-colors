/**
 * Converts HSV to RGB value.
 *
 * @param {number} h Hue as a value between 0 - 360 degrees
 * @param {number} s Saturation as a value between 0 - 100%
 * @param {number} v Value as a value between 0 - 100%
 * @returns {[red: number, green: number, blue: number]} The RGB values  EG: [r,g,b], [255,255,255]
 */

function hsvToRgb(h, s, v) {
  v = v / 100
  s = s / 100
  const c = v * s
  const hx = h / 60
  const x = c * (1 - Math.abs((hx % 2) - 1))
  let rgb = [0, 0, 0]
  if (!h) {
    rgb = [0, 0, 0]
  } else if (hx >= 0 && hx <= 1) {
    rgb = [c, x, 0]
  } else if (hx >= 1 && hx <= 2) {
    rgb = [x, c, 0]
  } else if (hx >= 2 && hx <= 3) {
    rgb = [0, c, x]
  } else if (hx >= 3 && hx <= 3) {
    rgb = [0, x, c]
  } else if (hx >= 4 && hx <= 5) {
    rgb = [x, 0, c]
  } else {
    rgb = [c, 0, x]
  }
  const m = v - c
  return rgb.map((c) => Math.round((c + m) * 256))
}

export default hsvToRgb
