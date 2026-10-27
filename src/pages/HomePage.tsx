import { Box, Container, Link, Stack, Typography } from '@mui/material';
import PaperList from '../components/paperlist';
import { usePapersData } from '../hooks/usePapersData';
import PaperCardSkeleton from '@/components/skeletons/PaperCardSkeleton';
import StatsDashboardSkeleton from '@/components/skeletons/StatsDashboardSkeleton';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import type { YearBasis } from '@/types';

const HomePage: React.FC = () => {
  const { data, loading, error } = usePapersData();
  const [searchParams] = useSearchParams();
  const initialVenue = searchParams.get('venue');
  const yearParam = searchParams.get('year');
  const parsedYear = yearParam ? Number.parseInt(yearParam, 10) : NaN;
  const initialYear = Number.isFinite(parsedYear) ? parsedYear : null;
  const initialYearBasis: YearBasis =
    searchParams.get('yearBasis') === 'final' ? 'final' : 'first';

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        disableGutters
        sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 0, sm: 2, md: 3 } }}
        role="status"
        aria-live="polite"
      >
        <Typography sx={{ position: 'absolute', left: '-10000px' }}>
          Loading papers...
        </Typography>
        <StatsDashboardSkeleton />
        {[1, 2, 3, 4, 5, 6].map(i => (
          <PaperCardSkeleton key={i} />
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        role="alert"
        aria-live="assertive"
      >
        <Typography color="error">
          Failed to load papers. Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography>No papers found.</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} useFlexGap>
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 2, sm: 4, md: 6 }, pt: { xs: 2, md: 3 } }}
      >
        <Box sx={{ maxWidth: 900 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontSize: { xs: '2rem', md: '2.65rem' }, mb: 1 }}
          >
            Research on e-values and anytime-valid inference
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.65 }}
          >
            A curated, searchable bibliography covering e-values, e-processes,
            e-detectors, confidence sequences, multiple testing, post-hoc
            inference, and related methods and applications. AI-assisted
            searches help identify research, while the community helps curate
            the collection. Missing papers, corrections, and other contributions
            can be submitted through the{' '}
            <Link component={RouterLink} to="/submit">
              Contribute
            </Link>{' '}
            page.
          </Typography>
        </Box>
      </Container>
      <PaperList
        data={data}
        initialVenue={initialVenue}
        initialYear={initialYear}
        initialYearBasis={initialYearBasis}
      />
    </Stack>
  );
};

export default HomePage;
