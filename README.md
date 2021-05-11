# Get Unique and Accessible Colors

This is a JavaScript module which allows you to get unique
and accessible colors for a given input (name, email, user
id etc.). Common use cases involves generating unique and
consistant colors for user avatars or tags badges in your
application.

## Example

```html
<script>
  // Get color for an account.
  // The color will be unique for this unique and consistant (same)
  // on all invocations for this email
  // No need to store it to databases!!

  const [r, g, b] = getColorForString("unique.email@domain.com")
</script>

<!-- set text and background color for avatar -->
<div style="color: rgb(r,g,b); background: rgba(r,g,b,.2);">UE</div>
```

## Features

- Get unique colors for string
- WCAG Level AAA accessible color by default
- Same color for repeated invocations of same string
- Usage [HSV](https://en.wikipedia.org/wiki/HSL_and_HSV) to generate colors
- Customize `brightness` and `saturation` of hue according to needs
- CLI helper
- Caching helper

## Demo

Check out the demo [here ->](https://sudkumar.github.io/generate-colors/)

## Installation

Install `generate-colors` with npm/yarn

```bash
# for npm
npm i -S generate-colors

# for yarn
yarn add generate-colors
```

You can also use the browser umd module to directly include
it on a web page.

```html
<!-- This will fetch the latest version of this page -->
<script src="https://unpkg.com/generate-colors"></script>
<!-- You can also specify a version-->
<script src="https://unpkg.com/generate-colors@1"></script>
<script>
  const { getColorForString } = generateColors
  const [r, g, b] = getColorForString("sab1h2bsdfk4.adfh122.12")
</script>
```

### CLI

You can also get colors using the cli helper.

```
# npm (this works even if you have not installed the package!)
npx generate-colors "unique@example.com" --brightness=35 --saturation=70

# yarn
yarn generate-colors "unique@example.com" --brightness=35 --saturation=70
```

## Usage/Examples

This module uses [HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
to generate accessible colors. This module exports two utility
method:

- `getColorForString` => Returns color in rgb format for a given string
- `makeGetColorForOptions` => Used for caching the resulted colors

```js
import { getColorForString, makeGetColorForOptions } from "generate-colors"

// pass a string to it and get an accessible color
const [r, g, b] = getColorForString("user.unique.id")

// If you have too many (10k+) call to getColorForString with repeated
// input string, it might impact the performance.
// To solve this, a utility is provided for color caching
const getColorWithOptions = makeGetColorForOptions(/* you can pass options here, see below*/)
const [r, g, b] = getColorWithOptions("user.unique.id")
```

You can also control the brightness and saturation of the generated
color. Here are some examples. For full details, please checkout
the [API Reference](#api-reference)

### Generate color for different themes

The default color is optimized for light theme i.e. the
generated colors have lesser brightness values (lesser
`V` in HSV). But the package provide configuration options
to control the `brightness` and `saturation`. These options
allows use to generate different shades of the same hue for
different themes.

#### Light Theme

The default colors are options for light themes.

```js
import { getColorForString } from "generate-colors"

const [r, g, b] = getColorForString("user.unique.id")
```

You may find these colors a bit too dark because the
package ensures the accessibility [WCAG Level AAA](https://www.w3.org/TR/UNDERSTANDING-WCAG20/conformance.html) for all generated colors.

If you some flexibility regarding accessibility or
using colors at places where accessibility is not so
much of a concern, you can increase the brightness
for better results.

```javascript
import { getColorForString } from "generate-colors"

const [r, g, b] = getColorForString("user.unique.id", {
  // let's constrain the brightness between 30 to 60
  // We should not increase it too much otherwise the
  // color will become too bright and unaccessible
  brightness: (defaultValue) => {
    if (defaultValue <= 30) return 30
    if (defaultValue >= 60) return 60
    return defaultValue
  },
})
```

You can adjust these configuration according to your needs.

#### Dark Theme

For dark theme, we will have to control both brightness
and saturation. We will make the hue brighter to make them
visible in dark mode. We will also control the saturation
because fully saturated colors don't look good on dark themes.

```javascript
import { getColorForString } from "generate-colors"

const [r, g, b] = getColorForString("user.unique.id", {
  // let's constrain the brightness between 60 to 90
  // We should not decrease it too much otherwise the
  // color will become too dark and unaccessible
  brightness: (defaultValue) => {
    if (defaultValue <= 60) return 60
    if (defaultValue >= 90) return 90
    return defaultValue
  },
  // Let's constrain the saturation between 30 to 70
  // We should not increase/decrease it too much otherwise the
  // color will become too dark/light and unaccessible
  saturation: (defaultValue) => {
    if (defaultValue <= 30) return 30
    if (defaultValue >= 70) return 70
    return defaultValue
  },
})
```

You can adjust these configuration according to your needs.

For a full reference, please check the [API Reference](#api-reference).

## API Reference

This module uses [HSV](https://en.wikipedia.org/wiki/HSL_and_HSV)
to generate accessible colors.

```typescript
export {
    getColorForString: GetColorForString,
    makeGetColorForOptions: MakeGetColorForOptions
}

type GetColorForString = (
    str: string,
    options?: Options
    ) => [red: number, green: number, blue: number]

type MakeGetColorForOptions = (
    options?: Options
    ) => (
        str: string
        ) => [red: number, green: number, blue: number]

type Options = {
    /**
     * Control the brightness/value in HS[V] model.
     *
     * NOTE: If you provide a custom value, you will have
     * to check for accessibility yourself. The default
     * values are checked for accessibility.
     *
     * @default (defaultBrightness) => defaultBrightness
     */
    brightness?:
        | number
        | ((
            /**
             * The default brightness. Use it to
             * constrain the brightness to your
             * desired values.
             */
            defaultBrightness: number
          ) => number)

    /**
     * Control the saturation in H[S]V model
     *
     * NOTE: If you provide a custom value, you will have
     * to check for accessibility yourself. The default
     * values are checked for accessibility.
     *
     * @default (defaultSaturation) => defaultSaturation
     */
    saturation?:
        | number
        | ((
            /**
             * The default saturation. Use it to
             * constrain the saturation to your
             * desired values
             */
            defaultSaturation: number
          ) => number)
}
```

## Contributing

Contributions are always welcome!

### Setup

1. Fork the repository to your account.
2. Clone the repository and install dependencies.

```bash
git clone git@github.com:<your_username>/generate-colors
cd generate-colors
npm install
```

3. The source code exists in `/src` directory.

### Available Scripts

| Script   | Description                                |
| :------- | :----------------------------------------- |
| dev      | To start the development with docs website |
| release  | To release a new version                   |
| test     | Run all the tests                          |
| lint     | To run the linter                          |
| coverage | To create the test coverage report         |

> Any script can be executed by calling `npm run <Script>`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
