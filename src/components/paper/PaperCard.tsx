import { memo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import PaperCardDesktop from './PaperCardDesktop';
import PaperCardMobile from './PaperCardMobile';
import type { Paper } from '@/types/paper';

export interface PaperCardProps {
  paper: Paper;
  selectedLabels?: string[];
  onLabelClick?: ((label: string) => void) | null;
  layout?: 'desktop' | 'mobile';
}

const RenderedPaperCard: React.FC<PaperCardProps & { isMobile: boolean }> = ({
  paper,
  selectedLabels = [],
  onLabelClick = null,
  isMobile,
}) => {
  const CardComponent = isMobile ? PaperCardMobile : PaperCardDesktop;

  return (
    <CardComponent
      paper={paper}
      selectedLabels={selectedLabels}
      onLabelClick={onLabelClick}
    />
  );
};

/**
 * Responsive wrapper used when a caller does not already know the layout.
 */
const ResponsivePaperCard: React.FC<PaperCardProps> = props => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return <RenderedPaperCard {...props} isMobile={isMobile} />;
};

const PaperCard: React.FC<PaperCardProps> = props => {
  if (props.layout) {
    return (
      <RenderedPaperCard {...props} isMobile={props.layout === 'mobile'} />
    );
  }

  return <ResponsivePaperCard {...props} />;
};

/**
 * Efficiently compare two string arrays for equality
 */
const areStringArraysEqual = (
  a: string[] | undefined,
  b: string[] | undefined
): boolean => {
  if (a === b) return true;
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
};

/**
 * Efficiently compare two publication arrays for equality
 * Compares only the fields that affect rendering
 */
const arePublicationsEqual = (
  a: Paper['publications'],
  b: Paper['publications']
): boolean => {
  if (a === b) return true;
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;

  return a.every((pubA, idx) => {
    const pubB = b[idx];
    if (!pubB) return false;
    return (
      pubA.name === pubB.name &&
      pubA.year === pubB.year &&
      pubA.url === pubB.url &&
      pubA.bibtex === pubB.bibtex
    );
  });
};

/**
 * Custom comparison function for memo
 * Optimized to avoid expensive JSON.stringify calls
 */
const arePropsEqual = (
  prevProps: PaperCardProps,
  nextProps: PaperCardProps
): boolean => {
  const prevSelectedLabels = prevProps.selectedLabels || [];
  const nextSelectedLabels = nextProps.selectedLabels || [];

  // Compare paper object by reference first for quick check
  if (
    prevProps.paper === nextProps.paper &&
    prevProps.onLabelClick === nextProps.onLabelClick &&
    prevProps.layout === nextProps.layout &&
    prevSelectedLabels.length === nextSelectedLabels.length &&
    prevSelectedLabels.every((label, idx) => label === nextSelectedLabels[idx])
  ) {
    return true;
  }

  // Deep compare paper properties that affect rendering
  const paperEqual =
    prevProps.paper.title === nextProps.paper.title &&
    prevProps.paper.authors === nextProps.paper.authors &&
    prevProps.paper.doi === nextProps.paper.doi &&
    prevProps.paper.arxiv === nextProps.paper.arxiv &&
    prevProps.paper.first_year === nextProps.paper.first_year &&
    prevProps.paper.final_year === nextProps.paper.final_year &&
    prevProps.paper.year === nextProps.paper.year &&
    prevProps.paper.database_added === nextProps.paper.database_added &&
    prevProps.paper.database_updated === nextProps.paper.database_updated &&
    prevProps.paper.abstract === nextProps.paper.abstract &&
    areStringArraysEqual(prevProps.paper.labels, nextProps.paper.labels) &&
    arePublicationsEqual(
      prevProps.paper.publications,
      nextProps.paper.publications
    );

  // Compare selectedLabels array
  const labelsEqual =
    prevSelectedLabels.length === nextSelectedLabels.length &&
    prevSelectedLabels.every((label, idx) => label === nextSelectedLabels[idx]);

  // Compare onLabelClick function reference
  const callbackEqual = prevProps.onLabelClick === nextProps.onLabelClick;

  return (
    paperEqual &&
    labelsEqual &&
    callbackEqual &&
    prevProps.layout === nextProps.layout
  );
};

export default memo(PaperCard, arePropsEqual);
