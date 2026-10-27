/* eslint-disable no-console */
import yaml from 'js-yaml';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { hasNamedAuthors } from './paperAuthorPolicy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paper_dir = join(__dirname, '..', 'papers');
const publicDir = join(__dirname, '..', 'public');
const outputPath = join(publicDir, 'papers.json');

console.info('📚 Processing papers from:', paper_dir);

// Read papers directory with error handling
let papers;
try {
  papers = fs.readdirSync(paper_dir);
} catch (error) {
  console.error('❌ Failed to read papers directory:', error.message);
  process.exit(1);
}

console.info(`📄 Found ${papers.length} paper files`);

const seenTitles = new Set();
const issues = {
  duplicates: [],
  missingFields: [],
  parseErrors: [],
  authorsUnavailable: [],
};

const paper_objs = papers
  .map(file => {
    const filePath = join(paper_dir, file);

    // Parse YAML with error handling
    let paperData;
    try {
      const fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
      paperData = yaml.load(fileContents);
    } catch (error) {
      console.error(`❌ Failed to parse ${file}:`, error.message);
      issues.parseErrors.push(file);
      return null;
    }

    // Validate data structure
    if (
      !paperData ||
      typeof paperData !== 'object' ||
      Array.isArray(paperData)
    ) {
      console.warn(`⚠️  Invalid paper structure in ${file}`);
      return null;
    }

    // Records without publicly named authors are not part of the bibliography.
    // This build-time check also protects the public data if a source record
    // bypasses the normal ingestion validator.
    if (!hasNamedAuthors(paperData.authors)) {
      console.warn(`⚠️  Skipping record without named authors: ${file}`);
      issues.authorsUnavailable.push(file);
      return null;
    }

    // Validate required fields
    const requiredFields = [
      'title',
      'authors',
      'publications',
      'labels',
      'database_added',
      'database_updated',
    ];
    const missingFields = requiredFields.filter(field => !paperData[field]);

    if (missingFields.length > 0) {
      console.warn(
        `⚠️  Missing required fields in ${file}: ${missingFields.join(', ')}`
      );
      issues.missingFields.push({ file, fields: missingFields });
    }

    // Check for duplicate titles
    if (paperData.title) {
      if (seenTitles.has(paperData.title)) {
        console.warn(
          `⚠️  Duplicate title found: "${paperData.title}" in ${file}`
        );
        issues.duplicates.push({ file, title: paperData.title });
      }
      seenTitles.add(paperData.title);
    }

    // Abstracts remain available at runtime for search and editorial transparency.
    // A 500-paper collection remains small enough for a static JSON payload.
    return paperData;
  })
  .filter(Boolean); // Remove null entries from parse errors

// Write JSON with error handling
try {
  const jsonContent = JSON.stringify(paper_objs, null, 2);
  fs.writeFileSync(outputPath, jsonContent);

  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(2);

  console.info(`✅ Processed ${paper_objs.length} papers`);
  console.info(`📝 Output: ${outputPath} (${sizeKB} KB)`);

  // Report issues summary
  if (issues.parseErrors.length > 0) {
    console.warn(`⚠️  Parse errors: ${issues.parseErrors.length}`);
  }
  if (issues.missingFields.length > 0) {
    console.warn(
      `⚠️  Papers with missing fields: ${issues.missingFields.length}`
    );
  }
  if (issues.duplicates.length > 0) {
    console.warn(`⚠️  Duplicate titles: ${issues.duplicates.length}`);
  }
  if (issues.authorsUnavailable.length > 0) {
    console.warn(
      `⚠️  Records without named authors excluded: ${issues.authorsUnavailable.length}`
    );
  }
} catch (error) {
  console.error('❌ Failed to write papers.json:', error.message);
  process.exit(1);
}
