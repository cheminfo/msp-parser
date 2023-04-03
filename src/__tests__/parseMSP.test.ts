import { readFileSync } from 'fs';
import { join } from 'path';

import { parseMSP } from '../index';

test('parseMSP', () => {
  const blob = readFileSync(join(__dirname, 'massBank.msp'));
  const results = parseMSP(blob);
  expect(results).toHaveLength(2);
  // @ts-expect-error It is a test we don't care
  expect(Object.keys(results[0].meta)).toStrictEqual([
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
  expect(results[0].variables).toStrictEqual({
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
