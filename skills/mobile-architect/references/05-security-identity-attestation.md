# KB-05: Mobile Security, Identity, Attestation, and Privacy Manifest

## 1. Enterprise authentication (OAuth 2.0 + PKCE)

- **System browser mandatory (RFC 8252):**
  - **iOS:** `ASWebAuthenticationSession` (with `prefersEphemeralWebBrowserSession` if shared SSO is not wanted, or `false` to reuse the enterprise IdP / Safari session).
  - **Android:** Chrome Custom Tabs (through `AppAuth` or an audited implementation).
  - **Forbidden:** Never use an embedded WebView (`WKWebView` / Android `WebView`) to enter SSO/OAuth credentials (session theft risk, loss of biometric SSO/Passkey, and blocking by Google/Microsoft Entra ID).

## 2. Secret storage and cryptographic biometrics

- **Zero plaintext secrets:** Never store tokens, API keys, or sensitive data in `UserDefaults`, `SharedPreferences`, unencrypted `DataStore`, or standard SQLite.
- **Native keychain and background durability:**
  - **iOS Keychain:** Configure `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` (if background tasks must renew a token after reboot) or `WhenUnlockedThisDeviceOnly` (if usage is strictly interactive), with `*ThisDeviceOnly` to prevent migration to another device through encrypted backup.
  - **Android Keystore (hardware-backed / StrongBox):** Generate a non-exportable AES-GCM key in the hardware Keystore and encrypt tokens with Tink (AEAD) before writing them to DataStore. Jetpack Security (`EncryptedSharedPreferences`, `EncryptedFile`) is deprecated, and there is no official `EncryptedDataStore` artifact.
- **Biometrics bound to cryptography:**
  - Never validate biometrics with a simple boolean callback easily bypassed by memory instrumentation (Frida).
  - **Android:** Pass a `BiometricPrompt.CryptoObject` bound to a Keystore key requiring `setUserAuthenticationRequired(true)`.
  - **iOS:** Protect the Keychain entry or the **Secure Enclave** key with `SecAccessControlCreateWithFlags(..., .biometryCurrentSet)` (automatically invalidates the key if a new fingerprint/Face ID is added to the phone).

## 3. Device integrity and server-side attestation

- **Do not rely on local-only anti-root/anti-jailbreak:** Naive client-side checks (looking for `/bin/bash`, `Cydia`, `su`) are trivially bypassed and produce false positives.
- **Cryptographic attestation on the backend:** Before any critical operation or issuing a sensitive token, the backend verifies binary and device authenticity through:
  - **iOS:** **App Attest** (`DCAppAttestService`: verifies the app is authentic, signed by your team, and running on genuine Apple hardware).
  - **Android:** **Google Play Integrity API** (verifies OS integrity `MEETS_DEVICE_INTEGRITY` and that the binary comes from your signed package on Google Play). The backend decrypts and verifies the verdict with Google; the app never interprets it itself.

## 4. Hygiene, confidentiality, and store declarations

- **Screen protection and multitasking:** Hide or blur sensitive content when the app goes to the background (to avoid capture in the app switcher: `FLAG_SECURE` on Android, a privacy view on `sceneWillResignActive` or SwiftUI `scenePhase` on iOS).
- **Logs and clipboard:** Zero PII/JWT in `Logcat` or `OSLog` in release builds (use the `%{private}@` specifiers in iOS `OSLog`). Apply expiry to secrets copied to the clipboard (`UIPasteboard` `expirationDate`, `ClipDescription.EXTRA_IS_SENSITIVE` on Android 13+).
- **Apple Privacy Manifest (`PrivacyInfo.xcprivacy`):** Mandatory for any use of *Required Reason APIs* (`UserDefaults`, file timestamps, disk space...) and for any third-party SDK on Apple's official list. Third-party binary SDKs must also include their signature.
