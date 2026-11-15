# KB-05: Enterprise Security, Identity, Cryptography, and Compliance

## 1. Threat model and isolation (Tauri ACL v2)

- **Least privilege per window (`src-tauri/capabilities/`):** Strictly isolate the capabilities of the minimal popover and the main window. The WebView never has generic access to the shell or the file system outside an explicit scope.

```json
// src-tauri/capabilities/tray-popover.json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "tray-popover-capability",
  "description": "Minimal permissions for the tray popover",
  "windows": ["tray-popover"],
  "permissions": [
    "core:event:default",
    "core:window:allow-hide"
  ]
}
```

- **Content Security Policy (CSP):** No `unsafe-inline` (scripts) and no `unsafe-eval`; block every network domain not explicitly allowed in `tauri.conf.json`.
- **Memory hygiene and parsing:** No `unwrap()` in production on external data; strict size bounds on IPC, UDS, and network payloads.

## 2. Identity, secrets, and biometrics

- **OAuth 2.0 + PKCE authentication (RFC 8252, RFC 9700):** Open the system browser, return through a registered URL scheme (`monapp://oauth/callback`) or an ephemeral loopback HTTP server (`127.0.0.1:<port>`):
  - Always validate `state` + the PKCE `code_verifier`.
  - Close the loopback listener right after receiving the callback (or on a short timeout) and return a static HTML page that **reflects no request parameter** (prevents XSS on localhost).
- **Secret storage and OS keychain pitfalls:**
  - No token or API key in plaintext in SQLite or JSON; use the native keychain (`keyring`).
  - **macOS caution:** The *Legacy File Keychain* API triggers blocking system popups on every signature change (local dev, CI). In production, target the *Data Protection Keychain* (`kSecUseDataProtectionKeychain`), which requires a valid signature, a provisioning profile, and the `keychain-access-groups` entitlement.
  - **Linux caution:** `keyring` depends on the D-Bus Secret Service (`gnome-keyring` / `kwallet`); provide clear detection in *Doctor* when the environment is headless or lacks a Secret Service daemon.
- **Multi-workspace isolation:** Physically separate SQLite databases, CAS caches, and keychain entries per organization/account.
- **Biometric approval (Touch ID / Windows Hello):**
  - There is no universal turnkey Rust crate: implement targeted native bindings (`objc2` + `LocalAuthentication` on macOS, WinRT `UserConsentVerifier` on Windows).
  - A simple in-memory boolean check protects against opportunistic physical access, not against a local attacker. For critical secrets, bind decryption to a hardware-protected key (macOS **Secure Enclave** / Windows **TPM**).

## 3. Artifact integrity and auditability

- **Downloaded artifacts:** Streaming **SHA-256** hashing and signature verification (**Ed25519** or **Sigstore**) before any execution.
- **E2EE (if secrets are synchronized):** Keys decrypted only in RAM and erased with `zeroize` on release.
- Primitives, *envelope encryption*, audit log content and PII masking: see `security-auditor` (references 03 and 06). Desktop-specific addition: also mask local user paths in logs and the diagnostic bundle.
