interface VenueDefinition {
  canonical: string;
  short: string;
  aliases?: string[];
}

const VENUES: VenueDefinition[] = [
  {
    canonical: 'Advances in Neural Information Processing Systems',
    short: 'NeurIPS',
  },
  {
    canonical: 'International Conference on Machine Learning',
    short: 'ICML',
  },
  {
    canonical:
      'International Conference on Artificial Intelligence and Statistics',
    short: 'AISTATS',
  },
  {
    canonical: 'Conference on Uncertainty in Artificial Intelligence',
    short: 'UAI',
    aliases: ['Uncertainty in Artificial Intelligence'],
  },
  { canonical: 'Conference on Learning Theory', short: 'COLT' },
  {
    canonical: 'International Conference on Learning Representations',
    short: 'ICLR',
  },
  {
    canonical: 'AAAI Conference on Artificial Intelligence',
    short: 'AAAI',
  },
  {
    canonical: 'Conference on Causal Learning and Reasoning',
    short: 'CLeaR',
  },
  { canonical: 'Algorithmic Learning Theory', short: 'ALT' },
  {
    canonical:
      'Symposium on Conformal and Probabilistic Prediction and Applications',
    short: 'COPA',
  },
  { canonical: 'The Annals of Statistics', short: 'AoS' },
  { canonical: 'The Annals of Probability', short: 'AoP' },
  { canonical: 'The Annals of Applied Statistics', short: 'AoAS' },
  { canonical: 'The Annals of Applied Probability', short: 'AoAP' },
  { canonical: 'The Annals of Mathematical Statistics', short: 'AoMS' },
  {
    canonical:
      'Journal of the Royal Statistical Society Series A: Statistics in Society',
    short: 'JRSSA',
    aliases: ['Journal of the Royal Statistical Society: Series A'],
  },
  {
    canonical:
      'Journal of the Royal Statistical Society Series B: Statistical Methodology',
    short: 'JRSSB',
    aliases: ['Journal of the Royal Statistical Society: Series B'],
  },
  {
    canonical: 'Journal of the American Statistical Association',
    short: 'JASA',
  },
  { canonical: 'Journal of Machine Learning Research', short: 'JMLR' },
  {
    canonical: 'Journal of Computational and Graphical Statistics',
    short: 'JCGS',
  },
  { canonical: 'Electronic Journal of Statistics', short: 'EJS' },
  { canonical: 'Electronic Journal of Probability', short: 'EJP' },
  { canonical: 'Statistics & Probability Letters', short: 'SPL' },
  { canonical: 'Statistical Science', short: 'StatSci' },
  { canonical: 'The American Statistician', short: 'TAS' },
  { canonical: 'Canadian Journal of Statistics', short: 'CJS' },
  {
    canonical: 'Stochastic Processes and their Applications',
    short: 'SPA',
  },
  {
    canonical: 'International Journal of Approximate Reasoning',
    short: 'IJAR',
  },
  {
    canonical: 'Proceedings of the National Academy of Sciences',
    short: 'PNAS',
  },
  { canonical: 'Lecture Notes in Computer Science', short: 'LNCS' },
  {
    canonical: 'IEEE Transactions on Information Theory',
    short: 'IEEE TIT',
  },
  {
    canonical: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
    short: 'IEEE TPAMI',
  },
  {
    canonical: 'IEEE Journal on Selected Areas in Information Theory',
    short: 'IEEE JSAIT',
  },
  { canonical: 'IEEE Signal Processing Letters', short: 'IEEE SPL' },
  {
    canonical: 'IEEE International Symposium on Information Theory',
    short: 'IEEE ISIT',
  },
  {
    canonical: 'Transactions on Machine Learning Research',
    short: 'TMLR',
  },
  {
    canonical: 'Journal of Business & Economic Statistics',
    short: 'JBES',
  },
  {
    canonical: 'Journal of Statistical Planning and Inference',
    short: 'JSPI',
  },
  { canonical: 'Journal of Multivariate Analysis', short: 'JMVA' },
  {
    canonical: 'Journal of Statistical Computation and Simulation',
    short: 'JSCS',
  },
  { canonical: 'International Statistical Review', short: 'ISR' },
  { canonical: 'Scandinavian Journal of Statistics', short: 'SJS' },
  {
    canonical: 'Quarterly Journal of the Royal Meteorological Society',
    short: 'QJRMS',
  },
  { canonical: 'Mathematics of Operations Research', short: 'MOR' },
  { canonical: 'Operations Research', short: 'OR' },
  { canonical: 'Management Science', short: 'MS' },
  { canonical: 'Probability Surveys', short: 'Probab. Surv.' },
  {
    canonical: 'Philosophical Transactions of the Royal Society A',
    short: 'Phil. Trans. R. Soc. A',
  },
  { canonical: 'Psychonomic Bulletin & Review', short: 'PBR' },
  { canonical: 'Data Mining and Knowledge Discovery', short: 'DMKD' },
  { canonical: 'BMC Medical Research Methodology', short: 'BMC MRM' },
  {
    canonical: 'The New England Journal of Statistics in Data Science',
    short: 'NEJSDS',
  },
];

const normalizeVenueName = (name: string): string =>
  name.trim().replace(/\s+/g, ' ').toLowerCase();

const venueLookup = new Map<string, VenueDefinition>();

VENUES.forEach(venue => {
  [venue.canonical, venue.short, ...(venue.aliases ?? [])].forEach(name => {
    venueLookup.set(normalizeVenueName(name), venue);
  });
});

const findVenue = (name?: string): VenueDefinition | undefined => {
  if (!name?.trim()) return undefined;
  return venueLookup.get(normalizeVenueName(name));
};

/** Return a compact, conventional venue label when one is known. */
export const getVenueDisplayName = (name?: string): string => {
  if (!name?.trim()) return '';
  return findVenue(name)?.short ?? name.trim();
};

/** Return the canonical full venue name, merging full-name and acronym aliases. */
export const getVenueCanonicalName = (name?: string): string => {
  if (!name?.trim()) return '';
  return findVenue(name)?.canonical ?? name.trim();
};

/** Include both full and short names in venue search. */
export const getVenueSearchText = (name?: string): string => {
  if (!name?.trim()) return '';
  const venue = findVenue(name);
  if (!venue) return name.trim();
  return [name, venue.canonical, venue.short, ...(venue.aliases ?? [])].join(
    ' '
  );
};
