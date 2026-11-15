# KB-05: Supply Chain (`A03:2025`), CI/CD, Cloud, and Misconfigurations (`A02:2025`)

## 1. Software supply chain (`A03:2025`, risk #3)

Compromise today goes overwhelmingly through dependencies and build pipelines:
- **Dependencies and registries:**
  - Mandatory lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `Cargo.lock`, `poetry.lock`, `go.sum`) enforced in CI (`--frozen-lockfile` / `--locked`).
  - Watch for **typosquatting**, *Dependency Confusion* (unscoped private packages or packages missing from the private registry), and maintainer takeover (use a cooldown delay before auto-merging minor/patch updates).
  - Generate an **SBOM** (CycloneDX/SPDX) and sign artifacts/containers (**Sigstore / Cosign**, **SLSA** compliance).
- **CI/CD pipeline hardening (GitHub Actions / GitLab CI):**
  - **Full SHA pinning:** For any third-party action, use `uses: owner/action@<full-40-char-sha> # v4.1.2` (`@v4` tags are mutable and frequently hijacked).
  - **Least-privilege `GITHUB_TOKEN`:** Declare `permissions: contents: read` at workflow level and grant `write` or OIDC only to the exact job that publishes.
  - **Critical `pull_request_target` trap:** Never run fork-originated code (checkout of the PR head) in a `pull_request_target` workflow that has access to repo secrets or a write token.
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
