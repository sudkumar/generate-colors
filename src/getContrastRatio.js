/**
 * Get lumniance from rgb
 * @param {Array} rgb: [r, g, b]
 * @return {Integer} - l [0 - 255]
 */
function getLuminanceFromRgb(rgb) {
  rgb = rgb.map(c => {
    c = c / 255
    if (c <= 0.03928) {
      return c / 12.92
    } else {
      return Math.pow((c + 0.055) / 1.055, 2.4)
    }
  })
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

/**
 * Get for color contrast on two rgb values
 * @param {Array} rgb1: [r, g, b]
 * @param {Array} rgb2: [r, g, b]
 * @return {Number} ratio of color contrast
 */
function getContrastRatio([r1, g1, b1], [r2, g2, b2]) {
  // perform math for WCAG2
  let ratio = 1
  var l1 = getLuminanceFromRgb([r1, g1, b1])
  var l2 = getLuminanceFromRgb([r2, g2, b2])
  if (l1 >= l2) {
    ratio = (l1 + 0.05) / (l2 + 0.05)
  } else {
    ratio = (l2 + 0.05) / (l1 + 0.05)
  }
  ratio = Math.floor(ratio * 1000) / 1000 // round to 3 decimal places
  return ratio
}

export default getContrastRatio
