/** Light Arabic normalisation used for client-side search (diacritics, tatweel, alef/ya/ta-marbuta variants).
 *  The real backend performs its own normalisation; this only keeps the local search forgiving. */
export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .trim();
}
