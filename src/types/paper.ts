/**
 * Represents a publication venue for a research paper
 */
export interface Publication {
  /** Publication venue name (e.g., "ICML", "NeurIPS") */
  name: string;
  /** Publication year */
  year?: number;
  /** Publication month (1-12) */
  month?: number;
  /** Publication day (1-31) */
  day?: number;
  /** Earliest known online/public date for this record (ISO 8601) */
  date?: string;
  /** URL to the publication */
  url?: string;
  /** BibTeX citation entry */
  bibtex?: string;
  /** DBLP key for the publication */
  dblp_key?: string;
  /** DOI attached to this publication */
  doi?: string;
  /** arXiv identifier attached to this publication */
  arxiv?: string;
}

/**
 * Represents a paper in The E-value Bibliography database
 *
 * Note: All fields are optional to handle incomplete/malformed data gracefully.
 * Abstracts and descriptions are optional.
 */
export interface Paper {
  /** Paper title */
  title?: string;
  /** Author names (can be a single string or array of author names) */
  authors?: string | string[];
  /** Category labels for filtering and organization */
  labels?: string[];
  /** List of publications/venues where this paper appeared */
  publications?: Publication[];
  /** Formal source abstract or an author-written source summary */
  abstract?: string;
  /** Provenance state for the abstract field */
  abstract_status?:
    | 'source_abstract'
    | 'source_summary'
    | 'no_formal_abstract'
    | 'abstract_unavailable';
  /** Online source used to verify the abstract state or text */
  abstract_source?: string;
  /** Earliest known public appearance year, when explicitly curated */
  first_year?: number;
  /** Earliest known public appearance date (ISO 8601) */
  first_date?: string;
  /** Final journal or proceedings year, when explicitly curated */
  final_year?: number;
  /** Date this paper was first added to the bibliography (ISO 8601 date) */
  database_added?: string;
  /** Date this database record was last materially updated (ISO 8601 date) */
  database_updated?: string;
  /** Canonical publication year (legacy alias for the final year) */
  year?: number;
  /** Canonical DOI */
  doi?: string;
  /** Canonical arXiv identifier */
  arxiv?: string;
  /** Optional OpenAlex work identifier */
  openalex_id?: string;
  /** Optional Semantic Scholar paper identifier */
  s2_id?: string;
}

/** Which notion of year is used by the dashboard chart and paper filter. */
export type YearBasis = 'first' | 'final';

/**
 * Backwards-compatible source type alias.
 */
export interface PaperWithAbstract extends Paper {
  abstract?: string;
}
