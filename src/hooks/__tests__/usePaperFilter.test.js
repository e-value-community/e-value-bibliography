import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaperFilter } from '../usePaperFilter';

const mockPapers = [
  {
    title: 'Online Algorithms with Predictions',
    authors: 'Alice Smith, Bob Jones',
    labels: ['online', 'rent-or-buy', 'theory'],
    publications: [
      { name: 'ICML', year: 2023 },
      { name: 'arXiv', year: 2022 },
    ],
  },
  {
    title: 'Streaming Data Structures',
    authors: ['Charlie Brown', 'Diana Prince'],
    labels: ['streaming', 'data-structure', 'philosophy'],
    publications: [{ name: 'NeurIPS', year: 2022 }],
  },
  {
    title: 'Scheduling with Machine Learning',
    authors: 'Eve Wilson',
    labels: ['scheduling', 'online'],
    publications: [{ name: 'SODA', year: 2021 }],
  },
];

describe('usePaperFilter', () => {
  describe('initialization', () => {
    it('initializes with empty search query', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));
      expect(result.current.searchQuery).toBe('');
    });

    it('initializes with empty selected labels', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));
      expect(result.current.selLabels).toEqual([]);
    });

    it('initializes with no dashboard filters', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));
      expect(result.current.selectedYear).toBeNull();
      expect(result.current.selectedVenue).toBeNull();
    });

    it('returns all papers initially sorted by bibliography addition date', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));
      expect(result.current.sortedData.length).toBe(3);
      // Undated fixtures retain first-appearance ordering as a fallback.
      expect(result.current.sortedData[0].title).toBe(
        'Online Algorithms with Predictions'
      );
    });

    it('does not mutate the source data while sorting', () => {
      const papers = [
        {
          title: 'Older Paper',
          authors: 'A',
          labels: [],
          publications: [{ name: 'SODA', year: 2021 }],
        },
        {
          title: 'Newer Paper',
          authors: 'B',
          labels: [],
          publications: [{ name: 'ICML', year: 2024 }],
        },
      ];

      renderHook(() => usePaperFilter(papers));

      expect(papers.map(paper => paper.title)).toEqual([
        'Older Paper',
        'Newer Paper',
      ]);
    });
  });

  describe('distinctLabels', () => {
    it('extracts unique non-special labels', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));
      const labels = result.current.distinctLabels;

      expect(labels).toContain('rent-or-buy');
      expect(labels).toContain('data-structure');
      expect(labels).toContain('scheduling');

      // Special labels should be excluded
      expect(labels).not.toContain('theory');
      expect(labels).not.toContain('philosophy');
    });

    it('sorts labels alphabetically', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));
      const labels = result.current.distinctLabels;

      for (let i = 1; i < labels.length; i++) {
        expect(
          labels[i - 1].toLowerCase() <= labels[i].toLowerCase()
        ).toBeTruthy();
      }
    });
  });

  describe('search filtering', () => {
    it('filters by title', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('streaming');
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].title).toBe(
        'Streaming Data Structures'
      );
    });

    it('filters by a venue acronym when the source stores the full name', () => {
      const papers = [
        {
          title: 'A statistical paper',
          publications: [{ name: 'The Annals of Statistics', year: 2024 }],
        },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));

      act(() => {
        result.current.setSearchQuery('AoS');
      });

      expect(result.current.sortedData).toHaveLength(1);
    });

    it('filters by author (string format)', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('alice');
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].authors).toContain('Alice');
    });

    it('filters by author (array format)', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('charlie');
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].authors).toContain('Charlie Brown');
    });

    it('matches an author when the query omits diacritics', () => {
      const papers = [
        {
          title: 'Safe testing',
          authors: 'Peter Grünwald',
          publications: [{ name: 'Manuscript', year: 2024 }],
        },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));

      act(() => {
        result.current.setSearchQuery('Grunwald');
      });

      expect(result.current.sortedData).toHaveLength(1);
      expect(result.current.sortedData[0].authors).toBe('Peter Grünwald');
    });

    it('filters by label', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('rent-or-buy');
      });

      expect(result.current.sortedData.length).toBe(1);
    });

    it('filters by venue name', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('neurips');
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].title).toBe(
        'Streaming Data Structures'
      );
    });

    it('filters by year', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('2021');
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].title).toBe(
        'Scheduling with Machine Learning'
      );
    });

    it('is case insensitive', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('STREAMING');
      });

      expect(result.current.sortedData.length).toBe(1);
    });
  });

  describe('label filtering', () => {
    it('filters by single label', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSelLabels(['online']);
      });

      expect(result.current.sortedData.length).toBe(2);
    });

    it('filters by multiple labels (AND logic)', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSelLabels(['online', 'rent-or-buy']);
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].title).toBe(
        'Online Algorithms with Predictions'
      );
    });

    it('returns empty when no papers match all labels', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSelLabels(['online', 'streaming']);
      });

      expect(result.current.sortedData.length).toBe(0);
    });
  });

  describe('combined filtering', () => {
    it('applies both search and label filters', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('alice');
        result.current.setSelLabels(['online']);
      });

      expect(result.current.sortedData.length).toBe(1);
      expect(result.current.sortedData[0].title).toBe(
        'Online Algorithms with Predictions'
      );
    });
  });

  describe('dashboard filtering', () => {
    it('initializes from a venue supplied by the page URL', () => {
      const { result } = renderHook(() =>
        usePaperFilter(mockPapers, 'NeurIPS')
      );

      expect(result.current.selectedVenue).toBe('NeurIPS');
      expect(result.current.sortedData.map(paper => paper.title)).toEqual([
        'Streaming Data Structures',
      ]);
    });

    it('filters by first appearance by default and final publication on request', () => {
      const papers = [
        {
          title: 'First paper',
          year: 2024,
          publications: [{ name: 'arXiv', year: 2022 }],
        },
        {
          title: 'Second paper',
          year: 2023,
          publications: [{ name: 'arXiv', year: 2023 }],
        },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));

      act(() => result.current.setSelectedYear(2022));

      expect(result.current.sortedData.map(paper => paper.title)).toEqual([
        'First paper',
      ]);

      act(() => {
        result.current.setYearBasis('final');
        result.current.setSelectedYear(2024);
      });

      expect(result.current.sortedData.map(paper => paper.title)).toEqual([
        'First paper',
      ]);
    });

    it('filters by an exact canonical venue', () => {
      const papers = [
        {
          title: 'Annals paper',
          publications: [{ name: 'The Annals of Statistics', year: 2024 }],
        },
        {
          title: 'JASA paper',
          publications: [
            {
              name: 'Journal of the American Statistical Association',
              year: 2024,
            },
          ],
        },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));

      act(() => result.current.setSelectedVenue('AoS'));

      expect(result.current.sortedData.map(paper => paper.title)).toEqual([
        'Annals paper',
      ]);
    });
  });

  describe('sorting', () => {
    it('uses bibliography addition date before publication dates', () => {
      const papers = [
        {
          title: 'Paper A',
          authors: 'A',
          labels: [],
          database_added: '2026-10-22',
          publications: [
            { name: 'arXiv', year: 2023, arxiv: '2304.01000' },
            { name: 'ICML', year: 2025 },
          ],
        },
        {
          title: 'Paper B',
          authors: 'B',
          labels: [],
          database_added: '2026-10-20',
          publications: [{ name: 'NeurIPS', year: 2024 }],
        },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));
      expect(result.current.sortedData[0].title).toBe('Paper A');
      expect(result.current.sortedData[1].title).toBe('Paper B');
    });

    it('uses the posting month and sequence encoded by arxiv identifiers', () => {
      const papers = [
        {
          title: 'January paper',
          authors: 'A',
          labels: [],
          arxiv: '2401.00300',
          publications: [
            { name: 'Journal', year: 2026 },
            { name: 'arXiv', year: 2024, arxiv: '2401.00300' },
          ],
        },
        {
          title: 'October paper',
          authors: 'B',
          labels: [],
          arxiv: '2410.00100',
          publications: [{ name: 'arXiv', year: 2024 }],
        },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));
      expect(result.current.sortedData.map(paper => paper.title)).toEqual([
        'October paper',
        'January paper',
      ]);
    });

    it('uses an explicit first-public date when one has been curated', () => {
      const papers = [
        { title: 'Earlier', first_date: '2024-02-03' },
        { title: 'Later', first_date: '2024-11-12' },
      ];
      const { result } = renderHook(() => usePaperFilter(papers));

      expect(result.current.sortedData.map(paper => paper.title)).toEqual([
        'Later',
        'Earlier',
      ]);
    });
  });

  describe('handleClearFilters', () => {
    it('clears search, label, year, and venue filters', () => {
      const { result } = renderHook(() => usePaperFilter(mockPapers));

      act(() => {
        result.current.setSearchQuery('test');
        result.current.setSelLabels(['online']);
        result.current.setSelectedYear(2024);
        result.current.setSelectedVenue('AoS');
      });

      expect(result.current.searchQuery).toBe('test');
      expect(result.current.selLabels).toEqual(['online']);
      expect(result.current.selectedYear).toBe(2024);
      expect(result.current.selectedVenue).toBe('AoS');

      act(() => {
        result.current.handleClearFilters();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.selLabels).toEqual([]);
      expect(result.current.selectedYear).toBeNull();
      expect(result.current.selectedVenue).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles null data', () => {
      const { result } = renderHook(() => usePaperFilter(null));
      expect(result.current.sortedData).toEqual([]);
      expect(result.current.distinctLabels).toEqual([]);
    });

    it('handles empty data', () => {
      const { result } = renderHook(() => usePaperFilter([]));
      expect(result.current.sortedData).toEqual([]);
    });

    it('handles papers without labels', () => {
      const papersWithoutLabels = [{ title: 'Test', authors: 'Test' }];
      const { result } = renderHook(() => usePaperFilter(papersWithoutLabels));
      expect(result.current.distinctLabels).toEqual([]);
    });
  });
});
