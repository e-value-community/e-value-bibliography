import { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { intakeApiUrl } from '@/utils/apiUrl';

const SubmitPage: React.FC = () => {
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [historicalSubmission, setHistoricalSubmission] = useState('');
  const [historicalContext, setHistoricalContext] = useState('');
  const [historicalSubmitting, setHistoricalSubmitting] = useState(false);
  const [historicalSuccess, setHistoricalSuccess] = useState('');
  const [historicalError, setHistoricalError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || submission.trim().length < 3) return;

    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch(intakeApiUrl('/api/paper-submissions'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ submission: submission.trim() }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        submitted_count?: number;
        new_count?: number;
        duplicate_count?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || 'The suggestion could not be saved.');
      }

      const submittedCount = result.submitted_count || 0;
      const duplicateCount = result.duplicate_count || 0;
      const savedLabel = `${submittedCount} paper ${submittedCount === 1 ? 'suggestion' : 'suggestions'}`;
      setSuccess(
        duplicateCount > 0
          ? `Saved ${savedLabel} in the review database. ${duplicateCount} ${duplicateCount === 1 ? 'was' : 'were'} already present and returned to pending review.`
          : `Saved ${savedLabel} in the review database.`
      );
      setSubmission('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'The suggestion could not be saved.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleHistoricalSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (
      historicalSubmitting ||
      historicalSubmission.trim().length < 3 ||
      historicalContext.trim().length < 10
    )
      return;

    setHistoricalSubmitting(true);
    setHistoricalSuccess('');
    setHistoricalError('');

    try {
      const response = await fetch(
        intakeApiUrl('/api/historical-paper-submissions'),
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            submission: historicalSubmission.trim(),
            context: historicalContext.trim(),
          }),
        }
      );
      const result = (await response.json().catch(() => ({}))) as {
        duplicate_count?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || 'The historical suggestion could not be saved.'
        );
      }

      setHistoricalSuccess(
        result.duplicate_count
          ? 'Updated this historical suggestion in the review database.'
          : 'Saved the historical suggestion in the review database.'
      );
      setHistoricalSubmission('');
      setHistoricalContext('');
    } catch (submitError) {
      setHistoricalError(
        submitError instanceof Error
          ? submitError.message
          : 'The historical suggestion could not be saved.'
      );
    } finally {
      setHistoricalSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (feedbackSubmitting || feedback.trim().length < 3) return;

    setFeedbackSubmitting(true);
    setFeedbackSuccess('');
    setFeedbackError('');

    try {
      const response = await fetch(intakeApiUrl('/api/site-feedback'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: feedback.trim() }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || 'The comment could not be saved.');
      }

      setFeedbackSuccess('Saved your comment for review.');
      setFeedback('');
    } catch (submitError) {
      setFeedbackError(
        submitError instanceof Error
          ? submitError.message
          : 'The comment could not be saved.'
      );
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <div>
          <Typography variant="h3" component="h1" gutterBottom>
            Contribute
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: '1.08rem', lineHeight: 1.7 }}
          >
            The E-value Bibliography is a community effort. Human contributors
            suggest and review papers, while AI-assisted searches help collect
            candidates and update metadata. Some papers will still be missing,
            and some records may be incomplete or inaccurate. You can help by
            submitting papers or suggesting any correction or improvement to the
            website.
          </Typography>
        </div>

        <Paper
          component="form"
          variant="outlined"
          onSubmit={event => void handleSubmit(event)}
          sx={{ p: { xs: 2.5, md: 3.5 } }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" component="h2">
              Submit papers
            </Typography>
            <Typography color="text.secondary">
              Paste one or more DOIs, paper titles, arXiv links, or publication
              links, with one suggestion on each line. Suggestions are saved for
              editorial review and are not added to the bibliography
              automatically.
            </Typography>
            <TextField
              label="DOIs, titles, or links"
              value={submission}
              onChange={event => setSubmission(event.target.value)}
              placeholder={
                'For example:\nhttps://arxiv.org/abs/2401.01234\n10.1000/example'
              }
              multiline
              minRows={3}
              fullWidth
              required
              disabled={submitting}
              slotProps={{ htmlInput: { maxLength: 12000 } }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={submitting || submission.trim().length < 3}
              sx={{ alignSelf: 'flex-start' }}
            >
              {submitting ? 'Submitting…' : 'Submit suggestions'}
            </Button>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Paper>

        <Paper
          component="form"
          variant="outlined"
          onSubmit={event => void handleFeedbackSubmit(event)}
          sx={{ p: { xs: 2.5, md: 3.5 } }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" component="h2">
              Suggest an edit
            </Typography>
            <Typography color="text.secondary">
              Send a correction, missing link, classification change, or any
              other comment about the website.
            </Typography>
            <TextField
              label="Comment or suggested edit"
              value={feedback}
              onChange={event => setFeedback(event.target.value)}
              placeholder="Describe what should be corrected or improved."
              multiline
              minRows={4}
              fullWidth
              required
              disabled={feedbackSubmitting}
              slotProps={{ htmlInput: { maxLength: 5000 } }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={feedbackSubmitting || feedback.trim().length < 3}
              sx={{ alignSelf: 'flex-start' }}
            >
              {feedbackSubmitting ? 'Submitting…' : 'Submit comment'}
            </Button>
            {feedbackSuccess && (
              <Alert severity="success">{feedbackSuccess}</Alert>
            )}
            {feedbackError && <Alert severity="error">{feedbackError}</Alert>}
          </Stack>
        </Paper>

        <Paper
          id="historical-paper-suggestion"
          component="form"
          variant="outlined"
          onSubmit={event => void handleHistoricalSubmit(event)}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderColor: 'secondary.light',
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" component="h2">
              Historical paper suggestion
            </Typography>
            <Typography color="text.secondary">
              Suggest a paper for the historical roots page and briefly explain
              its connection to e-values or sequential inference.
            </Typography>
            <TextField
              label="Historical paper DOI, title, or link"
              value={historicalSubmission}
              onChange={event => setHistoricalSubmission(event.target.value)}
              placeholder="For example: https://doi.org/10.1000/example"
              fullWidth
              required
              disabled={historicalSubmitting}
              slotProps={{ htmlInput: { maxLength: 1500 } }}
            />
            <TextField
              label="Why is it historically relevant?"
              value={historicalContext}
              onChange={event => setHistoricalContext(event.target.value)}
              placeholder="Briefly explain the historical connection."
              multiline
              minRows={3}
              fullWidth
              required
              disabled={historicalSubmitting}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              startIcon={<Send />}
              disabled={
                historicalSubmitting ||
                historicalSubmission.trim().length < 3 ||
                historicalContext.trim().length < 10
              }
              sx={{ alignSelf: 'flex-start' }}
            >
              {historicalSubmitting
                ? 'Submitting…'
                : 'Submit historical suggestion'}
            </Button>
            {historicalSuccess && (
              <Alert severity="success">{historicalSuccess}</Alert>
            )}
            {historicalError && (
              <Alert severity="error">{historicalError}</Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SubmitPage;
