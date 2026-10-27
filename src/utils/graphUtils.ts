/**
 * Author collaboration graph utilities for react-force-graph visualization
 */

import { buildAuthorCanonicalizer, parseAuthors } from './authorUtils';
import { getPaperFirstAppearanceYear } from './paperUtils';
import type { Paper } from '@/types';

export const AUTHOR_GRAPH_START_YEAR = 2019;

/**
 * Graph node representing an author
 */
export interface AuthorNode {
  /** Unique node identifier */
  id: number;
  /** Display name of the author */
  name: string;
  /** Number of papers this author has published */
  paperCount: number;
  /** Internal canonical key (not for display) */
  _key: string;
  /** d3-force simulation properties */
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  index?: number;
}

/**
 * Graph link representing collaboration between two authors
 */
export interface CollaborationLink {
  /** Source node ID or node object (d3-force transforms IDs to objects during simulation) */
  source: number | AuthorNode;
  /** Target node ID or node object (d3-force transforms IDs to objects during simulation) */
  target: number | AuthorNode;
  /** Number of papers they collaborated on */
  value: number;
}

/**
 * Author collaboration graph data
 */
export interface AuthorGraph {
  /** Array of author nodes */
  nodes: AuthorNode[];
  /** Array of collaboration edges */
  links: CollaborationLink[];
  /** Maximum collaboration count (for normalization) */
  maxCollaboration: number;
}

/**
 * Connectivity summary used by author-network views.
 */
export interface AuthorConnectivityAnalysis {
  /** Papers whose authors do not belong to the main coauthor component. */
  peripheralPapers: Set<Paper>;
  /** Number of authors in the main coauthor component. */
  mainComponentAuthorCount: number;
  /** Number of authors outside the main coauthor component. */
  peripheralAuthorCount: number;
  /** Number of connected author components in the graph. */
  componentCount: number;
  /** Whether the preferred anchor author was present in the graph. */
  anchorFound: boolean;
}

/**
 * Build author collaboration graph from paper data
 *
 * Creates a network graph where:
 * - Nodes represent authors
 * - Links represent co-authorship (authors who published together)
 * - Link weight represents number of collaborations
 *
 * Features:
 * - Uses author canonicalization to merge name variants
 * - Deduplicates authors within same paper
 * - Tracks collaboration frequency
 *
 * @param papers - Array of paper objects
 * @param minYear - Optional earliest first-appearance year to include
 * @returns Graph data compatible with react-force-graph
 */
export const buildAuthorGraph = (
  papers: Paper[],
  minYear?: number
): AuthorGraph => {
  const graphPapers =
    minYear === undefined
      ? papers
      : papers.filter(paper => {
          const year = getPaperFirstAppearanceYear(paper);
          return year !== undefined && year >= minYear;
        });
  const canonicalizer = buildAuthorCanonicalizer(graphPapers);

  // Collect all unique authors and build author index
  const authorKeySet = new Set<string>();
  const authorKeyToPapers = new Map<string, Paper[]>(); // Track which papers each canonical author appears in

  graphPapers.forEach(paper => {
    const authors = parseAuthors(paper.authors);
    const canonicalKeys = Array.from(
      new Set(authors.map(a => canonicalizer.canonicalKey(a)))
    );

    canonicalKeys.forEach(authorKey => {
      authorKeySet.add(authorKey);
      if (!authorKeyToPapers.has(authorKey)) {
        authorKeyToPapers.set(authorKey, []);
      }
      authorKeyToPapers.get(authorKey)!.push(paper);
    });
  });

  // Create nodes array with id, name, and paper count
  const authorKeysArray = Array.from(authorKeySet);
  const nodes: AuthorNode[] = authorKeysArray.map((authorKey, index) => ({
    id: index,
    name: canonicalizer.displayNameForKey(authorKey),
    paperCount: authorKeyToPapers.get(authorKey)!.length,
    _key: authorKey,
  }));

  // Create author name to node id mapping
  const authorKeyToId = new Map<string, number>();
  nodes.forEach(node => {
    authorKeyToId.set(node._key, node.id);
  });

  // Build collaboration edges
  // Use a map to track collaboration counts between author pairs
  const collaborationMap = new Map<string, number>(); // key: "author1|author2" (sorted), value: count

  graphPapers.forEach(paper => {
    const authors = parseAuthors(paper.authors);
    const canonicalKeys = Array.from(
      new Set(authors.map(a => canonicalizer.canonicalKey(a)))
    );

    // Create edges between all pairs of authors on the same paper
    for (let i = 0; i < canonicalKeys.length; i++) {
      for (let j = i + 1; j < canonicalKeys.length; j++) {
        const authorKey1 = canonicalKeys[i]!;
        const authorKey2 = canonicalKeys[j]!;

        // Create a consistent key (sorted order to avoid duplicate edges)
        const key =
          authorKey1 < authorKey2
            ? `${authorKey1}|${authorKey2}`
            : `${authorKey2}|${authorKey1}`;

        collaborationMap.set(key, (collaborationMap.get(key) || 0) + 1);
      }
    }
  });

  // Create links array from collaboration map
  const links: CollaborationLink[] = Array.from(collaborationMap.entries()).map(
    ([key, value]) => {
      const [authorKey1, authorKey2] = key.split('|');
      return {
        source: authorKeyToId.get(authorKey1!)!,
        target: authorKeyToId.get(authorKey2!)!,
        value: value, // number of papers they collaborated on
      };
    }
  );

  // Calculate max collaboration count for normalization
  const maxCollaboration =
    links.length > 0 ? Math.max(...links.map(link => link.value)) : 1;

  return {
    nodes,
    links,
    maxCollaboration,
  };
};

