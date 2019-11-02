const { expect } = require("chai")
const faker = require("faker")
const exec = require("child_process").exec

const cli_path = require.resolve("./../cli/generate-colors")

function runCli(args = "") {
  return new Promise((resolve, reject) => {
    exec(`node ${cli_path} ${args}`, function callback(error, stdout, stderr) {
      if (error || stderr) {
        reject(error || stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

describe("CLI", function() {
  it("should work", function() {
    const word = faker.random.word()
    return runCli(word).then(output => {
      expect(output).to.not.be.empty
    })
  })
  it("should require a string", function() {
    return runCli().catch(error => {
      expect(error).to.not.be.empty
    })
  })

  it("should return same result for same string", function() {
    const word = faker.random.word()
    return runCli(word).then(stdout => {
      return runCli(word).then(newStdout => {
        expect(stdout).to.be.equal(newStdout)
      })
    })
  })

  it("should handle options", function() {
    const word = faker.random.word()
    return runCli(word).then(stdout => {
      return runCli(`${word} --contrast=60`).then(newStdout => {
        expect(stdout).to.not.equal(newStdout)
      })
    })
  })
})
