import { describe, expect, it } from 'vitest';
import {
  getVenueCanonicalName,
  getVenueDisplayName,
  getVenueSearchText,
} from '../venueUtils';

describe('venueUtils', () => {
  it('uses conventional shorthand for common venues', () => {
    expect(
      getVenueDisplayName('Advances in Neural Information Processing Systems')
    ).toBe('NeurIPS');
    expect(getVenueDisplayName('The Annals of Statistics')).toBe('AoS');
    expect(
      getVenueDisplayName(
        'Journal of the Royal Statistical Society Series B: Statistical Methodology'
      )
    ).toBe('JRSSB');
    expect(
      getVenueDisplayName('Journal of the American Statistical Association')
    ).toBe('JASA');
  });

  it('retains unknown venue names', () => {
    expect(getVenueDisplayName('A New Journal')).toBe('A New Journal');
  });

  it('canonicalizes acronyms for counting', () => {
    expect(getVenueCanonicalName('NeurIPS')).toBe(
      'Advances in Neural Information Processing Systems'
    );
  });

  it('canonicalizes the historical UAI venue name', () => {
    expect(
      getVenueCanonicalName('Uncertainty in Artificial Intelligence')
    ).toBe('Conference on Uncertainty in Artificial Intelligence');
    expect(getVenueDisplayName('Uncertainty in Artificial Intelligence')).toBe(
      'UAI'
    );
  });

  it('makes both the full name and acronym searchable', () => {
    const searchText = getVenueSearchText('The Annals of Statistics');
    expect(searchText).toContain('The Annals of Statistics');
    expect(searchText).toContain('AoS');
  });
});
