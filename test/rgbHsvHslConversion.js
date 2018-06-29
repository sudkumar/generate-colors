const { expect } = require('chai')
const hsvToRgb = require('../lib/hsvToRgb')
const rgbToHsv = require('../lib/rgbToHsv')

describe('Check conversion for RGB, HSV, HSL', function () {
  it('Checking hsv to rgb conversion', function() {
    const rgb = [123, 45, 56]
    const hsv = rgbToHsv.apply(null, rgb)
    expect(rgb).to.deep.equal(hsvToRgb.apply(null, hsv))
  });
  it('Checking rgb to hsv conversion', function() {
    const hsv = [120, 20, 80]
    const rgb = hsvToRgb.apply(null, hsv)
    expect(hsv).to.deep.equal(rgbToHsv.apply(null, rgb))
  });
})
