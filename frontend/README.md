# Group Theory Calculator - Next.js Frontend

Modern Next.js 14 frontend with TypeScript and Tailwind CSS.

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 18** - UI library
- **Axios** - API client
- **Zustand** - State management (to be implemented)
- **D3.js** - Visualizations (to be implemented)
- **Three.js** - 3D graphics (to be implemented)

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (/)
│   ├── calculator/
│   │   └── page.tsx       # Calculator page (/calculator)
│   └── globals.css        # Global styles
│
├── components/
│   ├── ui/                # Shared UI components (Button, Input, Card, etc.)
│   ├── layout/            # Layout components (Header, Footer)
│   ├── pages/             # Page-specific components
│   ├── calculators/       # Calculator form components
│   └── diagrams/          # Visualization components (coming soon)
│
├── services/
│   └── api.ts             # API client
│
├── hooks/                 # Custom React hooks (to be added)
├── store/                 # Zustand stores (to be added)
├── types/                 # TypeScript types (to be added)
└── utils/                 # Utility functions (to be added)
```

## Component Guidelines

### Use UI Toolkit Components

Always use components from `@/components/ui` instead of raw HTML:

```tsx
// ❌ Don't
<button className="bg-blue-600 text-white...">Click me</button>

// ✅ Do
import { Button } from '@/components/ui'
<Button variant="primary">Click me</Button>
```

### Component Patterns

1. **Client Components** - Mark with `'use client'` when using:
   - State (`useState`, `useReducer`)
   - Effects (`useEffect`)
   - Event handlers (`onClick`, etc.)
   - Browser APIs

2. **Server Components** - Default, use when:
   - Fetching data
   - No interactivity needed
   - SEO important

3. **Extract Complex JSX** - Keep components focused:
   ```tsx
   // Extract map callbacks into components
   const items = data.map(item => <ItemCard key={item.id} item={item} />)
   ```

## Styling

Using Tailwind CSS utility classes. Custom theme colors:

```js
primary: {
  500: '#3b82f6',  // Blue
  600: '#2563eb',
  700: '#1d4ed8',
}
```

## API Integration

API calls go through `services/api.ts`:

```tsx
import { api } from '@/services/api'

const response = await api.calculateTensorProduct('SU3', [1,0], [1,0])
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Coming Soon

- [ ] React Query for API state management
- [ ] D3.js Dynkin diagram visualizations
- [ ] Three.js 3D multiplet viewer
- [ ] WebSocket real-time updates
- [ ] User authentication (optional)
- [ ] Save/share calculations

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
