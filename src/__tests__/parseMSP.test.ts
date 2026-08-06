import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { parseMSP } from '../index.ts';

test('parseMSP', () => {
  const blob = readFileSync(join(import.meta.dirname, 'massBank.msp'));
  const results = parseMSP(blob);

  expect(results).toHaveLength(2);

  const [first] = results;

  expect(Object.keys(first?.meta ?? {})).toStrictEqual([
    'Name',
    'Synon',
    'DB#',
    'InChIKey',
    'InChI',
    'SMILES',
    'Precursor_type',
    'Spectrum_type',
    'PrecursorMZ',
    'Instrument_type',
    'Instrument',
    'Ion_mode',
    'Collision_energy',
    'Formula',
    'MW',
    'ExactMass',
    'Comments',
    'Splash',
    'Num Peaks',
  ]);
  expect(first?.variables).toStrictEqual({
    x: {
      data: [
        91.0542, 125.0233, 154.0499, 155.0577, 185.0961, 200.107, 229.0859,
        246.1125,
      ],
      label: 'm/z',
      units: 'u',
    },
    y: {
      data: [245, 999, 80, 355, 349, 45, 142, 734],
      label: 'Relative intensity',
      units: '%',
    },
  });

  expect(results).toMatchSnapshot();
});
