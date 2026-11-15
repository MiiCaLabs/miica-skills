# KB-06: Mobile QA, Battery-Friendly Observability, Stores, and MDM Deployment

## 1. Pragmatic mobile testing strategy

- **Controlled inverted pyramid:**
  - *Unit and simulation (70%):* Run domain, serialization, SQLite migration, and sync engine tests (with simulated clock and network) on the JVM / macOS-Linux host in seconds on every commit.
  - *Integration and native UI tests (20%):* **XCUITest** (iOS) and **Compose UI Test / Espresso** (Android) on critical screens with a locally mocked network.
  - *Cross-platform E2E (10%):* **Maestro** (fast declarative YAML scenarios resilient to animations) on critical journeys (login, offline creation, network resume, deep link), rather than Appium, which is often slow and fragile in CI.
- **Hardware and system constraints testing:**
  - Validate every release candidate on a physical device farm (Firebase Test Lab / AWS Device Farm) covering: degraded network, airplane mode -> resume, *Don't Keep Activities* (Android *Process Death* simulation), and an **Android 15+ emulator configured with 16 KB memory pages**.

## 2. Battery-friendly observability and symbolication

- **Crash reporting and CI symbolication:** Systematically archive **dSYMs** (iOS) and the **ProGuard/R8 mapping + native `.so` symbols** (Android) on every release build to get usable stack traces (Sentry, Firebase Crashlytics, or Datadog).
- **Priority mobile health metrics:** Track first the *Crash-Free Users Rate* (> 99.8%), Android **ANRs**, iOS **OOM kills / App Hangs**, and cold start time (P95).
- **Frugal telemetry:** Buffer locally with a disk size cap, send only in compressed batches (preferably on Wi-Fi for large dumps), with a user-triggerable **diagnostic bundle export scrubbed of secrets** in advanced settings.

## 3. Store requirements, CI signing, and compliance (2026+)

- **Android (Google Play):**
  - **AAB** (*Android App Bundle*) format with **Play App Signing** (separate upload key stored in CI secrets / HSM).
  - **R8 / ProGuard** enabled (`isMinifyEnabled = true`, `isShrinkResources = true`) to reduce size and lightly obfuscate.
  - **Mandatory 16 KB alignment:** All native `.so` libraries (NDK, Rust, Flutter, React Native, SQLCipher) must be aligned for **16 KB** memory pages (required for apps targeting Android 15+; non-compliant updates blocked on Google Play starting February 2027).
  - Check licenses and the **SBOM** of all third-party SDKs (Play Data Safety must be consistent with the embedded SDKs).
- **iOS (App Store / TestFlight):**
  - CI automation without fragile 2FA through an **App Store Connect API Key** (`.p8`) + **Fastlane Match** (encrypted repository for certificates and provisioning profiles) or Xcode Cloud.
  - Before upload, check for **`PrivacyInfo.xcprivacy`**, the signatures of third-party XCFrameworks listed by Apple, and the absence of `com.apple.quarantine` attributes.

## 4. Enterprise distribution (MDM and AppConfig) and updates

- **Private vs public distribution:**
  - Prefer **Apple Business Manager (Custom Apps / Unlisted Apps)** and **Managed Google Play** (Intune, Jamf, Workspace ONE) over the legacy *Apple Developer Enterprise (In-House)* program, whose certificate revocation instantly cuts off the whole deployed fleet.
- **Managed configuration (AppConfig):**
  - Expose IT configuration (tenant URL, SSO client ID, telemetry opt-out, TLS pins) through the native MDM standards: **`UserDefaults` (`com.apple.configuration.managed`)** on iOS and **`RestrictionsManager` (`app_restrictions.xml`)** on Android.
- **Progressive updates and OTA:**
  - Use ring-based rollout (*Staged Rollout* 5% -> 25% -> 100% on Play Console / 7-day *Phased Release* on the App Store) + the *In-App Updates API* to force critical security updates (minimum supported version kill-switch negotiated through the API).
  - **OTA updates (CodePush / EAS Update / Shorebird):** Strictly reserved for urgent JS/Dart logic fixes with no native change and no store-review circumvention, and generally **prohibited in regulated environments** (banking, health, defense) where every executed binary must be audited and signed end to end.
