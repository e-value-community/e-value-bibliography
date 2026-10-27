import { describe, it, expect } from 'vitest';
import { getLabelColor, sortLabels } from '../labelUtils';

describe('getLabelColor', () => {
  it('returns "typeLabels" for type labels', () => {
    expect(getLabelColor('methodology')).toBe('typeLabels');
    expect(getLabelColor('theory')).toBe('typeLabels');
    expect(getLabelColor('applications')).toBe('typeLabels');
    expect(getLabelColor('philosophy')).toBe('typeLabels');
  });

  it('returns "default" for prior label', () => {
    expect(getLabelColor('related work')).toBe('default');
  });

  it('returns "labels" for regular labels', () => {
    expect(getLabelColor('rent-or-buy')).toBe('labels');
    expect(getLabelColor('scheduling')).toBe('labels');
    expect(getLabelColor('caching')).toBe('labels');
  });
});

describe('sortLabels', () => {
  it('returns empty array for null or undefined', () => {
    expect(sortLabels(null)).toEqual([]);
    expect(sortLabels(undefined)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(sortLabels([])).toEqual([]);
  });

  it('places type labels first', () => {
    const labels = ['e-values', 'theory', 'post-hoc inference'];
    const sorted = sortLabels(labels);
    expect(sorted[0]).toBe('theory');
  });

  it('places prior label last', () => {
    const labels = ['e-values', 'related work', 'post-hoc inference'];
    const sorted = sortLabels(labels);
    expect(sorted[sorted.length - 1]).toBe('related work');
  });

  it('orders: type labels > regular labels > prior label', () => {
    const labels = [
      'related work',
      'e-values',
      'methodology',
      'philosophy',
      'post-hoc inference',
    ];
    const sorted = sortLabels(labels);

    // Type labels should be first
    expect(sorted[0]).toBe('methodology');
    expect(sorted[1]).toBe('philosophy');

    // Prior label should be last
    expect(sorted[sorted.length - 1]).toBe('related work');

    // Regular labels in between
    expect(sorted.slice(2, -1)).toContain('e-values');
    expect(sorted.slice(2, -1)).toContain('post-hoc inference');
  });

  it('does not mutate original array', () => {
    const labels = ['e-values', 'theory'];
    const original = [...labels];
    sortLabels(labels);
    expect(labels).toEqual(original);
  });

  it('maintains relative order within same category', () => {
    const labels = ['caching', 'rent-or-buy', 'scheduling'];
    const sorted = sortLabels(labels);
    // All regular labels should maintain original relative order
    expect(sorted).toEqual(['caching', 'rent-or-buy', 'scheduling']);
  });
});
