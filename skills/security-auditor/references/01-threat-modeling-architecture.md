# KB-01: Threat Modeling, Trust Boundaries, and Secure Architecture

## 1. Mapping trust boundaries

In any architectural audit, explicitly trace the boundaries where the privilege or trust level changes:
1. **Internet / browser / mobile -> edge / API gateway:** Everything coming from the client (headers, cookies, JSON, GraphQL, files, User-Agent, URL parameters) is **hostile by default**.
2. **Edge / BFF -> internal microservices:** Check whether user identity is propagated in a cryptographically verifiable way (mTLS + short-lived signed internal JWT) or whether an internal service blindly trusts a forgeable header (`X-User-Id`).
3. **Application -> third-party services / webhooks / LLM:** Responses from external APIs, incoming webhooks, and indexed RAG documents are **untrusted inputs**.
4. **Tenant A -> Tenant B (multi-tenancy):** A critical boundary often broken in shared caches, queues, full-text search, and object buckets.

## 2. STRIDE threat modeling and *Insecure Design* (`A06:2025`)

Systematically evaluate each critical flow with **STRIDE**:
- **S, Spoofing:** Can an attacker impersonate a user, a service, or a webhook (missing HMAC signature, SSRF to an unauthenticated internal service)?
- **T, Tampering:** Can a price parameter, a role, a workflow status, or a CI artifact be modified in transit or at rest?
- **R, Repudiation:** Can a financial, administrative, or PII-access action be denied for lack of a timestamped, immutable audit log?
- **I, Information Disclosure:** Leaks through error messages, overly chatty GraphQL/ORM responses, misconfigured CDN caches, logs, or exposed debug/metrics endpoints?
- **D, Denial of Service (`X01:2025` Lack of Application Resilience):** Unbounded requests (`limit=1000000`), ReDoS (catastrophic regexes), recursive GraphQL queries with no depth/cost limit, unbounded decompression (*Zip/XML Bomb*), missing rate limiting on expensive operations (PDF, hashing, AI)?
- **E, Elevation of Privilege:** Standard user -> admin, tenant A -> tenant B, or CI runner -> production access?

## 3. Non-negotiable architectural invariants

- **Deny-by-default and fail-closed:** Every route, HTTP method, IAM permission, or firewall rule not explicitly allowed is refused. On a permission-check error or when the PDP (*Policy Decision Point*) is unavailable, **block the action**.
- **Defense-in-depth multi-tenant isolation:**
  - `tenant_id` must be taken from the server-side authenticated context (never from a client-supplied JSON field or query parameter).
  - In a relational database: ideally **Row-Level Security (RLS)** or filtering enforced at the ORM/repository layer (with automated isolation tests).
  - In caches (Redis) and search engines: **always prefix every key/index with `tenant_id`** (otherwise a cross-tenant leak is trivial).
- **Control plane / data plane separation:** Keep internal administration interfaces (back office, Prometheus metrics, private Swagger/OpenAPI, DB consoles) off the public Internet (VPN / zero-trust proxy / dedicated private network).
