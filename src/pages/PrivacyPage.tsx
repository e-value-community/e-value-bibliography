import { Container, Typography, Box, Stack } from '@mui/material';

const sectionSx = {
  pt: { xs: 3, md: 3.5 },
  borderTop: 1,
  borderColor: 'divider',
};

const PrivacyPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={{ xs: 3, md: 3.5 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h5" gutterBottom>
            Data Collection and Usage
          </Typography>

          <Typography paragraph>
            The E-value Bibliography collects aggregate usage information
            through its contribution service and Cloudflare Web Analytics. This
            helps us understand how the bibliography is used without identifying
            individual visitors.
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            What We Collect
          </Typography>
          <Box component="ul" sx={{ pl: 2, my: 0 }}>
            <li>Visits and page views</li>
            <li>Pages visited and referring websites</li>
            <li>Approximate location at the country level</li>
            <li>Device, browser, and operating-system information</li>
            <li>Basic page-performance measurements</li>
            <li>Names voluntarily provided with a contribution</li>
          </Box>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            What We Don&apos;t Collect
          </Typography>
          <Box component="ul" sx={{ pl: 2, my: 0 }}>
            <li>Email addresses</li>
            <li>Precise location data</li>
            <li>Cross-site browsing histories</li>
            <li>Data for advertising purposes</li>
          </Box>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            Cookies and Tracking
          </Typography>
          <Typography paragraph>
            The site does not use analytics cookies or fingerprinting. It stores
            one anonymous marker in the browser&apos;s session storage so that
            the first page view in a tab can be counted as a visit. The marker
            is not sent to the server and disappears when the tab session ends.
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            Contributions
          </Typography>
          <Typography paragraph>
            Text submitted through the Contribute page is stored for editorial
            review. Contributors may optionally provide a name, which is shown
            only in the private curation workspace. The forms do not ask for an
            email address. Please do not include personal or confidential
            information in a submission.
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            Your Rights
          </Typography>
          <Typography paragraph>
            Browser privacy tools and content blockers may prevent some
            aggregate measurements from being recorded. For questions about data
            use, contact the site maintainers through the Contribute page.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default PrivacyPage;
