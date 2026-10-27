import {
  Box,
  Stack,
  Typography,
  Container,
  Fade,
  IconButton,
  Tooltip,
  useMediaQuery,
  Button,
} from '@mui/material';
import { Download, Clear } from '@mui/icons-material';
import * as React from 'react';
import { useMemo, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import type { Paper } from '@/types';
import type { YearBasis } from '@/types';
import { useSearchParams } from 'react-router-dom';

// Import our new components
import SearchAndFilter from './SearchAndFilter';
import { PaperCard } from './paper';
import StatsDashboard from './StatsDashboard';
import EmptyState from './EmptyState';
import { usePaperFilter } from '../hooks/usePaperFilter';
import { exportBibtex } from '../utils/exportUtils';
import { getVenueCanonicalName } from '../utils/venueUtils';

interface PaperListProps {
  data: Paper[];
  initialVenue?: string | null;
  initialYear?: number | null;
  initialYearBasis?: YearBasis;
}

const PaperList: React.FC<PaperListProps> = ({
  data,
  initialVenue = null,
  initialYear = null,
  initialYearBasis = 'first',
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const isCardMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    searchQuery,
    setSearchQuery,
    selLabels,
    setSelLabels,
    selectedYear,
    setSelectedYear,
    yearBasis,
    setYearBasis,
    selectedVenue,
    setSelectedVenue,
    sortedData,
    distinctLabels,
    handleClearFilters,
    SPECIAL_LABELS,
  } = usePaperFilter(data, initialVenue, initialYear, initialYearBasis);

  const updateUrlFilters = useCallback(
    (updates: {
      venue?: string | null;
      year?: number | null;
      yearBasis?: YearBasis;
    }): void => {
      const nextParams = new URLSearchParams(searchParams);

      if ('venue' in updates) {
        if (updates.venue) nextParams.set('venue', updates.venue);
        else nextParams.delete('venue');
      }

      if ('year' in updates) {
        if (updates.year !== null && updates.year !== undefined) {
          nextParams.set('year', String(updates.year));
        } else {
          nextParams.delete('year');
        }
      }

      if ('yearBasis' in updates) {
        if (updates.yearBasis === 'final') {
          nextParams.set('yearBasis', 'final');
        } else {
          nextParams.delete('yearBasis');
        }
      }

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const hasActiveFilters = Boolean(
    searchQuery ||
    selLabels.length > 0 ||
    selectedYear !== null ||
    selectedVenue
  );
  const hasActiveControls = hasActiveFilters;

  const activeFilterSummary = useMemo(() => {
    const filters: string[] = [];
    if (searchQuery) filters.push(`"${searchQuery}"`);
    if (selLabels.length > 0) {
      filters.push(
        `${selLabels.length === 1 ? 'label' : 'labels'} ${selLabels.join(', ')}`
      );
    }
    if (selectedYear !== null) {
      filters.push(
        `${yearBasis === 'first' ? 'first appearance' : 'final publication'} year ${selectedYear}`
      );
    }
    if (selectedVenue) filters.push(`venue ${selectedVenue}`);
    return filters.join(' and ');
  }, [searchQuery, selLabels, selectedYear, selectedVenue, yearBasis]);

  // Count papers with BibTeX
  const papersWithBibtex = useMemo(() => {
    return sortedData.filter(paper =>
      paper.publications?.some(pub => pub.bibtex)
    ).length;
  }, [sortedData]);

  // Stable callback for label clicks to enable PaperCard memoization
  const handleLabelClick = useCallback(
    (label: string): void => {
      setSelLabels((prev: string[]) => {
        // Avoid duplicates
        if (prev.includes(label)) return prev;
        return [label, ...prev];
      });
    },
    [setSelLabels]
  );

  const handleYearSelect = useCallback(
    (year: number): void => {
      const nextYear = selectedYear === year ? null : year;
      setSelectedYear(nextYear);
      updateUrlFilters({ year: nextYear, yearBasis });
    },
    [selectedYear, setSelectedYear, updateUrlFilters, yearBasis]
  );

  const handleYearBasisChange = useCallback(
    (nextBasis: YearBasis): void => {
      if (nextBasis === yearBasis) return;
      setYearBasis(nextBasis);
      setSelectedYear(null);
      updateUrlFilters({ year: null, yearBasis: nextBasis });
    },
    [setSelectedYear, setYearBasis, updateUrlFilters, yearBasis]
  );

  const handleVenueSelect = useCallback(
    (venue: string): void => {
      const isSameVenue =
        selectedVenue !== null &&
        getVenueCanonicalName(selectedVenue) === getVenueCanonicalName(venue);
      const nextVenue = isSameVenue ? null : venue;
      setSelectedVenue(nextVenue);
      updateUrlFilters({ venue: nextVenue });
    },
    [selectedVenue, setSelectedVenue, updateUrlFilters]
  );

  const clearAllFilters = useCallback((): void => {
    handleClearFilters();
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('venue');
    nextParams.delete('year');
    nextParams.delete('yearBasis');
    setSearchParams(nextParams);
  }, [handleClearFilters, searchParams, setSearchParams]);

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 0, sm: 2, md: 3 } }}
    >
      <Stack spacing={{ xs: 1, md: 1.5 }}>
        {/* Stats Dashboard */}
        <Fade in timeout={600}>
          <Box>
            <StatsDashboard
              data={data}
              yearBasis={yearBasis}
              selectedYear={selectedYear}
              selectedVenue={selectedVenue}
              onYearSelect={handleYearSelect}
              onYearBasisChange={handleYearBasisChange}
              onVenueSelect={handleVenueSelect}
            />
          </Box>
        </Fade>

        {/* Search and Filters */}
        <Fade in timeout={800}>
          <Box>
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedLabels={selLabels}
              onLabelsChange={setSelLabels}
              availableLabels={distinctLabels}
              specialLabels={SPECIAL_LABELS}
            />
          </Box>
        </Fade>

        {/* Compact Results Summary */}
        <Fade in timeout={1000}>
          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1}
              sx={{
                py: 1,
                px: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Showing{' '}
                  <strong>
                    {sortedData.length} of {data?.length ?? 0}
                  </strong>{' '}
                  papers
                  {hasActiveFilters && (
                    <>
                      {' matching '}
                      {activeFilterSummary}
                    </>
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.1 }}
                >
                  Ordered by date added to the bibliography, newest first.
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.5}>
                {/* Clear filters button */}
                {hasActiveControls && (
                  <>
                    {isDesktop ? (
                      <Button
                        size="medium"
                        startIcon={<Clear />}
                        onClick={clearAllFilters}
                        sx={{
                          color: 'secondary.dark',
                          fontWeight: 700,
                          '&:hover': {
                            bgcolor: 'secondary.light',
                            color: 'secondary.dark',
                          },
                        }}
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <Tooltip title="Clear all filters">
                        <IconButton
                          size="small"
                          onClick={clearAllFilters}
                          sx={{
                            color: 'secondary.dark',
                            '&:hover': {
                              bgcolor: 'secondary.light',
                              color: 'secondary.dark',
                            },
                          }}
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}

                {/* Export BibTeX button */}
                {papersWithBibtex > 0 && isDesktop && (
                  <Tooltip
                    title={`Export BibTeX for ${papersWithBibtex} papers with bibliography`}
                  >
                    <IconButton
                      size="small"
                      onClick={() => exportBibtex(sortedData)}
                      sx={{
                        color: 'primary.dark',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.dark',
                          borderColor: 'primary.light',
                        },
                      }}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Box>
        </Fade>

        {/* Papers List */}
        <Fade in timeout={1200}>
          <Box>
            {sortedData.length === 0 ? (
              <EmptyState
                variant="no-results"
                title="No papers found"
                message={
                  searchQuery
                    ? `No papers match "${searchQuery}". Try different keywords or clear filters.`
                    : hasActiveFilters
                      ? `No papers match the selected filters. Try selecting different labels.`
                      : 'No papers available in the database.'
                }
                {...(hasActiveFilters && {
                  action: {
                    label: 'Clear Filters',
                    onClick: clearAllFilters,
                  },
                })}
              />
            ) : (
              <Stack spacing={1}>
                {sortedData.map((paper, index) => (
                  <Box
                    key={`${paper.title || 'untitled'}-${index}`}
                    sx={{
                      contentVisibility: 'auto',
                      containIntrinsicSize: isCardMobile ? '180px' : '72px',
                    }}
                  >
                    <PaperCard
                      paper={paper}
                      layout={isCardMobile ? 'mobile' : 'desktop'}
                      selectedLabels={selLabels}
                      onLabelClick={handleLabelClick}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Fade>
      </Stack>
    </Container>
  );
};

export default PaperList;
