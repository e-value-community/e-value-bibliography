import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowForward, Business, Search } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { usePapersData } from '../hooks/usePapersData';
import { calculateAllVenueStats } from '../utils/statsUtils';
import { normalizeSearchText } from '../utils/searchUtils';

const VenuesPage: React.FC = () => {
  const { data, loading, error } = usePapersData();
  const [query, setQuery] = useState('');

  const venues = useMemo(
    () => (data ? calculateAllVenueStats(data) : []),
    [data]
  );
  const filteredVenues = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return venues;
    return venues.filter(venue =>
      normalizeSearchText(`${venue.name} ${venue.canonicalName}`).includes(
        normalizedQuery
      )
    );
  }, [query, venues]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        role="status"
      >
        <CircularProgress aria-label="Loading venues" />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load the venue directory. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Box sx={{ maxWidth: 820 }}>
          <Stack direction="row" alignItems="center" spacing={1.25} mb={1}>
            <Business color="secondary" />
            <Chip
              label={`${venues.length} venues`}
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontSize: { xs: '2rem', md: '2.65rem' }, mb: 1 }}
          >
            Venues publishing e-values research
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
            Every journal, conference, and proceedings venue represented in the
            collection, including venues with a single paper. Counts refer to
            distinct papers; years show the publication years currently recorded
            for that venue.
          </Typography>
        </Box>

        <TextField
          value={query}
          onChange={event => setQuery(event.target.value)}
          label="Find a venue"
          placeholder="Search by venue name or abbreviation"
          size="small"
          sx={{ maxWidth: 520 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2" color="text.secondary">
          Showing <strong>{filteredVenues.length}</strong> of {venues.length}{' '}
          venues
        </Typography>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}
        >
          <Table aria-label="All publication venues">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Venue</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Papers
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Years</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Paper list
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVenues.map(venue => (
                <TableRow key={venue.canonicalName} hover>
                  <TableCell>
                    <Typography fontWeight={700}>{venue.name}</Typography>
                    {venue.name !== venue.canonicalName && (
                      <Typography variant="body2" color="text.secondary">
                        {venue.canonicalName}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={venue.count}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      aria-label={`${venue.count} ${venue.count === 1 ? 'paper' : 'papers'}`}
                    />
                  </TableCell>
                  <TableCell>
                    {venue.years.length > 0 ? venue.years.join(', ') : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={RouterLink}
                      to={`/?venue=${encodeURIComponent(venue.canonicalName)}`}
                      size="small"
                      endIcon={<ArrowForward />}
                      aria-label={`View papers published in ${venue.canonicalName}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

export default VenuesPage;
