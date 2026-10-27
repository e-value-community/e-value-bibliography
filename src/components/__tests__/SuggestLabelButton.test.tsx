import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SuggestLabelButton from '../SuggestLabelButton';

describe('SuggestLabelButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves a category or label suggestion for curation', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    );

    render(<SuggestLabelButton />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Suggest a new category or label' })
    );
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Proposed category or label' }),
      {
        target: {
          value: 'Sequential design: papers about adaptive experiment design.',
        },
      }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit suggestion' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/site-feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: [
          'Category or label suggestion',
          '',
          'Suggestion:',
          'Sequential design: papers about adaptive experiment design.',
        ].join('\n'),
      }),
    });
    expect(
      await screen.findByText('Category or label suggestion saved for review.')
    ).toBeVisible();
  });
});
