import { describe, it, expect } from 'vitest';
import { calculateAllVenueStats, calculateStats } from '../statsUtils';

describe('calculateStats', () => {
  it('returns zeros for empty data', () => {
    const result = calculateStats([]);
    expect(result.totalPapers).toBe(0);
    expect(result.totalAuthors).toBe(0);
    expect(result.totalVenues).toBe(0);
    expect(result.yearDistribution).toEqual({});
    expect(result.venueStats).toEqual([]);
  });

  it('counts total papers correctly', () => {
    const data = [
      { title: 'Paper 1' },
      { title: 'Paper 2' },
      { title: 'Paper 3' },
    ];
    const result = calculateStats(data);
    expect(result.totalPapers).toBe(3);
  });

  it('counts unique authors from string format', () => {
    const data = [{ authors: 'Alice, Bob' }, { authors: 'Bob, Charlie' }];
    const result = calculateStats(data);
    expect(result.totalAuthors).toBe(3); // Alice, Bob, Charlie
  });

  it('counts unique authors from array format', () => {
    const data = [
      { authors: ['Alice', 'Bob'] },
      { authors: ['Bob', 'Charlie'] },
    ];
    const result = calculateStats(data);
    expect(result.totalAuthors).toBe(3);
  });

  it('handles mixed author formats', () => {
    const data = [{ authors: 'Alice, Bob' }, { authors: ['Charlie', 'David'] }];
    const result = calculateStats(data);
    expect(result.totalAuthors).toBe(4);
  });

  it('excludes arXiv from venue count', () => {
    const data = [
      {
        publications: [
          { name: 'arXiv', year: 2023 },
          { name: 'ICML', year: 2023 },
        ],
      },
      {
        publications: [{ name: 'NeurIPS', year: 2023 }],
      },
    ];
    const result = calculateStats(data);
    expect(result.totalVenues).toBe(2); // ICML, NeurIPS (not arXiv)
  });

  it('excludes repositories and placeholder labels from venue statistics', () => {
    const data = [
      {
        publications: [
          { name: 'SSRN', year: 2026 },
          { name: 'SSRN working paper', year: 2026 },
          { name: 'Published paper', year: 2026 },
          { name: 'Manuscript', year: 2026 },
          { name: 'Preprint', year: 2026 },
          { name: 'bioRxiv', year: 2026 },
          { name: 'PhD dissertation', year: 2026 },
          { name: "Bachelor's thesis", year: 2026 },
          { name: 'Technical project report', year: 2026 },
          { name: 'Author-hosted working draft', year: 2026 },
          { name: 'Journal of Testing', year: 2026 },
        ],
      },
    ];
    const result = calculateStats(data);
    expect(result.totalVenues).toBe(1);
    expect(result.venueStats).toEqual([
      { name: 'Journal of Testing', count: 1 },
    ]);
  });

  it('calculates year distribution correctly', () => {
    const data = [
      { publications: [{ year: 2022 }, { year: 2023 }] },
      { publications: [{ year: 2022 }] },
      { publications: [{ year: 2023 }] },
    ];
    const result = calculateStats(data);
    expect(result.yearDistribution).toEqual({
      2022: 1,
      2023: 2,
    });
    expect(result.firstYearDistribution).toEqual({ 2022: 2, 2023: 1 });
    expect(result.finalYearDistribution).toEqual({ 2022: 1, 2023: 2 });
  });

  it('prefers the curated year over an earlier preprint year', () => {
    const data = [
      {
        year: 2026,
        publications: [
          { name: 'Journal', year: 2026 },
          { name: 'arXiv', year: 2022 },
        ],
      },
    ];
    const result = calculateStats(data);
    expect(result.yearDistribution).toEqual({ 2026: 1 });
    expect(result.firstYearDistribution).toEqual({ 2022: 1 });
    expect(result.finalYearDistribution).toEqual({ 2026: 1 });
  });

  it('calculates venue stats sorted by count', () => {
    const data = [
      { publications: [{ name: 'ICML' }, { name: 'arXiv' }] },
      { publications: [{ name: 'ICML' }] },
      { publications: [{ name: 'NeurIPS' }] },
    ];
    const result = calculateStats(data);
    expect(result.venueStats[0]).toEqual({ name: 'ICML', count: 2 });
    expect(result.venueStats[1]).toEqual({ name: 'NeurIPS', count: 1 });
  });

  it('merges full and abbreviated venue names', () => {
    const data = [
      {
        publications: [
          { name: 'Advances in Neural Information Processing Systems' },
        ],
      },
      { publications: [{ name: 'NeurIPS' }] },
    ];
    const result = calculateStats(data);
    expect(result.totalVenues).toBe(1);
    expect(result.venueStats[0]).toEqual({ name: 'NeurIPS', count: 2 });
  });

  it('merges historical and current UAI venue names', () => {
    const data = [
      {
        publications: [{ name: 'Uncertainty in Artificial Intelligence' }],
      },
      {
        publications: [
          { name: 'Conference on Uncertainty in Artificial Intelligence' },
        ],
      },
      { publications: [{ name: 'UAI' }] },
    ];
    const result = calculateStats(data);
    expect(result.totalVenues).toBe(1);
    expect(result.venueStats[0]).toEqual({ name: 'UAI', count: 3 });
  });

  it('limits venue stats to top 7', () => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      publications: [{ name: `Venue${i}` }],
    }));
    const result = calculateStats(data);
    expect(result.venueStats.length).toBe(7);
  });

  it('handles papers without authors', () => {
    const data = [{ title: 'Paper without authors' }];
    const result = calculateStats(data);
    expect(result.totalAuthors).toBe(0);
  });

  it('handles papers without publications', () => {
    const data = [{ title: 'Paper without publications' }];
    const result = calculateStats(data);
    expect(result.totalVenues).toBe(0);
    expect(result.yearDistribution).toEqual({});
  });
});

describe('calculateAllVenueStats', () => {
  it('lists every venue with distinct paper counts and publication years', () => {
    const data = [
      {
        year: 2024,
        publications: [
          { name: 'The Annals of Statistics', year: 2024 },
          { name: 'AoS', year: 2024 },
          { name: 'arXiv', year: 2022 },
        ],
      },
      {
        publications: [{ name: 'AoS', year: 2021 }],
      },
      {
        publications: [{ name: 'Journal of Testing', year: 2023 }],
      },
    ];

    expect(calculateAllVenueStats(data)).toEqual([
      {
        canonicalName: 'The Annals of Statistics',
        name: 'AoS',
        count: 2,
        years: [2021, 2024],
      },
      {
        canonicalName: 'Journal of Testing',
        name: 'Journal of Testing',
        count: 1,
        years: [2023],
      },
    ]);
  });
});
