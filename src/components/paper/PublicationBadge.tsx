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
  const isArxiv = name === 'arXiv';
  const displayName = getVenueDisplayName(name);
  const fullName = getVenueCanonicalName(name);

  const displayLabel = `${displayName}${year ? " '" + year.toString().slice(-2) : ''}`;
  const tooltipTitle = `${fullName}${year ? ' ' + year : ''}${url ? ' - Click to view' : ''}`;

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
        variant={isArxiv ? 'outlined' : 'filled'}
        color={isArxiv ? 'default' : 'primary'}
        onClick={handleClick}
        sx={{
          cursor: url ? 'pointer' : 'default',
          borderRadius: 1,
          borderWidth: 1,
          bgcolor: isArxiv ? 'action.hover' : 'primary.light',
          borderColor: isArxiv ? 'divider' : 'primary.light',
          color: isArxiv ? 'text.primary' : 'primary.dark',
          '&:hover': url
            ? {
                bgcolor: isArxiv ? 'background.paper' : 'background.paper',
                borderColor: isArxiv ? 'text.secondary' : 'primary.main',
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
