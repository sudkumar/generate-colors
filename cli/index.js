#!/usr/bin/env node

import getColorForString from "../src/getColorForString"

const [, , ...args] = process.argv

function parseOptions(args) {
  let options = {}
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    let key, value
    switch (true) {
      case /^--.+=/.test(arg):
        // when --options=value
        var m = arg.match(/^--([^=]+)=([\s\S]*)$/)
        key = m[1]
        value = m[2]
        options[key] = value
        break
      case /^--.+/.test(arg):
        // when --options value
        key = arg.match(/^--(.+)/)[1]
        value = args[i + 1]
        options[key] = value
        break
      default:
        break
    }
  }
  return options
}

if (args.length) {
  const str = args[0]
  const options = parseOptions(args)
  const [R, G, B] = getColorForString(str, options)
  process.stdout.write(`R: ${R}, G: ${G}, B: ${B}` + "\n")
} else {
  process.stderr.write("Error: Please provide a string to generate color")
}
