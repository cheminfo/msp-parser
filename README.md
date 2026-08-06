# msp-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse the mass .msp format.

It is being used for the MassBank database releases.

## Installation

`$ npm i msp-parser`

This package is ESM-only. CommonJS consumers need Node.js ≥ 20.19, ≥ 22.12 or
any 24.x and later (where `require()` of ESM works), or should migrate to
`import`.

## Usage

`parseMSP` accepts the content of a `.msp` file as a string, an `ArrayBuffer` or
a typed array, and returns one
[`MeasurementXY`](https://github.com/cheminfo/cheminfo-types) per entry: `meta`
holds the `Key: value` header lines and `variables.x` / `variables.y` hold the
`m/z` and relative intensity of the peaks.

```js
import { parseMSP } from 'msp-parser';

const result = parseMSP(mspText);

// result[0].meta.Name -> 'Pyrophen'
// result[0].variables.x.data -> [91.0542, 125.0233, ...]
// result[0].variables.y.data -> [245, 999, ...]
```

```js
// not implemented yet
import { mspIterator } from 'msp-parser';
for (const entry of mspIterator(mspText)) {
  console.log(entry);
}
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/msp-parser.svg
[npm-url]: https://www.npmjs.com/package/msp-parser
[ci-image]: https://github.com/cheminfo/msp-parser/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/msp-parser/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/msp-parser.svg
[codecov-url]: https://codecov.io/gh/cheminfo/msp-parser
[download-image]: https://img.shields.io/npm/dm/msp-parser.svg
[download-url]: https://www.npmjs.com/package/msp-parser
