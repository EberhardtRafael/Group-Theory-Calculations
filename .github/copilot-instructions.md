# Copilot Instructions

## Code Style Preferences
- **Prefer arrow functions** for component definitions: `const MyComponent = () => { ... }` with `export default MyComponent`
- This enables cleaner imports without destructuring: `import MyComponent from './MyComponent'`
- However, function declarations are acceptable when there's a good reason (hoisting, readability, etc.)
- Biome handles formatting automatically (semicolons, spacing, quotes)
- **Never use semantic heading tags** (`<h1>`, `<h2>`, `<h3>`, etc.) - use styled `<div>` elements instead with Tailwind classes like `text-4xl font-bold`
- **Never use raw anchor tags** (`<a>`) - always use Next.js `Link` component from `next/link` for both internal and external links
- **Always use translations** - never hardcode user-facing text. Use `useTranslations` hook from `next-intl` and add strings to `/messages/en.json`

## Toolkit-First Development (Required)
- Always use existing shared components from `src/components/ui` whenever possible.
- Before writing raw HTML tags in feature code (`button`, `a`, `ul`, `ol`, `li`, etc.), check whether a toolkit component already exists for that use case.
- Prefer extending existing toolkit APIs over creating parallel one-off implementations.

## Component Architecture Rules (CRITICAL)

### One Component, One Return (Absolute Rule)
- **NEVER define multiple function components in the same file that return JSX**.
- Each file should export ONE main component with ONE return statement.
- If you write a helper function that returns JSX inside a component file, STOP. Extract it to a separate file.
- Internal functions are OK if they return primitive values (string, number, boolean), but NOT JSX elements.

### Container vs Presentation Pattern (Required)
- **Container components** (orchestrators): Handle state, side effects, data fetching, business logic. Pass clean props to presentation components.
- **Presentation components** (slices): ONLY receive data via props and render UI. NO state manipulation, NO data transformation, NO async logic.
- If a component is doing BOTH data manipulation AND rendering, split it into:
  1. Container that handles logic and passes clean props
  2. Presentation component(s) that just render

### Component Decomposition Rules
- Keep components focused and composable.
- Prefer one main JSX return per component and extract conditional branches or repeated blocks into **separate component files**.
- If markup grows complex or repeated, extract it into a dedicated reusable component in its own file.
- **Avoid Deep Nesting ("Closing Tag Ladder")**: When you see many levels of closing tags stacked vertically (e.g., `</div></div></Card>`), it signals the component is too complex. Extract deeply nested blocks, especially inside `.map()` callbacks, into dedicated components. A `.map()` callback with >30 lines of JSX should typically become its own component.
- **Use the Orchestrator + Slice Pattern**: When a component starts rendering multiple distinct UI sections (header, list rows, summary, actions, etc.), split it into:
	1) an **orchestrator component** that composes sections,
	2) small **slice components** in separate files that each own one section.
	The orchestrator should mostly wire props and layout; slice components should contain section-specific markup.
- **Decomposition Triggers**: Refactor when any of these appear:
	- more than ~3 visual sections in one component,
	- repeated nested wrappers that create a closing-tag ladder,
	- `.map()` callbacks with complex markup (>30 lines),
	- mixed responsibilities (formatting, business display rules, and layout) in one JSX block,
	- **ANY internal function that returns JSX**.
- **Component Boundaries**: Keep each slice component single-purpose and predictable:
	- prefer one responsibility per component,
	- keep data shape consistent with source models unless a clear adapter is introduced,
	- place mapped display arrays/constants near the slice that consumes them,
	- avoid pushing conditional rendering complexity back into the orchestrator.
- **Component Unification Pattern (Configuration-Driven Factory)**: When multiple components share the same layout/shell and differ mainly by variant-specific content or copy, unify them behind one factory/coordinator component.
	- Use one entry component with a `variant` prop and a `variantConfigs` map.
	- Keep shared wrapper/layout in the factory; move variant-specific rendering into config-driven renderers.
	- Prefer thin compatibility wrappers only when needed for gradual migration.
	- Use this pattern for **variants of one section** (loading/error/empty/success), not for unrelated page sections.
	- If a component contains multiple distinct sections, prefer **Orchestrator + Slice** instead of a variant factory.

