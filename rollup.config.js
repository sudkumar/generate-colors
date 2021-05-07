import pkg from "./package.json"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"
import svelte from "rollup-plugin-svelte"
import html from "@rollup/plugin-html"
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
        filename: "index.html",
        title: "Generate colors for a string with accessibility complaint",
        template: function ({ files, attributes, title, meta, publicPath }) {
          const scripts = (files.js || [])
            .map(({ fileName }) => {
              const attrs = makeHtmlAttributes(attributes.script)
              return `<script src="${publicPath}${fileName}"${attrs}></script>`
            })
            .join("\n")
          const links = (files.css || [])
            .map(({ fileName }) => {
              const attrs = makeHtmlAttributes(attributes.link)
              return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`
            })
            .join("\n")

          const metas = meta
            .map((input) => {
              const attrs = makeHtmlAttributes(input)
              return `<meta${attrs}>`
            })
            .join("\n")
          return `<!DOCTYPE html>
<html ${attributes}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
    <style>
      @import url("https://fonts.googleapis.com/css?family=Lato:400");
      html {
        font-size: 16px;
        height: 100%;
      }

      @media all and (max-width: 959px) and (min-width: 600px) {
        html {
          font-size: 15px;
        }
      }

      @media all and (max-width: 599px) and (min-width: 320px) {
        html {
          font-size: 13px;
        }
      }
      html,
      body {
        height: 100%;
        min-height: 100%;
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: "Lato", sans-serif;
        line-height: 1.6;
        font-weight: 400;
        margin: 0;
        min-height: 100%;
        background: white;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="root" />
    ${scripts}
  </body>
</html>`
        },
      }),
    ],
  },
]
export const makeHtmlAttributes = (attributes) => {
  if (!attributes) {
    return ""
  }

  const keys = Object.keys(attributes)
  // eslint-disable-next-line no-param-reassign
  return keys.reduce(
    (result, key) => (result += ` ${key}="${attributes[key]}"`),
    ""
  )
}
