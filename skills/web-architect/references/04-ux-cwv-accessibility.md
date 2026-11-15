# KB-04: Core Web Vitals, Enterprise Ergonomics, and Accessibility (WCAG 2.2 AA)

## 1. Core Web Vitals budgets (production thresholds)

- **LCP (*Largest Contentful Paint*) < 2.5 s:**
  - Preload the hero image/font (`fetchpriority="high"`, AVIF/WebP formats with explicit `width`/`height`), avoid client request waterfalls before first paint (streaming SSR or route prefetch).
- **INP (*Interaction to Next Paint*) < 200 ms:**
  - The official replacement for FID: measures responsiveness across the whole session.
  - Avoid JS *Long Tasks* > 50 ms on the main thread (massive one-shot hydration, huge JSON parsing, non-virtualized tables). Use **`@defer`** (Angular), granular **`<Suspense>`** (React/Next), and **Web Workers** for heavy computations (CSV exports, parsing, complex charts).
- **CLS (*Cumulative Layout Shift*) < 0.1:**
  - Always reserve space for images, banners, and skeletons; use `next/font` / `font-display: swap` with adjusted metrics to avoid layout jumps when fonts load.

## 2. UI scalability, forms, and i18n

- **Virtualization and splitting:** Virtualize any list/grid above ~100 items (`@tanstack/virtual` or Angular CDK Virtual Scroll); split code by route and load rich editors, PDF viewers, and chart libraries on demand.
- **Enterprise data ergonomics:**
  - *Optimistic UI* with clear visual rollback only on low-failure-rate actions.
  - Empty states, actionable errors (*Retry*), and preservation of entered form data across a network failure or session reconnection.
- **Form validation:** React Hook Form + Zod (React/Next) or typed reactive / Signal Forms (Angular), with clear synchronous validation tied to fields and an accessible error summary at the top of the form.
- **Internationalization (`Intl`):** Format dates, time zones, numbers, and currencies exclusively through the native **`Intl.DateTimeFormat`** / **`Intl.NumberFormat`** APIs (avoid `moment.js`), and anticipate text expansion (+30% in German/French) and RTL support if needed.

## 3. Strict accessibility (WCAG 2.2 AA / RGAA / EAA)

- **Semantic HTML first:** An action button is a `<button>`, a navigation is an `<a href>`. Never turn clickable `<div>`s into controls with heavy ARIA when the native element exists.
- **Focus management and keyboard navigation:**
  - The whole application must be usable by keyboard alone (`Tab`, `Shift+Tab`, `Escape`, arrows in menus/tabs).
  - Use the native `<dialog>` or proven accessible primitives (Radix UI / React Aria / Angular CDK A11y) that guarantee a *focus trap* in modals and focus restoration on close.
  - In an SPA, announce or move focus to the main title (`<h1>`) or a *live region* on a virtual page change.
- **Contrast and preferences:** Text contrast >= **4.5:1** (charts/interactive borders >= **3:1**), visible focus (`:focus-visible`) never removed (`outline: none` forbidden without a clear replacement), and respect for `@media (prefers-reduced-motion: reduce)`.
