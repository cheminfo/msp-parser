import type { TextData } from 'cheminfo-types';
import { ensureString } from 'ensure-string';

import { parseEntry } from './parseEntry.ts';
import type { MSPEntry } from './types.ts';

/**
 * Iterate over the spectra of an MSP file, yielding one entry at a time.
 *
 * Entries are separated by a blank line. Prefer this over `parseMSP` for large
 * libraries — the NIST releases hold more than 50000 spectra per file — because
 * it never materializes every measurement at once.
 * @param blob - The MSP data, as a string, an ArrayBuffer or a typed array.
 * @yields {MSPEntry} One measurement per entry found in the file.
 */
export function* mspIterator(blob: TextData): Generator<MSPEntry> {
  const text = ensureString(blob);
  let lines: string[] = [];
  let position = 0;

  while (position <= text.length) {
    let separator = text.indexOf('\n', position);
    if (separator === -1) separator = text.length;
    let end = separator;
    if (end > position && text.codePointAt(end - 1) === 13) end--;

    if (end === position) {
      if (lines.length > 0) {
        const entry = parseEntry(lines);
        if (entry !== undefined) yield entry;
        lines = [];
      }
    } else {
      lines.push(text.slice(position, end));
    }
    position = separator + 1;
  }

  if (lines.length > 0) {
    const entry = parseEntry(lines);
    if (entry !== undefined) yield entry;
  }
}
