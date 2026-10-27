const UNAVAILABLE_AUTHOR_RE =
  /^(?:anonymous(?: authors?)?(?:,\s*not publicly disclosed)?|unknown(?: authors?)?|not yet verified|not publicly disclosed|n\/?a|tbd)$/i;

export function hasNamedAuthors(authors) {
  const authorText = Array.isArray(authors)
    ? authors
        .map(author => String(author || '').trim())
        .filter(Boolean)
        .join(', ')
    : String(authors || '').trim();

  return Boolean(authorText) && !UNAVAILABLE_AUTHOR_RE.test(authorText);
}
