# msp-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Parse the mass .msp format.

It is being used for the MassBank and NIST database releases.

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

A field that appears several times in one entry — `Synon` is the usual case — is
collected into an array, in the order it was encountered, so no value is lost.

```js
// result[1].meta.Synon -> ['F2 Toxin', '(2E,11S)-15,17-dihydroxy-...']
```

### Iterating over a large library

A NIST release holds more than 50000 spectra per file. `mspIterator` yields the
entries one at a time instead of building the whole array:

```js
import { mspIterator } from 'msp-parser';

for (const entry of mspIterator(mspText)) {
  console.log(entry.meta.Name, entry.variables.x.data.length);
}
```

### Dialects

Both layouts of the peak list are supported: one pair per line as MassBank
writes it (`91.0542 245`), and several pairs packed on one line separated by
semicolons as NIST writes it (`12 108; 13 229; 14 999;`).

NIST also packs the two registry numbers on a single line; they are returned as
two separate fields:

```
CAS#: 1333-74-0;  NIST#: 245692
```

```js
// entry.meta['CAS#']  -> '1333-74-0'
// entry.meta['NIST#'] -> '245692'
```

Only a semicolon followed by something shaped like a field label starts a new
field, so a value that merely contains semicolons — such as the extra CAS
numbers NIST stores as `Synon: $:24156457-45-3; 263005-65-8` — is kept whole.
Keys are split on their first colon, so a value containing a colon (a name such
as `14,15:21,23-diepoxy-...`) is preserved.

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
