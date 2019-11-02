import pkg from "./package.json"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import svelte from "rollup-plugin-svelte"
import html from "rollup-plugin-fill-html"
import cleaner from "rollup-plugin-cleaner"

const production = !process.env.ROLLUP_WATCH

export default [
  // UMD
  {
    input: "src/index.js",
    output: {
      name: "generateColors",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/index.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
  },
  // CLI CommonJS (for Node)
  {
    input: "cli/index.js",
    output: {
      name: "generateColors",
      file: pkg.bin["generate-colors"],
      format: "cjs",
    },
  },
  // docs
  {
    input: "docs/main.js",
    output: {
      file: ".out/main.js",
      format: "iife", // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
    },
    plugins: [
      cleaner({
        targets: [".out"],
      }),
      resolve(), // tells Rollup how to find date-fns in node_modules
      commonjs(), // converts date-fns to ES modules
      svelte({}), // handle svelte
      production && terser(), // minify, but only in production
      html({
        template: "docs/index.html",
        filename: "index.html",
      }),
    ],
  },
]
