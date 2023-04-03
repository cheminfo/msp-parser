# msp-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm i msp-parser`

## Usage

```js
import { parseMSP } from 'msp-parser';

const result = parseMSP(mspText);
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
