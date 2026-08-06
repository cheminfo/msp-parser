import type { TextData } from 'cheminfo-types';

import { mspIterator } from './mspIterator.ts';
import type { MSPEntry } from './types.ts';

/**
 * Parse an MSP file containing one or many mass spectra.
 *
 * For large libraries prefer `mspIterator`, which yields the entries one by one
 * instead of building the whole array.
 * @param blob - The MSP data, as a string, an ArrayBuffer or a typed array.
 * @returns One measurement per entry found in the file.
 */
export function parseMSP(blob: TextData): MSPEntry[] {
  const results: MSPEntry[] = [];
  for (const entry of mspIterator(blob)) {
    results.push(entry);
  }
  return results;
}
