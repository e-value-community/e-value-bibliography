import { describe, expect, it } from 'vitest';
import { hasNamedAuthors } from '../../../scripts/paperAuthorPolicy.js';

describe('paper author policy', () => {
  it('accepts named authors in scalar and list forms', () => {
    expect(hasNamedAuthors('A. Author')).toBe(true);
    expect(hasNamedAuthors(['A. Author', 'B. Author'])).toBe(true);
  });

  it.each([
    undefined,
    '',
    [],
    'Anonymous',
    'Anonymous authors',
    'Anonymous, not publicly disclosed',
    'Unknown authors',
    'Not yet verified',
    'N/A',
    'TBD',
  ])('rejects unavailable author value %j', authors => {
    expect(hasNamedAuthors(authors)).toBe(false);
  });
});
