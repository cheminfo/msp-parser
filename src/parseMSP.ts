import type {
  MeasurementXY,
  MeasurementXYVariables,
  TextData,
} from 'cheminfo-types';
import { ensureString } from 'ensure-string';

/**
 * Parse a MSP file containing one or many mass spectra.
 * @param blob - The MSP data, as a string, an ArrayBuffer or a typed array.
 * @returns One measurement per entry found in the file.
 */
export function parseMSP(blob: TextData): MeasurementXY[] {
  const results = [];
  const entries = ensureString(blob).split(/\r?\n\r?\n/);
  for (const entry of entries) {
    results.push(parseEntry(entry));
  }
  return results;
}

function parseEntry(entry: string): MeasurementXY {
  const lines = entry.split(/\r?\n/);
  const mataLines = lines.filter((line: string) => /^[A-Za-z]/.exec(line));
  const dataLines = lines.filter((line: string) => /^[0-9]/.exec(line));

  const meta: Record<string, string> = {};
  for (const line of mataLines) {
    const [key, value] = line.split(':');
    if (key === undefined || value === undefined) continue;
    meta[key] = value.trim();
  }
  const variables: MeasurementXYVariables<number[]> = {
    x: {
      data: [],
      label: 'm/z',
      units: 'u',
    },
    y: {
      data: [],
      label: 'Relative intensity',
      units: '%',
    },
  };
  for (const line of dataLines) {
    const [x, y] = line.split(' ');
    variables.x.data.push(Number(x));
    variables.y.data.push(Number(y));
  }
  return {
    variables,
    meta,
  };
}
