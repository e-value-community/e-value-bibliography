import { memo, useMemo, useState } from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import LabelChip from './LabelChip';
import PublicationBadge from './PublicationBadge';
import AuthorLine from './AuthorLine';
import SuggestEditButton from './SuggestEditButton';
import PaperAbstract from './PaperAbstract';
import { sortLabels } from '../../utils/labelUtils';
import { hasPaperDetails } from '../../utils/paperUtils';
import type { PaperCardProps } from './PaperCard';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 4,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'inset 3px 0 0 transparent',
  transition:
    'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
  margin: 0,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'dark' ? '#1d1f1f' : '#fffdf6',
    boxShadow: `inset 3px 0 0 ${theme.palette.primary.main}`,
  },
}));

const PaperTitle = styled(Typography)(() => ({
  fontWeight: 700,
  lineHeight: 1.25,
  fontSize: '1rem',
}));

/**
 * Mobile layout for PaperCard
 * - Title on first row
 * - Authors on second row
 * - Labels and publication badges wrapped together
 */
const PaperCardMobile: React.FC<PaperCardProps> = ({
  paper,
  selectedLabels = [],
  onLabelClick = null,
}) => {
  const sortedLabels = useMemo(() => sortLabels(paper.labels), [paper.labels]);
  const [abstractExpanded, setAbstractExpanded] = useState(false);
  const showDetails = hasPaperDetails(paper);

  const handleCardClick = (event: React.MouseEvent) => {
    if (!showDetails) return;
    const target = event.target as HTMLElement;
    if (target.closest('a, button, input, [role="button"]')) return;
    setAbstractExpanded(value => !value);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (!showDetails || event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setAbstractExpanded(value => !value);
    }
  };

  return (
    <StyledCard
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={showDetails ? 0 : undefined}
      aria-expanded={showDetails ? abstractExpanded : undefined}
      aria-label={
        showDetails
          ? `${paper.title || 'Paper'}. ${abstractExpanded ? 'Hide' : 'Show'} details`
          : undefined
      }
      sx={{ cursor: showDetails ? 'pointer' : 'default' }}
    >
      <CardContent
        sx={{
          position: 'relative',
          pt: 1,
          px: 2,
          pr: 9,
          '&:last-child': { pb: 5 },
        }}
      >
        {/* Title */}
        <PaperTitle
          variant="subtitle1"
          sx={{
            display: 'block',
            mb: 0.75,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          {paper.title}
        </PaperTitle>

        {/* Authors */}
        <AuthorLine authors={paper.authors} sx={{ display: 'block' }} />

        {showDetails && (
          <PaperAbstract paper={paper} expanded={abstractExpanded} />
        )}

        {/* Labels and publication badges wrapped together */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            flexWrap: 'wrap',
            gap: 0.75,
            '& > *': {
              minHeight: '32px', // Ensure adequate touch targets
            },
          }}
        >
          {/* Topic labels */}
          {sortedLabels.map((label: string) => (
            <LabelChip
              key={`label-${label}`}
              label={label}
              isSelected={selectedLabels.includes(label)}
              onLabelClick={onLabelClick}
            />
          ))}

          {/* Publication badges inline with labels */}
          {paper.publications?.map((pub, index: number) => (
            <PublicationBadge key={`pub-${index}`} publication={pub} />
          ))}
        </Stack>
        <SuggestEditButton paper={paper} />
      </CardContent>
    </StyledCard>
  );
};

export default memo(PaperCardMobile);
