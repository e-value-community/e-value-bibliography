import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import SubmitPage from '../SubmitPage';

describe('SubmitPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits a DOI, title, or link to the database queue', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          submitted_count: 2,
          new_count: 2,
          duplicate_count: 0,
        }),
        { status: 201, headers: { 'content-type': 'application/json' } }
      )
    );
    render(<SubmitPage />);
    fireEvent.change(
      screen.getByRole('textbox', { name: /DOIs, titles, or links/ }),
      {
        target: { value: '10.1000/example\nA proposed paper title' },
      }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit suggestions' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/paper-submissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        submission: '10.1000/example\nA proposed paper title',
      }),
    });
    expect(
      await screen.findByText(
        'Saved 2 paper suggestions in the review database.'
      )
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: /DOIs, titles, or links/ })
    ).toHaveValue('');
  });

  it('explains when a duplicate is returned to the queue', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          submitted_count: 1,
          new_count: 0,
          duplicate_count: 1,
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    );
    render(<SubmitPage />);
    fireEvent.change(
      screen.getByRole('textbox', { name: /DOIs, titles, or links/ }),
      {
        target: { value: 'A proposed paper title' },
      }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit suggestions' }));

    expect(
      await screen.findByText(
        'Saved 1 paper suggestion in the review database. 1 was already present and returned to pending review.'
      )
    ).toBeVisible();
  });

  it('submits a historical paper with its relevance note', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          submitted_count: 1,
          new_count: 1,
          duplicate_count: 0,
        }),
        { status: 201, headers: { 'content-type': 'application/json' } }
      )
    );
    render(<SubmitPage />);

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /Historical paper DOI, title, or link/,
      }),
      { target: { value: '10.1000/historical-example' } }
    );
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /Why is it historically relevant/,
      }),
      {
        target: {
          value:
            'This paper introduced a martingale argument used by later e-processes.',
        },
      }
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Submit historical suggestion' })
    );

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/historical-paper-submissions',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          submission: '10.1000/historical-example',
          context:
            'This paper introduced a martingale argument used by later e-processes.',
        }),
      }
    );
    expect(
      await screen.findByText(
        'Saved the historical suggestion in the review database.'
      )
    ).toBeVisible();
  });

  it('submits a general website comment', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    );
    render(<SubmitPage />);

    expect(screen.getByRole('heading', { name: 'Contribute' })).toBeVisible();
    const feedbackForm = screen
      .getByRole('heading', { name: 'Suggest an edit' })
      .closest('form');
    expect(feedbackForm).not.toBeNull();
    fireEvent.change(
      within(feedbackForm!).getByRole('textbox', {
        name: 'Comment or suggested edit',
      }),
      {
        target: {
          value: 'The venue for one paper should be corrected.',
        },
      }
    );
    fireEvent.change(
      within(feedbackForm!).getByRole('textbox', {
        name: 'Your name (optional)',
      }),
      { target: { value: 'Ada Researcher' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit comment' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/site-feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'The venue for one paper should be corrected.',
        submitter_name: 'Ada Researcher',
      }),
    });
    expect(
      await screen.findByText('Saved your comment for review.')
    ).toBeVisible();
  });
});
