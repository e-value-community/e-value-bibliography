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
            The E-value Bibliography uses Cloudflare Web Analytics to collect
            aggregate usage information. This helps us understand how the
            bibliography is used without identifying individual visitors.
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
          </Box>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            What We Don&apos;t Collect
          </Typography>
          <Box component="ul" sx={{ pl: 2, my: 0 }}>
            <li>Names or email addresses</li>
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
            Cloudflare Web Analytics does not use cookies, local storage, or
            fingerprinting to identify or follow visitors. The site therefore
            does not display an analytics cookie banner.
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            Contributions
          </Typography>
          <Typography paragraph>
            Text submitted through the Contribute page is stored for editorial
            review. The forms do not ask for a name or email address. Please do
            not include personal or confidential information in a submission.
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <Typography variant="h6" gutterBottom>
            Your Rights
          </Typography>
          <Typography paragraph>
            Browser privacy tools and content blockers can prevent the analytics
            beacon from loading. For questions about data use, contact the site
            maintainers through the Contribute page.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default PrivacyPage;
