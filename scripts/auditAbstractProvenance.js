#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const projectRoot = path.resolve(import.meta.dirname, '..');
const papersDirectory = path.join(projectRoot, 'papers');
const statusesWithText = new Set(['source_abstract', 'source_summary']);
const statusesWithoutText = new Set([
  'no_formal_abstract',
  'abstract_unavailable',
]);
const acceptedStatuses = new Set([...statusesWithText, ...statusesWithoutText]);

const counts = {};
const errors = [];

for (const file of fs
  .readdirSync(papersDirectory)
  .filter(name => name.endsWith('.yml'))) {
  const filePath = path.join(papersDirectory, file);
  const paper = yaml.load(fs.readFileSync(filePath, 'utf8'));
  const status = paper?.abstract_status;
  const abstract =
    typeof paper?.abstract === 'string' ? paper.abstract.trim() : '';
  const source =
    typeof paper?.abstract_source === 'string'
      ? paper.abstract_source.trim()
      : '';

  counts[status ?? 'unmarked'] = (counts[status ?? 'unmarked'] ?? 0) + 1;

  if (!acceptedStatuses.has(status)) {
    errors.push(`${file}: missing or unsupported abstract_status`);
    continue;
  }

  if (!source) errors.push(`${file}: missing abstract_source`);
  else {
    try {
      const url = new URL(source);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      errors.push(`${file}: invalid abstract_source URL`);
    }
  }

  if (statusesWithText.has(status) && !abstract) {
    errors.push(`${file}: ${status} requires nonempty abstract text`);
  }
  if (statusesWithoutText.has(status) && abstract) {
    errors.push(`${file}: ${status} must not contain substitute prose`);
  }
}

console.log(JSON.stringify({ counts, errors }, null, 2));
if (errors.length > 0) process.exitCode = 1;
