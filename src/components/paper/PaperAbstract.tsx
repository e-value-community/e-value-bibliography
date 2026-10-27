import { Box, Collapse, Typography } from '@mui/material';
import {
  getPaperFirstAppearanceYear,
  getPaperVersionOfRecordYear,
} from '../../utils/paperUtils';
import type { Paper } from '@/types/paper';
import AbstractContent from './AbstractContent';
import DatabaseUpdatedLine from './DatabaseUpdatedLine';

interface PaperAbstractProps {
  paper: Paper;
  expanded: boolean;
}

const PaperAbstract: React.FC<PaperAbstractProps> = ({ paper, expanded }) => {
  const firstYear = getPaperFirstAppearanceYear(paper);
  const versionOfRecordYear = getPaperVersionOfRecordYear(paper);
  const metadataSx = {
    display: 'block',
    color: 'text.secondary',
    lineHeight: 1.35,
  } as const;

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Box sx={{ mt: 0.8 }}>
        {firstYear && (
          <Typography variant="caption" sx={metadataSx}>
            First appearance: {firstYear}
          </Typography>
        )}
        <DatabaseUpdatedLine
          addedDate={paper.database_added}
          updatedDate={paper.database_updated}
        />
        {versionOfRecordYear && (
          <Typography variant="caption" sx={metadataSx}>
            Version of record: {versionOfRecordYear}
          </Typography>
        )}
        {paper.abstract && (
          <Box sx={{ mt: 0.75 }}>
            <Typography
              component="span"
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              Abstract
            </Typography>
            <AbstractContent>{paper.abstract}</AbstractContent>
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default PaperAbstract;
