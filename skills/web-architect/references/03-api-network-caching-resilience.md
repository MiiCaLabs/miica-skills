# KB-03: API Contracts, HTTP/CDN Caching, and Network Resilience

## 1. Typed contracts and validation at the boundary

- **Zero blind trust in network JSON:** TypeScript is erased at runtime. Generate types from **OpenAPI / GraphQL / Protobuf** (or share schemas through tRPC/Zod in a monorepo) and validate critical payloads with **Zod / Valibot** at the input/output boundary, so API drift is detected immediately instead of silently crashing components.

## 2. HTTP caching, Next.js 16, and the deadly CDN trap

- **Cache-Control rules:**
  - *Hashed built assets (`/assets/app.8f3a1.js`, `/_next/static/*`):* `Cache-Control: public, max-age=31536000, immutable`.
  - *SPA entry point (`index.html`):* `Cache-Control: no-cache` (systematic ETag revalidation to get the latest deployed version).
  - *Public SSR/ISR content:* `s-maxage` + `stale-while-revalidate` with targeted invalidation (`revalidateTag` / `updateTag` under Next.js 16, with *opt-in* caching through `use cache`).
- **Critical trap (cache poisoning / CDN session leak):**
  - **Never** put a shared CDN cache (`public`, `s-maxage`) in front of an SSR route that reads session cookies or `Authorization` headers without setting `Cache-Control: private, no-store` (or a strict `Vary` key and a clean separation of public shells vs private islands). A mistake here exposes user A's data to user B.

## 3. Network resilience and real time

- **Cancellation and race conditions:** Always pass an **`AbortSignal`** (native `AbortController`, built into TanStack Query and RxJS `switchMap`) on live searches or page changes, so a slow earlier response does not overwrite the current view.
- **Controlled retries:** Retry with *exponential backoff + jitter* only on transient network errors / `502`/`503`/`504`/`429` (honoring `Retry-After`); **never** on `400`, `401`, `403`, `404`, `422`.
- **Real-time streams (SSE / WebSockets):** Prefer **SSE (Server-Sent Events)** for one-way server -> client streams (passes enterprise HTTP/2 proxies more easily and handles reconnection natively). For high-frequency streams (trading, monitoring), aggregate/batch messages client-side (for example every 50-100 ms) before triggering a re-render.

## 4. Heavy uploads and exports

- **Never route large files through the web server/BFF or Server Actions:** Serverless functions and Server Actions have strict payload limits (1 to 4.5 MB) and timeouts.
- **Standard pattern:** The BFF generates a **pre-signed URL** (S3 / Cloudflare R2 / GCS) after checking rights and the allowed MIME type/max size; the browser uploads directly to object storage (with XHR/fetch progress tracking), then notifies the backend.
