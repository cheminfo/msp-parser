import type { MSPEntry } from './types.ts';

const FIELD = /^(?<key>[A-Za-z][^:]*):(?<value>.*)$/;

/**
 * A few dialects pack a second field at the end of a line, separated by a
 * semicolon. NIST does it for the registry numbers:
 * `CAS#: 1333-74-0;  NIST#: 245692`. The embedded label must look like a field
 * name, so a value that merely contains semicolons — such as the extra CAS
 * numbers in `Synon: $:24156457-45-3; 263005-65-8` — is left untouched.
 */
const EMBEDDED_FIELD = /;[^\S\n]*(?<key>[A-Za-z][A-Za-z0-9_#]*)[^\S\n]*:/;

/**
 * Parse the lines of one MSP entry.
 * @param lines - Lines of the entry, without the separating blank line.
 * @returns The measurement, or undefined if the entry held no data at all.
 */
export function parseEntry(lines: string[]): MSPEntry | undefined {
  const meta: Record<string, string | string[]> = {};
  const x: number[] = [];
  const y: number[] = [];

  for (const line of lines) {
    const match = FIELD.exec(line);
    if (match?.groups) {
      addField(meta, match.groups.key as string, match.groups.value as string);
    } else {
      addPeaks(line, x, y);
    }
  }

  if (Object.keys(meta).length === 0 && x.length === 0) return undefined;

  return {
    variables: {
      x: { data: x, label: 'm/z', units: 'u' },
      y: { data: y, label: 'Relative intensity', units: '%' },
    },
    meta,
  };
}

function addField(
  meta: Record<string, string | string[]>,
  key: string,
  value: string,
): void {
  const match = EMBEDDED_FIELD.exec(value);
  if (match?.groups) {
    const { index, groups } = match;
    addValue(meta, key.trim(), value.slice(0, index));
    addField(meta, groups.key as string, value.slice(index + match[0].length));
    return;
  }
  addValue(meta, key.trim(), value);
}

function addValue(
  meta: Record<string, string | string[]>,
  key: string,
  rawValue: string,
): void {
  const value = rawValue.trim();
  const existing = meta[key];
  if (existing === undefined) {
    meta[key] = value;
  } else if (typeof existing === 'string') {
    meta[key] = [existing, value];
  } else {
    existing.push(value);
  }
}

// A data line holds one `m/z intensity` pair per semicolon-separated group.
// NIST packs several groups on one line (`12 108; 13 229; 14 999;`) while
// MassBank writes a single pair per line (`91.0542 245`).
function addPeaks(line: string, x: number[], y: number[]): void {
  let start = 0;
  while (start < line.length) {
    let end = line.indexOf(';', start);
    if (end === -1) end = line.length;
    addPeak(line, start, end, x, y);
    start = end + 1;
  }
}

function addPeak(
  line: string,
  start: number,
  end: number,
  x: number[],
  y: number[],
): void {
  const mass = readNumber(line, start, end);
  if (mass === undefined) return;
  const intensity = readNumber(line, mass.next, end);
  if (intensity === undefined) return;
  x.push(mass.value);
  y.push(intensity.value);
}

function readNumber(
  line: string,
  from: number,
  end: number,
): { value: number; next: number } | undefined {
  let start = from;
  while (start < end && isSeparator(line.codePointAt(start))) start++;
  let stop = start;
  while (stop < end && !isSeparator(line.codePointAt(stop))) stop++;
  if (stop === start) return undefined;
  const value = Number(line.slice(start, stop));
  if (Number.isNaN(value)) return undefined;
  return { value, next: stop };
}

// Peak lines only ever hold digits, dots, spaces, tabs and a trailing carriage
// return, so every control character up to the space separates two numbers.
function isSeparator(code: number | undefined): boolean {
  return code === undefined || code <= 32;
}
