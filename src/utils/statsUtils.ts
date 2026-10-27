/**
 * Statistics calculation utilities for paper data
 */

import { buildAuthorCanonicalizer, parseAuthors } from './authorUtils';
import {
  getPaperFinalPublicationYear,
  getPaperFirstAppearanceYear,
  getPaperYear,
} from './paperUtils';
import { getVenueCanonicalName, getVenueDisplayName } from './venueUtils';
import type { Paper } from '@/types';

const NON_VENUE_NAMES = new Set([
  'arxiv',
  'biorxiv',
  'cambridge open engage',
  'manuscript',
  'medrxiv',
  'msc thesis',
  'phd dissertation',
  'preprint',
  'preprints.org',
  'psyarxiv',
  'published paper',
  'ssrn',
  'ssrn working paper',
  'technical report',
  'working paper',
  'zenodo',
]);

const NON_VENUE_PATTERNS = [
  /author-hosted/,
  /preprint/,
  /repository/,
  /technical (?:project )?report/,
  /\b(?:thesis|dissertation)\b/,
  /working (?:paper|draft)/,
];

const isPublicationVenue = (name?: string): name is string => {
  if (!name?.trim()) return false;
  const normalizedName = name.trim().toLowerCase();
  return (
    !NON_VENUE_NAMES.has(normalizedName) &&
    !NON_VENUE_PATTERNS.some(pattern => pattern.test(normalizedName))
  );
};

/**
 * Venue statistics
 */
export interface VenueStats {
  /** Venue name */
  name: string;
  /** Number of papers in this venue */
  count: number;
}

/** Complete venue information used by the all-venues directory. */
export interface DetailedVenueStats extends VenueStats {
  /** Canonical full venue name used for exact filtering. */
  canonicalName: string;
  /** Distinct publication years represented in the collection. */
  years: number[];
}

/**
 * Calculate statistics for every publication venue in the collection.
 *
 * A paper is counted at most once per canonical venue, even when its metadata
 * contains both a full venue name and an abbreviation.
 */
export const calculateAllVenueStats = (data: Paper[]): DetailedVenueStats[] => {
  const venues = new Map<string, { count: number; years: Set<number> }>();

  data.forEach(paper => {
    const venuesSeenForPaper = new Set<string>();

    (paper.publications ?? []).forEach(publication => {
      if (!isPublicationVenue(publication.name)) return;

      const canonicalName = getVenueCanonicalName(publication.name);
      if (!canonicalName) return;

      let venue = venues.get(canonicalName);
      if (!venue) {
        venue = { count: 0, years: new Set<number>() };
        venues.set(canonicalName, venue);
      }

      if (!venuesSeenForPaper.has(canonicalName)) {
        venue.count += 1;
        venuesSeenForPaper.add(canonicalName);
      }

      const year = publication.year ?? getPaperYear(paper);
      if (year !== undefined && Number.isFinite(year)) {
        venue.years.add(year);
      }
    });
  });

  return Array.from(venues.entries())
    .map(([canonicalName, venue]) => ({
      canonicalName,
      name: getVenueDisplayName(canonicalName),
      count: venue.count,
      years: Array.from(venue.years).sort((a, b) => a - b),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/**
 * Paper statistics
 */
export interface PaperStats {
  /** Total number of papers */
  totalPapers: number;
  /** Total number of unique authors (canonicalized) */
  totalAuthors: number;
  /** Total number of unique publication venues */
  totalVenues: number;
  /** Year distribution: year -> count of papers */
  yearDistribution: Record<number, number>;
  /** Earliest public appearance year -> count of papers */
  firstYearDistribution: Record<number, number>;
  /** Final publication year -> count of papers */
  finalYearDistribution: Record<number, number>;
  /** Top venues by paper count (limited to 7) */
  venueStats: VenueStats[];
}

/**
 * Calculate comprehensive statistics from paper data
 *
 * Computes:
 * - Total papers
 * - Unique authors (using canonicalization to merge variants)
 * - Unique publication venues (excluding repositories and placeholders)
 * - Year distribution (uses the curated canonical year, with a legacy fallback)
 * - Top 7 venues by publication count
 *
 * @param data - Array of paper objects
 * @returns Statistics object
 */
export const calculateStats = (data: Paper[]): PaperStats => {
  const canonicalizer = buildAuthorCanonicalizer(data);

  // Calculate total papers
  const totalPapers = data.length;

  // Calculate unique authors
  const allAuthors = new Set<string>();
  data.forEach(paper => {
    if (paper.authors) {
      const authorList = parseAuthors(paper.authors);
      const canonicalKeys = Array.from(
        new Set(authorList.map(a => canonicalizer.canonicalKey(a)))
      );
      canonicalKeys.forEach(key => allAuthors.add(key));
    }
  });
  const totalAuthors = allAuthors.size;

  const allVenueStats = calculateAllVenueStats(data);
  const totalVenues = allVenueStats.length;

  const calculateYearDistribution = (
    yearForPaper: (paper: Paper) => number | undefined
  ): Record<number, number> =>
    data.reduce<Record<number, number>>((acc, paper) => {
      const year = yearForPaper(paper);
      if (year !== undefined) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});

  const firstYearDistribution = calculateYearDistribution(
    getPaperFirstAppearanceYear
  );
  const finalYearDistribution = calculateYearDistribution(
    getPaperFinalPublicationYear
  );

  // Retain the original property as a final-year alias for older callers.
  const yearDistribution = finalYearDistribution;

  const venueStats: VenueStats[] = allVenueStats
    .map(({ name, count }) => ({ name, count }))
    .slice(0, 7);

  return {
    totalPapers,
    totalAuthors,
    totalVenues,
    yearDistribution,
    firstYearDistribution,
    finalYearDistribution,
    venueStats,
  };
};
