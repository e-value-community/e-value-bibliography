import { Chip, Tooltip } from '@mui/material';
import { openInNewTab } from '../../utils/paperUtils';
import {
  getVenueCanonicalName,
  getVenueDisplayName,
} from '../../utils/venueUtils';
import type { Publication } from '@/types/paper';

interface PublicationBadgeProps {
  publication: Publication;
}

/**
 * Publication badge chip with tooltip and click handling
 */
const PublicationBadge: React.FC<PublicationBadgeProps> = ({ publication }) => {
  const { name, year, url } = publication;
  const isManuscript = /^manuscript$/i.test(name);
  const isRepository = isManuscript || /^arxiv$/i.test(name);
  const displayName = isManuscript ? 'Manuscript' : getVenueDisplayName(name);
  const fullName = isManuscript ? 'Manuscript' : getVenueCanonicalName(name);
  const displayLabel = isManuscript
    ? 'Manuscript'
    : `${displayName}${year ? " '" + year.toString().slice(-2) : ''}`;
  const tooltipTitle = isManuscript
    ? url
      ? 'Open manuscript'
      : 'Manuscript'
    : `${fullName}${year ? ' ' + year : ''}${url ? ' - Click to view' : ''}`;

  const handleClick = () => {
    if (url) {
      openInNewTab(url);
    }
  };

  return (
    <Tooltip title={tooltipTitle}>
      <Chip
        label={displayLabel}
        size="small"
        variant={isRepository ? 'outlined' : 'filled'}
        color={isRepository ? 'default' : 'primary'}
        onClick={handleClick}
        sx={{
          cursor: url ? 'pointer' : 'default',
          borderRadius: 1,
          borderWidth: 1,
          bgcolor: isRepository ? 'action.hover' : 'primary.light',
          borderColor: isRepository ? 'divider' : 'primary.light',
          color: isRepository ? 'text.primary' : 'primary.dark',
          '&:hover': url
            ? {
                bgcolor: 'background.paper',
                borderColor: isRepository ? 'text.secondary' : 'primary.main',
              }
            : {},
          transition:
            'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          height: 20,
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      />
    </Tooltip>
  );
};

export default PublicationBadge;
