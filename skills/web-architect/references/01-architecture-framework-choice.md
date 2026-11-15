# KB-01: Framework Trade-offs, BFF Architecture, and Monorepo

## 1. Pragmatic trade-off matrix (2026)

The worst enterprise web anti-pattern is imposing a single framework for every use case:

| Primary need | Recommended stack | Why (and when to avoid) |
| :--- | :--- | :--- |
| **Marketing sites, documentation, blogs, SEO e-commerce storefronts** | **Astro (5/6)** | Zero client JS by default, typed *Content Layer*, *Server Islands* for dynamic blocks, and native CSP (v6). **Avoid** for a highly interactive SaaS workspace like Figma/Jira. |
| **Internal business app / dashboard behind authentication (no SEO)** | **React (Vite SPA) + TanStack Router/Query** or **Angular 21+** | Zero SSR/hydration/server-cache complexity, trivial static CDN deployment behind a BFF/API. **Avoid** the Next.js App Router if 100% of routes require login and need no SEO. |
| **Hybrid portal with SEO + dynamic e-commerce + full-stack React** | **Next.js (15/16 App Router)** | RSC, streaming SSR, Turbopack (default in v16), *Cache Components* (`use cache` + PPR). **Watch** the operational complexity of caching and the coupling to a Node/Edge server. |
| **Large typed business applications, structured multi-team** | **Angular (21+ Zoneless)** | Standardized architecture (DI, Router, Forms, HTTP), native **Signals + Zoneless** (no `zone.js`), strict control and long-term maintenance. **Avoid** for small lightweight landing pages. |

## 2. The BFF pattern (*Backend-for-Frontend*)

For critical applications handling APIs and OIDC/OAuth authentication:
- **Principle:** The browser ideally talks only to a **BFF** (Next.js route handlers/Server Actions, Astro SSR endpoints, or a light reverse proxy such as Envoy/OAuth2-Proxy/Node/Rust) on the same site (or subdomain).
- **Benefits:** OAuth tokens stay server-side (never exposed to browser JS), microservice calls are aggregated into one request, DTOs are adapted to the exact UI need, and sensitive fields are filtered before serialization.

## 3. Modular layout and monorepo (vs micro-frontends)

- **Structure by business domain (Feature-Sliced / domain-driven frontend):**
```text
web-monorepo/
├── apps/
│   ├── portal/            # Main app (Next.js or Angular)
│   └── marketing/         # Public site / docs (Astro)
└── packages/
    ├── design-system/     # Shared accessible UI components + CSS tokens
    ├── api-contracts/     # Shared OpenAPI types / Zod schemas
    └── auth-client/       # Session utilities & error handling
```
- **Micro-frontend governance (Module Federation):** **Do not adopt micro-frontends below 5 to 6 fully independent teams**. The cost in dependency duplication, UX/design-system inconsistency, state sharing, and CI complexity far outweighs the benefits for 90% of companies; prefer an **Nx/Turborepo monorepo** deployed as one coherent artifact.
