# LaTeX / Math Rendering Guide

The Group Theory Calculator now includes a reusable `<Math>` component for rendering LaTeX formulas throughout the application using KaTeX.

## Quick Start

```tsx
import { Math } from '@/components/ui';

// Inline math
<Math>3 \otimes 3 = 6 \oplus \bar{3}</Math>

// Block (centered) math
<Math block>E = mc^2</Math>
```

## Component API

```typescript
interface MathProps {
  children: string;     // LaTeX formula
  block?: boolean;      // Display mode (default: false)
  className?: string;   // Additional CSS classes
}
```

## Common Group Theory Symbols

### Binary Operations
| Symbol | LaTeX | Usage |
|--------|-------|-------|
| ⊗ | `\otimes` | Tensor product: `3 \otimes 3` |
| ⊕ | `\oplus` | Direct sum: `6 \oplus \bar{3}` |
| × | `\times` | Cartesian product: `SU(3) \times U(1)` |

### Representations
| Symbol | LaTeX | Usage |
|--------|-------|-------|
| 3̄ | `\bar{3}` | Conjugate rep: `\bar{3}` |
| **3** | `\mathbf{3}` | Bold rep: `\mathbf{3}` |
| 10̄ | `\overline{10}` | Overline: `\overline{10}` |
| 3* | `3^*` | Dual rep: `3^*` |

### Greek Letters
| Symbol | LaTeX | Usage |
|--------|-------|-------|
| α, β, γ | `\alpha, \beta, \gamma` | Simple roots |
| Δ | `\Delta` | Root difference |
| λ, μ | `\lambda, \mu` | Weights |

### Groups
| Symbol | LaTeX | Usage |
|--------|-------|-------|
| SU(3) | `SU(3)` | Special unitary |
| SO(10) | `SO(10)` | Special orthogonal |
| E₆ | `E_6` | Exceptional group |

### Sets and Special Symbols
| Symbol | LaTeX | Usage |
|--------|-------|-------|
| ℂ | `\mathbb{C}` | Complex numbers |
| ℝ | `\mathbb{R}` | Real numbers |
| ℤ | `\mathbb{Z}` | Integers |
| ∈ | `\in` | Element of |
| ⊂ | `\subset` | Subset |

## Usage Examples

### Tensor Product Results
```tsx
<Math>3 \otimes 3 = 6 \oplus \bar{3}</Math>
<Math>8 \otimes 8 = 1 \oplus 8 \oplus 8 \oplus 10 \oplus \overline{10} \oplus 27</Math>
```

### Group Representations
```tsx
<Math>\mathbf{5} \otimes \mathbf{10} = \mathbf{45} \oplus \mathbf{\bar{5}}</Math>
```

### Highest Weights
```tsx
<Math>\lambda = (1, 0, 0, 0, 0)</Math>
```

### Branching Rules
```tsx
<Math>E_6 \to SO(10) \times U(1)</Math>
<Math>\mathbf{27} \to \mathbf{16}_{-1} \oplus \mathbf{10}_2 \oplus \mathbf{1}_{-4}</Math>
```

### Root Systems
```tsx
<Math>\alpha_1, \alpha_2, \ldots, \alpha_r</Math>
<Math>[\alpha_i, \alpha_j] = A_{ij}</Math>
```

### Block Equations
```tsx
<Math block>
  \text{dim}(\lambda) = \prod_{\alpha > 0} \frac{(\lambda + \rho, \alpha)}{(\rho, \alpha)}
</Math>
```

## Replacing Icon-Based Symbols

**Before (using icons):**
```tsx
<Icon name="tensor" /> {/* custom icon */}
```

**After (using LaTeX):**
```tsx
<Math>\otimes</Math>
```

## Integration Examples

### In List Items
```tsx
<li>
  Tensor product: <Math>3 \otimes 3 = 6 \oplus \bar{3}</Math>
</li>
```

### In Buttons
```tsx
<Button>
  Calculate <Math>\otimes</Math>
</Button>
```

### In Cards
```tsx
<Card title="Representation Theory">
  The fundamental rep <Math>\mathbf{3}</Math> of <Math>SU(3)</Math>
  has dimension 3.
</Card>
```

### In Tables
```tsx
<td><Math>\mathbf{3}</Math></td>
<td><Math>\bar{3}</Math></td>
<td><Math>8</Math></td>
```

## Styling

The Math component respects your Tailwind classes:

```tsx
{/* Larger math */}
<Math className="text-2xl">E = mc^2</Math>

{/* Colored math */}
<Math className="text-blue-600">\alpha + \beta</Math>

{/* Centered block with margin */}
<Math block className="my-4">
  SU(3) \to SU(2) \times U(1)
</Math>
```

## Performance Notes

- KaTeX is ~5x faster than MathJax
- Bundle size: ~150KB (gzipped)
- Renders on initial page load (no flash)
- Works with SSR (Next.js)

## Fallback for Complex Formulas

For very complex formulas not supported by KaTeX, you can optionally fallback to MathJax, but KaTeX handles ~99% of group theory notation.

## Resources

- [KaTeX Documentation](https://katex.org/)
- [Supported Functions](https://katex.org/docs/supported.html)
- [KaTeX vs MathJax Comparison](https://www.intmath.com/cg5/katex-mathjax-comparison.php)
