import checkColorCompliant from "./checkColorCompliant"
import getContrastRatio from "./getContrastRatio"
/**
 * Accessibility checks
 * @param {Array} rgb1: [r, g, b]
 * @param {Array} rgb2: [r, g, b]
 * @return {Object} - accessibility check results
 */
function checkAccessibility([r1, g1, b1], [r2, g2, b2]) {
  const colorCompliant = checkColorCompliant([r1, g1, b1], [r2, g2, b2])
  const contrastRatio = getContrastRatio([r1, g1, b1], [r2, g2, b2])
  const w2b = contrastRatio >= 4.5 ? 1 : 0
  const w2a = contrastRatio >= 3 ? 1 : 0
  const w2aaab = contrastRatio >= 7 ? 1 : 0
  const w2aaaa = contrastRatio >= 4.5 ? 1 : 0

  return {
    colorCompliant,
    contrastRatio,
    w2b,
    w2a,
    w2aaab,
    w2aaaa,
    warn:
      !colorCompliant || !contrastRatio || !w2b || !w2a || !w2aaab || !w2aaaa,
  }
}

export default checkAccessibility
