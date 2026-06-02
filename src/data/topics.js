// Topic data for GCSE Mathematics (Higher) — Edexcel Level 1/2 GCSE (9-1).
// Sparx Maths codes are taken directly from the Y10 PPE2 revision guide.
// Each topic carries a strand, the Sparx codes, and a short "focus" used to
// steer the AI when generating questions and hints.

export const PAPER_INFO = {
  board: 'Edexcel (Pearson)',
  tier: 'Higher',
  qualification: 'Level 1/2 GCSE (9-1) in Mathematics',
  papers: 'Paper 1 (non-calculator) & Paper 2 (calculator)',
  lengthEach: '1 hour 30 minutes each',
  marksEach: 90,
  leadTeacher: 'Mr Hodgson',
  ppe: {
    name: 'Y10 Summer PPE2',
    window: '15 June – 26 June',
    paper1: 'Friday 19 June',
    paper2: 'Monday 22 June',
  },
  note:
    'The assessment can include any topic from Year 9 and Year 10 (Term 1 to Term 5). Search the Sparx codes in the Independent Learning function on Sparx.',
};

export const STRANDS = {
  number: { label: 'Number', color: '#1F8A4C' },
  algebra: { label: 'Algebra', color: '#E8623A' },
  ratio: { label: 'Ratio & Proportion', color: '#E0A526' },
  geometry: { label: 'Geometry & Measures', color: '#2F6DB5' },
  probability: { label: 'Probability', color: '#8A4FB0' },
  statistics: { label: 'Statistics', color: '#1F8A4C' },
};

