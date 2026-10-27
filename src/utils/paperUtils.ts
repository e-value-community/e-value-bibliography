import type { Paper, Publication, YearBasis } from '@/types';

const isValidYear = (year: number | null | undefined): year is number =>
  year !== null &&
  year !== undefined &&
  !Number.isNaN(year) &&
  Number.isFinite(year);

const getPublicationYears = (paper: Paper): number[] => {
  const publicationYears = (paper.publications ?? [])
    .map(publication => publication.year)
    .filter(isValidYear);

  return publicationYears;
};

/** Get the earliest known public appearance of a paper. */
export const getPaperFirstAppearanceYear = (
  paper: Paper
): number | undefined => {
  if (isValidYear(paper.first_year)) return paper.first_year;

  const knownYears = getPublicationYears(paper);
  if (isValidYear(paper.year)) knownYears.push(paper.year);

  return knownYears.length > 0 ? Math.min(...knownYears) : undefined;
};

/**
 * Get the final journal or proceedings year. For manuscripts, the curated year
 * normally coincides with their first appearance.
 */
export const getPaperFinalPublicationYear = (
  paper: Paper
): number | undefined => {
  if (isValidYear(paper.final_year)) return paper.final_year;
  if (isValidYear(paper.year)) return paper.year;

  const publicationYears = getPublicationYears(paper);

  return publicationYears.length > 0
    ? Math.max(...publicationYears)
    : undefined;
};

const isVersionOfRecordPublication = (publication: Publication): boolean => {
  const name = publication.name.trim();

  return (
    !/^(?:arxiv|preprint|manuscript|working paper|technical report)$/i.test(
      name
    ) && !/\b(?:thesis|dissertation)\b/i.test(name)
  );
};

/** Get the publication year of a journal or proceedings version, if one exists. */
export const getPaperVersionOfRecordYear = (
  paper: Paper
): number | undefined => {
  const versionOfRecordPublications = (paper.publications ?? []).filter(
    isVersionOfRecordPublication
  );

  if (versionOfRecordPublications.length === 0) {
    return paper.doi && isValidYear(paper.year) ? paper.year : undefined;
  }

  if (isValidYear(paper.final_year)) return paper.final_year;

  const publicationYears = versionOfRecordPublications
    .map(publication => publication.year)
    .filter(isValidYear);

  if (publicationYears.length > 0) return Math.max(...publicationYears);
  return isValidYear(paper.year) ? paper.year : undefined;
};

/** Whether clicking a paper can reveal additional metadata or an abstract. */
export const hasPaperDetails = (paper: Paper): boolean =>
  Boolean(
    paper.abstract ||
    paper.database_added ||
    paper.database_updated ||
    getPaperFirstAppearanceYear(paper) ||
    getPaperVersionOfRecordYear(paper)
  );

/** Get the paper year for the selected dashboard interpretation. */
export const getPaperYearByBasis = (
  paper: Paper,
  basis: YearBasis
): number | undefined =>
  basis === 'first'
    ? getPaperFirstAppearanceYear(paper)
    : getPaperFinalPublicationYear(paper);

export interface FirstAppearanceSortKey {
  year: number;
  month: number;
  day: number;
  archiveSequence: number;
}

type PartialDate = FirstAppearanceSortKey;

const parseIsoDate = (value: string | undefined): PartialDate | undefined => {
  const match = value?.trim().match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 0;
  const day = match[3] ? Number(match[3]) : 0;

  if (match[2] && (month < 1 || month > 12)) return undefined;
  if (match[3] && (day < 1 || day > 31)) return undefined;

  if (month > 0 && day > 0) {
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() + 1 !== month ||
      parsed.getUTCDate() !== day
    ) {
      return undefined;
    }
  }

  return { year, month, day, archiveSequence: 0 };
};

const parseArxivDate = (value: string | undefined): PartialDate | undefined => {
  if (!value) return undefined;

  const normalized = value
    .trim()
    .replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, '')
    .replace(/\.pdf$/i, '')
    .replace(/^arxiv:\s*/i, '')
    .replace(/v\d+$/i, '');

  const modern = normalized.match(/^(\d{2})(0[1-9]|1[0-2])\.(\d{4,5})$/);
  const legacy = normalized.match(
    /^[a-z][a-z0-9.+-]*\/(\d{2})(0[1-9]|1[0-2])(\d{3,4})$/i
  );
  const match = modern ?? legacy;
  if (!match) return undefined;

  const shortYear = Number(match[1]);
  const year = shortYear >= 91 ? 1900 + shortYear : 2000 + shortYear;

  return {
    year,
    month: Number(match[2]),
    day: 0,
    archiveSequence: Number(match[3]),
  };
};

const publicationDateCandidates = (publication: Publication): PartialDate[] => {
  const candidates: PartialDate[] = [];
  const explicitDate = parseIsoDate(publication.date);
  if (explicitDate) candidates.push(explicitDate);

  if (isValidYear(publication.year)) {
    const month =
      publication.month && publication.month >= 1 && publication.month <= 12
        ? publication.month
        : 0;
    const day =
      month > 0 &&
      publication.day &&
      publication.day >= 1 &&
      publication.day <= 31
        ? publication.day
        : 0;

    candidates.push({
      year: publication.year,
      month,
      day,
      archiveSequence: 0,
    });
  }

  const arxivDate = parseArxivDate(publication.arxiv ?? publication.url);
  if (arxivDate) candidates.push(arxivDate);

  return candidates;
};

/**
 * Return the best available key for a paper's first public appearance.
 * Exact curated dates take precedence. Otherwise, the key uses the earliest
 * publication/archive evidence in the first-appearance year. Modern and
 * legacy arXiv identifiers provide a posting month and submission sequence.
 */
