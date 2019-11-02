const { expect } = require("chai")
const faker = require("faker")
const { getColorForString } = require("../dist/index")

describe("Get color for string", function() {
  it("Shoud return a rgb list", function() {
    const word = faker.random.word()
    const color = getColorForString(word)
    expect(color).to.be.an("array")
    expect(color).to.have.lengthOf(3)
  })
  it("Shoud return same color for same string", function() {
    const word = faker.random.word()
    const color1 = getColorForString(word)
    const color2 = getColorForString(word)
    expect(color1).to.deep.equal(color2)
  })
})
