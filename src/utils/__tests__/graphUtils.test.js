import { describe, expect, it } from 'vitest';
import { analyzeAuthorConnectivity, buildAuthorGraph } from '../graphUtils';

describe('buildAuthorGraph', () => {
  it('clusters accented, unaccented, middle-initial, and abbreviated names', () => {
    const graph = buildAuthorGraph([
      { title: 'One', authors: 'Peter Grünwald, Alice Example' },
      { title: 'Two', authors: 'Peter D. Grünwald, Bob Example' },
      { title: 'Three', authors: 'Peter Grunwald, Carol Example' },
      { title: 'Four', authors: 'P. Grunwald, Dan Example' },
    ]);

    const grunwaldNodes = graph.nodes.filter(node =>
      node._key.includes('grunwald')
    );

    expect(grunwaldNodes).toHaveLength(1);
    expect(grunwaldNodes[0]).toMatchObject({
      name: 'Peter Grünwald',
      paperCount: 4,
    });
  });

  it('clusters compatible full middle names without collapsing Unicode names', () => {
    const graph = buildAuthorGraph([
      { title: 'One', authors: ['Muriel Felipe Pérez-Ortiz', '邹文豪'] },
      { title: 'Two', authors: ['Muriel F. Perez-Ortiz', '杨建萍'] },
    ]);

    expect(
      graph.nodes
        .filter(node => node._key.includes('muriel'))
        .map(node => ({
          name: node.name,
          paperCount: node.paperCount,
        }))
    ).toEqual([{ name: 'Muriel Felipe Pérez-Ortiz', paperCount: 2 }]);
    expect(graph.nodes.some(node => node.name === '邹文豪')).toBe(true);
    expect(graph.nodes.some(node => node.name === '杨建萍')).toBe(true);
  });

  it('can restrict the network to papers first appearing since 2019', () => {
    const graph = buildAuthorGraph(
      [
        {
          title: 'Historical precursor',
          authors: 'Historical Author, Shared Author',
          year: 1995,
        },
        {
          title: 'Modern paper',
          authors: 'Modern Author, Shared Author',
          first_year: 2019,
          year: 2021,
        },
      ],
      2019
    );

    expect(graph.nodes.map(node => node.name).sort()).toEqual([
      'Modern Author',
      'Shared Author',
    ]);
    expect(graph.links).toHaveLength(1);
  });
});

describe('analyzeAuthorConnectivity', () => {
  it('marks solo authors and disconnected coauthor groups as peripheral', () => {
    const mainOne = {
      title: 'Main one',
      authors: ['Aaditya Ramdas', 'Alice Example'],
    };
    const mainTwo = {
      title: 'Main two',
      authors: ['Alice Example', 'Bob Example'],
    };
    const disconnected = {
      title: 'Disconnected group',
      authors: ['Outside One', 'Outside Two'],
    };
    const solo = { title: 'Solo paper', authors: ['Solo Author'] };
    const missingAuthors = { title: 'Missing author metadata' };

    const analysis = analyzeAuthorConnectivity([
      mainOne,
      mainTwo,
      disconnected,
      solo,
      missingAuthors,
    ]);

    expect(analysis.anchorFound).toBe(true);
    expect(analysis.mainComponentAuthorCount).toBe(3);
    expect(analysis.peripheralAuthorCount).toBe(3);
    expect(analysis.componentCount).toBe(3);
    expect([...analysis.peripheralPapers]).toEqual([
      disconnected,
      solo,
      missingAuthors,
    ]);
  });

  it('falls back to the largest component when the anchor is absent', () => {
    const connectedOne = {
      title: 'Connected one',
      authors: ['Alice Example', 'Bob Example'],
    };
    const connectedTwo = {
      title: 'Connected two',
      authors: ['Bob Example', 'Carol Example'],
    };
    const solo = { title: 'Solo paper', authors: ['Solo Author'] };

    const analysis = analyzeAuthorConnectivity([
      connectedOne,
      connectedTwo,
      solo,
    ]);

    expect(analysis.anchorFound).toBe(false);
    expect(analysis.mainComponentAuthorCount).toBe(3);
    expect([...analysis.peripheralPapers]).toEqual([solo]);
  });
});
