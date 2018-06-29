const { expect } = require('chai')
const faker = require('faker')
const getColorForString = require('../lib/getColorForString')
const checkAccessibility = require('../lib/checkAccessibility')

describe('Get color for string', function () {
  it('Shoud return a rgb list', function () {
    const word = faker.random.word()
    const color = getColorForString(word)
    expect(color).to.be.an('array')
    expect(color).to.have.lengthOf(3)
  })
  it('Shoud return same color for same string', function () {
    const word = faker.random.word()
    const color1 = getColorForString(word)
    const color2 = getColorForString(word)
    expect(color1).to.deep.equal(color2)
  })
  it('All color should pass the accessibility check against white, checking for 1000 string', function () {
    const whiteRgb = [255, 255, 255]
    for (let i = 0; i < 1000; i++) {
      const word = faker.random.word()
      const wordRgb = getColorForString(word)
      const result = checkAccessibility(whiteRgb, wordRgb)
      expect(result).to.have.property('warn', false)
    }
  })
})
