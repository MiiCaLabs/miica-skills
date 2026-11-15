# KB-03: Cryptography (`A04:2025`), Secrets, and Data Protection

## 1. Cryptographic audit (ASVS 5.0 V11)

- **Approved primitives only (zero home-grown crypto):**
  - *Authenticated symmetric encryption (AEAD):* **AES-256-GCM** or **ChaCha20-Poly1305** (or XChaCha20-Poly1305). **Flag as Critical/High:** AES-ECB, DES/3DES, RC4, or AES-CBC without authenticated Encrypt-then-MAC (vulnerable to padding oracles).
  - *Password hashing:* **Argon2id** (recommended) or `scrypt`/`bcrypt` with an appropriate cost (never raw SHA-256 or MD5/SHA-1).
  - *Integrity hashing and signatures:* SHA-256 / SHA-3 / BLAKE2/3; Ed25519 or ECDSA P-256 (RSA >= 2048/3072 bits for legacy compatibility only).
- **The 4 fatal implementation errors to hunt:**
  1. **Nonce / IV reuse:** Reusing the same nonce with the same key in AES-GCM or ChaCha20 completely breaks confidentiality and authenticity. Use a CSPRNG to generate unique nonces (or XChaCha20 / strict counter management / key rotation through KMS).
  2. **Non-cryptographic PRNG:** `Math.random()`, a non-secure `rand::thread_rng`, `java.util.Random`, or Python `random` used to generate tokens, OTP codes, API keys, or reset links. Require `crypto.randomBytes` / `secrets` / `SecureRandom` / `OsRng` exclusively.
  3. **Non-constant-time comparison:** Comparing HMAC signatures, API keys, or tokens with `==` / `===` exposes *timing attacks*. Require `crypto.timingSafeEqual` / `hmac.compare_digest` / `subtle::ConstantTimeEq`.
  4. **Hard-coded static keys or keys shared across environments:** Strictly separate dev/staging/prod cryptographic keys and use *envelope encryption* (DEK encrypted by a KEK in KMS/Vault) with rotation support.

## 2. Secrets management and eliminating static keys

- **Secret leak audit:**
  - Inspect Git history (not only `HEAD`), front-end environment variables (`NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`), `Dockerfile`s (`ENV`/`ARG` remain visible in `docker history`), Kubernetes manifests (`ConfigMap` vs `Secret`), and mobile bundles.
- **Target architecture:**
  - Replace long-lived static keys (AWS IAM keys, service account JSON) between CI/cloud or microservices with **ephemeral identity federation (OIDC Workload Identity / IAM Roles / SPIFFE)**.
  - Store the remaining secrets in a dedicated manager (AWS/GCP/Azure Secrets Manager, HashiCorp Vault) with least-privilege access and automated rotation.

## 3. Data protection and privacy (PII / GDPR)

- **Transport:** TLS 1.2+ (TLS 1.3 preferred), strict disabling of weak ciphers and TLS 1.0/1.1; strict certificate verification (never `rejectUnauthorized: false` or `InsecureSkipVerify: true` outside an isolated local dev setup).
- **Minimization and exposure:**
  - Never return internal/sensitive fields (`password_hash`, `mfa_secret`, `internal_notes`, `stripe_secret`) in API responses or SSR payloads.
  - Forbid unanonymized production dumps in development or staging environments.
