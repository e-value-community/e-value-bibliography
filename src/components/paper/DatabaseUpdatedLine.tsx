import { Typography } from '@mui/material';

interface DatabaseUpdatedLineProps {
  addedDate?: string | undefined;
  updatedDate?: string | undefined;
}

const formatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const formatDatabaseUpdated = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const parsed = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  return Number.isNaN(parsed.getTime()) ? value : formatter.format(parsed);
};

const DateLine = ({ label, date }: { label: string; date: string }) => (
  <Typography
    variant="caption"
    color="text.secondary"
    title={`${label} on ${date}`}
    sx={{ display: 'block', mt: 0.25, lineHeight: 1.35 }}
  >
    {label}: {formatDatabaseUpdated(date)}
  </Typography>
);

const DatabaseUpdatedLine: React.FC<DatabaseUpdatedLineProps> = ({
  addedDate,
  updatedDate,
}) => {
  if (!addedDate && !updatedDate) return null;

  return (
    <>
      {addedDate && <DateLine label="Added to bibliography" date={addedDate} />}
      {updatedDate && updatedDate !== addedDate && (
        <DateLine label="Database updated" date={updatedDate} />
      )}
    </>
  );
};

export default DatabaseUpdatedLine;
