import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { School, People, Business, ArrowForward } from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { calculateStats } from '../utils/statsUtils';
import { getVenueCanonicalName } from '../utils/venueUtils';
import type { Paper, YearBasis } from '@/types/paper';

interface MetricItemProps {
  icon: SvgIconComponent;
  value: number;
  title?: string | undefined;
  color?: 'primary' | 'secondary';
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon: Icon,
  value,
  title,
  color = 'primary',
}) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
    <Box
      sx={{
        width: { xs: 26, sm: 32 },
        height: { xs: 26, sm: 32 },
        borderRadius: 1,
        bgcolor: `${color}.light`,
        color: `${color}.dark`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: { xs: 14, sm: 18 } }} />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="text.primary"
        sx={{
          fontSize: { xs: '1rem', sm: '1.75rem' },
          lineHeight: 1.2,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
      >
        {title}
      </Typography>
    </Box>
  </Stack>
);

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: SvgIconComponent;
  trend?: string;
  color?: 'primary' | 'secondary';
  secondaryValue?: number;
  secondaryTitle?: string;
  secondaryIcon?: SvgIconComponent;
  tertiaryValue?: number;
  tertiaryTitle?: string;
  tertiaryIcon?: SvgIconComponent;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  secondaryValue,
  secondaryTitle,
  secondaryIcon,
  tertiaryValue,
  tertiaryTitle,
  tertiaryIcon,
}) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: 1,
      border: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        borderColor: `${color}.main`,
      },
    }}
  >
    <CardContent sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
      <Stack spacing={{ xs: 0.5, sm: 1 }}>
        {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
        <Stack
          direction={{ xs: 'row', sm: 'column' }}
          spacing={{ xs: 1.5, sm: 1 }}
          sx={{
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            alignItems: { xs: 'center', sm: 'stretch' },
          }}
        >
          <MetricItem icon={icon} value={value} title={title} color={color} />

          {secondaryValue && secondaryIcon && (
            <MetricItem
              icon={secondaryIcon}
              value={secondaryValue}
              title={secondaryTitle}
              color={color}
            />
          )}
        </Stack>

        {tertiaryValue && tertiaryIcon && (
          <MetricItem
            icon={tertiaryIcon}
            value={tertiaryValue}
            title={tertiaryTitle}
            color={color}
          />
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 1 }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Trend */}
        {trend && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Chip
              label={trend}
              size="small"
              color={trend.startsWith('+') ? 'secondary' : 'default'}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          </Box>
        )}
      </Stack>
    </CardContent>
  </Card>
);

interface VenueData {
  name: string;
  count: number;
}

interface TopVenuesCardProps {
  venues: VenueData[];
  selectedVenue: string | null;
  onVenueSelect: (venue: string) => void;
}

