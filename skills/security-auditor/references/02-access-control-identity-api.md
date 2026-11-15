# KB-02: Access Control (`A01:2025`), Identity (`A07:2025`), and API Security

## 1. Access control (`A01:2025`, risk #1) and API Top 10

Access control remains the number one cause of serious compromises and now includes **SSRF** in the OWASP Top 10:2025:

- **BOLA / IDOR (*Broken Object Level Authorization*):**
  - *Audit point:* Every endpoint handling an ID (`/orders/{id}`, `/invoices/{uuid}`, GraphQL `node(id)`).
  - *Requirement:* Systematically verify `resource.owner_id == current_user.id` (or `resource.tenant_id == current_user.tenant_id` + RBAC/ABAC rights) **in the SQL query or the business layer**, not only through a `@RequireAuth` decorator checking that the user is logged in.
  - *Note:* UUIDv4 slows enumeration but **is never an authorization** (UUIDs leak through logs, Referer, emails, histories).
- **BFLA (*Broken Function Level Authorization*):**
  - Check rights on **every HTTP verb** (`GET` vs `POST`/`PUT`/`PATCH`/`DELETE`), on admin routes (`/api/admin/*`), and on internal or batch endpoints.
- **BOPLA / mass assignment:**
  - Forbid binding an incoming JSON payload directly to an ORM/DB entity (`Object.assign`, `...req.body`, unfiltered Pydantic/Jackson). Use **explicit input DTOs** that strictly list modifiable fields (never `role`, `is_admin`, `tenant_id`, `balance`, `verified`).
- **SSRF (*Server-Side Request Forgery*, part of `A01:2025`):**
  - *At-risk surfaces:* User-configurable webhooks, import from URL, PDF/HTML-screenshot generators (Puppeteer/wkhtmltopdf), avatar/link-preview fetchers.
  - *Mandatory controls:*
    1. Strict protocol allowlist (`https:` only; block `file://`, `gopher://`, internal `http://`) and, if possible, a domain allowlist.
    2. Resolve DNS, then block private/reserved ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, **`169.254.169.254`** cloud metadata, IPv6 `::1`, `fc00::/7`, `fe80::/10`) at the **real socket/connector** level (protection against *DNS Rebinding*, where the IP changes between the check and the connection).
    3. Disable automatic HTTP redirect following (`301`/`302` to `http://169.254.169.254/`) and enforce **IMDSv2** on AWS.

## 2. Authentication, sessions, and JWT (`A07:2025`, ASVS 5.0 V6-V10)

- **OAuth references:** RFC 9700 (Security BCP), RFC 8252 (native apps) and RFC 10017 (browser-based apps, BCP 212, Aug. 2026). OAuth 2.1 is still an IETF draft (revision -17 of 2026-10-31): use it as a target profile and cite the RFCs in contractual requirements.
- **JWT / OAuth / OIDC audit:**
  - Explicitly validate the allowed algorithm server-side (allowlist, for example `RS256` or `EdDSA`; reject `none` and prevent `RS256` -> `HS256` asymmetric/symmetric confusion with the public key used as secret).
  - Always validate `exp`, `nbf`, `iss` (exact issuer), and `aud` (the exact audience of this API; a token issued for service A must not be accepted by service B).
  - Never trust a dynamic `jku` / `x5u` in the JWT header without a strict allowlist.
- **Session and token lifecycle:**
  - Web cookies must be `HttpOnly; Secure; SameSite=Lax` (or `Strict`), with session ID regeneration at login (anti *Session Fixation*).
  - Public clients (SPA, mobile, desktop): prefer sender-constrained tokens (**DPoP**, RFC 9449) when the IdP supports it.
  - Refresh tokens with **single-use rotation** and **reuse detection** (revoke the whole token family if an already-consumed refresh token is replayed).
  - Effective server-side invalidation on logout, password change, or admin revocation (beware long-lived stateless JWTs that cannot be revoked).
- **Brute force, MFA, and password reset:**
  - Phishing-resistant MFA (**FIDO2/WebAuthn/Passkeys**) for privileged accounts. Synced passkeys meet AAL2 of NIST SP 800-63B-4. For production administration, require device-bound keys (security key, TPM, Secure Enclave).
  - Rate limiting and anti-enumeration protection on login, password reset (single-use CSPRNG tokens >= 128 bits stored **hashed** in the database with a short TTL <= 15-30 min), and OTP.
