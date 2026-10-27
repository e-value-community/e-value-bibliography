import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PaperAbstract from '../PaperAbstract';

describe('PaperAbstract', () => {
  it('does not display the abstract while collapsed', () => {
    render(
      <PaperAbstract
        paper={{ abstract: 'A paper abstract.', year: 2024 }}
        expanded={false}
      />
    );

    expect(screen.queryByText('A paper abstract.')).not.toBeInTheDocument();
  });

  it('displays the complete abstract while expanded', () => {
    render(
      <PaperAbstract
        paper={{
          abstract: 'A complete paper abstract.',
          year: 2026,
          database_added: '2026-10-19',
          database_updated: '2026-10-20',
          publications: [{ name: 'arXiv', year: 2024 }],
        }}
        expanded
      />
    );

    expect(screen.getByText('Abstract')).toBeInTheDocument();
    expect(screen.getByText('A complete paper abstract.')).toBeInTheDocument();
    expect(screen.getByText('First appearance: 2024')).toBeInTheDocument();
    expect(
      screen.getByText('Added to bibliography: Oct 19, 2026')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Database updated: Oct 20, 2026')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Version of record:/)).not.toBeInTheDocument();
  });

  it('does not repeat the update date when it matches the addition date', () => {
    render(
      <PaperAbstract
        paper={{
          database_added: '2026-10-20',
          database_updated: '2026-10-20',
        }}
        expanded
      />
    );

    expect(
      screen.getByText('Added to bibliography: Oct 20, 2026')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Database updated:/)).not.toBeInTheDocument();
  });

  it('shows the version-of-record year for a published paper', () => {
    render(
      <PaperAbstract
        paper={{
          abstract: 'A published paper abstract.',
          year: 2026,
          publications: [
            { name: 'Journal', year: 2026 },
            { name: 'arXiv', year: 2024 },
          ],
        }}
        expanded
      />
    );

    expect(screen.getByText('First appearance: 2024')).toBeInTheDocument();
    expect(screen.getByText('Version of record: 2026')).toBeInTheDocument();
  });

  it('labels an author-written source summary as an abstract', () => {
    render(
      <PaperAbstract
        paper={{
          abstract: 'A summary supplied by the author.',
          abstract_status: 'source_summary',
        }}
        expanded
      />
    );

    expect(screen.getByText('Abstract')).toBeInTheDocument();
    expect(
      screen.getByText('A summary supplied by the author.')
    ).toBeInTheDocument();
  });

  it('renders LaTeX math and prose commands instead of showing raw markup', () => {
    const { container } = render(
      <PaperAbstract
        paper={{
          abstract:
            'We study $E_t$ using \\emph{anytime-valid} and \\textbf{finite-sample} inference.',
        }}
        expanded
      />
    );

    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(screen.getByText('anytime-valid').tagName).toBe('EM');
    expect(screen.getByText('finite-sample').tagName).toBe('STRONG');
    expect(container).not.toHaveTextContent('\\emph');
  });

  it('renders bracket-delimited display math', () => {
    const { container } = render(
      <PaperAbstract
        paper={{ abstract: '\\[\\mathbb{E}[E_t] \\leq 1\\]' }}
        expanded
      />
    );

    expect(container.querySelector('.katex-display')).toBeInTheDocument();
  });
});
