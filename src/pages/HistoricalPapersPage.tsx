import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ArrowForward, MenuBook, OpenInNew } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface HistoricalPaper {
  year: number;
  title: string;
  authors: string;
  venue: string;
  url: string;
  note: string;
}

interface HistoricalEra {
  title: string;
  period: string;
  introduction: string;
  papers: HistoricalPaper[];
}

const BOOK_HISTORY_URL =
  'https://www.stat.cmu.edu/~aramdas/ebook-final.pdf#page=27';

const historicalEras: HistoricalEra[] = [
  {
    title: 'Martingales and sequential tests',
    period: '1939–1948',
    introduction:
      'The core validity argument appeared before modern e-value terminology: accumulate nonnegative evidence and control the chance that it ever becomes large under the null.',
    papers: [
      {
        year: 1939,
        title: 'Étude critique de la notion de collectif',
        authors: 'Jean Ville',
        venue: 'Doctoral thesis',
        url: 'https://www.numdam.org/item/THESE_1939__218__1_0.pdf',
        note: 'Introduced the gambling and nonnegative-martingale viewpoint behind the maximal inequality now used to monitor e-processes continuously.',
      },
      {
        year: 1945,
        title: 'Sequential Tests of Statistical Hypotheses',
        authors: 'Abraham Wald',
        venue: 'Annals of Mathematical Statistics',
        url: 'https://doi.org/10.1214/aoms/1177731118',
        note: 'Established sequential likelihood-ratio testing, the classical source of likelihood-ratio test martingales and stopping rules.',
      },
      {
        year: 1948,
        title: 'Optimum Character of the Sequential Probability Ratio Test',
        authors: 'Abraham Wald and Jacob Wolfowitz',
        venue: 'Annals of Mathematical Statistics',
        url: 'https://doi.org/10.1214/aoms/1177730197',
        note: 'Proved the benchmark expected-sample-size optimality of the sequential probability ratio test for two simple hypotheses.',
      },
    ],
  },
  {
    title: 'Growth-optimal betting',
    period: '1956–1998',
    introduction:
      'A parallel line treated wealth growth itself as the objective. Kelly, Breiman, and Cover supplied ideas that later became central to designing powerful betting tests.',
    papers: [
      {
        year: 1956,
        title: 'A New Interpretation of Information Rate',
        authors: 'John L. Kelly Jr.',
        venue: 'Bell System Technical Journal',
        url: 'https://doi.org/10.1002/j.1538-7305.1956.tb03809.x',
        note: 'Connected information to the maximal long-run logarithmic growth of capital, motivating growth-optimal betting strategies.',
      },
      {
        year: 1961,
        title: 'Optimal Gambling Systems for Favorable Games',
        authors: 'Leo Breiman',
        venue: 'Fourth Berkeley Symposium',
        url: 'https://digicoll.lib.berkeley.edu/record/112884?ln=en',
        note: 'Developed the asymptotic optimality of log-growth strategies and clarified why repeated favorable betting is naturally evaluated through capital growth.',
      },
      {
        year: 1984,
        title: 'An Algorithm for Maximizing Expected Log Investment Return',
        authors: 'Thomas M. Cover',
        venue: 'IEEE Transactions on Information Theory',
        url: 'https://doi.org/10.1109/TIT.1984.1056869',
        note: 'Gave an iterative method for finding a log-optimal portfolio, strengthening the computational side of growth-optimal betting.',
      },
      {
        year: 1987,
        title: 'Log Optimal Portfolios',
        authors: 'Thomas M. Cover',
        venue: 'Gambling Research: Gambling and Risk Taking',
        url: 'https://isl.stanford.edu/~cover/papers/paper81.pdf',
        note: 'Connected the long-run, competitive, and sequential optimality properties of log-optimal portfolios, presenting capital growth as a common criterion across several betting horizons.',
      },
      {
        year: 1988,
        title: 'Game-Theoretic Optimal Portfolios',
        authors: 'Robert Bell and Thomas M. Cover',
        venue: 'Management Science',
        url: 'https://doi.org/10.1287/mnsc.34.6.724',
        note: 'Showed that the log-optimal portfolio solves a broad family of competitive wealth games, anticipating the numeraire and growth-optimal ideas used to compare e-values.',
      },
      {
        year: 1991,
        title: 'Universal Portfolios',
        authors: 'Thomas M. Cover',
        venue: 'Mathematical Finance',
        url: 'https://doi.org/10.1111/j.1467-9965.1991.tb00002.x',
        note: 'Constructed a pathwise universal betting strategy that competes with the best constant portfolio chosen in hindsight.',
      },
      {
        year: 1998,
        title: 'The Cost of Achieving the Best Portfolio in Hindsight',
        authors: 'Erik Ordentlich and Thomas M. Cover',
        venue: 'Mathematics of Operations Research',
        url: 'https://doi.org/10.1287/moor.23.4.960',
        note: 'Derived an exact minimax strategy for competing with the best constant rebalanced portfolio in hindsight, linking pathwise wealth guarantees with universal betting and online learning.',
      },
    ],
  },
  {
    title: 'Sequential tests, confidence sequences, and power-one tests',
    period: '1950–1976',
    introduction:
      'This literature extended sequential testing beyond simple hypotheses and developed inference that remains valid over an open-ended sequence of sample sizes, together with tests that eventually reject false nulls.',
    papers: [
      {
        year: 1950,
        title: 'On a Sequential t-Test',
        authors: 'S. Rushton',
        venue: 'Biometrika',
        url: 'https://doi.org/10.1093/biomet/37.3-4.326',
        note: 'Adapted sequential testing to a normal-mean problem with an unknown variance, an early step from simple likelihood-ratio tests toward routinely usable sequential procedures.',
      },
      {
        year: 1967,
        title: 'Confidence Sequences for Mean, Variance, and Median',
        authors: 'D. A. Darling and Herbert Robbins',
        venue: 'PNAS',
        url: 'https://doi.org/10.1073/pnas.58.1.66',
        note: 'Introduced confidence sequences with simultaneous coverage over time, a central inferential consequence of modern e-processes.',
      },
      {
        year: 1967,
        title: 'Iterated Logarithm Inequalities',
        authors: 'D. A. Darling and Herbert Robbins',
        venue: 'PNAS',
        url: 'https://doi.org/10.1073/pnas.57.5.1188',
        note: 'Used nonnegative exponential martingales to obtain explicit time-uniform bounds, with direct applications to confidence intervals and tests under optional stopping.',
      },
      {
        year: 1968,
        title: 'Some Nonparametric Sequential Tests with Power One',
        authors: 'D. A. Darling and Herbert Robbins',
        venue: 'PNAS',
        url: 'https://doi.org/10.1073/pnas.61.3.804',
        note: 'Constructed nonparametric sequential tests that control false rejection while eventually rejecting under broad alternatives, extending power-one testing beyond parametric models.',
      },
      {
        year: 1970,
        title:
          'Statistical Methods Related to the Law of the Iterated Logarithm',
        authors: 'Herbert Robbins',
        venue: 'Annals of Mathematical Statistics',
        url: 'https://doi.org/10.1214/aoms/1177696786',
        note: 'Extended the Ville–Wald inequality to study an entire sequence of observations, yielding time-uniform probability bounds and statistical procedures closely related to modern e-processes.',
      },
      {
        year: 1970,
        title:
          'Boundary Crossing Probabilities for the Wiener Process and Sample Sums',
        authors: 'Herbert Robbins and David Siegmund',
        venue: 'Annals of Mathematical Statistics',
        url: 'https://doi.org/10.1214/aoms/1177696787',
        note: 'Calculated curved-boundary crossing probabilities for Brownian motion and established an invariance result for sample sums, providing foundations for time-uniform stopping boundaries.',
      },
      {
        year: 1972,
        title: 'A Class of Stopping Rules for Testing Parametric Hypotheses',
        authors: 'Herbert Robbins and David Siegmund',
        venue: 'Proceedings volume',
        url: 'https://doi.org/10.1525/9780520422001-006',
        note: 'Used predictable parameter estimates inside likelihood factors, an early form of the modern predict-then-bet construction.',
      },
      {
        year: 1974,
        title: 'The Expected Sample Size of Some Tests of Power One',
        authors: 'Herbert Robbins and David Siegmund',
        venue: 'Annals of Statistics',
        url: 'https://doi.org/10.1214/aos/1176342704',
        note: 'Analyzed the efficiency of mixture-based power-one tests through their expected sample size and connected their likelihood mixtures to favorable gambling.',
      },
      {
        year: 1975,
        title:
          'Approximations to the Expected Sample Size of Certain Sequential Tests',
        authors: 'Moshe Pollak and David Siegmund',
        venue: 'Annals of Statistics',
        url: 'https://doi.org/10.1214/aos/1176343284',
        note: 'Developed practical approximations and bounds for the sample size of mixture power-one tests and change-detection procedures.',
      },
      {
        year: 1976,
        title: 'On Confidence Sequences',
        authors: 'Tze Leung Lai',
        venue: 'Annals of Statistics',
        url: 'https://doi.org/10.1214/aos/1176343406',
        note: 'Developed shrinking confidence sequences using likelihood-ratio martingales and boundary-crossing analysis.',
      },
    ],
  },
  {
    title: 'Algorithmic and game-theoretic evidence',
    period: '1976–2011',
    introduction:
      'Algorithmic randomness, game-theoretic probability, and early conformal prediction made the evidence interpretation increasingly explicit and led toward today’s numerical e-values.',
    papers: [
      {
        year: 1976,
        title: 'Uniform Tests of Randomness',
        authors: 'Leonid A. Levin',
        venue: 'Soviet Mathematics Doklady',
        url: 'https://www.cs.bu.edu/fac/lnd/dvi/rnd76.pdf',
        note: 'Developed tests of randomness that apply uniformly across probability measures. Their expectation-bounded functional form is a direct algorithmic precursor of e-values.',
      },
      {
        year: 1993,
        title: 'On the Empirical Validity of the Bayesian Method',
        authors: 'Vladimir Vovk and Vladimir V. V’yugin',
        venue: 'JRSSB',
        url: 'https://doi.org/10.1111/j.2517-6161.1993.tb01482.x',
        note: 'Defined a quantitative disagreement between a probability distribution and an observed outcome, then studied how Bayesian updating preserves empirical validity.',
      },
      {
        year: 1993,
        title:
          'A Logic of Probability, with Application to the Foundations of Statistics',
        authors: 'Vladimir Vovk',
        venue: 'JRSSB',
        url: 'https://doi.org/10.1111/j.2517-6161.1993.tb01904.x',
        note: 'Built a statistical logic around Ville’s excluded-gambling-strategy principle and compared the martingale approach with Kiefer’s conditional and estimated confidence sets. Only the lead paper is listed here, not the attached discussions.',
      },
      {
        year: 1998,
        title: 'Learning by Transduction',
        authors: 'Alexander Gammerman, Vladimir Vovk, and Vladimir Vapnik',
        venue: 'UAI',
        url: 'https://mlanthology.org/uai/1998/gammerman1998uai-learning/',
        note: 'Embedded an expectation-bounded measure of evidence against exchangeability in an early conformal-prediction method—an explicit e-value construction before the name became standard.',
      },
      {
        year: 2011,
        title: 'Test Martingales, Bayes Factors and p-values',
        authors:
          'Glenn Shafer, Alexander Shen, Nikolai Vereshchagin, and Vladimir Vovk',
        venue: 'Statistical Science',
        url: 'https://doi.org/10.1214/10-STS347',
        note: 'Made the modern bridge explicit by relating test martingales to Bayes factors, p-values, and sequential measures of evidence.',
      },
    ],
  },
];

const HistoricalPapersPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={{ xs: 4, md: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
            gap: 3,
            alignItems: 'end',
          }}
        >
          <Box sx={{ maxWidth: 820 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontSize: { xs: '2rem', md: '2.65rem' }, mb: 1.5 }}
            >
              Historical roots of e-values
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Modern e-value theory draws on earlier work in martingale testing,
              sequential analysis, growth-optimal betting, confidence sequences,
              algorithmic randomness, game-theoretic probability, and conformal
              prediction. This page collects several of those precursors.
            </Typography>
          </Box>

          <Stack
            spacing={1.25}
            sx={{ justifySelf: { md: 'end' }, alignItems: 'stretch' }}
          >
            <Button
              component={Link}
              href={BOOK_HISTORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="primary"
              startIcon={<MenuBook />}
              endIcon={<OpenInNew fontSize="small" />}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.dark',
                px: 2,
                py: 1,
                '&:visited': { color: 'primary.dark' },
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.main',
                  color: 'primary.dark',
                },
              }}
            >
              Read the e-book history
            </Button>
          </Stack>
        </Box>

        {historicalEras.map(era => (
          <Box
            component="section"
            key={era.title}
            aria-labelledby={`era-${era.period}`}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography
                id={`era-${era.period}`}
                variant="overline"
                color="secondary.main"
                sx={{ fontWeight: 800, letterSpacing: '0.09em' }}
              >
                {era.period}
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontSize: { xs: '1.5rem', md: '1.9rem' }, mb: 0.75 }}
              >
                {era.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.65, maxWidth: 860 }}
              >
                {era.introduction}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {era.papers.map(paper => (
                <Paper
                  key={`${paper.year}-${paper.title}`}
                  component="article"
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    p: { xs: 2, md: 2.5 },
                    pl: { xs: 2.5, md: 3 },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '0 auto 0 0',
                      width: 4,
                      bgcolor: 'primary.main',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: '72px minmax(0, 1fr) auto',
                      },
                      gap: { xs: 1, sm: 2 },
                      alignItems: 'start',
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="secondary.main"
                      sx={{
                        fontVariantNumeric: 'tabular-nums',
                        fontWeight: 800,
                      }}
                    >
                      {paper.year}
                    </Typography>

                    <Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ lineHeight: 1.35, mb: 0.5 }}
                      >
                        {paper.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {paper.authors} · {paper.venue}
                      </Typography>
                      <Typography sx={{ mt: 1.25, lineHeight: 1.65 }}>
                        {paper.note}
                      </Typography>
                    </Box>

                    <Button
                      component={Link}
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      endIcon={<OpenInNew fontSize="small" />}
                      sx={{ whiteSpace: 'nowrap', justifySelf: { sm: 'end' } }}
                      aria-label={`Open ${paper.title}`}
                    >
                      Source
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>
        ))}

        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'divider',
            bgcolor: 'primary.light',
            p: { xs: 2.5, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" component="h2">
              Continue into the current literature
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Browse the searchable collection of contemporary e-value research.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{ flexShrink: 0 }}
          >
            Browse papers
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
};

export default HistoricalPapersPage;
