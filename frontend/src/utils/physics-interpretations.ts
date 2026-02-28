/**
 * Physics interpretations for group theory results
 * Maps mathematical representations to physical particles and states
 */

export interface ParticleInterpretation {
  name: string;
  symbol: string;
  latex: string;
  description: string;
  examples?: string[];
}

export interface RepresentationInterpretation {
  group: string;
  irrep: string;
  physics: ParticleInterpretation;
}

/**
 * Standard Model and GUT particle interpretations
 */
export const PARTICLE_INTERPRETATIONS: Record<string, RepresentationInterpretation> = {
  // SU(3) - Color SU(3)_C representations
  'SU(3)_3': {
    group: 'SU(3)',
    irrep: '3',
    physics: {
      name: 'Quark',
      symbol: 'q',
      latex: 'q',
      description: 'Fundamental representation - a single quark in color space',
      examples: ['up quark', 'down quark', 'strange quark'],
    },
  },
  'SU(3)_3bar': {
    group: 'SU(3)',
    irrep: '3̄',
    physics: {
      name: 'Antiquark',
      symbol: 'q̄',
      latex: '\\bar{q}',
      description: 'Anti-fundamental - a single antiquark',
      examples: ['anti-up', 'anti-down', 'anti-strange'],
    },
  },
  'SU(3)_8': {
    group: 'SU(3)',
    irrep: '8',
    physics: {
      name: 'Gluon (Adjoint)',
      symbol: 'g',
      latex: 'g',
      description: 'Adjoint representation - gluons that mediate strong force',
      examples: ['8 gluon states'],
    },
  },
  'SU(3)_6': {
    group: 'SU(3)',
    irrep: '6',
    physics: {
      name: 'Diquark',
      symbol: 'qq',
      latex: 'qq',
      description: 'Symmetric combination of two quarks',
      examples: ['ud diquark in Δ++', 'color antisymmetric pair'],
    },
  },
  'SU(3)_10': {
    group: 'SU(3)',
    irrep: '10',
    physics: {
      name: 'Three-quark baryon',
      symbol: 'qqq',
      latex: 'qqq',
      description: 'Completely symmetric three-quark state',
      examples: ['Δ baryons', 'Ω baryon'],
    },
  },

  // SU(5) GUT representations
  'SU(5)_5': {
    group: 'SU(5)',
    irrep: '5',
    physics: {
      name: 'D-quarks + lepton',
      symbol: '(d̄, L)',
      latex: '(\\bar{d}, L)',
      description: 'Anti-down quarks (3 colors) + lepton doublet (e, νₑ)',
      examples: ['First generation: d̄ᵣ, d̄ᵍ, d̄ᵇ, e⁻, νₑ'],
    },
  },
  'SU(5)_5bar': {
    group: 'SU(5)',
    irrep: '5̄',
    physics: {
      name: 'D-quarks + anti-lepton',
      symbol: '(d, L̄)',
      latex: '(d, \\bar{L})',
      description: 'Down quarks + anti-lepton',
      examples: ['Antiparticles of 5-plet'],
    },
  },
  'SU(5)_10': {
    group: 'SU(5)',
    irrep: '10',
    physics: {
      name: 'U-quarks + E + Q',
      symbol: '(u, ū, e⁺)',
      latex: '(u, \\bar{u}, e^+)',
      description: 'Up quarks (antisymmetric) + anti-up + positron',
      examples: ['First generation: uᵣᵍ, uᵣᵇ, uᵍᵇ, ūᵣ, ūᵍ, ūᵇ, e⁺'],
    },
  },
  'SU(5)_24': {
    group: 'SU(5)',
    irrep: '24',
    physics: {
      name: 'GUT gauge bosons',
      symbol: 'X, Y, g, W, B',
      latex: 'X, Y, g, W, B',
      description: 'All gauge bosons: 12 X/Y leptoquarks + 8 gluons + 3 W + 1 B',
      examples: ['Includes particles that violate baryon number'],
    },
  },

  // SO(10) GUT representations
  'SO(10)_10': {
    group: 'SO(10)',
    irrep: '10',
    physics: {
      name: 'Gauge bosons',
      symbol: 'Gₐ',
      latex: 'G_a',
      description: 'SO(10) gauge bosons',
      examples: ['Унифицирует все калибровочные поля'],
    },
  },
  'SO(10)_16': {
    group: 'SO(10)',
    irrep: '16',
    physics: {
      name: 'Complete fermion generation',
      symbol: 'ψ',
      latex: '\\psi',
      description: 'One complete generation: all quarks, leptons, AND right-handed neutrino',
      examples: [
        'All SM fermions + νᵣ',
        '15 SM states + 1 sterile neutrino',
        'Explains why 3 generations',
      ],
    },
  },
  'SO(10)_45': {
    group: 'SO(10)',
    irrep: '45',
    physics: {
      name: 'Adjoint Higgs',
      symbol: 'Φ',
      latex: '\\Phi',
      description: 'Adjoint Higgs that breaks SO(10) → SU(5) × U(1)',
      examples: ['GUT symmetry breaking field'],
    },
  },
  'SO(10)_126': {
    group: 'SO(10)',
    irrep: '126',
    physics: {
      name: 'Higgs + Majorana mass',
      symbol: 'Δ',
      latex: '\\Delta',
      description: 'Higgs that gives Majorana masses to right-handed neutrinos',
      examples: ['Seesaw mechanism', 'Neutrino mass generation'],
    },
  },
};

