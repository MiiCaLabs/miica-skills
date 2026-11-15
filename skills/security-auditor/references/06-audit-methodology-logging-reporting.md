# KB-06: Audit Methodology, Logging (`A09:2025`), and Report Format

## 1. Security logging and alerting (`A09:2025`)

A compromised system without usable traces prevents any forensic investigation:
- **Events that must be logged:** Successful/failed authentications, account lockouts, password/MFA changes, role/permission changes, mass access or export of PII, repeated authorization denials (`403` / IDOR attempts), signature/JWT validation errors, and critical configuration changes.
- **Format and integrity:** Structured JSON logs including `timestamp` (UTC ISO-8601), `trace_id`, `actor_id`, `tenant_id`, `source_ip`, `action`, `outcome` (`allow`/`deny`). Shipped in real time to a SIEM / **append-only** central store (not modifiable or deletable from the application server).
- **Absolute hygiene rule:** **Never log** passwords, JWT/session tokens, API keys, credit card data, or full request bodies containing secrets (beware *Log Forging* if user newlines are not escaped).

## 2. Pragmatic audit methodology (tools + human review)

Systematically combine two complementary layers:
1. **Automated layer (fast coverage of the known):**
   - *Secrets:* Gitleaks / TruffleHog (over the full Git history).
   - *SAST:* Semgrep / CodeQL (OWASP rules, source -> sink taint flow).
   - *SCA and containers/IaC:* Trivy / Grype / Checkov / `cargo-audit` / `pnpm audit` (images and actions of these tools pinned by digest or SHA).
   - *DAST / API fuzzing:* Nuclei / OWASP ZAP / negative contract tests on staging.
2. **Expert manual layer (where 80% of critical flaws are):**
   - Object-by-object checks (**BOLA/IDOR**) and **multi-tenant** isolation.
   - Bypass of multi-step workflows (for example skipping the payment/validation step, reusing an invitation token).
   - **Race conditions / TOCTOU** and **fail-open** behavior under simulated outages.
   - Full identity chain (edge -> BFF -> API -> async worker) and CI/CD configuration.

## 3. Contextual severity grid and report format

Never rate a vulnerability only by a detached theoretical score: weigh **business impact x ease of exploitation in this precise context**:
- **Critical:** Direct multi-tenant compromise, pre-auth RCE, auth/admin bypass exposed publicly, mass leak of production secrets. *(Action: block the release / patch immediately.)*
- **High:** Authenticated IDOR on sensitive data, SSRF to the internal network/IMDS, privileged stored XSS, CI/CD escalation from a PR. *(Action: fix within days / before going to production.)*
- **Medium:** CSRF on a moderate action, incomplete security headers/CSP with limited surface, technical information leak that eases an attack. *(Action: planned sprint.)*
- **Low / Info:** Defensive hardening with no demonstrated direct exploitation vector.

### Mandatory template per finding

```markdown
### [SEV-XX] Precise vulnerability title
- **Classification:** OWASP `A0X:2025` | ASVS 5.0 `Vx.y.z` | `CWE-XXX`
- **Location:** `path/to/file.ts:line` (or endpoint / Terraform resource)
- **Observation:** Factual description of the defect found in the code or architecture.
- **Exploitation scenario:** Concrete steps an attacker follows to exploit the flaw in this environment.
- **Impact:** Exact business consequence (for example reading the invoices of all tenants, code execution in the pod).
- **Remediation:** Exact fix (minimal recommended code/config) + automated test to add to prevent regression.
```
