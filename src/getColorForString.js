import rgbToHsv from "./rgbToHsv"
import hsvToRgb from "./hsvToRgb"

const defaultOptions = {
  contrast: 35,
}

export default function getColorForString(str = "", options = {}) {
  options = Object.assign({}, defaultOptions, options)
  const letters = str.split("")
  // get the hash
  const hash = letters.reduce((hash, l) => {
    const val = l.charCodeAt()
    return val * val * val * val + hash
  }, 0)
  // int to rgb
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  const hex = "000000".substring(0, 6 - c.length) + c
  const int = parseInt(hex, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  const [hue, sat, val] = rgbToHsv(r, g, b)
  let brightness = Math.min(val, 35)
  if (options.brightness !== undefined) {
    brightness = options.brightness
  } else if (options.contrast !== undefined) {
    // this is to ensure backward compatibility
    // options.contrast has been deprecated
    brightness = Math.min(val, options.contrast)
  }
  if (typeof brightness === "function") {
    brightness = brightness(Math.min(val, 35))
  }
  let saturation = sat
  if (options.saturation !== undefined) {
    saturation = options.saturation
  }
  if (typeof saturation === "function") {
    saturation = saturation(sat)
  }
  const rgb = hsvToRgb(hue, saturation, brightness)
  return rgb
}

export function makeGetColorForOptions(options = {}) {
  // cache the calculated colors
  let colorForString = {
    "": [0, 0, 0],
  }
  return function generateColors(str = "") {
    const cacheKey = str
    if (colorForString[cacheKey]) {
      return colorForString[cacheKey] || [0, 0, 0]
    }
    if (!str) {
      return colorForString[cacheKey] || [0, 0, 0]
    }
    const rgb = getColorForString(str, options)
    colorForString[cacheKey] = rgb
    return rgb
  }
}
