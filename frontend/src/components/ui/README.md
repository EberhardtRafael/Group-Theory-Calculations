# UI Components Directory

This directory will contain shared, reusable UI components following a consistent design system.

## Structure

```
ui/
├── Button.tsx          # Button variants (primary, secondary, outline, etc.)
├── Card.tsx            # Container component
├── Input.tsx           # Form input component
├── Select.tsx          # Dropdown select component
├── Badge.tsx           # Label/badge component
├── Spinner.tsx         # Loading indicator
├── Alert.tsx           # Alert/notification component
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
```

## Coming Soon

These components will be implemented following the shadcn/ui pattern with Tailwind CSS.
