import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { mspIterator, parseMSP } from '../index.ts';

const blob = readFileSync(join(import.meta.dirname, 'nist.msp'));

test('parses every entry of a NIST library', () => {
  const results = parseMSP(blob);

  expect(results).toHaveLength(5);
  expect(results.map((result) => result.meta.Name)).toStrictEqual([
    'Hydrogen',
    'Diazirine',
    'Methane',
    'D-Homo-24-nor-17-oxachola-20,22-diene-3,7,16-trione, 14,15:21,23-diepoxy-4,4,8-trimethyl-, (5α,13α,14β,15β,17aα)-',
    'Nitrogen',
  ]);
});

test('splits the registry numbers packed on a single line', () => {
  const [hydrogen, diazirine] = parseMSP(blob);

  expect(hydrogen?.meta['CAS#']).toBe('1333-74-0');
  expect(hydrogen?.meta['NIST#']).toBe('245692');
  expect(hydrogen?.meta['DB#']).toBe('1');

  // An entry without a CAS number carries the NIST number on its own line.
  expect(diazirine?.meta['CAS#']).toBeUndefined();
  expect(diazirine?.meta['NIST#']).toBe('305841');
});

test('keeps every repeated field', () => {
  const [hydrogen] = parseMSP(blob);

  expect(hydrogen?.meta.Synon).toStrictEqual([
    'Dihydrogen',
    'o-Hydrogen',
    'p-Hydrogen',
    'Molecular hydrogen',
    'H2',
    'UN 1049',
    'UN 1966',
  ]);
});

test('reads the peaks packed several per line', () => {
  const results = parseMSP(blob);
  const diazirine = results[1];

  expect(diazirine?.meta['Num Peaks']).toBe('12');
  expect(diazirine?.variables.x.data).toStrictEqual([
    12, 13, 14, 15, 26, 27, 28, 29, 40, 41, 42, 43,
  ]);
  expect(diazirine?.variables.y.data).toStrictEqual([
    108, 229, 999, 22, 18, 58, 178, 23, 18, 108, 431, 8,
  ]);
});

test('the peak count matches the declared Num Peaks for every entry', () => {
  for (const entry of mspIterator(blob)) {
    const declared = Number(entry.meta['Num Peaks']);

    expect(entry.variables.x.data).toHaveLength(declared);
    expect(entry.variables.y.data).toHaveLength(declared);
  }
});

test('a value holding semicolons is not split into fields', () => {
  const nitrogen = parseMSP(blob)[4];
  const synonyms = nitrogen?.meta.Synon as string[];

  expect(synonyms.at(-1)).toBe(
    '$:24156457-45-3; 263005-65-8; 745765-07-5; 93037-13-9; 161728-27-4; 882528-56-5; 778548-56-4; 794449-54-0',
  );
  expect(nitrogen?.meta['CAS#']).toBe('7727-37-9');
  expect(Object.keys(nitrogen?.meta ?? {})).toStrictEqual([
    'Name',
    'Synon',
    'Comments',
    'Formula',
    'MW',
    'CAS#',
    'NIST#',
    'DB#',
    'Num Peaks',
  ]);
});

test('a value holding a colon is kept whole', () => {
  const entry = parseMSP(blob)[3];

  expect(entry?.meta.Formula).toBe('C26H32O6');
  expect((entry?.meta.Synon as string[])[0]).toBe(
    '16,17-Seco-24-nor-5α,13α,14β,17α-chola-20,22-dien-16-oic acid, 14,15β:21,23-diepoxy-17-hydroxy-4,4,8-trimethyl-3,7-dioxo-, δ-lactone',
  );
  expect(entry?.variables.x.data).toHaveLength(263);
  expect(entry?.variables.x.data.at(-1)).toBe(440);
  expect(entry?.variables.y.data.at(-1)).toBe(1);
});

test('mspIterator yields the same entries as parseMSP', () => {
  expect([...mspIterator(blob)]).toStrictEqual(parseMSP(blob));
});

test('parseMSP', () => {
  expect(parseMSP(blob)).toMatchSnapshot();
});
