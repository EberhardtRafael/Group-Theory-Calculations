# UI Components Directory

This directory will contain shared, reusable UI components following a consistent design system.

## Structure

```
ui/
├── Alert.tsx           # Alert/notification component
├── Button.tsx          # Button variants (primary, secondary, outline, etc.)
├── Card.tsx            # Container component
├── Icon.tsx            # Icon component with Lucide React
├── Input.tsx           # Form input component
├── Math.tsx            # LaTeX formula renderer (KaTeX)
├── Radio.tsx           # Radio button component
├── Select.tsx          # Dropdown select component (coming soon)
├── Badge.tsx           # Label/badge component (coming soon)
├── Spinner.tsx         # Loading indicator (coming soon)
└── index.ts            # Barrel export
```

## Component Guidelines

### Button Component
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

### Card Component
```typescript
interface CardProps {
  title?: string
  subtitle?: string
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}
```

### Math Component
```typescript
interface MathProps {
  children: string        // LaTeX formula string
  block?: boolean         // Display as block (centered) or inline
  className?: string
}
```

Renders LaTeX formulas using KaTeX. Use for mathematical notation throughout the site.

**Examples:**
```tsx
// Inline math
<Math>3 \otimes 3 = 6 \oplus \bar{3}</Math>

// Block math (centered, display mode)
<Math block>E = mc^2</Math>

// Greek letters
<Math>\alpha, \beta, \gamma</Math>

// Representations
<Math>\mathbf{3} \otimes \mathbf{\bar{3}} = \mathbf{8} \oplus \mathbf{1}</Math>
```

## Usage Examples

```tsx
// Instead of:
<button className="bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>

// Use:
<Button variant="primary">Click me</Button>

// Instead of:
<div className="bg-white rounded-lg shadow-md p-6">
  <h2>Title</h2>
  <p>Content</p>
</div>

// Use:
<Card title="Title">
  <p>Content</p>
</Card>

// Instead of: raw LaTeX strings
<div>3 \otimes 3 = 6 \oplus \bar{3}</div>

// Use:
<Math>3 \otimes 3 = 6 \oplus \bar{3}</Math>
```

## LaTeX Symbols Reference

Common symbols for group theory:

| Symbol | LaTeX | Meaning |
|--------|-------|---------|
| ⊗ | `\otimes` | Tensor product |
| ⊕ | `\oplus` | Direct sum |
| 3̄ | `\bar{3}` | Conjugate representation |
| α, β | `\alpha, \beta` | Greek letters |
| **3** | `\mathbf{3}` | Bold representation |
| ℂ, ℝ | `\mathbb{C}, \mathbb{R}` | Number sets |

## Coming Soon

These components will be implemented following the shadcn/ui pattern with Tailwind CSS.