export const getPaperFirstAppearanceSortKey = (
  paper: Paper
): FirstAppearanceSortKey => {
  const explicitDate = parseIsoDate(paper.first_date);
  if (explicitDate) return explicitDate;

  const firstYear = getPaperFirstAppearanceYear(paper) ?? 0;
  if (firstYear === 0) {
    return { year: 0, month: 0, day: 0, archiveSequence: 0 };
  }

  const candidates = (paper.publications ?? []).flatMap(
    publicationDateCandidates
  );
  const paperArxivDate = parseArxivDate(paper.arxiv);
  if (paperArxivDate) candidates.push(paperArxivDate);

  const firstYearCandidates = candidates.filter(
    candidate => candidate.year === firstYear
  );
  const knownMonths = firstYearCandidates
    .map(candidate => candidate.month)
    .filter(month => month > 0);

  if (knownMonths.length === 0) {
    return { year: firstYear, month: 0, day: 0, archiveSequence: 0 };
  }

  const month = Math.min(...knownMonths);
  const firstMonthCandidates = firstYearCandidates.filter(
    candidate => candidate.month === month
  );
  const knownDays = firstMonthCandidates
    .map(candidate => candidate.day)
    .filter(day => day > 0);
  const archiveSequences = firstMonthCandidates
    .map(candidate => candidate.archiveSequence)
    .filter(sequence => sequence > 0);

  return {
    year: firstYear,
    month,
    day: knownDays.length > 0 ? Math.min(...knownDays) : 0,
    archiveSequence:
      archiveSequences.length > 0 ? Math.min(...archiveSequences) : 0,
  };
};

/** Sort newest first by earliest public appearance, then alphabetically. */
export const comparePapersByFirstAppearance = (a: Paper, b: Paper): number => {
  const keyA = getPaperFirstAppearanceSortKey(a);
  const keyB = getPaperFirstAppearanceSortKey(b);

  const fields: Array<keyof FirstAppearanceSortKey> = [
    'year',
    'month',
    'day',
    'archiveSequence',
  ];

  for (const field of fields) {
    const difference = keyB[field] - keyA[field];
    if (difference !== 0) return difference;
  }

  return (a.title ?? '')
    .toLowerCase()
    .localeCompare((b.title ?? '').toLowerCase());
};

/** Sort newest first by bibliography addition date, then first appearance. */
export const comparePapersByDatabaseAdded = (a: Paper, b: Paper): number => {
  const addedA = parseIsoDate(a.database_added);
  const addedB = parseIsoDate(b.database_added);
  const valueA = addedA
    ? addedA.year * 10000 + addedA.month * 100 + addedA.day
    : 0;
  const valueB = addedB
    ? addedB.year * 10000 + addedB.month * 100 + addedB.day
    : 0;

  return valueB - valueA || comparePapersByFirstAppearance(a, b);
};

/**
 * Get the curated final year. Kept as the default for existing venue and sort
 * behavior; the dashboard uses getPaperYearByBasis explicitly.
 */
export const getPaperYear = (paper: Paper): number | undefined => {
  return getPaperFinalPublicationYear(paper);
};

/**
 * Format authors for display
 *
 * @param authors - Authors as string or array
 * @param maxAuthors - Maximum number of authors to display before truncating (default: 3)
 * @returns Formatted author string
 */
export const formatAuthors = (
  authors: string | string[] | undefined,
  maxAuthors: number = 3
): string => {
  if (!authors) return 'Unknown authors';

  if (typeof authors === 'string') return authors;

  const authorArray = authors;

  if (authorArray.length <= maxAuthors) {
    return authorArray.join(', ');
  }

  // Show first maxAuthors + count of remaining
  const firstAuthors = authorArray.slice(0, maxAuthors).join(', ');
  const remaining = authorArray.length - maxAuthors;
  return `${firstAuthors} and ${remaining} more`;
};

/**
 * Get full author list for tooltip (without truncation)
 *
 * @param authors - Authors as string or array
 * @returns Full author string
 */
export const getFullAuthorList = (
  authors: string | string[] | undefined
): string => {
  if (!authors) return 'Unknown authors';
  return typeof authors === 'string' ? authors : authors.join(', ');
};

/**
 * Get the main publication for a paper (prefer non-arXiv publications)
 *
 * @param publications - Array of publication objects
 * @returns The main publication, or undefined if no publications
 */
export const getMainPublication = (
  publications: Publication[] | undefined
): Publication | undefined => {
  if (!publications || publications.length === 0) return undefined;
  return publications.find(pub => pub.name !== 'arXiv') || publications[0];
};

/**
 * Open URL in new tab safely with noopener and noreferrer
 *
 * @param url - URL to open
 */
export const openInNewTab = (url: string): void => {
  if (typeof window !== 'undefined') {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }
};

/**
 * Check if a paper has any BibTeX entries
 *
 * @param publications - Array of publication objects
 * @returns True if at least one publication has BibTeX
 */
export const hasBibtex = (publications: Publication[] | undefined): boolean => {
  return publications?.some(pub => pub.bibtex) ?? false;
};

/**
 * Get all BibTeX entries for a paper, combined into a single string
 *
 * @param publications - Array of publication objects
 * @returns Combined BibTeX entries, separated by blank lines
 */
export const getBibtexEntries = (
  publications: Publication[] | undefined
): string => {
  return (
    publications
      ?.filter(pub => pub.bibtex)
      .map(pub => pub.bibtex!.trim())
      .join('\n\n') || ''
  );
};
