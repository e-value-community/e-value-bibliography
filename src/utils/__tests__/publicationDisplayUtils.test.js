import { describe, expect, it } from 'vitest';
import { getPublicationDisplayData } from '../publicationDisplayUtils';

describe('getPublicationDisplayData', () => {
  it('identifies common manuscript repositories', () => {
    expect(
      getPublicationDisplayData({
        name: 'Manuscript',
        year: 2026,
        doi: '10.2139/ssrn.7100358',
      }).displayLabel
    ).toBe('SSRN working paper · 2026');
    expect(
      getPublicationDisplayData({
        name: 'Manuscript',
        year: 2026,
        url: 'https://doi.org/10.25740/hv421yk6687',
      }).displayLabel
    ).toBe('Stanford report · 2026');
    expect(
      getPublicationDisplayData({
        name: 'Manuscript',
        year: 2026,
        url: 'https://openreview.net/forum?id=example',
      }).displayLabel
    ).toBe('OpenReview preprint · 2026');
  });

  it('labels a manuscript with a publisher book DOI as a book', () => {
    expect(
      getPublicationDisplayData({
        name: 'Manuscript',
        year: 2025,
        doi: '10.1561/3600000002',
      }).displayLabel
    ).toBe('Book · 2025');
  });

  it('uses a clear fallback for an author-hosted manuscript', () => {
    expect(
      getPublicationDisplayData({
        name: 'Manuscript',
        year: 2026,
        url: 'https://example.edu/paper.pdf',
      }).displayLabel
    ).toBe('Author-hosted manuscript · 2026');
  });

  it('keeps compact conventional labels for publication venues', () => {
    const publication = getPublicationDisplayData({
      name: 'The Annals of Statistics',
      year: 2024,
    });
    expect(publication.displayLabel).toBe("AoS '24");
    expect(publication.isRepository).toBe(false);
  });
});
