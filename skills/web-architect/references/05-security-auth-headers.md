# KB-05: Web Security, BFF Authentication, SSR Hardening, and CSP

## 1. Authentication: BFF cookies vs SPA PKCE

- **Recommended enterprise standard (BFF):**
  - The BFF handles the OAuth 2.0 / OIDC + PKCE flow with the IdP (Entra ID, Okta, Keycloak), keeps the `access_token` and `refresh_token` server-side / in an encrypted session, and gives the browser only an **`HttpOnly; Secure; SameSite=Lax; Path=/` session cookie**.
  - **Zero tokens in `localStorage` or `sessionStorage`:** A single third-party XSS script (analytics, compromised dependency) immediately exfiltrates any JavaScript-readable token.
- **If pure SPA without a BFF (purely static architecture):** Use OAuth 2.0 + PKCE with tokens stored **exclusively in JS memory** (or an isolated Service Worker) and short-lived *refresh token rotation* on the IdP side.

## 2. Critical security of full-stack frameworks (Next.js / Astro SSR / Angular SSR)

- **Never trust the middleware / `proxy.ts` alone for security:**
  - In Next.js 16 (`proxy.ts`, formerly `middleware.ts`), the proxy layer is for light routing, UX redirects, and headers, **never the sole access control** (historical routing-bypass risk, cf. the lessons of the middleware flaws).
  - **Golden rule, Data Access Layer (DAL):** Every server function that reads or writes data must itself verify the cryptographic session and the current user's RBAC/ABAC rights.
- **Hardening Server Actions (`"use server"` Next.js / Astro Actions):**
  - A Server Action is technically a **public HTTP POST endpoint** that can be invoked directly with any forged JSON payload.
  - Mandatory in **every** Server Action: 1) verify authentication + authorization on the targeted resource (IDOR), 2) validate all arguments with Zod/Valibot, 3) never return a raw DB object (strict DTO).
- **Client / server partitioning:**
  - Never expose secrets in public-prefixed variables (`NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*`).
  - Use `server-only` (Next.js) in DAL modules and pass only strictly necessary fields to Client Components (avoid serializing full user objects in the HTML/RSC payload).

## 3. XSS defense, strict CSP, and HTTP headers

- **Modern Content Security Policy (CSP):**
  - On SSR applications: generate a **random per-request nonce** for `script-src 'nonce-...' 'strict-dynamic'` without `unsafe-inline` or `unsafe-eval`. (Astro 6 offers stable native declarative CSP support.)
  - Enable **Trusted Types** (`require-trusted-types-for 'script'`) on critical applications to structurally block DOM-XSS.
- **Sanitization and injection:**
  - Ban `dangerouslySetInnerHTML` (React), `set:html` (Astro), and `[innerHTML]` (Angular) without passing through a strictly configured **DOMPurify**.
  - Validate user-supplied URLs before injecting them into `href`/`src` (allow only `https:` / `http:` / relative; block `javascript:` and `data:text/html`).
- **Headers and CSRF:**
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: frame-ancestors 'self'` (anti-clickjacking).
  - For cookie-authenticated mutations: `SameSite=Lax` + `Origin`/`Host` header verification or a CSRF token on endpoints not natively covered.
