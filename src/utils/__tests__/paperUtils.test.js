import { describe, it, expect } from 'vitest';
import {
  formatAuthors,
  getMainPublication,
  hasBibtex,
  getBibtexEntries,
  getPaperFirstAppearanceYear,
  getPaperFinalPublicationYear,
  getPaperVersionOfRecordYear,
  getPaperFirstAppearanceSortKey,
  comparePapersByDatabaseAdded,
  getPaperYearByBasis,
} from '../paperUtils';

describe('paper year helpers', () => {
  const paper = {
    year: 2026,
    publications: [
      { name: 'Journal', year: 2026 },
      { name: 'arXiv', year: 2024 },
    ],
  };

  it('distinguishes first appearance from final publication', () => {
    expect(getPaperFirstAppearanceYear(paper)).toBe(2024);
    expect(getPaperFinalPublicationYear(paper)).toBe(2026);
    expect(getPaperYearByBasis(paper, 'first')).toBe(2024);
    expect(getPaperYearByBasis(paper, 'final')).toBe(2026);
  });

  it('uses explicit curated year fields when present', () => {
    const curatedPaper = { ...paper, first_year: 2023, final_year: 2025 };
    expect(getPaperFirstAppearanceYear(curatedPaper)).toBe(2023);
    expect(getPaperFinalPublicationYear(curatedPaper)).toBe(2025);
  });

  it('uses the same year for an unpublished manuscript', () => {
    const manuscript = {
      year: 2024,
      publications: [{ name: 'Manuscript', year: 2024 }],
    };
    expect(getPaperFirstAppearanceYear(manuscript)).toBe(2024);
    expect(getPaperFinalPublicationYear(manuscript)).toBe(2024);
    expect(getPaperVersionOfRecordYear(manuscript)).toBeUndefined();
  });

  it('reports a version-of-record year only for published papers', () => {
    expect(getPaperVersionOfRecordYear(paper)).toBe(2026);
    expect(
      getPaperVersionOfRecordYear({
        year: 2024,
        publications: [{ name: 'arXiv', year: 2024 }],
      })
    ).toBeUndefined();
  });

  it('derives first-posting order from modern arxiv identifiers', () => {
    expect(
      getPaperFirstAppearanceSortKey({
        year: 2026,
        arxiv: '2404.19465v3',
        publications: [
          { name: 'Journal', year: 2026 },
          { name: 'arXiv', year: 2024 },
        ],
      })
    ).toEqual({ year: 2024, month: 4, day: 0, archiveSequence: 19465 });
  });

  it('derives first-posting order from legacy arxiv identifiers', () => {
    expect(
      getPaperFirstAppearanceSortKey({
        arxiv: 'math/0601001',
        publications: [{ name: 'arXiv', year: 2006 }],
      })
    ).toEqual({ year: 2006, month: 1, day: 0, archiveSequence: 1 });
  });

  it('prefers an explicit curated first date', () => {
    expect(
      getPaperFirstAppearanceSortKey({
        first_date: '2023-07-14',
        arxiv: '2404.19465',
      })
    ).toEqual({ year: 2023, month: 7, day: 14, archiveSequence: 0 });
  });

  it('sorts papers by date added rather than publication or update date', () => {
    const olderEntry = {
      title: 'Recently updated preprint',
      first_date: '2026-10-20',
      database_added: '2026-10-01',
      database_updated: '2026-10-22',
    };
    const newerEntry = {
      title: 'New bibliography entry',
      first_date: '2025-01-01',
      database_added: '2026-10-21',
      database_updated: '2026-10-21',
    };

    expect(
      [olderEntry, newerEntry]
        .sort(comparePapersByDatabaseAdded)
        .map(paper => paper.title)
    ).toEqual(['New bibliography entry', 'Recently updated preprint']);
  });
});

describe('formatAuthors', () => {
  it('returns "Unknown authors" for null/undefined', () => {
    expect(formatAuthors(null)).toBe('Unknown authors');
    expect(formatAuthors(undefined)).toBe('Unknown authors');
  });

  it('returns string as-is', () => {
    expect(formatAuthors('Alice, Bob, Charlie')).toBe('Alice, Bob, Charlie');
  });

  it('joins array with commas', () => {
    expect(formatAuthors(['Alice', 'Bob', 'Charlie'])).toBe(
      'Alice, Bob, Charlie'
    );
  });

  it('handles single author array', () => {
    expect(formatAuthors(['Alice'])).toBe('Alice');
  });

  it('handles empty array', () => {
    expect(formatAuthors([])).toBe('');
  });
});

describe('getMainPublication', () => {
  it('returns undefined for empty/null publications', () => {
    expect(getMainPublication(null)).toBeUndefined();
    expect(getMainPublication(undefined)).toBeUndefined();
    expect(getMainPublication([])).toBeUndefined();
  });

  it('prefers non-arXiv publication', () => {
    const publications = [
      { name: 'arXiv', year: 2023 },
      { name: 'ICML', year: 2023 },
    ];
    expect(getMainPublication(publications)).toEqual({
      name: 'ICML',
      year: 2023,
    });
  });

  it('returns first publication if all are arXiv', () => {
    const publications = [
      { name: 'arXiv', year: 2022 },
      { name: 'arXiv', year: 2023 },
    ];
    expect(getMainPublication(publications)).toEqual({
      name: 'arXiv',
      year: 2022,
    });
  });

  it('returns first non-arXiv when multiple non-arXiv exist', () => {
    const publications = [
      { name: 'arXiv', year: 2022 },
      { name: 'ICML', year: 2023 },
      { name: 'NeurIPS', year: 2023 },
    ];
    expect(getMainPublication(publications).name).toBe('ICML');
  });
});

describe('hasBibtex', () => {
  it('returns false for null/undefined', () => {
    expect(hasBibtex(null)).toBe(false);
    expect(hasBibtex(undefined)).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(hasBibtex([])).toBe(false);
  });

  it('returns false when no publications have bibtex', () => {
    const publications = [
      { name: 'ICML', year: 2023 },
      { name: 'arXiv', year: 2023 },
    ];
    expect(hasBibtex(publications)).toBe(false);
  });

  it('returns true when at least one publication has bibtex', () => {
    const publications = [
      { name: 'ICML', year: 2023, bibtex: '@article{...}' },
      { name: 'arXiv', year: 2023 },
    ];
    expect(hasBibtex(publications)).toBe(true);
  });
});

describe('getBibtexEntries', () => {
  it('returns empty string for null/undefined', () => {
    expect(getBibtexEntries(null)).toBe('');
    expect(getBibtexEntries(undefined)).toBe('');
  });

  it('returns empty string when no bibtex entries', () => {
    const publications = [{ name: 'ICML', year: 2023 }];
    expect(getBibtexEntries(publications)).toBe('');
  });

  it('returns single bibtex entry trimmed', () => {
    const publications = [{ name: 'ICML', bibtex: '  @article{test}  ' }];
    expect(getBibtexEntries(publications)).toBe('@article{test}');
  });

  it('joins multiple bibtex entries with double newline', () => {
    const publications = [
      { name: 'ICML', bibtex: '@article{first}' },
      { name: 'NeurIPS', bibtex: '@inproceedings{second}' },
    ];
    expect(getBibtexEntries(publications)).toBe(
      '@article{first}\n\n@inproceedings{second}'
    );
  });

  it('filters out publications without bibtex', () => {
    const publications = [
      { name: 'arXiv' },
      { name: 'ICML', bibtex: '@article{test}' },
    ];
    expect(getBibtexEntries(publications)).toBe('@article{test}');
  });
});
