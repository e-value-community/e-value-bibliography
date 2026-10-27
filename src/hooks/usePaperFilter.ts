import { useEffect, useState, useMemo } from 'react';
import { SPECIAL_LABELS } from '../constants';
import {
  comparePapersByDatabaseAdded,
  getPaperYearByBasis,
} from '../utils/paperUtils';
import { getVenueCanonicalName, getVenueSearchText } from '../utils/venueUtils';
import { normalizeSearchText } from '../utils/searchUtils';
import type { Paper, YearBasis } from '@/types';

/**
 * Case-insensitive string comparison
 */
function stringCmp(a: string, b: string): number {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

/**
 * Return type for usePaperFilter hook
 */
export interface PaperFilterResult {
  /** Current search query */
  searchQuery: string;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Selected label filters */
  selLabels: string[];
  /** Set selected label filters */
  setSelLabels: (labels: string[] | ((prev: string[]) => string[])) => void;
  /** Selected publication year from the dashboard */
  selectedYear: number | null;
  /** Set the dashboard year filter */
  setSelectedYear: (year: number | null) => void;
  /** Whether the chart and year filter use first or final appearance */
  yearBasis: YearBasis;
  /** Change the chart and year-filter interpretation */
  setYearBasis: (basis: YearBasis) => void;
  /** Selected publication venue from the dashboard */
  selectedVenue: string | null;
  /** Set the dashboard venue filter */
  setSelectedVenue: (venue: string | null) => void;
  /** Filtered and sorted papers */
  sortedData: Paper[];
  /** All distinct labels (excluding special labels) */
  distinctLabels: string[];
  /** Clear all filters */
  handleClearFilters: () => void;
  /** Special labels constant */
  SPECIAL_LABELS: readonly string[];
}

/**
 * Hook for filtering and sorting papers based on search query and label selection
 *
 * Features:
 * - Search across title, authors, labels, and publications
 * - Filter by multiple labels (AND logic - all selected labels must match)
 * - Sort by date added to the bibliography (newest first)
 * - Extract distinct labels for filter UI
 *
 * @param data - Array of papers to filter
 * @returns Filter state and filtered data
 */
export const usePaperFilter = (
  data: Paper[] | null,
  initialVenue: string | null = null,
  initialYear: number | null = null,
  initialYearBasis: YearBasis = 'first'
): PaperFilterResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selLabels, setSelLabels] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [yearBasis, setYearBasis] = useState<YearBasis>(initialYearBasis);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(
    initialVenue
  );

  useEffect(() => {
    setSelectedVenue(initialVenue);
  }, [initialVenue]);

  useEffect(() => {
    setSelectedYear(initialYear);
  }, [initialYear]);

  useEffect(() => {
    setYearBasis(initialYearBasis);
  }, [initialYearBasis]);

  // Get all labels from papers
  const distinctLabels = useMemo(() => {
    if (!data) return [];
    const allLabels = data.flatMap(paper => (paper.labels ? paper.labels : []));
    const distinct = [...new Set(allLabels)];
    distinct.sort(stringCmp);
    return distinct.filter(
      el => !(SPECIAL_LABELS as readonly string[]).includes(el)
    );
  }, [data]);

  // Filter and sort papers
  const sortedData = useMemo(() => {
    if (!data) return [];
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      const query = normalizeSearchText(searchQuery);
      const includesQuery = (
        value: string | number | null | undefined
      ): boolean => normalizeSearchText(value).includes(query);
      filtered = filtered.filter(
        paper =>
          includesQuery(paper.title) ||
          includesQuery(paper.abstract) ||
          includesQuery(paper.doi) ||
          includesQuery(paper.arxiv) ||
          (typeof paper.authors === 'string'
            ? includesQuery(paper.authors)
            : paper.authors?.some(includesQuery)) ||
          paper.labels?.some(includesQuery) ||
          paper.publications?.some(
            pub =>
              includesQuery(getVenueSearchText(pub.name)) ||
              includesQuery(pub.doi) ||
              includesQuery(pub.arxiv) ||
              includesQuery(pub.year)
          )
      );
    }

    // Apply label filter (AND logic - all selected labels must be present)
    if (selLabels.length > 0) {
      filtered = filtered.filter(paper =>
        selLabels.every(selectedLabel => paper.labels?.includes(selectedLabel))
      );
    }

    if (selectedYear !== null) {
      filtered = filtered.filter(
        paper => getPaperYearByBasis(paper, yearBasis) === selectedYear
      );
    }

    if (selectedVenue) {
      const canonicalVenue = getVenueCanonicalName(selectedVenue);
      filtered = filtered.filter(paper =>
        paper.publications?.some(
          publication =>
            getVenueCanonicalName(publication.name) === canonicalVenue
        )
      );
    }

    return [...filtered].sort(comparePapersByDatabaseAdded);
  }, [data, searchQuery, selLabels, selectedYear, selectedVenue, yearBasis]);

  const handleClearFilters = (): void => {
    setSearchQuery('');
    setSelLabels([]);
    setSelectedYear(null);
    setYearBasis('first');
    setSelectedVenue(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    selLabels,
    setSelLabels,
    selectedYear,
    setSelectedYear,
    yearBasis,
    setYearBasis,
    selectedVenue,
    setSelectedVenue,
    sortedData,
    distinctLabels,
    handleClearFilters,
    SPECIAL_LABELS,
  };
};