const TopVenuesCard: React.FC<TopVenuesCardProps> = ({
  venues,
  selectedVenue,
  onVenueSelect,
}) => {
  const maxCount = venues.length > 0 ? venues[0]?.count || 1 : 1;
  const isSelected = (venueName: string): boolean =>
    selectedVenue !== null &&
    getVenueCanonicalName(selectedVenue) === getVenueCanonicalName(venueName);

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: 'secondary.main',
        },
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: { xs: 0.75, sm: 1.5 }, flexShrink: 0 }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}
          >
            Top Venues
          </Typography>
          <Button
            component={RouterLink}
            to="/venues"
            size="small"
            endIcon={<ArrowForward />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            All venues
          </Button>
        </Stack>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            position: 'relative',
            minHeight: { xs: '80px', sm: '110px' },
            px: { xs: 0.5, sm: 1 },
            pb: { xs: 1.5, sm: 2 },
            pt: { xs: 1.5, sm: 2 },
          }}
        >
          {venues?.map(venue => (
            <Box
              key={venue.name}
              component="button"
              type="button"
              onClick={() => onVenueSelect(venue.name)}
              aria-label={`Filter to ${venue.count} ${venue.count === 1 ? 'paper' : 'papers'} from ${venue.name}`}
              aria-pressed={isSelected(venue.name)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                mx: { xs: 0.2, sm: 0.4 },
                height: '100%',
                position: 'relative',
                justifyContent: 'flex-end',
                appearance: 'none',
                border: 0,
                p: 0,
                color: 'inherit',
                background: 'transparent',
                cursor: 'pointer',
                opacity: selectedVenue && !isSelected(venue.name) ? 0.5 : 1,
                '&:focus-visible': {
                  outline: theme => `2px solid ${theme.palette.secondary.main}`,
                  outlineOffset: 3,
                  borderRadius: 1,
                },
              }}
            >
              {/* Count label positioned at top */}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: { xs: -16, sm: -20 },
                  color: isSelected(venue.name)
                    ? 'secondary.dark'
                    : 'text.secondary',
                  fontSize: { xs: '0.55rem', sm: '0.65rem' },
                  fontWeight: 'medium',
                  whiteSpace: 'nowrap',
                }}
              >
                {venue.count}
              </Typography>

              {/* Bar - proportional height based on data */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: { xs: '28px', sm: '44px' },
                  height: {
                    xs: `${Math.max((venue.count / maxCount) * 45, 4)}px`,
                    sm: `${Math.max((venue.count / maxCount) * 65, 6)}px`,
                  },
                  backgroundColor: theme =>
                    isSelected(venue.name)
                      ? theme.palette.secondary.dark
                      : theme.palette.secondary.main,
                  borderRadius: '3px 3px 0 0',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.secondary.dark,
                    transform: 'scaleY(1.04)',
                    transformOrigin: 'bottom',
                  },
                }}
              />

              {/* Venue label positioned at bottom */}
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  bottom: { xs: -16, sm: -20 },
                  fontSize: { xs: '0.55rem', sm: '0.65rem' },
                  fontWeight: isSelected(venue.name) ? 'bold' : 'medium',
                  color: isSelected(venue.name)
                    ? 'secondary.dark'
                    : 'text.secondary',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  maxWidth: { xs: '46px', sm: '64px' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {venue.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

interface YearDistributionChartProps {
  yearData: Record<string, number>;
  yearBasis: YearBasis;
  selectedYear: number | null;
  onYearSelect: (year: number) => void;
  onYearBasisChange: (basis: YearBasis) => void;
}

const MIN_DISPLAY_YEAR = 2019;

const YearDistributionChart: React.FC<YearDistributionChartProps> = ({
  yearData,
  yearBasis,
  selectedYear,
  onYearSelect,
  onYearBasisChange,
}) => {
  const years = Object.keys(yearData)
    .filter(year => parseInt(year) >= MIN_DISPLAY_YEAR)
    .sort((a, b) => parseInt(a) - parseInt(b));
  const maxCount = Math.max(1, ...years.map(year => yearData[year] || 0));

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 1.5, sm: 2 },
          px: { xs: 1.5, sm: 2 },
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: { xs: 0.75, sm: 1.5 }, flexShrink: 0 }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.05rem' },
                lineHeight: 1.2,
              }}
            >
              Papers by{' '}
              {yearBasis === 'first' ? 'first appearance' : 'final publication'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.65rem', sm: '0.72rem' } }}
            >
              Since 2019
            </Typography>
          </Box>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={yearBasis}
            onChange={(_event, nextBasis: YearBasis | null) => {
              if (nextBasis) onYearBasisChange(nextBasis);
            }}
            aria-label="Choose the year definition"
            sx={{
              flexShrink: 0,
              '& .MuiToggleButton-root': {
                py: 0.35,
                px: { xs: 0.8, sm: 1 },
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                fontWeight: 700,
                textTransform: 'none',
              },
            }}
          >
            <ToggleButton value="first" aria-label="First appearance year">
              <Tooltip title="Earliest public version">
                <span>First</span>
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="final" aria-label="Final publication year">
              <Tooltip title="Journal or proceedings year; first year for unpublished work">
                <span>Final</span>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            position: 'relative',
            minHeight: { xs: '80px', sm: '110px' },
            px: { xs: 0.5, sm: 1 },
            pb: { xs: 1.5, sm: 2 },
            pt: { xs: 1.5, sm: 2 },
          }}
        >
          {years.map(year => (
            <Box
              key={year}
              component="button"
              type="button"
              onClick={() => onYearSelect(Number(year))}
              aria-label={`Filter to ${yearData[year]} ${yearData[year] === 1 ? 'paper' : 'papers'} with ${yearBasis === 'first' ? 'first appearance' : 'final publication'} in ${year}`}
              aria-pressed={selectedYear === Number(year)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                mx: { xs: 0.35, sm: 0.7 },
                height: '100%',
                position: 'relative',
                justifyContent: 'flex-end',
                appearance: 'none',
                border: 0,
                p: 0,
                color: 'inherit',
                background: 'transparent',
                cursor: 'pointer',
                opacity:
                  selectedYear !== null && selectedYear !== Number(year)
                    ? 0.5
                    : 1,
                '&:focus-visible': {
                  outline: theme => `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 3,
                  borderRadius: 1,
                },
              }}
            >
              {/* Count label positioned at top */}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: { xs: -16, sm: -20 },
                  color:
                    selectedYear === Number(year)
                      ? 'primary.dark'
                      : 'text.secondary',
                  fontSize: { xs: '0.55rem', sm: '0.65rem' },
                  fontWeight: 'medium',
                  whiteSpace: 'nowrap',
                }}
              >
                {yearData[year]}
              </Typography>

              {/* Bar - proportional height based on data */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: { xs: '22px', sm: '30px' },
                  height: {
                    xs: `${Math.max(((yearData[year] || 0) / maxCount) * 45, 4)}px`,
                    sm: `${Math.max(((yearData[year] || 0) / maxCount) * 65, 6)}px`,
                  },
                  backgroundColor: theme =>
                    selectedYear === Number(year)
                      ? theme.palette.primary.dark
                      : theme.palette.primary.main,
                  borderRadius: '3px 3px 0 0',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.primary.dark,
                    transform: 'scaleY(1.04)',
                    transformOrigin: 'bottom',
                  },
                }}
              />

              {/* Year label positioned at bottom */}
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  bottom: { xs: -16, sm: -20 },
                  fontSize: { xs: '0.6rem', sm: '0.7rem' },
                  fontWeight: selectedYear === Number(year) ? 'bold' : 'medium',
                  color:
                    selectedYear === Number(year)
                      ? 'primary.dark'
                      : 'text.secondary',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {year}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

interface StatsDashboardProps {
  data: Paper[];
  yearBasis: YearBasis;
  selectedYear: number | null;
  selectedVenue: string | null;
  onYearSelect: (year: number) => void;
  onYearBasisChange: (basis: YearBasis) => void;
  onVenueSelect: (venue: string) => void;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({
  data,
  yearBasis,
  selectedYear,
  selectedVenue,
  onYearSelect,
  onYearBasisChange,
  onVenueSelect,
}) => {
  const {
    totalPapers,
    totalAuthors,
    totalVenues,
    firstYearDistribution,
    finalYearDistribution,
    venueStats,
  } = useMemo(() => calculateStats(data), [data]);

  const yearDistribution =
    yearBasis === 'first' ? firstYearDistribution : finalYearDistribution;

  return (
    <Box sx={{ mb: { xs: 0.5, sm: 0.75 } }}>
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        {/* Compact Total Papers & Authors & Venues */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Papers"
            value={totalPapers}
            secondaryValue={totalAuthors}
            secondaryTitle="Authors"
            tertiaryValue={totalVenues}
            tertiaryTitle="Venues/Journals"
            icon={School}
            secondaryIcon={People}
            tertiaryIcon={Business}
            color="primary"
          />
        </Grid>

        {/* Year Distribution Chart */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <YearDistributionChart
            yearData={yearDistribution}
            yearBasis={yearBasis}
            selectedYear={selectedYear}
            onYearSelect={onYearSelect}
            onYearBasisChange={onYearBasisChange}
          />
        </Grid>

        {/* Compact Top Venues */}
        <Grid size={{ xs: 12, md: 5 }}>
          <TopVenuesCard
            venues={venueStats}
            selectedVenue={selectedVenue}
            onVenueSelect={onVenueSelect}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsDashboard;