## State Communication Rules (Required)
- Never use browser or global event listeners (`window.addEventListener`, `document.addEventListener`, `CustomEvent`, etc.) for app state communication.
- For cross-component state and signals, use container state via React Context/provider patterns.
- Prefer explicit state flow through context/hooks over pub/sub-style event broadcasting.

## Clean Code & Maintainability
- Apply appropriate design patterns where they improve readability and maintainability.
- Prioritize code that is elegant, readable, maintainable, and understandable by humans.
- Avoid duplication (DRY). If similar structures appear more than once, refactor into reusable components/helpers.
- Keep implementations clean and low-bureaucracy: minimal, clear abstractions over scattered ad hoc code.
- **Extract Mapped Data (Use Judgment)**: 
  - **INLINE the map** for simple, obvious cases (clean JSX, 1-3 props, straightforward logic).
  - **EXTRACT to constant** when the map operation is complex, has significant conditional logic, or when the extracted name adds meaningful clarity.
  - Examples of when to keep INLINE: `{items.map(item => <Component key={item.id} name={item.name} />)}`
  - Examples of when to EXTRACT: complex transformations, multiple nested maps, conditional filtering + mapping, business logic embedded in map.
  - **Default to inline for simplicity unless extraction clearly improves readability.**
- **Prefer immutability**: Default to `const` over `let`. When a value needs to be derived conditionally or from a collection, use expressions and functional patterns (ternary, map, filter, reduce, flatMap, etc.) rather than imperative reassignment. Reserve `let` for legitimate accumulation, loops, or complex multi-step derivations where functional approaches would harm clarity.

## Styling & Consistency
- Reuse existing component primitives and variants for consistent behavior and styling.
- Avoid one-off UI patterns when a shared component can be used.
- Keep visual and interaction patterns aligned with the existing design system.

## Proactive Refactor Suggestions
- When editing any area, actively look for nearby opportunities to improve structure based on the rules above.
- Proactively suggest project-wide refactors when you identify repeated anti-patterns.

---

## Project-Specific Guidelines

### Group Theory Calculator Frontend

#### Component Organization
```
src/
├── components/
│   ├── ui/                 # Shared toolkit components (Button, Card, Input, etc.)
│   ├── diagrams/           # Visualization components (Dynkin, Hasse, Multiplet)
│   ├── calculators/        # Calculation form components
│   └── layout/             # Layout components (Header, Footer, Sidebar)
├── pages/                  # Route-level components
├── hooks/                  # Custom React hooks
├── services/               # API clients and external services
├── store/                  # State management (Zustand stores)
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

#### Mathematics & Physics UI Patterns
- Use MathJax for LaTeX rendering - wrap in appropriate components
- D3.js visualizations should be in dedicated diagram components
- Three.js 3D visualizations should use `@react-three/fiber` wrapper components
- Keep physics/math domain logic separate from UI rendering
- Extract calculation display formatting into utility functions

#### API Integration
- All API calls go through `services/api.ts`
- Use React Query or similar for async state management (to be added)
- Handle loading/error states consistently across calculation components
- Cache expensive calculations when appropriate

#### Performance Considerations
- Lazy load heavy visualization libraries (D3, Three.js)
- Memoize expensive calculations in components
- Consider WebWorkers for heavy client-side computations
- Virtualize long lists of weights/irreps

#### TypeScript Best Practices
- Define clear interfaces for all physics objects (Group, Irrep, Weight, etc.)
- Use discriminated unions for calculation result types
- Avoid `any` - use `unknown` and type guards when needed
- Export types from feature modules for reuse

#### Testing Strategy
- Unit test calculation logic and utilities
- Component tests for UI interactions
- Integration tests for calculator workflows
- Mock API responses for consistent test data