/**
 * Tensor product physical interpretations
 */
export interface TensorProductPhysics {
  productLatex: string;
  physicsDescription: string;
  examples: string[];
}

export const TENSOR_PRODUCT_PHYSICS: Record<string, TensorProductPhysics> = {
  // SU(3) color
  'SU(3)_3x3': {
    productLatex: '3 \\otimes 3',
    physicsDescription: 'Quark + Quark → Diquark states + Color singlet',
    examples: [
      'qq → 6 (symmetric diquark) ⊕ 3̄ (antisymmetric)',
      'Color combination in baryons',
      'Not color singlet - needs third quark',
    ],
  },
  'SU(3)_3x3bar': {
    productLatex: '3 \\otimes \\bar{3}',
    physicsDescription: 'Quark + Antiquark → Meson (singlet) + Gluons',
    examples: [
      'q⊗q̄ → 1 (meson) ⊕ 8 (excited states)',
      'π meson is from 1',
      'ρ, ω mesons from 8',
      'Physical mesons are superpositions',
    ],
  },
  'SU(3)_8x8': {
    productLatex: '8 \\otimes 8',
    physicsDescription: 'Gluon + Gluon → Glueball states',
    examples: [
      'Gluon fusion creates glueballs',
      'Multiple representations mix',
      'Experimental: f₀(1500) candidate glueball',
    ],
  },
  'SU(3)_3x3x3': {
    productLatex: '3 \\otimes 3 \\otimes 3',
    physicsDescription: 'Three quarks → Baryon states',
    examples: [
      'Proton p = uud in 1 (antisymmetric)',
      'Neutron n = udd in 1',
      'Δ++ = uuu in 10 (symmetric)',
      'Color antisymmetric = flavor symmetric × spin',
    ],
  },

  // SU(5) GUT
  'SU(5)_5x10': {
    productLatex: '5 \\otimes 10',
    physicsDescription: 'Yukawa coupling - generates fermion masses',
    examples: [
      'Higgs couples to fermions',
      '5̄⊗10 gives masses to down-type',
      'Predicts mₑ = mₐ at GUT scale',
    ],
  },
  'SU(5)_10x10': {
    productLatex: '10 \\otimes 10',
    physicsDescription: 'Fermion bilinear - Majorana masses or Yukawa',
    examples: ['Can give Majorana masses', 'Related to neutrino mass', 'Contains 5̄ for Yukawa'],
  },

  // SO(10) GUT
  'SO(10)_16x16': {
    productLatex: '16 \\otimes 16',
    physicsDescription: 'Two fermion generations → All Yukawa couplings',
    examples: [
      'Contains 10 (Higgs doublet)',
      'Contains 126 (νᵣ Majorana mass)',
      'Unified mass generation',
      'Seesaw mechanism natural',
    ],
  },
  'SO(10)_16x10': {
    productLatex: '16 \\otimes 10',
    physicsDescription: 'Fermion + Higgs → Mass terms',
    examples: ['Dirac masses for fermions', 'Simpler than 16⊗16⊗126̄'],
  },
};

/**
 * Get physics interpretation for a representation
 */
export const getRepresentationPhysics = (
  group: string,
  irrep: string
): ParticleInterpretation | null => {
  const key = `${group}_${irrep.replace('̄', 'bar')}`;
  return PARTICLE_INTERPRETATIONS[key]?.physics || null;
};

/**
 * Get physics interpretation for tensor product
 */
export const getTensorProductPhysics = (
  group: string,
  irrep1: string,
  irrep2: string
): TensorProductPhysics | null => {
  const key = `${group}_${irrep1}x${irrep2}`.replace(/̄/g, 'bar');
  return TENSOR_PRODUCT_PHYSICS[key] || null;
};

