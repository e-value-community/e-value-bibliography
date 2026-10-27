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
    <>
      {paper.abstract && (
        <Box aria-label="Abstract" sx={{ mt: 0.65, ml: 2 }}>
          <AbstractContent preview={!expanded}>
            {paper.abstract}
          </AbstractContent>
        </Box>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box aria-label="Database information" sx={{ mt: 0.8, ml: 2 }}>
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
        </Box>
      </Collapse>
    </>
  );
};

export default PaperAbstract;