export const TOPICS = [
  // ---- Number ----
  { id: 'decimal-manipulation', name: 'Decimal manipulation', strand: 'number',
    focus: 'multiplying and dividing by decimals, ordering, rounding within calculations',
    sparx: ['U417','U478','U127','U293','U453','U868','U976'] },
  { id: 'estimation-accuracy', name: 'Estimation & limits of accuracy', strand: 'number',
    focus: 'estimating answers, upper and lower bounds, error intervals, truncation',
    sparx: ['U480','U298','U731','U965','U225','U657','U108','U301'] },
  { id: 'related-calculations', name: 'Related calculations', strand: 'number',
    focus: 'using a given calculation to deduce related answers without working from scratch',
    sparx: ['U735'] },
  { id: 'hcf-lcm', name: 'HCF & LCM of large numbers', strand: 'number',
    focus: 'prime factorisation, Venn-method HCF and LCM, product of prime factors',
    sparx: ['U211','U751','U529','U236','U739','U250'] },
  { id: 'fractions', name: 'Fraction calculations', strand: 'number',
    focus: 'four operations with fractions and mixed numbers, fractions of amounts',
    sparx: ['U736','U692','U793','U475','U224','U544','U538','U881','U916','U874'] },
  { id: 'index-laws', name: 'Index laws', strand: 'number',
    focus: 'multiplying/dividing powers, powers of powers, negative and fractional indices',
    sparx: ['U235','U694','U851'] },
  { id: 'standard-form', name: 'Standard form', strand: 'number',
    focus: 'writing in standard form, calculating with standard form (with and without a calculator)',
    sparx: ['M719','M678'] },
  { id: 'surds', name: 'Surds', strand: 'number',
    focus: 'simplifying surds, multiplying/dividing, rationalising the denominator',
    sparx: ['U633','U338','U872','U499','U707','U281'] },
  { id: 'growth-decay', name: 'Growth & decay', strand: 'number',
    focus: 'compound interest, depreciation, repeated percentage change, multipliers',
    sparx: ['U332','U988'] },

  // ---- Algebra ----
  { id: 'algebraic-manipulation', name: 'Algebraic manipulation', strand: 'algebra',
    focus: 'collecting like terms, simplifying, working with algebraic fractions',
    sparx: ['U613','U662'] },
  { id: 'expand-factorise', name: 'Expanding & factorising', strand: 'algebra',
    focus: 'expanding double/triple brackets, factorising quadratics, difference of two squares',
    sparx: ['U179','U365','U768','U178','U963'] },
  { id: 'expressions-substitution', name: 'Forming expressions & substitution', strand: 'algebra',
    focus: 'forming expressions from words, substituting values including negatives',
    sparx: ['M175','M428','U201','U585','U144','M830'] },
  { id: 'solving-equations', name: 'Solving equations', strand: 'algebra',
    focus: 'linear equations, unknowns on both sides, equations with brackets and fractions',
    sparx: ['U755','U325','U870','U599','U556'] },
  { id: 'rearranging-formulae', name: 'Rearranging formulae', strand: 'algebra',
    focus: 'changing the subject, including where the subject appears more than once',
    sparx: ['U755','U325','U870','U556'] },
  { id: 'inequalities', name: 'Inequalities', strand: 'algebra',
    focus: 'solving linear inequalities, number lines, set notation',
    sparx: ['U759','U509','U738','U145'] },
  { id: 'sequences', name: 'Sequences', strand: 'algebra',
    focus: 'nth term of linear and quadratic sequences, geometric and special sequences',
    sparx: ['U213','U530','U498','U978','U680','U958'] },
  { id: 'linear-graphs', name: 'Linear graphs', strand: 'algebra',
    focus: 'y = mx + c, gradient, parallel and perpendicular lines, finding equations',
    sparx: ['U789','U741','U933','U889','U669','U315','U377','U477','U848','U652','U862','U898'] },
  { id: 'simultaneous-equations', name: 'Linear simultaneous equations', strand: 'algebra',
    focus: 'solving by elimination and substitution, forming pairs of equations',
    sparx: ['U760','U757','U836','U137'] },
  { id: 'quadratics-graphical', name: 'Quadratics — graphical', strand: 'algebra',
    focus: 'plotting quadratics, roots, turning points, reading solutions from graphs',
    sparx: ['U989','U667','U601'] },
  { id: 'quadratics-algebraic', name: 'Quadratics — algebraic', strand: 'algebra',
    focus: 'solving by factorising, the quadratic formula, completing the square',
    sparx: ['U178','U963','U228','U858','U960','U589','U665','U150','U397','U103','U437','U294','U685','U457','U824'] },
  { id: 'further-graphs', name: 'Further graphs', strand: 'algebra',
    focus: 'cubic, reciprocal and exponential graphs, recognising graph shapes',
    sparx: ['U980','U593','U238','U229','U567'] },

  // ---- Ratio & Proportion ----
  { id: 'direct-inverse-proportion', name: 'Direct & inverse proportion', strand: 'ratio',
    focus: 'recognising and using direct and inverse proportion, unitary method',
    sparx: ['U721','U610','U357','U640','U364','U238'] },
  { id: 'ratio-2', name: 'Ratio (2)', strand: 'ratio',
    focus: 'sharing in a ratio, combining ratios, ratio change problems',
    sparx: ['U687','U577','U176','U753','U921','U676','U865'] },
  { id: 'ratio-3', name: 'Ratio (3)', strand: 'ratio',
    focus: 'harder multi-step ratio reasoning and proportion problems',
    sparx: ['U595'] },
  { id: 'compound-measures', name: 'Compound measures', strand: 'ratio',
    focus: 'speed, density, pressure, rates and unit conversions',
    sparx: ['U902','U388','U248','U468','U151','U256','U403','U910','U527','U842','U914','U462','U896'] },
  { id: 'algebraic-proportion', name: 'Algebraic proportion', strand: 'ratio',
    focus: 'y proportional to x (and powers of x), finding the constant of proportionality',
    sparx: ['U721','U357','U640','U407','U364','U138','U238'] },

  // ---- Geometry & Measures ----
  { id: 'pythagoras', name: 'Pythagoras', strand: 'geometry',
    focus: 'finding missing sides in right-angled triangles, including in context',
    sparx: ['U385','U851'] },
  { id: 'right-angled-trig', name: 'Right-angled trigonometry', strand: 'geometry',
    focus: 'SOHCAHTOA, finding sides and angles, exact trig values',
    sparx: ['U605','U283','U545','U627'] },
  { id: 'angles', name: 'Interior & exterior angles', strand: 'geometry',
    focus: 'polygon angle rules, angles in parallel lines, angle reasoning',
    sparx: ['U447','U390','U730','U628','U732','U329','U655','U427'] },
  { id: 'vectors', name: 'Vectors', strand: 'geometry',
    focus: 'column vectors, vector arithmetic, vector geometry proofs',
    sparx: ['U196','U903','U564','U632','U660'] },
  { id: 'transformations', name: 'Transformations', strand: 'geometry',
    focus: 'translation, reflection, rotation and enlargement, describing transformations',
    sparx: ['M797','U799','U696','U519'] },
  { id: 'plans-elevations', name: 'Plans & elevations', strand: 'geometry',
    focus: 'drawing and interpreting plan, front and side elevations of 3D solids',
    sparx: ['U743'] },
  { id: 'arcs-sectors', name: 'Arcs & sectors', strand: 'geometry',
    focus: 'arc length and sector area, perimeter of sectors',
    sparx: ['U767','U604','U950','U221','U373'] },
  { id: 'surface-area', name: 'Surface area', strand: 'geometry',
    focus: 'surface area of prisms, cylinders, cones, spheres and composite solids',
    sparx: ['U929','U259','U464','U761','U871','U523','U893','U334','U561','U142','U771'] },
  { id: 'volume', name: 'Volume', strand: 'geometry',
    focus: 'volume of prisms, cylinders, cones, spheres and composite solids',
    sparx: ['U786','U174','U915','U484','U116','U617','U426','U543','U350'] },
  { id: 'similar-shapes', name: 'Similar shapes', strand: 'geometry',
    focus: 'similar triangles, length/area/volume scale factors',
    sparx: ['U551','U578','U630','U110','U350','U334'] },

  // ---- Probability ----
  { id: 'probability-1', name: 'Probability (1)', strand: 'probability',
    focus: 'basic probability, sample space, relative frequency, expected outcomes',
    sparx: ['U408','U510','U683','U166','U104','U476','U748','U296','U280','U580'] },
  { id: 'probability-2', name: 'Probability (2)', strand: 'probability',
    focus: 'tree diagrams, Venn diagrams, conditional probability, AND/OR rules',
    sparx: ['U803','U408','U510','U280','U683','U166','U104','U580','U476','U748','U558','U729','U296','U369'] },

  // ---- Statistics ----
  { id: 'statistics-2', name: 'Statistics (2)', strand: 'statistics',
    focus: 'averages from tables, frequency polygons, scatter graphs, sampling',
    sparx: ['U508','U172','U200','U909','U569','U854','U877','U717','U322','U162','U199','U277','U840'] },
  { id: 'cumulative-frequency', name: 'Cumulative frequency & box plots', strand: 'statistics',
    focus: 'cumulative frequency curves, median and quartiles, box plots, comparing distributions',
    sparx: ['U642','U182','U837','U879','U507'] },
];

export const TOPICS_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

export function topicsByStrand() {
  const grouped = {};
  for (const key of Object.keys(STRANDS)) grouped[key] = [];
  for (const t of TOPICS) grouped[t.strand].push(t);
  return grouped;
}
