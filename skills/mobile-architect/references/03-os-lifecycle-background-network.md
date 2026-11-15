# KB-03: Background Execution, Hostile Mobile Networks, and Deep Links

## 1. The reality of iOS and Android background execution

It is **impossible** to guarantee exact periodic background execution every N minutes on a modern smartphone:
- **iOS (`BGTaskScheduler`):**
  - `BGAppRefreshTask` (short tasks, ~30 s) and `BGProcessingTask` (heavy tasks on power/Wi-Fi) are **entirely opportunistic**: the system learns usage habits and may defer a task by several hours if the battery is low or in power-saving mode.
  - *Silent push* (`apns-push-type: background`, `content-available: 1`): heavily throttled by APNs (no more than a few wake-ups per hour, blocked in *Low Power Mode* or if the user *force-quit* the app).
- **Android (`WorkManager` and `ForegroundService`):**
  - `WorkManager` is the standard for any reliable deferrable task (survives reboots and respects *Doze Mode* / *App Standby Buckets*).
  - **Android 14/15/16 restriction:** A `ForegroundService` (with a mandatory persistent notification) requires a `foregroundServiceType` declared and justified in the Manifest (for example `dataSync`, `location`), subject to strict Google Play review; on Android 15+, `dataSync` services have a maximum run quota of **6 hours per 24 h**. Never misuse a `ForegroundService` to keep a needless permanent WebSocket connection alive.

## 2. Cellular networks, enterprise proxies, and TLS

- **Adapting to network quality:**
  - Detect network state through `NWPathMonitor` (iOS) and `ConnectivityManager.NetworkCallback` (Android) to distinguish **unmetered Wi-Fi** from **cellular / roaming** (limit heavy syncs or HD media on cellular according to user preference).
  - Apply **request coalescing**: avoid waking the cellular radio every 10 seconds (major battery impact); group telemetry and prefetches.
  - Configure explicit timeouts suited to slow tunnels (short connect timeout ~10 s, adapted read timeout), with *exponential backoff + jitter* on `5xx`/`429` and an immediate stop of retries on `401`/`403`.
- **Enterprise proxies and TLS inspection:**
  - On Android, configure `res/xml/network_security_config.xml` to forbid cleartext traffic (`cleartextTrafficPermitted="false"`) and, if required by IT on MDM-managed devices, allow user/MDM CA certificates (`<certificates src="user" />` only in an enterprise build or through a controlled policy).
  - **Certificate pinning pitfall:** Strict pinning in the binary abruptly breaks the whole app on a server certificate rotation or behind an enterprise SSL proxy (Zscaler, Netskope). If pinning is mandated by compliance, **always include at least 2 backup pins (SPKI hash)** and be able to disable/update the configuration through MDM/AppConfig.
  - **Shorter TLS lifetimes:** public certificates are capped at 200 days since 2026-03-15 (100 days in 2027, 47 days in 2029). Never pin the leaf certificate: pin the public key of an intermediate or root CA, plus backup keys (shared rule: `security-auditor` reference 03).

## 3. Secure push notifications and deep routing

- **Zero PII in push:** APNs and FCM servers transit through Apple/Google infrastructure. Never put confidential data (bank amount, medical diagnosis, a customer's full name) in clear text in the push JSON.
  - Send a minimal opaque payload (`{"event_id": "evt_123", "type": "approval"}`); on iOS, use a **`UNNotificationServiceExtension`** (about 30 s available) to fetch/decrypt the real content through an authenticated API before display.
- **Universal Links (iOS) and App Links (Android):**
  - Replace legacy custom schemes `monapp://` (hijackable by another installed app) with verified HTTPS links (`apple-app-site-association` and `.well-known/assetlinks.json`), except for callbacks strictly required by certain local flows.
  - Validate every parameter extracted from a deep link before navigating (prevents *Open Redirect* or privileged-route injection).
