import type { MeasurementXY } from 'cheminfo-types';

/**
 * A single spectrum parsed from an MSP file.
 *
 * `meta` holds every field of the entry, keyed by its label. A field that
 * appears several times in one entry (`Synon` is the usual case) is collected
 * into an array in the order it was encountered, so no value is ever lost.
 */
export interface MSPEntry extends MeasurementXY<number[]> {
  meta: Record<string, string | string[]>;
}
