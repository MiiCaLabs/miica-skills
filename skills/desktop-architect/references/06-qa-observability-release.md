# KB-06: Quality Engineering, Observability, MDM, and Release Engineering

## 1. Deterministic test harness and E2E

- **Abstracting side effects:** The domain and sync engine consume injectable traits (`trait Clock`, `trait NetworkTransport`, `trait BlobStore`) so CI can simulate in milliseconds: network loss mid-transfer, sleep/wake cycles, concurrent conflicts, and notification coalescing.
- **Validation layers:**
  - *Unit and property tests:* `cargo test` + `proptest` on state machines, IPC serialization, and reconciliation.
  - *Desktop E2E (Tauri v2):*
    - **WebdriverIO (`@wdio/tauri-service`)** to drive the full app (`tauri-driver` on Windows/Linux, and an embedded WebDriver server such as `tauri-plugin-wdio-webdriver` on **macOS**, because `tauri-driver` does not support macOS/`WKWebView`).
    - **Playwright** is reserved for fast testing of the isolated frontend (with IPC mocks) or CDP attachment to WebView2 on Windows.
  - *GPUI E2E:* Headless `#[gpui::test]` harness.

## 2. Observability and self-diagnostics ("Doctor")

- **Structured logging:** `tracing` + `tracing-subscriber` with rotation in the standard OS folder (`~/Library/Logs/<app>` on macOS, `%LOCALAPPDATA%\<app>\logs` on Windows).
- **Controlled OpenTelemetry telemetry:** Propagate the `trace_id` on API requests; disable or sample client-side OTel export by default, honoring offline mode, corporate proxies, and a compliance switch (GDPR / air-gapped enterprise).
- **"Doctor" command and view:** Reachable from the tray and `Cmd+K`, checking: API/WebSocket connectivity, TLS chain (including corporate proxy certificates), NTP clock drift, SQLite integrity (`PRAGMA integrity_check` + `user_version`), OS keychain accessibility, and disk space.
- **Diagnostic bundle and crash reporting:** Export a `.zip` scrubbed of secrets (logs + Doctor report + `sync_outbox` state), and keep `.dSYM` / `.pdb` symbols in CI to symbolicate panics/crashes.

## 3. Supply chain, signing, MDM, and auto-update

- **Dependency governance:** `cargo-deny` in CI (allowed licenses, rustsec advisories, duplicate checks) + an **SBOM** (CycloneDX/SPDX) generated on every release.
- **Automated signing and notarization:**
  - *macOS:* Universal build (`aarch64` + `x86_64`), `codesign` signing (*Developer ID Application* + *Hardened Runtime*), notarization through `notarytool`, and stapling (`stapler`) in `.dmg` / `.pkg`.
  - *Windows (no more exportable `.pfx` since June 2023):* Authenticode signing in CI must go through a **Cloud HSM**: **Certum SimplySign**, **SSL.com eSigner**, **DigiCert KeyLocker**, or **Azure Artifact Signing** (formerly *Azure Trusted Signing*; note that it is geographically restricted to entities registered in the eligible country list).
- **Enterprise reality (MDM and non-admin):**
  - Ship packages deployable via **Intune / Jamf** (per-machine `.msi` or macOS `.pkg`) for machines without administrator privileges.
  - **Auto-updater disabled by IT policy:** Expose a Windows GPO/Registry key or a macOS MDM `plist` profile that disables the built-in auto-update when IT manages the version cycle.
- **Auto-update and rings:** Progressive publication (*Canary* -> *Beta* -> *Stable*) with an **Ed25519**-signed manifest verified before replacement; on macOS, detect *App Translocation* and write permission on `/Applications` before launching an in-place update.
