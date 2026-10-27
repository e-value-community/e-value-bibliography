const MARKDOWN_COMMANDS: Record<string, readonly [string, string]> = {
  emph: ['*', '*'],
  textit: ['*', '*'],
  textbf: ['**', '**'],
  texttt: ['`', '`'],
  enquote: ['“', '”'],
};

const PLAIN_TEXT_COMMANDS = new Set(['textrm', 'text']);

const isEscaped = (value: string, index: number): boolean => {
  let slashCount = 0;
  for (
    let cursor = index - 1;
    cursor >= 0 && value[cursor] === '\\';
    cursor -= 1
  ) {
    slashCount += 1;
  }
  return slashCount % 2 === 1;
};

const findClosingBrace = (value: string, openingIndex: number): number => {
  let depth = 1;

  for (let cursor = openingIndex + 1; cursor < value.length; cursor += 1) {
    if (isEscaped(value, cursor)) continue;
    if (value[cursor] === '{') depth += 1;
    if (value[cursor] === '}') depth -= 1;
    if (depth === 0) return cursor;
  }

  return -1;
};

const normalizeTextCommands = (value: string): string => {
  let output = '';
  let cursor = 0;
  let mathDelimiter: '$' | '$$' | null = null;

  while (cursor < value.length) {
    if (value[cursor] === '$' && !isEscaped(value, cursor)) {
      const delimiter = value.startsWith('$$', cursor) ? '$$' : '$';

      if (mathDelimiter === null || mathDelimiter === delimiter) {
        mathDelimiter = mathDelimiter === null ? delimiter : null;
      }

      output += delimiter;
      cursor += delimiter.length;
      continue;
    }

    if (mathDelimiter === null && value[cursor] === '\\') {
      const commandMatch = value.slice(cursor).match(/^\\([A-Za-z]+)\{/);

      if (commandMatch) {
        const command = commandMatch[1] ?? '';
        const openingIndex = cursor + commandMatch[0].length - 1;
        const closingIndex = findClosingBrace(value, openingIndex);

        if (closingIndex !== -1) {
          const inner = normalizeTextCommands(
            value.slice(openingIndex + 1, closingIndex)
          );
          const markdownWrapper = MARKDOWN_COMMANDS[command];

          if (markdownWrapper) {
            output += `${markdownWrapper[0]}${inner}${markdownWrapper[1]}`;
            cursor = closingIndex + 1;
            continue;
          }

          if (PLAIN_TEXT_COMMANDS.has(command)) {
            output += inner;
            cursor = closingIndex + 1;
            continue;
          }

          if (command === 'textsc') {
            output += inner.toLocaleUpperCase();
            cursor = closingIndex + 1;
            continue;
          }
        }
      }
    }

    if (mathDelimiter === null && value[cursor] === '~') {
      output += '\u00a0';
      cursor += 1;
      continue;
    }

    output += value[cursor];
    cursor += 1;
  }

  return output;
};

/**
 * Converts LaTeX delimiters and common prose commands found in source abstracts
 * into syntax understood by the Markdown and math renderers.
 */
export const normalizeAbstractLatex = (value: string): string => {
  const normalizedDelimiters = value
    .replace(/\\\[/g, () => '\n\n$$\n')
    .replace(/\\\]/g, () => '\n$$\n\n')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');

  return normalizeTextCommands(normalizedDelimiters);
};
