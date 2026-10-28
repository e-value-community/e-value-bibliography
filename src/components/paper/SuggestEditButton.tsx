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
import { EditOutlined } from '@mui/icons-material';
import type { Paper } from '@/types/paper';
import { intakeApiUrl } from '@/utils/apiUrl';

interface SuggestEditButtonProps {
  paper: Paper;
}

const EDIT_PLACEHOLDER =
  'Describe what should change. For example: this paper has been published and is no longer a preprint; the venue, year, DOI, title, authors, or abstract is incorrect; it uses the wrong category; or a topic tag should be added or removed. If the paper does not seem relevant to the e-value community, say that it should be removed and briefly explain why. Include a supporting link when possible.';

const paperAuthors = (paper: Paper): string =>
  Array.isArray(paper.authors)
    ? paper.authors.filter(Boolean).join(', ')
    : paper.authors || '';

const paperDoi = (paper: Paper): string =>
  paper.doi ||
  paper.publications?.find(publication => publication.doi)?.doi ||
  '';

const paperArxiv = (paper: Paper): string =>
  paper.arxiv ||
  paper.publications?.find(publication => publication.arxiv)?.arxiv ||
  '';

const SuggestEditButton: React.FC<SuggestEditButtonProps> = ({ paper }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(false);

  const stopCardClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const suggestedEdit = editText.trim();
    if (editSubmitting || suggestedEdit.length < 3) return;

    setEditSubmitting(true);
    setEditError('');

    const authors = paperAuthors(paper);
    const doi = paperDoi(paper);
    const arxiv = paperArxiv(paper);
    const message = [
      'Paper edit suggestion',
      `Title: ${paper.title || 'Untitled paper'}`,
      ...(authors ? [`Authors: ${authors}`] : []),
      ...(doi ? [`DOI: ${doi}`] : []),
      ...(arxiv ? [`arXiv: ${arxiv}`] : []),
      '',
      'Suggested edit:',
      suggestedEdit,
    ].join('\n');

    try {
      const response = await fetch(intakeApiUrl('/api/site-feedback'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message,
          ...(contributorName.trim()
            ? { submitter_name: contributorName.trim() }
            : {}),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(
          result.error || 'The suggested edit could not be saved.'
        );
      }

      setEditOpen(false);
      setEditText('');
      setContributorName('');
      setNoticeOpen(true);
    } catch (submitError) {
      setEditError(
        submitError instanceof Error
          ? submitError.message
          : 'The suggested edit could not be saved.'
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <>
      <Box sx={{ position: 'absolute', right: 7, bottom: 5 }}>
        <Tooltip title="Suggest an edit to this paper">
          <span>
            <IconButton
              aria-label={`Suggest an edit for ${paper.title || 'paper'}`}
              aria-disabled={editSubmitting}
              onClick={event => {
                stopCardClick(event);
                setEditError('');
                setEditOpen(true);
              }}
              size="small"
              sx={{
                width: 30,
                height: 30,
                color: 'text.disabled',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                },
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Dialog
        open={editOpen}
        onClose={() => {
          if (!editSubmitting) setEditOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        onClick={stopCardClick}
      >
        <Box component="form" onSubmit={event => void handleEditSubmit(event)}>
          <DialogTitle>Suggest an edit</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <strong>{paper.title || 'Untitled paper'}</strong>
            </Box>
            <Box sx={{ mb: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
              Suggest a correction, update, or classification change. If the
              paper does not seem relevant to the e-value community, you can
              also suggest removing it.
            </Box>
            <TextField
              autoFocus
              fullWidth
              required
              multiline
              minRows={5}
              label="Suggested correction"
              placeholder={EDIT_PLACEHOLDER}
              value={editText}
              onChange={event => setEditText(event.target.value)}
              disabled={editSubmitting}
              slotProps={{ htmlInput: { maxLength: 3000 } }}
            />
            <TextField
              fullWidth
              label="Your name (optional)"
              value={contributorName}
              onChange={event => setContributorName(event.target.value)}
              helperText="Who are you, if you don't mind telling us?"
              disabled={editSubmitting}
              slotProps={{ htmlInput: { maxLength: 120 } }}
              sx={{ mt: 2 }}
            />
            {editError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {editError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              onClick={() => setEditOpen(false)}
              disabled={editSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={editSubmitting || editText.trim().length < 3}
            >
              {editSubmitting ? 'Submitting…' : 'Submit edit'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={noticeOpen}
        autoHideDuration={5000}
        onClose={() => setNoticeOpen(false)}
        message="Edit suggestion saved for review."
      />
    </>
  );
};

export default SuggestEditButton;
