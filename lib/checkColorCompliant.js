/**
 * Check for color compaliant
 * @param {Array} rgb1: [r, g, b]
 * @param {Array} rgb2: [r, g, b]
 * @return {Number} with result of color compliant checks where -1 represents the sort of.. stuff
 */
function checkColorCompliant ([r1, g1, b1], [r2, g2, b2]) {
  // perform math for WCAG1
  const brightnessThreshold = 125;
  const colorThreshold = 500;
  const Y1 = ((r1 * 299) + (g1 * 587) + (b1 * 114)) / 1000;
  const Y2 = ((r2 * 299) + (g2 * 587) + (b2 * 114)) / 1000;
  const brightnessDifference = Math.abs(Y1 - Y2)
  const colorDifference = (Math.max(r1, r2) - Math.min(r1, r2)) +
      (Math.max(g1, g2) - Math.min(g1, g2)) +
      (Math.max(b1, b2) - Math.min(b1, b2));

  let colorCompliant = 0
  if ((brightnessDifference >= brightnessThreshold) && (colorDifference >= colorThreshold))   {
    colorCompliant = 1
  } else if ((brightnessDifference >= brightnessThreshold) || (colorDifference >= colorThreshold)) {
    colorCompliant = -1
  }
  return colorCompliant
}

module.exports = checkColorCompliant
