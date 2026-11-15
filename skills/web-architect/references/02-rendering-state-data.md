# KB-02: Rendering Strategies, State Management, and Modern Reactivity

## 1. Choosing the right rendering mode per route

Do not make everything dynamic SSR by default:
- **SSG / static pre-rendering:** Stable public pages, documentation, low-volatility product pages (CDN latency < 50 ms).
- **Hybrid (Next.js 16 PPR / Cache Components or Astro 5/6 Server Islands):** HTML shell cached at the CDN + dynamic holes streamed per request (cart, user avatar, personalized pricing) through `<Suspense>` or `server:defer`.
- **Dynamic SSR:** Only if the initial HTML depends on the request for real-time SEO or critical permissions.
- **CSR (client-side rendering):** Admin areas, interactive editors, real-time consoles behind authentication.

## 2. Strict state taxonomy (zero duplication)

| State category | Suitable tool | Anti-pattern to ban |
| :--- | :--- | :--- |
| **Server state (async cache)** | **TanStack Query** (React/Angular), **RSC** (Next.js), **`httpResource`** / RxJS | Copying API responses into Redux/Zustand/NgRx to "manage a home-made cache". |
| **Navigation / shareable state** | **URL SearchParams** (filters, sorting, pagination, active tab, search) | Storing filters and the current page in local memory (breaks the Back button and URL sharing). |
| **Light global UI state** | **Zustand / targeted Context** (React), **Signal services** (Angular), **Nano Stores** (Astro cross-islands) | Putting the whole application in a monolithic store that causes global re-renders. |
| **Local component state** | `useState` / `signal()` | Lifting ephemeral state (dropdown open, hover) to the global level. |

## 3. Reactivity standards by framework (2026)

- **React 19 + React Compiler 1.0:**
  - Enable the **React Compiler** (`reactCompiler: true` under Next.js 16 / Babel Vite plugin) after fixing the violations reported by `eslint-plugin-react-hooks` (*Rules of React*).
  - Stop writing `useMemo` / `useCallback` / `React.memo` by hand for micro-optimization in new code; reserve `useMemo` for stable dependencies of rare effects.
  - **Forbidden:** Syncing derived state through `useEffect` + `setState` (double render and desynchronization); always compute directly during render.
- **Angular 21+ (Zoneless and Signals):**
  - Start without `zone.js` (`provideZonelessChangeDetection()` / default in v21+) with **`ChangeDetectionStrategy.OnPush`** everywhere.
  - Use **`signal()`**, **`computed()`**, and *Signal Inputs/Outputs* (`input()`, `output()`) for UI state; confine **RxJS** to complex async flows (`switchMap` cancellation, websockets with `bufferTime` before updating a Signal).
- **Astro (Islands architecture):**
  - Keep HTML static by default. Hydrate interactive islands sparingly: prefer `client:visible` or `client:idle`, and use `client:load` only for immediately critical interactive elements *above the fold*.

## 4. SSR hydration pitfalls and browser storage

- **Hydration mismatch (Next.js / Angular SSR):** Never read `window`, `localStorage`, `Date.now()`, or an unstable browser locale format directly in the initial SSR/client render without explicit synchronization (`suppressHydrationWarning` reserved for timestamps, or deferred post-mount rendering).
- **Offline web (IndexedDB / OPFS):** For occasional offline use in the browser, prefer **IndexedDB** (via a typed `idb` / `Dexie` wrapper) in a **Web Worker** so the UI thread is not blocked, knowing the browser may purge storage in private browsing or under disk pressure.
