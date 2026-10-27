import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PaperAbstract from '../PaperAbstract';

describe('PaperAbstract', () => {
  it('displays a one-line abstract preview while collapsed', () => {
    const { container } = render(
      <PaperAbstract
        paper={{ abstract: 'A paper abstract.', year: 2024 }}
        expanded={false}
      />
    );

    expect(screen.getByText('A paper abstract.')).toBeInTheDocument();
    expect(screen.queryByText(/^Abstract:?$/)).not.toBeInTheDocument();
    const abstract = screen.getByLabelText('Abstract');
    expect(abstract).toHaveStyle({ marginLeft: '16px' });
    expect(container.querySelector('.paper-abstract-content')).toHaveStyle({
      WebkitLineClamp: '1',
      fontSize: '0.82rem',
      overflow: 'hidden',
    });
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

    expect(screen.getByText('A complete paper abstract.')).toBeInTheDocument();
    expect(screen.getByText('First appearance: 2024')).toBeInTheDocument();
    expect(
      screen.getByText('Added to bibliography: Oct 19, 2026')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Database updated: Oct 20, 2026')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Version of record:/)).not.toBeInTheDocument();

    const abstract = screen.getByLabelText('Abstract');
    const metadata = screen.getByLabelText('Database information');
    expect(
      abstract.compareDocumentPosition(metadata) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
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

  it('does not add an abstract heading to an author-written source summary', () => {
    render(
      <PaperAbstract
        paper={{
          abstract: 'A summary supplied by the author.',
          abstract_status: 'source_summary',
        }}
        expanded
      />
    );

    expect(screen.queryByText(/^Abstract:?$/)).not.toBeInTheDocument();
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