/**
 * Educational examples - famous calculations in particle physics
 */
export interface PhysicsExample {
  title: string;
  group: string;
  calculation: {
    type: 'tensor_product' | 'branching' | 'dimension';
    irrep1?: number[];
    irrep2?: number[];
    irrep1Display?: string; // For display purposes (e.g., "3", "3̄")
    irrep2Display?: string;
    targetGroup?: string;
  };
  physicsContext: string;
  whyItMatters: string;
  historicalNote?: string;
}

export const FAMOUS_EXAMPLES: PhysicsExample[] = [
  {
    title: 'Quark-Antiquark Mesons',
    group: 'SU(3)',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0],
      irrep2: [0, 1],
      irrep1Display: '3',
      irrep2Display: '3̄',
    },
    physicsContext:
      'Combining a quark and antiquark creates mesons. The singlet 1 is the physical meson (π, K), while the octet 8 gives excited states (ρ, ω).',
    whyItMatters: 'Foundation of hadron spectroscopy. Explains why pions are lightest mesons.',
    historicalNote: "Gell-Mann and Ne'eman (1961) - Eightfold Way",
  },
  {
    title: 'Baryon Decuplet',
    group: 'SU(3)',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0],
      irrep2: [1, 0],
      irrep1Display: '3',
      irrep2Display: '3',
    },
    physicsContext:
      'Three quarks combine to form baryons. Symmetric combination gives Δ particles and Ω⁻.',
    whyItMatters: 'Predicted Ω⁻ before discovery! Confirmed quark model. Nobel Prize 1969.',
    historicalNote: 'Ω⁻ discovered at Brookhaven (1964), mass 1672 MeV - exactly as predicted',
  },
  {
    title: 'SO(10) Single Generation',
    group: 'SO(10)',
    calculation: {
      type: 'dimension',
      irrep1: [1, 0, 0, 0, 0],
      irrep1Display: '16',
    },
    physicsContext:
      'The 16 spinor representation contains ALL fermions of one generation: uᵣᵍᵇ (3), dᵣᵍᵇ (3), uₗᵣᵍᵇ (3), dₗᵣᵍᵇ (3), νₗ (1), eₗ (1), νᵣ (1), eᵣ (1). That is 3+3+3+3+1+1+1+1 = 16!',
    whyItMatters:
      'Most elegant unification! Explains family structure. Predicts right-handed neutrino → neutrino masses.',
    historicalNote: 'Georgi, Fritzsch, Minkowski (1975)',
  },
  {
    title: 'SU(5) First Generation',
    group: 'SU(5)',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0, 0, 0],
      irrep2: [0, 1, 0, 0],
      irrep1Display: '5',
      irrep2Display: '10',
    },
    physicsContext:
      'Fermions split into 5̄ (d̄ᵣᵍᵇ, e⁻, νₑ) and 10 (uᵣᵍᵇ in antisym, ū, e⁺). Higgs in 5 couples to give masses.',
    whyItMatters:
      'First realistic GUT! Predicts sin²θw = 3/8 at GUT scale. Proton decay predictions.',
    historicalNote:
      'Georgi-Glashow model (1974). Proton lifetime > 10³⁴ years ruled out minimal SU(5).',
  },
  {
    title: 'Gluon-Gluon Fusion',
    group: 'SU(3)',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 1],
      irrep2: [1, 1],
      irrep1Display: '8',
      irrep2Display: '8',
    },
    physicsContext:
      'Two gluons can fuse to create glueballs - exotic hadrons made purely of gluons with no quarks.',
    whyItMatters: 'Tests QCD in pure gauge sector. f₀(1500) and f₀(1710) are glueball candidates.',
    historicalNote: 'Predicted by QCD (1970s), experimental confirmation still ambiguous (2024)',
  },
  {
    title: 'Seesaw Mechanism',
    group: 'SO(10)',
    calculation: {
      type: 'tensor_product',
      irrep1: [1, 0, 0, 0, 0],
      irrep2: [1, 0, 0, 0, 0],
      irrep1Display: '16',
      irrep2Display: '16',
    },
    physicsContext:
      '16⊗16 contains 126 which gives Majorana mass to νᵣ. Heavy νᵣ → tiny mₐₗ via seesaw: mₐₗ ≈ m²ᴅ/Mᵣ.',
    whyItMatters:
      'Natural explanation for tiny neutrino masses! Connects to leptogenesis and matter-antimatter asymmetry.',
    historicalNote:
      'Seesaw mechanism (Minkowski 1977, Gell-Mann et al. 1979). Neutrino oscillations confirmed 1998 (Nobel 2015).',
  },
];
