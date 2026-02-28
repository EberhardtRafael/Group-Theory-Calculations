/**
 * @deprecated Use the <Math> component with LaTeX instead for mathematical notation.
 *
 * @example
 * // Old (deprecated):
 * import Icon from '@/components/ui/Icon';
 * <Icon name="tensor" />
 *
 * // New (recommended):
 * import { Math } from '@/components/ui';
 * <Math>\otimes</Math>
 *
 * See: frontend/docs/latex-guide.md for full LaTeX usage guide
 */
export const MATH_ICONS = {
  // Arrows
  arrow: '→',
  doubleArrow: '⇒',
  leftArrow: '←',

  // Operations
  tensor: '⊗',
  direct: '⊕',
  times: '×',

  // Groups
  'SO(10)': 'SO(10)',
  'SU(5)': 'SU(5)',
  'SU(3)': 'SU(3)',
  'SU(2)': 'SU(2)',
  'U(1)': 'U(1)',
  'SU(4)': 'SU(4)',
  E6: 'E₆',
  E7: 'E₇',
  E8: 'E₈',
  F4: 'F₄',
  G2: 'G₂',

  // Subscripts
  Y: 'ʏ',

  // Common symbols
  cross: '⊗',
  sum: '⊕',
  equiv: '≡',
  approx: '≈',
} as const;

export type MathIconName = keyof typeof MATH_ICONS;
