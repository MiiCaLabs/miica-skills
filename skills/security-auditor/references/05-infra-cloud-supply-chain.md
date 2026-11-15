# KB-05: Supply Chain (`A03:2025`), CI/CD, Cloud, and Misconfigurations (`A02:2025`)

## 1. Software supply chain (`A03:2025`, risk #3)

Compromise today goes overwhelmingly through dependencies and build pipelines:
- **Dependencies and registries:**
  - Mandatory lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `Cargo.lock`, `poetry.lock`, `go.sum`) enforced in CI (`--frozen-lockfile` / `--locked`).
  - Watch for **typosquatting**, *Dependency Confusion* (unscoped private packages or packages missing from the private registry), and maintainer takeover: 7-day cooldown by default, on both the installer and the bot side, with an explicit exception for security fixes.
  - Registries: npm revoked classic tokens in December 2025 and capped granular tokens at 90 days. Publish through OIDC *trusted publishing*, with no stored token.
  - Generate an **SBOM** (CycloneDX/SPDX) and sign artifacts/containers (**Sigstore / Cosign**, **SLSA** compliance).
- **CI/CD pipeline hardening (GitHub Actions / GitLab CI):**
  - **Full SHA pinning:** For any third-party action, use `uses: owner/action@<full-40-char-sha> # v4.1.2` (`@v4` tags are mutable and frequently hijacked).
  - **Least-privilege `GITHUB_TOKEN`:** Declare `permissions: contents: read` at workflow level and grant `write` or OIDC only to the exact job that publishes.
  - **Critical `pull_request_target` trap:** Never run fork-originated code (checkout of the PR head) in a `pull_request_target` workflow that has access to secrets, a write token or the repository cache. Since 2025-12-08, GitHub always runs this trigger from the default branch, which does not protect against the fork code you run inside it. On public repositories, a default rule disables it, enforced automatically from 2026-12-02: allow it only by exception, workflow by workflow.
  - **CI cache poisoning:** a PR-triggered workflow can write cache entries that the release workflow later restores. Never restore a cache in a publishing job, isolate `id-token: write` in a dedicated job that runs no unreviewed code, and protect publishing with a manual-approval environment. Real case: 42 TanStack packages compromised in May 2026, with an OIDC token extracted from runner memory.
  - **Security tools themselves:** scanners run with CI secrets. Pin them by SHA or digest like any action (Trivy compromised in March 2026, `tj-actions/changed-files` in March 2025).
  - **CI script injection:** Never interpolate `${{ github.event.issue.title }}`, `${{ github.head_ref }}`, or a branch name directly in a bash `run:` block; pass it through an `env:` variable.

## 2. Cloud, containers, and misconfigurations (`A02:2025`, risk #2)

- **Container and Kubernetes hardening:**
  - Minimal base images (distroless, scratch, Chainguard, or minimal up-to-date Alpine) with no unnecessary debug tools (`curl`, `netcat`, shell) in production.
  - Mandatory strict security context on Pods/containers:
    - `runAsNonRoot: true` (UID > 10000)
    - `readOnlyRootFilesystem: true`
    - `allowPrivilegeEscalation: false`
    - `capabilities: drop: ["ALL"]`
    - `seccompProfile: RuntimeDefault`
  - Never mount the Docker socket (`/var/run/docker.sock`) in an application container (it equals `root` access on the host).
- **Cloud and network:**
  - **Least-privilege IAM:** Ban `"Action": "*"` / `"Resource": "*"` and admin roles attached to application workloads.
  - **Storage and databases:** No public S3/GCS bucket by default (except an explicitly intended static CDN), encryption at rest enabled, **no database or Redis exposed on `0.0.0.0/0`**.
  - **Separate environments:** No shared VPC, cloud accounts, or secrets between dev/staging and production; disable debug modes (`DEBUG=True`, unneeded GraphQL introspection/playground, unprotected Spring Actuator/Swagger) in production.
