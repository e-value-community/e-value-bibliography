import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SuggestEditButton from '../SuggestEditButton';
import type { Paper } from '@/types/paper';

const paper: Paper = {
  title: 'A paper on e-values',
  authors: 'Ada Researcher, Ben Statistician',
  doi: '10.1000/example',
  arxiv: '2601.00001',
};

describe('SuggestEditButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits a correction with the paper identifiers', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    );

    render(<SuggestEditButton paper={paper} />);

    expect(screen.queryByRole('button', { name: /relevant/i })).toBeNull();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Suggest an edit for A paper on e-values',
      })
    );
    expect(screen.getByText(/you can also suggest removing it/i)).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Suggested correction' })
    ).toHaveAttribute(
      'placeholder',
      expect.stringContaining('does not seem relevant to the e-value community')
    );
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Suggested correction' }),
      {
        target: { value: 'This paper is now published in JASA.' },
      }
    );
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Your name (optional)' }),
      { target: { value: 'Ada Researcher' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit edit' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/site-feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: [
          'Paper edit suggestion',
          'Title: A paper on e-values',
          'Authors: Ada Researcher, Ben Statistician',
          'DOI: 10.1000/example',
          'arXiv: 2601.00001',
          '',
          'Suggested edit:',
          'This paper is now published in JASA.',
        ].join('\n'),
        submitter_name: 'Ada Researcher',
      }),
    });
    expect(
      await screen.findByText('Edit suggestion saved for review.')
    ).toBeVisible();
  });
});
