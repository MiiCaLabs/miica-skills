---
name: security-auditor
description: Pragmatic security audit, threat modeling, and architecture hardening standards aligned with OWASP Top 10:2025, OWASP ASVS 5.0, OWASP API Security, OWASP Top 10 for LLM and Agentic Applications, and SLSA supply-chain practices. Use when reviewing system architectures, auditing codebases or pull requests, threat-modeling new features, assessing auth/RBAC/multi-tenancy, hardening CI/CD/cloud/containers, or producing prioritized remediation plans. Platform-agnostic: to design or implement a web, mobile or desktop app, use the matching *-architect skill, which applies these principles per platform.
---

# Enterprise Security & Architecture Auditor

Pragmatic guide for application security (AppSec), software architecture, and cloud/CI-CD infrastructure audits, aligned with **OWASP Top 10:2025**, **OWASP ASVS 5.0 (L1-L3)**, and **OWASP API Security**. Designed to find truly exploitable vulnerabilities, especially the business-logic and architecture flaws that automated scanners miss.

## When to Use

- Security review of an architecture, an RFC/ADR, or a flow diagram (STRIDE threat modeling).
- Audit of source code or a critical pull request (authentication, authorization, payments, uploads, parsers, multi-tenancy, AI/LLM endpoints).
- Audit of cloud configuration, Kubernetes/Docker, IaC (Terraform), and CI/CD pipelines (supply chain security).
- Technical compliance assessment against OWASP Top 10:2025 / ASVS 5.0 and writing a prioritized remediation plan.

## Sizing and audit mode (anti compliance theater)

Adapt the depth of analysis to the requested context:

- **Mode 1, fast review (PR / feature / design doc):** Targeted check of 5 non-negotiable invariants: 1) trust boundaries and untrusted inputs, 2) AuthN and object/tenant-level AuthZ, 3) fail-closed on errors/timeouts, 4) secrets/crypto/logs, 5) injection and SSRF risks. Produce only actionable findings (no theoretical filler).
- **Mode 2, full audit (pre-production / platform):** Full STRIDE threat modeling, *crown jewels* mapping, cross-cutting review of code + API + CI/CD supply chain + infrastructure, OWASP Top 10:2025 / ASVS 5.0 mapping (L1, L2, or L3), and a sequenced remediation plan with regression tests.

## Reference knowledge bases

Before conducting an audit or validating an architecture, read only the relevant files in `references/`:

- `references/01-threat-modeling-architecture.md`: Threat modeling (STRIDE), trust boundary mapping, *Insecure Design* (`A06:2025`), multi-tenant isolation, the fail-closed principle, and DoS resilience (`X01:2025`).
- `references/02-access-control-identity-api.md`: Access control (`A01:2025`: BOLA/IDOR, BFLA, mass assignment, **SSRF**), AuthN/sessions (`A07:2025`, ASVS 5.0 V6-V10), JWT pitfalls, OAuth references (RFC 9700, RFC 10017, the OAuth 2.1 profile still in draft), DPoP, and phishing-resistant MFA.
- `references/03-crypto-secrets-data-protection.md`: Approved cryptography (`A04:2025`, ASVS 5.0 V11), fatal implementation errors (AEAD nonces, PRNG, timing attacks), secrets management / OIDC workload identity, hybrid PQC, certificate lifetimes, the pinning rule, and PII protection.
- `references/04-code-injection-error-resilience.md`: Injections (`A05:2025`: SQL, shell, path traversal, XXE, deserialization), upload security, error handling and race conditions (`A10:2025`, *Mishandling of Exceptional Conditions*), and LLM/RAG/agent architecture security (OWASP Agentic ASI01-ASI10, MCP servers).
- `references/05-infra-cloud-supply-chain.md`: Supply chain security (`A03:2025`: CI/CD SHA pinning, the `pull_request_target` trap, CI cache poisoning, SLSA/SBOM, typosquatting), container/Kubernetes hardening, cloud IAM, and misconfigurations (`A02:2025`).
- `references/06-audit-methodology-logging-reporting.md`: Logging and detection (`A09:2025`, immutable logs), combining SAST/SCA with manual business-logic review, contextual severity grid, and standardized audit report format.

## Workflow

1. **Define scope and threat model:** Identify critical assets (*crown jewels*), attacker profiles (anonymous user, malicious neighboring tenant, internal employee, compromised CI dependency), and trust boundaries.
2. **Read the targeted references:** Load the `references/0X-*.md` files matching the audited layers.
3. **Audit methodically (from the outside toward the data):**
   - Verify the full chain: edge/proxy -> AuthN -> AuthZ (object + tenant) -> schema validation -> business logic/transactions -> storage/egress -> logs/errors.
   - Hunt first for **business-logic and authorization flaws** (what SAST tools do not find).
4. **Report rigorously and pragmatically:**
   - Each finding must include: **exact location**, **concrete exploitation scenario**, **real impact**, **justified severity**, and **immediate fix + CI security test**.
   - Explicitly exclude "theoretical best practices" with no real exposure surface, or flag them only as an *improvement note*, never as *Critical*.

## Gotchas

- Never conclude an application is safe because SAST/SCA shows "0 alerts": the most serious flaws (`A01` BOLA/IDOR, multi-tenant isolation, race conditions, `A10` fail-open, payment logic) are invisible to static scanners.
- Never let an authorization component, token parser, or RBAC call "fail open" on exception or timeout (`A10:2025`).
- Never recommend home-grown crypto, AES-ECB, MD5/SHA-1 for integrity/passwords, or purely client-side detection as a security control.
- Never forget the runtime environment when rating severity: an RCE behind an authenticated local admin on an internal VPN does not have the same immediate priority as a publicly exposed unauthenticated IDOR.
- Never recommend blocking a feature without proposing a safe, realistic alternative architecture for the business.
- Never treat valid SLSA provenance or *trusted publishing* as proof of innocence: in May 2026, the malicious TanStack package versions carried valid provenance, issued from the real release workflow after it was hijacked.
