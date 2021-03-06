# Get colors for strings

## Use case

To differentiate between UI elements of different categories, we can use colors. For example, a unique color per event
type can be used in a Calendar UI to differentiate between different type of events. Sometimes, we may need to show a
unique background color for user's avatar when we don't have a profile picture.

## Install

```bash
npm i -S generate-colors
```

## Usage

Usage are pretty simple. Just import the `getColorForString` method from the module and call it with a string that
uniquely identifies an object (User Account, Event Type). The method returns an array with `[R, G, B]` values.

```js
import { getColorForString } from "generate-colors"

const color = getColorForString("First Name and Last Name")
// color = [90, 39, 50]
```

> Passing the same string again will result in the same color.

### Available Method

```js
/**
 * Generate the color a string
 * @param {string} str String for which we want to get the colors
 * @param {{ contrast: number }} [config={ contrast: 30 }] - Configuration for the color
 * @returns {Array} Array with R,G,B values in sequence
 */
function getColorForString(str, config): [number, number, number]
```

Visit [Playground](https://sudkumar.github.io/generate-colors/) to see in section.

### CLI

This module also exposes a CLI tool to generate colors from command line itself.

```bash
npx generate-colors "unique@example.com" --contrast=35
```

## Contribution

Any kind of contribution is most welcome!!

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
| test     | Run all the tests                          |
| lint     | To run the linter                          |
| coverage | To create the test coverage report         |
| dev      | To start the development with docs website |
| release  | To release a new version                   |

> Any script can be executed by calling `npm run <script_name>`.

## Licence

MIT
