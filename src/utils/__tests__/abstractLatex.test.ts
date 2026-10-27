import { describe, expect, it } from 'vitest';
import { normalizeAbstractLatex } from '../abstractLatex';

describe('normalizeAbstractLatex', () => {
  it('converts common prose commands while preserving commands inside math', () => {
    expect(
      normalizeAbstractLatex(
        '\\emph{Safe \\textbf{testing}} uses $\\textit{e}$-values.'
      )
    ).toBe('*Safe **testing*** uses $\\textit{e}$-values.');
  });

  it('normalizes TeX math delimiters for the Markdown math parser', () => {
    expect(normalizeAbstractLatex('Use \\(E_t\\) and \\[E_t \\leq 1\\].')).toBe(
      'Use $E_t$ and \n\n$$\nE_t \\leq 1\n$$\n\n.'
    );
  });

  it('converts texttt, enquote, small caps, and nonbreaking spaces', () => {
    expect(
      normalizeAbstractLatex(
        '\\texttt{online-cp} in \\enquote{online} \\textsc{Gpt}~tests'
      )
    ).toBe('`online-cp` in “online” GPT\u00a0tests');
  });
});
