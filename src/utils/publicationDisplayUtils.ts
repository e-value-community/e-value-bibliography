import type { Publication } from '@/types/paper';
import { getVenueCanonicalName, getVenueDisplayName } from './venueUtils';

export interface PublicationDisplayData {
  displayLabel: string;
  fullName: string;
  isRepository: boolean;
}

const manuscriptSourceName = (publication: Publication): string => {
  const source =
    `${publication.doi ?? ''} ${publication.url ?? ''}`.toLowerCase();

  if (source.includes('10.2139/ssrn') || source.includes('ssrn.com')) {
    return 'SSRN working paper';
  }
  if (source.includes('10.5281/zenodo') || source.includes('zenodo.org')) {
    return 'Zenodo manuscript';
  }
  if (
    source.includes('10.25740/') ||
    source.includes('searchworks.stanford.edu')
  ) {
    return 'Stanford report';
  }
  if (source.includes('10.31234/') || source.includes('psyarxiv.com')) {
    return 'PsyArXiv preprint';
  }
  if (
    source.includes('10.20944/preprints') ||
    source.includes('preprints.org')
  ) {
    return 'Preprints.org';
  }
  if (source.includes('10.64898/') || source.includes('biorxiv.org')) {
    return 'bioRxiv preprint';
  }
  if (source.includes('10.1101/') || source.includes('medrxiv.org')) {
    return 'medRxiv preprint';
  }
  if (source.includes('10.33774/') || source.includes('cambridge.org/engage')) {
    return 'Cambridge Open Engage';
  }
  if (source.includes('openreview.net')) {
    return 'OpenReview preprint';
  }
  if (source.includes('10.1561/')) {
    return 'Book';
  }
  if (publication.url) {
    return 'Author-hosted manuscript';
  }
  return 'Manuscript';
};

/**
 * Build a concise badge label while distinguishing repositories and working
 * papers from journals and conference proceedings.
 */
export const getPublicationDisplayData = (
  publication: Publication
): PublicationDisplayData => {
  const name = publication.name.trim();
  const isManuscript = /^manuscript$/i.test(name);
  const isArxiv = /^arxiv$/i.test(name);
  const fullName = isManuscript
    ? manuscriptSourceName(publication)
    : getVenueCanonicalName(name);
  const displayName = isManuscript ? fullName : getVenueDisplayName(name);
  const year = publication.year;

  return {
    displayLabel: isManuscript
      ? `${displayName}${year ? ` · ${year}` : ''}`
      : `${displayName}${year ? ` '${year.toString().slice(-2)}` : ''}`,
    fullName,
    isRepository: isManuscript || isArxiv,
  };
};
