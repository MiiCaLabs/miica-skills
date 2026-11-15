# KB-06: Modern Web QA, RUM Observability, and Zero-Downtime Deployment

## 1. Effective web test pyramid

- **Strict static analysis:** TypeScript `strict: true` + `noUncheckedIndexedAccess: true`, a linter with accessibility rules (`eslint-plugin-jsx-a11y` / Angular template a11y rules) and framework rules (React Hooks/Compiler).
- **Unit and component integration tests (Vitest + Testing Library + MSW, Vitest being Angular's default runner since v22):**
  - Test real rendered behavior (accessible roles, user interactions), never private internal state or internal CSS classes.
  - Use **MSW (*Mock Service Worker*)** to intercept network calls at the `fetch`/XHR level in tests rather than mocking internal HTTP clients.
- **E2E and accessibility tests (Playwright + Axe):**
  - Run full multi-role business journeys in CI (auth, creation, network error, permissions) through **Playwright**.
  - Integrate **`@axe-core/playwright`** on key views to block obvious WCAG 2.2 AA regressions in PRs (contrast, missing labels, heading hierarchy).
- **Performance budgets (Lighthouse CI):** Block or alert in PRs when initial JS weight explodes or LCP/CLS degrade on critical routes.

## 2. RUM observability, source maps, and correlation

- **Real User Monitoring (RUM):** Collect real Core Web Vitals (`web-vitals`: LCP, **INP**, CLS, TTFB) segmented by route, device type, and deployed version.
- **Secure source map handling:**
  - Generate source maps in CI, upload them directly to the observability tool (Sentry, Datadog, Grafana Faro), then **remove the `.map` files from artifacts served in production** (or restrict access by internal IP) so business source code is not publicly exposed.
- **Correlation and privacy:**
  - Propagate the W3C **`traceparent`** header (OpenTelemetry) to the APIs/BFF to link a slow click in the browser to the slow SQL query on the backend.
  - Configure strict masking of inputs and PII fields in session replay and error breadcrumbs.

## 3. JS supply chain, containers, and *version skew*

- **npm supply chain governance (critical on the web):** principles and thresholds in `security-auditor` (reference 05). Concrete application:
  - Reproducible installs (`pnpm install --frozen-lockfile` / `npm ci`). pnpm 10+ blocks install scripts by default: keep an explicit allowlist (`onlyBuiltDependencies`) instead of re-allowing everything.
  - Minimum release age, on both the installer and the bot side: `minimumReleaseAge` (pnpm, 1 day by default in v11), `min-release-age` (npm 11.10+), `npmMinimalAgeGate` (Yarn 4.10+), `minimumReleaseAge` (Renovate). Aim for 7 days, except for security fixes.
  - CVE/malware scanning (Socket.dev, Snyk, `pnpm audit`) and a **CycloneDX SBOM** on every build.
- **Production packaging (Docker / Edge / CDN):**
  - Minimal multi-stage Docker builds (non-root user, Node.js LTS or edge runtime, **`output: 'standalone'`** mode under Next.js to drastically reduce image size).
- **Protection against *version skew* (rolling deployments):**
  - When a user keeps an SPA/Next/Angular tab open while a new version is deployed, old JS chunks may disappear and cause a `ChunkLoadError` or an out-of-sync server action error.
  - **Required solutions:** 1) Keep old hashed static assets for a grace window (CDN / S3) or enable the platform's *Skew Protection*, and 2) properly intercept chunk load errors / build mismatches in a global ErrorBoundary to offer or trigger a single soft reload (with an infinite-loop guard).
