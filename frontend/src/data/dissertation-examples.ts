/**
 * Complete catalog of examples from 2021 Master's Dissertation
 * "A Python Library for Group Theory Calculations in Particle Physics"
 * by Rafael Eberhardt Sarate
 */

export type ExampleCategory =
  | 'irrep-construction'
  | 'dynkin-diagrams'
  | 'symmetry-breaking'
  | 'multiplet-diagrams'
  | 'tensor-products'
  | 'gut-applications'
  | 'benchmarks';

export interface DissertationExample {
  id: string;
  figureNumber: string;
  section: string;
  title: string;
  category: ExampleCategory;
  group: string;
  description: string;
  calculation: {
    type: 'irrep' | 'tensor_product' | 'symmetry_breaking' | 'multiplet' | 'dimension';
    irrep?: number[];
    irrep1?: number[];
    irrep2?: number[];
    power?: number;
    nodeToBreak?: number;
    method?: 'standard' | 'extended';
  };
  expectedResult?: string;
  physicsContext?: string;
  page?: number;
  dissertationChapterId?: string; // Links to chapter in dissertation-content.ts
}

export const DISSERTATION_EXAMPLES: DissertationExample[] = [
  // ==========================================
  // SECTION 3.2 - Irrep Construction (Hasse Diagrams)
  // ==========================================
  {
    id: 'fig-3.6-15-su4',
    figureNumber: '3.6',
    section: '3.2.1',
    title: 'Irreducible Representation: 15 of SU(4)',
    category: 'irrep-construction',
    group: 'SU4',
    description:
      'Hasse diagram showing step-by-step construction of the 15-dimensional irrep with highest weight (1,0,1). Demonstrates the algorithmic process of subtracting simple roots.',
    calculation: {
      type: 'irrep',
      irrep: [1, 0, 1],
    },
    expectedResult:
      'Dimension: 15, Weights include (1,0,1), (-1,0,-1), (0,0,0) with multiplicity 3',
    page: 67,
  },
  {
    id: 'fig-3.7-3-su3',
    figureNumber: '3.7',
    section: '3.2.1',
    title: 'Fundamental Representation: 3 of SU(3)',
    category: 'irrep-construction',
    group: 'SU3',
    description:
      'Hasse diagram for the simplest non-trivial irrep of SU(3). Shows the three quarks (u, d, s) in QCD.',
    calculation: {
      type: 'irrep',
      irrep: [1, 0],
    },
    expectedResult: 'Dimension: 3, Weights: (1,0), (-1,1), (0,-1)',
    physicsContext: 'The three colored quarks of Quantum Chromodynamics',
    page: 66,
  },
  {
    id: 'fig-3.8-6bar-su3',
    figureNumber: '3.8',
    section: '3.5',
    title: 'Antisymmetric Representation: 6̄ of SU(3)',
    category: 'irrep-construction',
    group: 'SU3',
    description: 'Hasse diagram for 6̄ with highest weight (2,0). Appears in 3⊗3 decomposition.',
    calculation: {
      type: 'irrep',
      irrep: [2, 0],
    },
    expectedResult: 'Dimension: 6',
    page: 90,
  },

  // ==========================================
  // SECTION 3.3 - Dynkin Diagrams
  // ==========================================
  {
    id: 'fig-3.4-f4-dynkin',
    figureNumber: '3.4',
    section: '3.3',
    title: 'Dynkin Diagram: F₄ Exceptional Lie Algebra',
    category: 'dynkin-diagrams',
    group: 'F4',
    description:
      'Demonstrates Dynkin diagram construction from Cartan matrix. Shows two filled nodes (shorter roots) connected by double line to two unfilled nodes.',
    calculation: {
      type: 'dimension',
    },
    expectedResult: 'Rank: 4, Dimension: 52',
    page: 64,
  },

  // ==========================================
  // SECTION 3.4-3.5 - Symmetry Breaking
  // ==========================================
  {
    id: 'fig-3.11-su5-break',
    figureNumber: '3.11',
    section: '3.4.1',
    title: 'SU(5) → SU(3) ⊗ SU(2) ⊗ U(1)',
    category: 'symmetry-breaking',
    group: 'SU5',
    description:
      'Non-semisimple decomposition by crossing out node 2 (α₂) in the Dynkin diagram. Fundamental for GUT model building.',
    calculation: {
      type: 'symmetry_breaking',
      nodeToBreak: 2,
      method: 'standard',
    },
    expectedResult: 'SU(5) → SU(3) ⊗ SU(2) ⊗ U(1)',
    physicsContext: 'First step in breaking SU(5) GUT to Standard Model gauge group',
    page: 81,
  },
  {
    id: 'fig-3.12-so10-break',
    figureNumber: '3.12',
    section: '3.4.1',
    title: 'SO(10) → SU(5) ⊗ U(1)',
    category: 'symmetry-breaking',
    group: 'SO10',
    description:
      'Crossing node 4 in SO(10) Dynkin diagram produces SU(5). Classic GUT symmetry breaking.',
    calculation: {
      type: 'symmetry_breaking',
      nodeToBreak: 4,
      method: 'standard',
    },
    expectedResult: 'SO(10) → SU(5) ⊗ U(1)',
    physicsContext: 'SO(10) is one of the most popular GUT candidates',
    page: 82,
  },
  {
    id: 'fig-3.13-e6-break-ext',
    figureNumber: '3.13',
    section: '3.4.2',
    title: 'E₆ → SU(6) ⊗ SU(2) (Extended)',
    category: 'symmetry-breaking',
    group: 'E6',
    description:
      'Semisimple decomposition using extended Dynkin diagram. Demonstrates breaking with highest root γ.',
    calculation: {
      type: 'symmetry_breaking',
      nodeToBreak: 3,
      method: 'extended',
    },
    expectedResult: 'E₆ → SU(6) ⊗ SU(2)',
    page: 84,
  },
  {
    id: 'fig-3.14-su4-break',
    figureNumber: '3.14',
    section: '3.5.3',
    title: 'SU(4) → SU(3) ⊗ U(1)',
    category: 'symmetry-breaking',
    group: 'SU4',
    description:
      'Preparation for studying irrep breaking. Shows Dynkin diagram with node 2 crossed.',
    calculation: {
      type: 'symmetry_breaking',
      nodeToBreak: 2,
      method: 'standard',
    },
    expectedResult: 'SU(4) → SU(3) ⊗ U(1)',
    page: 85,
  },

  // ==========================================
  // SECTION 3.6 - Multiplet Diagrams (Quantum Number Space)
  // ==========================================
  {
    id: 'fig-3.16-3-su3-multiplet',
    figureNumber: '3.16',
    section: '3.6',
    title: 'Quantum Numbers: 3 of SU(3)',
    category: 'multiplet-diagrams',
    group: 'SU3',
    description:
      '2D multiplet diagram in (I₃, Y) space showing three quark states. First example of quantum number visualization.',
    calculation: {
      type: 'multiplet',
      irrep: [1, 0],
    },
    physicsContext:
      'Shows the three colored quarks with their isospin and hypercharge quantum numbers',
    page: 89,
    dissertationChapterId: 'multiplet-diagrams',
  },
  {
    id: 'fig-3.17-3bar-su3-multiplet',
    figureNumber: '3.17',
    section: '3.6',
    title: 'Quantum Numbers: 3̄ of SU(3)',
    category: 'multiplet-diagrams',
    group: 'SU3',
    description:
      '2D multiplet diagram for anti-fundamental (antiquarks). Mirror image of figure 3.16.',
    calculation: {
      type: 'multiplet',
      irrep: [0, 1],
    },
    physicsContext: 'The three antiquarks (ū, đ, s̄)',
    page: 90,
    dissertationChapterId: 'multiplet-diagrams',
  },
  {
    id: 'fig-3.18-8-su3-multiplet',
    figureNumber: '3.18',
    section: '3.6',
    title: 'Quantum Numbers: 8 (Adjoint) of SU(3)',
    category: 'multiplet-diagrams',
    group: 'SU3',
    description:
      '2D multiplet diagram showing the 8 gluons. Central point (0,0) has multiplicity 2.',
    calculation: {
      type: 'multiplet',
      irrep: [1, 1],
    },
    physicsContext: 'The eight colored gluons mediating the strong force',
    page: 91,
    dissertationChapterId: 'multiplet-diagrams',
  },
  {
    id: 'fig-3.19-15-su4-multiplet-3d',
    figureNumber: '3.19',
    section: '3.6',
    title: 'Quantum Numbers: 15 of SU(4) (3D)',
    category: 'multiplet-diagrams',
    group: 'SU4',
    description:
      '3D multiplet diagram showing quantum number space for rank-3 algebra. Colored planes indicate SU(3) subgroups.',
    calculation: {
      type: 'multiplet',
      irrep: [1, 0, 1],
    },
    dissertationChapterId: 'multiplet-diagrams',
    expectedResult: 'Planes colored by SU(3) irreps: red (3), pink (3̄), green (8⊕1)',
    page: 92,
  },

  // ==========================================
  // SECTION 3.5 - Tensor Products
  // ==========================================
  {
    id: 'example-3x3-su3',
    figureNumber: '3.5',
    section: '3.5',
    title: 'Tensor Product: 3 ⊗ 3 in SU(3)',
    category: 'tensor-products',
    group: 'SU3',
    description:
      'Fundamental example showing algorithmic tensor product decomposition. Sum all weight pairs, find highest weights.',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0],
      irrep2: [1, 0],
    },
    expectedResult: '3 ⊗ 3 = 6̄ ⊕ 3̄',
    physicsContext: 'Combining two quarks produces diquark states',
    page: 78,
  },

  // ==========================================
  // SECTION 4 - GUT Applications
  // ==========================================
  {
    id: 'fig-4.2-16-so10-break',
    figureNumber: '4.2',
    section: '4',
    title: '16 of SO(10) → SU(5) Decomposition',
    category: 'gut-applications',
    group: 'SO10',
    description:
      'The 16-dimensional spinor of SO(10) contains a complete fermion generation. Shows breaking to 10 ⊕ 5̄ ⊕ 1.',
    calculation: {
      type: 'irrep',
      irrep: [0, 0, 0, 1, 0],
    },
    expectedResult: '16 → 10 ⊕ 5̄ ⊕ 1 (in SU(5))',
    physicsContext: 'One generation of Standard Model fermions unified in a single SO(10) irrep',
    page: 107,
  },
  {
    id: 'fig-4.3-5bar-su5-break',
    figureNumber: '4.3',
    section: '4',
    title: '5̄ of SU(5) → SU(3) ⊗ SU(2) Decomposition',
    category: 'gut-applications',
    group: 'SU5',
    description: 'Breaking 5̄ to Standard Model groups reveals leptons and down quarks.',
    calculation: {
      type: 'irrep',
      irrep: [0, 0, 0, 1],
    },
    expectedResult: '5̄ → 1⊗2 ⊕ 3̄⊗1 (left-handed leptons, right-handed down quarks)',
    physicsContext: 'Shows how leptons and quarks fit together in SU(5)',
    page: 108,
  },
  {
    id: 'fig-4.4-10-su5-break',
    figureNumber: '4.4',
    section: '4',
    title: '10 of SU(5) → SU(3) ⊗ SU(2) Decomposition',
    category: 'gut-applications',
    group: 'SU5',
    description: 'The 10 contains left-handed quarks and right-handed positron.',
    calculation: {
      type: 'irrep',
      irrep: [0, 1, 0, 0],
    },
    expectedResult:
      '10 → 3̄⊗1 ⊕ 3⊗2 ⊕ 1⊗1 (right-handed up/down quarks, left-handed quarks, right-handed e⁺)',
    physicsContext: 'Completes the Standard Model fermion content',
    page: 109,
  },

  // ==========================================
  // APPENDIX B - Performance Benchmarks
  // ==========================================
  {
    id: 'benchmark-27-squared-e6',
    figureNumber: 'B.1',
    section: 'Appendix B',
    title: 'E₆ Benchmark: 27²',
    category: 'benchmarks',
    group: 'E6',
    description: 'Tensor product 27 ⊗ 27 in E₆. Used for performance comparison with LieART.',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0, 0, 0, 0, 0],
      irrep2: [1, 0, 0, 0, 0, 0],
    },
    expectedResult: '27² = 2̄7 ⊕ 3̄51 ⊕ 351′',
    page: 116,
  },
  {
    id: 'benchmark-27-cubed-e6',
    figureNumber: 'B.1',
    section: 'Appendix B',
    title: 'E₆ Benchmark: 27³',
    category: 'benchmarks',
    group: 'E6',
    description: 'Higher power calculation demonstrating algorithm efficiency.',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0, 0, 0, 0, 0],
      irrep2: [1, 0, 0, 0, 0, 0],
      power: 3,
    },
    expectedResult: '27³ = 1 ⊕ 2(78) ⊕ 3(650) ⊕ 2925 ⊕ 3003 ⊕ 2(5824)',
    page: 116,
  },
  {
    id: 'benchmark-78-squared-e6',
    figureNumber: 'B.2',
    section: 'Appendix B',
    title: 'E₆ Benchmark: 78²',
    category: 'benchmarks',
    group: 'E6',
    description: 'The adjoint representation squared. 78 is the dimension of E₆.',
    calculation: {
      type: 'tensor_product',
      irrep1: [0, 0, 0, 0, 0, 1],
      irrep2: [0, 0, 0, 0, 0, 1],
    },
    expectedResult: '78² = 1 ⊕ 78 ⊕ 650 ⊕ 2430 ⊕ 2925',
    page: 118,
  },
  {
    id: 'benchmark-248-squared-e8',
    figureNumber: 'B.3',
    section: 'Appendix B',
    title: 'E₈ Benchmark: 248²',
    category: 'benchmarks',
    group: 'E8',
    description: 'The adjoint of E₈ squared. E₈ is the largest exceptional group.',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0, 0, 0, 0, 0, 0, 0],
      irrep2: [1, 0, 0, 0, 0, 0, 0, 0],
    },
    expectedResult: '248² = 1 ⊕ 248 ⊕ 3875 ⊕ 27000 ⊕ 30380',
    page: 120,
  },
];

