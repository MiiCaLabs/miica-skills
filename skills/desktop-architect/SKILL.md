---
name: desktop-architect
description: Architecture, engineering standards, and production patterns for enterprise desktop applications in Rust (Tauri v2 primary, GPUI for specialized high-density UIs). Use when designing, scaffolding, auditing, or implementing desktop apps involving background daemons, local-first storage (SQLite WAL + CAS), synchronization engines, system tray menus, OS notifications, corporate network/MDM constraints, enterprise security (OAuth PKCE, Keychain, biometrics), or CI/CD signing and notarization.
---

# Enterprise Desktop Architect (Rust / Tauri v2 / GPUI)

Architecture guide and enterprise engineering standards for designing, securing, testing, and shipping critical desktop applications in Rust, built as needed on the "Resident Daemon + Ephemeral UI" model.

**OS scope:** These standards primarily target **macOS and Windows** in managed enterprise environments (MDM, TLS-inspecting proxies, non-admin users). Linux is optionally supported with its own specifics (Secret Service / D-Bus, `.deb` / AppImage / Flatpak packaging).

## When to Use

- Designing or scoping the architecture of a Rust desktop application (Tauri v2 by default, or GPUI with strict justification).
- Implementing a local-first engine, a background task / synchronization pipeline, or a resident daemon.
- Designing native OS integration: system tray, instant popover, system notifications, sleep/wake handling, corporate networking, and a companion CLI.
- Defining enterprise security standards (Tauri v2 ACL, CSP, Keychain, OAuth 2.0 + PKCE, biometrics, Ed25519 signatures).
- Setting up deterministic test harnesses, observability (`tracing` / OTel, Doctor self-diagnostics), and release pipelines (Cloud HSM signing, notarization, MDM, auto-update).

## Sizing and complexity trade-off (anti over-engineering)

Never apply the full architecture blindly when the need does not justify it. Choose the matching profile explicitly during scoping:

- **Profile A, standard business app (2 to 3 crates):** Tauri v2 UI + simple business backend (`app-core` + `src-tauri`). No HLC/CRDT engine, no CAS, no UDS daemon if the server is authoritative over REST/GraphQL + `ETag` and a light SQLite cache is enough.
- **Profile B, critical platform / local-first / resident daemon (5 to 7 crates):** Full architecture with hybrid SQLite WAL + CAS storage, transactional outbox, offline synchronization, reactive tray, companion CLI, and a deterministic simulation pipeline.

## Reference knowledge bases

Before answering or generating code, read only the relevant files in `references/`:

- `references/01-architecture-daemon.md`: Resident daemon vs ephemeral UI paradigm, Cargo workspace sizing, realistic Tauri v2 vs GPUI trade-off, single-writer SQLite actor, IPC contracts, and the `CloseRequested` / `ExitRequested` lifecycle.
- `references/02-storage-cas-sync.md`: Hybrid SQLite storage (WAL, FTS5, Expand & Contract, anti-downgrade guard) + atomic CAS (Windows/antivirus pitfalls) with LRU GC, transactional outbox, proportionate conflict resolution, and echo-free file watcher.
- `references/03-os-tray-notifications.md`: In-process daemon vs separate OS service, sleep/wake and `NWPathMonitor` resilience, enterprise networking (`rustls-platform-verifier`, TLS proxies), system tray, Dual-Window strategy (hidden popover vs destroyed window), notifications with coalescing, and authenticated companion CLI (`SO_PEERCRED` / Named Pipe ACL).
- `references/04-ux-accessibility-design.md`: Desktop ergonomics (macOS HIG / Windows Fluent), multi-monitor persistence, just-in-time permissions (TCC), command palette (`Cmd+K`), virtualization, conflict resolution UI, and WCAG 2.2 AA reality (Tauri vs GPUI).
- `references/05-security-identity-crypto.md`: Threat model, Tauri v2 ACL (per-window `capabilities/`), strict CSP, OAuth 2.0 + PKCE secure loopback, system keychain (macOS Legacy vs Data Protection Keychain pitfalls), hardware biometrics (Secure Enclave / TPM), and E2EE (`zeroize`).
- `references/06-qa-observability-release.md`: Deterministic harness (`Clock`, `NetworkTransport`, `BlobStore`), E2E tests (`WebdriverIO` + `@wdio/tauri-service` / `#[gpui::test]`), controlled `tracing` + OTel observability, Doctor, `cargo-deny` / SBOM, macOS signing + Windows Cloud HSM (Azure Artifact Signing, Certum, SSL.com, DigiCert), and MDM deployment / auto-update.

## Workflow

1. **Qualify the profile (A or B) and scope:** Decide whether the application really needs a full local-first daemon or a light modular architecture, and which subsystems are involved.
2. **Read the targeted references:** Load only the `references/0X-*.md` files useful for the task.
3. **Produce the architecture or implementation:**
   - Separate the pure business core (`app-domain`) from OS/UI adapters (`app-os`, `src-tauri` / `app-ui`).
   - Recommend **Tauri v2 by default** in enterprise settings; consider GPUI only with explicit justification (high-frequency rendering or massive inspectors), accepting its accessibility and dependency costs.
   - Produce idiomatic Rust with no blocking I/O on the UI thread, no `unwrap()` on external input, and no plaintext secrets.
4. **Check compliance:** Verify sleep/network resilience, least-privilege ACLs, window/daemon lifecycle, non-admin/MDM deployment, and observability.

## Gotchas

- Never concentrate all business logic in `src-tauri`, and never split a simple tool into 8 empty crates.
- Never block `RunEvent::ExitRequested` blindly without distinguishing window closure (`code.is_none()`) from a real exit order (`app.exit(0)`), and never destroy the WebView of a popover that must open instantly.
- Never use `webpki-roots` alone in an enterprise app: use `rustls-platform-verifier` so root certificates injected by corporate TLS proxies are honored.
- Never expose a companion-CLI Unix Domain Socket or Named Pipe without verifying peer identity (`SO_PEERCRED` / `LOCAL_PEERCRED`, or a Windows DACL on the user SID).
- Never use JSON `invoke` to stream large logs or binaries: prefer `tauri::ipc::Channel` or an asynchronous URI protocol.
- Never store tokens or secrets in SQLite or JSON: use the native OS keychain (`keyring`), taking macOS signing rules into account.