/**
 * Find papers outside the main coauthor network.
 *
 * The main component is the connected component containing Aaditya Ramdas.
 * If that author is absent, the largest connected component is used instead.
 * Papers without author metadata are treated as peripheral because they cannot
 * be connected to the main network.
 */
export const analyzeAuthorConnectivity = (
  papers: Paper[],
  anchorAuthor = 'Aaditya Ramdas'
): AuthorConnectivityAnalysis => {
  const graph = buildAuthorGraph(papers);
  const canonicalizer = buildAuthorCanonicalizer(papers);
  const nodeKeyById = new Map(graph.nodes.map(node => [node.id, node._key]));
  const adjacency = new Map<string, Set<string>>(
    graph.nodes.map(node => [node._key, new Set<string>()])
  );

  graph.links.forEach(link => {
    const sourceId =
      typeof link.source === 'object' ? link.source.id : link.source;
    const targetId =
      typeof link.target === 'object' ? link.target.id : link.target;
    const sourceKey = nodeKeyById.get(sourceId);
    const targetKey = nodeKeyById.get(targetId);
    if (!sourceKey || !targetKey) return;
    adjacency.get(sourceKey)?.add(targetKey);
    adjacency.get(targetKey)?.add(sourceKey);
  });

  const components: Set<string>[] = [];
  const visited = new Set<string>();

  graph.nodes.forEach(node => {
    if (visited.has(node._key)) return;
    const component = new Set<string>();
    const pending = [node._key];

    while (pending.length > 0) {
      const key = pending.pop()!;
      if (visited.has(key)) continue;
      visited.add(key);
      component.add(key);
      adjacency.get(key)?.forEach(neighbor => {
        if (!visited.has(neighbor)) pending.push(neighbor);
      });
    }

    components.push(component);
  });

  const anchorKey = canonicalizer.canonicalKey(anchorAuthor);
  const anchorComponent = components.find(component =>
    component.has(anchorKey)
  );
  const largestComponent = components.reduce<Set<string> | undefined>(
    (largest, component) =>
      !largest || component.size > largest.size ? component : largest,
    undefined
  );
  const mainComponent =
    anchorComponent ?? largestComponent ?? new Set<string>();

  const peripheralPapers = new Set(
    papers.filter(paper => {
      const authorKeys = Array.from(
        new Set(
          parseAuthors(paper.authors).map(author =>
            canonicalizer.canonicalKey(author)
          )
        )
      );
      return (
        authorKeys.length === 0 ||
        authorKeys.every(authorKey => !mainComponent.has(authorKey))
      );
    })
  );

  return {
    peripheralPapers,
    mainComponentAuthorCount: mainComponent.size,
    peripheralAuthorCount: Math.max(0, graph.nodes.length - mainComponent.size),
    componentCount: components.length,
    anchorFound: Boolean(anchorComponent),
  };
};