/**
 * Group examples by category
 */
export const EXAMPLES_BY_CATEGORY = DISSERTATION_EXAMPLES.reduce(
  (acc, example) => {
    if (!acc[example.category]) {
      acc[example.category] = [];
    }
    acc[example.category].push(example);
    return acc;
  },
  {} as Record<ExampleCategory, DissertationExample[]>
);

/**
 * Category metadata
 */
export const CATEGORY_INFO: Record<
  ExampleCategory,
  { title: string; description: string; icon: string }
> = {
  'irrep-construction': {
    title: 'Irrep Construction',
    description: 'Building irreducible representations using Hasse diagrams',
    icon: '🏗️',
  },
  'dynkin-diagrams': {
    title: 'Dynkin Diagrams',
    description: 'Visual representation of Lie algebra structure',
    icon: '📊',
  },
  'symmetry-breaking': {
    title: 'Symmetry Breaking',
    description: 'How large groups decompose into smaller subgroups',
    icon: '💥',
  },
  'multiplet-diagrams': {
    title: 'Multiplet Diagrams',
    description: 'Quantum number space visualization in 2D and 3D',
    icon: '🎯',
  },
  'tensor-products': {
    title: 'Tensor Products',
    description: 'Combining representations',
    icon: '⊗',
  },
  'gut-applications': {
    title: 'GUT Applications',
    description: 'Grand Unified Theory symmetry breaking chains',
    icon: '🌌',
  },
  benchmarks: {
    title: 'Computational Benchmarks',
    description: 'Performance validation calculations',
    icon: '⚡',
  },
};
