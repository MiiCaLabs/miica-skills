---
name: web-architect
description: Architecture, engineering standards, and production patterns for enterprise web applications using React (Vite SPA), Next.js (15/16 App Router), Astro (5/6 Islands), or Angular (20/21+ Zoneless & Signals). Use when designing, scaffolding, auditing, or implementing web apps involving framework selection, BFF/SSR/CSR rendering, state management, Core Web Vitals (INP/LCP/CLS), WCAG 2.2 AA accessibility, OAuth BFF security, CSP/DAL hardening, Playwright/Vitest QA, or zero-downtime CI/CD.
---

# Enterprise Web Architect (React / Next.js / Astro / Angular)

Architecture guide and enterprise engineering standards for designing, securing, optimizing, and deploying critical web applications with **React, Next.js, Astro, and Angular**, using a pragmatic approach focused on performance, server-side security, and multi-team maintainability.

## When to Use

- Choosing a framework and scoping the architecture of an enterprise web application (editorial/marketing site, hybrid customer portal, complex SaaS, or internal tool).
- Designing the monorepo split, rendering strategies (SSG, PPR/Cache Components, SSR, CSR, Islands), and state management (server state vs client state).
- Optimizing Core Web Vitals (LCP, INP, CLS), HTTP/CDN caching without cross-user leaks, and WCAG 2.2 AA accessibility.
- Security hardening: BFF architecture (`HttpOnly` cookies), securing the Data Access Layer (DAL) on Server Components/Server Actions, strict nonce-based CSP, and XSS/CSRF defense.
- Setting up tests (Vitest + MSW + Playwright + Axe), RUM observability (private source maps, OpenTelemetry), and deployments without *version skew*.

## Sizing and complexity trade-off (anti over-engineering)

Choose the matching profile explicitly at the start:

- **Profile A, content site / focused app (maximum simplicity):** Astro for content/SEO (zero JS by default + targeted islands) or a modular React/Angular SPA behind a reverse proxy/single API. No heavy Redux/NgRx, no micro-frontends, no complex multi-level cache.
- **Profile B, SaaS platform / critical enterprise portal:** Monorepo structured by domains (*Feature-Sliced* / Nx / Turborepo), authenticated BFF, end-to-end typed API contracts, fine-grained caching with targeted invalidation, correlated RUM observability, and multi-role Playwright E2E tests.

## Reference knowledge bases

Before answering or generating code, read only the relevant files in `references/`:

- `references/01-architecture-framework-choice.md`: Honest trade-off matrix (Astro 5/6 vs React SPA vs Next.js 15/16 vs Angular 21+), BFF architecture, modular / monorepo organization, and when to refuse micro-frontends.
- `references/02-rendering-state-data.md`: Rendering strategies (SSG, PPR/Cache Components `use cache`, SSR, CSR, Server Islands), strict separation of server state vs client state vs URL state, modern reactivity (React Compiler 1.0, Angular Zoneless + Signals), and hydration pitfalls.
- `references/03-api-network-caching-resilience.md`: Typed contracts + runtime validation (Zod/Valibot), `Cache-Control` / CDN strategy (preventing session leaks in cache), resilience (`AbortController`, retries, real-time batching), and direct uploads to object storage.
- `references/04-ux-cwv-accessibility.md`: Core Web Vitals budgets (LCP < 2.5 s, INP < 200 ms, CLS < 0.1), splitting (`@defer`, `Suspense`, virtualization), robust forms, i18n (`Intl`), and WCAG 2.2 AA / EAA accessibility.
- `references/05-security-auth-headers.md`: BFF `HttpOnly` cookie auth vs SPA PKCE, SSR/DAL hardening (never rely on `proxy.ts`/`middleware.ts` alone for auth), Server Action security, nonce-based CSP, Trusted Types, and sanitization.
- `references/06-qa-observability-cicd.md`: Vitest + MSW + Playwright + Axe pyramid, Lighthouse CI, RUM + private source maps + OpenTelemetry, npm supply chain governance, and deployment with *version skew* protection.

## Workflow

1. **Qualify the profile (A or B) and pick the right tool:** Validate the framework choice against the real need (SEO content vs interactive app behind login vs dense business platform) without yielding to fashion.
2. **Read the targeted references:** Load only the `references/0X-*.md` files relevant to the request.
3. **Produce the architecture or implementation:**
   - Strictly separate server data (async cache) from UI/URL state.
   - Put all authentication and authorization checks in the server-side data access layer (DAL/API), never only in a routing middleware or in the browser.
   - Guarantee strict TypeScript typing (`strict: true`) and validation of network inputs/outputs.
4. **Check compliance:** Verify Core Web Vitals (INP/bundle size), absence of client-side secret leaks, headers/CSP, keyboard/screen-reader accessibility, and continuous deployment handling.

## Gotchas

- Never use `middleware.ts` / `proxy.ts` (Next.js) or SPA router guards as the sole security barrier: always verify session and permissions in the Data Access Layer (DAL) and in every Server Action (`"use server"`).
- Never store OAuth tokens (`access_token`, `refresh_token`) in `localStorage` or `sessionStorage` if a BFF with `HttpOnly; Secure; SameSite=Lax` cookies is possible.
- Never ship a full React/Angular runtime on a purely editorial/marketing site: use Astro (zero JS by default).
- Never duplicate the API cache in a global store (Redux/Zustand/NgRx) or recompute derived state in `useEffect`: use TanStack Query / `httpResource` / RSC and direct computation or `computed()`.
- Never use Zone.js on a new Angular 21+ project: start in **Zoneless + Signals + `OnPush`** mode.
- Never route large file uploads through Server Actions or serverless functions (payload limits and timeouts): use pre-signed URLs to S3/R2/GCS.
