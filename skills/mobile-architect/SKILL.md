---
name: mobile-architect
description: Architecture, engineering standards, and production patterns for enterprise mobile applications (iOS & Android — Native Swift/Kotlin, KMP, Flutter, React Native, or Rust core via UniFFI). Use when designing, scaffolding, auditing, or implementing mobile apps involving offline-first storage (SQLite/SQLCipher), resilient sync, background execution constraints, enterprise auth (OIDC PKCE, Keychain/Keystore, biometrics, App Attest / Play Integrity), accessibility, MDM/AppConfig, or App Store / Google Play release pipelines.
---

# Enterprise Mobile Architect (iOS & Android)

Architecture guide and enterprise engineering standards for designing, securing, testing, and shipping critical mobile applications on **iOS and Android**, built on a testable business core, resilience to aggressive OS lifecycles, and deployment in managed environments (MDM / stores).

## When to Use

- Designing or scoping the architecture of an enterprise mobile application (native vs KMP vs Flutter/React Native vs shared Rust core).
- Implementing robust local persistence, an offline queue (*outbox*), or background file transfers.
- Handling mobile OS constraints: Android *Process Death*, iOS *App Termination*, `WorkManager`, `BGTaskScheduler`, silent push notifications, and deep links.
- Defining mobile security standards: OAuth 2.0 + PKCE through the system browser, Keychain / Android Keystore (StrongBox), biometrics bound to a hardware key, App Attest / Play Integrity, and Privacy Manifest compliance.
- Setting up mobile QA (shared unit tests, Maestro/XCUITest/Compose, device farm), battery-friendly observability, and MDM / App Store / Google Play pipelines.

## Sizing and complexity trade-off (anti over-engineering)

Choose the matching profile explicitly during scoping to avoid over-engineering:

- **Profile A, standard business app (thin client):** Clean layered architecture (UI -> ViewModel/State -> Repository -> API) with a simple HTTP/disk cache and OIDC authentication. No complex relational SQLite database, no transactional outbox, and no conflict-resolution engine if usage is mostly connected.
- **Profile B, field / critical / offline-first app:** Pure, deterministic shared core, SQLite WAL storage (+ SQLCipher if required), idempotent transactional outbox, OS-constrained synchronization, explicit *Process Death* handling, bounded telemetry, and MDM / AppConfig support.

## Reference knowledge bases

Before answering or generating code, read only the relevant files in `references/`:

- `references/01-architecture-stack.md`: Fundamental mobile constraint (no permanent daemon), pragmatic stack trade-offs (Native + KMP, Compose Multiplatform, Flutter, React Native New Arch, Rust `uniffi`), Profile A/B modular layout, UDF/MVI, and *Process Death* survival.
- `references/02-storage-offline-sync.md`: SQLite WAL vs SQLCipher (real cost), blob storage outside the database (`NSURLIsExcludedFromBackupKey`), transactional outbox with `Idempotency-Key`, OS background transfers (`URLSession` / `WorkManager`), and proportionate conflict resolution.
- `references/03-os-lifecycle-background-network.md`: Strict iOS/Android background reality (quotas, *Doze Mode*, Android 14+ `ForegroundService`), resilience on cellular and enterprise tunnels, TLS / certificate pinning strategy, push (APNs/FCM without PII), and Universal/App Links.
- `references/04-ux-accessibility-adaptive.md`: Native ergonomics (iOS HIG / Material 3 Edge-to-Edge and Predictive Back), perceived performance (cold start < 1.5 s, optimistic UI), keyboard/foldable/tablet handling, and strict accessibility (Dynamic Type 200%, 44pt/48dp targets, VoiceOver/TalkBack).
- `references/05-security-identity-attestation.md`: OAuth 2.0 + PKCE (`ASWebAuthenticationSession` / Custom Tabs, never a WebView), Keychain / Keystore + cryptographic biometrics (`CryptoObject` / Secure Enclave), App Attest and Play Integrity vs naive anti-root checks, snapshot/log confidentiality, and Privacy Manifest.
- `references/06-qa-observability-mdm-release.md`: Mobile test pyramid (shared tests, Maestro, XCUITest/Compose, device farms), dSYM/R8/NDK symbolication, store constraints (Android **16 KB** ELF alignment, iOS **PrivacyInfo.xcprivacy**), CI signing without 2FA, and MDM distribution (ABM / Managed Google Play / AppConfig).

## Workflow

1. **Qualify the profile (A or B) and team context:** Identify offline requirements, the available team (native iOS/Android, Kotlin, JS/TS, Dart, or existing Rust), and regulatory/MDM constraints.
2. **Read the targeted references:** Load only the `references/0X-*.md` files useful for the request.
3. **Produce the architecture or implementation:**
   - Justify the stack choice objectively (do not impose cross-platform if the team is already native, nor duplicated pure-native code when complex business logic is identical).
   - Design async flows and storage to survive a brutal OS process kill at any moment.
   - Enforce zero blocking I/O on the Main/UI thread, zero plaintext secrets in `UserDefaults`/`SharedPreferences`, and zero WebView for OAuth authentication.
4. **Check compliance:** Verify accessibility (Dynamic Type / TalkBack / VoiceOver), OS background constraints, store requirements (Android 16 KB, iOS Privacy Manifest), and MDM configurability.

## Gotchas

- Never design a mobile app with the desktop "resident daemon" mindset: iOS and Android suspend or kill the process without notice once it goes to the background.
- Never use an embedded WebView (`WKWebView` / `WebView`) for OAuth/OIDC authentication: use only `ASWebAuthenticationSession` (iOS) and Android Custom Tabs.
- Never store large files/media as SQLite `BLOB`s, and never forget `NSURLIsExcludedFromBackupKey` on iOS caches (App Store rejection risk for iCloud Backup bloat).
- Never validate biometrics with a simple app-level boolean (`if authenticated`): bind biometrics to unlocking a hardware key (Secure Enclave / Keystore `CryptoObject`).
- Never deploy rigid certificate pinning without backup pins and an OTA rotation plan, or a certificate renewal or enterprise TLS proxy can lock out the whole fleet in production.
- Never send business data or PII in clear text in push notification payloads (APNs/FCM), and never rely on purely local root/jailbreak detection without server-side attestation (App Attest / Play Integrity).
