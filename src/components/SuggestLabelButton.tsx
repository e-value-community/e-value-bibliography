import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { intakeApiUrl } from '@/utils/apiUrl';

const SUGGESTION_PLACEHOLDER =
  'Give the proposed category or label and briefly explain what it would cover. You can also mention papers that should receive it.';

const SuggestLabelButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const proposedLabel = suggestion.trim();
    if (submitting || proposedLabel.length < 3) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(intakeApiUrl('/api/site-feedback'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: [
            'Category or label suggestion',
            '',
            'Suggestion:',
            proposedLabel,
          ].join('\n'),
          ...(contributorName.trim()
            ? { submitter_name: contributorName.trim() }
            : {}),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.error || 'The suggestion could not be saved.');
      }

      setOpen(false);
      setSuggestion('');
      setContributorName('');
      setNoticeOpen(true);
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

  return (
    <>
      <Tooltip title="Suggest a category or label">
        <span>
          <IconButton
            aria-label="Suggest a new category or label"
            onClick={() => {
              setError('');
              setOpen(true);
            }}
            disabled={submitting}
            size="small"
            sx={{
              width: 30,
              height: 30,
              border: 1,
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => {
          if (!submitting) setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={event => void handleSubmit(event)}>
          <DialogTitle>Suggest a category or label</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
              Suggest a new category or research-topic label for the
              bibliography.
            </Box>
            <TextField
              autoFocus
              fullWidth
              required
              multiline
              minRows={4}
              label="Proposed category or label"
              placeholder={SUGGESTION_PLACEHOLDER}
              value={suggestion}
              onChange={event => setSuggestion(event.target.value)}
              disabled={submitting}
              slotProps={{ htmlInput: { maxLength: 3000 } }}
            />
            <TextField
              fullWidth
              label="Your name (optional)"
              value={contributorName}
              onChange={event => setContributorName(event.target.value)}
              helperText="Who are you, if you don't mind telling us?"
              disabled={submitting}
              slotProps={{ htmlInput: { maxLength: 120 } }}
              sx={{ mt: 2 }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || suggestion.trim().length < 3}
            >
              {submitting ? 'Submitting…' : 'Submit suggestion'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={noticeOpen}
        autoHideDuration={5000}
        onClose={() => setNoticeOpen(false)}
        message="Category or label suggestion saved for review."
      />
    </>
  );
};

export default SuggestLabelButton;
