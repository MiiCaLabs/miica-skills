# KB-01: Mobile Architecture, Stack Trade-offs, and OS Lifecycle

## 1. Fundamental constraint: the OS is hostile to processes

Unlike desktop, a mobile application **has no permanent lifecycle**:
- On **iOS**, a backgrounded app is suspended after a few seconds, then killed (*Jetsam*) as soon as the system needs RAM, often without running any clean shutdown hook.
- On **Android**, the process is destroyed in the background (**Process Death**) and recreated on the fly when the user returns to the screen, restoring only the serialized state bundle (`SavedStateHandle`). **All in-memory singletons are reset.**

Architectural consequence: **no critical state or in-flight transaction may live only in RAM**. The UI observes persisted state (disk/DB source of truth) rather than directly driving in-memory tasks.

## 2. Pragmatic stack trade-off (enterprise)

| Stack | Enterprise maturity | Code sharing | UX and accessibility | When to choose (or avoid) |
| :--- | :--- | :--- | :--- | :--- |
| **Native + KMP (Kotlin Multiplatform)** | **Very high** (official Google & JetBrains) | Logic, network, DB, ViewModels (60-75%) | **100% native** (SwiftUI + Jetpack Compose) | **Recommended enterprise default** when you want zero UX/accessibility compromise while removing duplicated business logic. |
| **Compose Multiplatform (CMP)** | **Stable on iOS** (since 1.8+) | Logic + UI (85-95%) | Good, but watch iOS feel/text input | Relevant for B2B/internal apps or Android-first teams that want to share UI without hiring SwiftUI developers. |
| **Flutter (Impeller)** | **Mature** | Logic + UI (90%+) | Smooth (120 FPS), but non-native widgets and accessibility to verify | Very good for uniformly branded apps and dedicated Dart teams. Watch binary size and the native bridge for MDM/hardware SDKs. |
| **React Native (New Arch / Fabric)** | **Mature** | Logic + UI (80-90%) | Native underneath, but fragile npm dependencies | Relevant if the company is heavily invested in TypeScript/React. Requires strict governance of native dependencies. |
| **Native + Rust core (`uniffi`)** | **Solid (core layer)** | Domain/Crypto/Sync shared with desktop/CLI | 100% native (SwiftUI + Compose) | Ideal **only if a Rust engine already exists** (for example desktop + mobile app). Avoid Tauri v2 Mobile / WebView for a rich mobile app. |

## 3. Modular layout

### Profile A: thin client (connected business app)
```text
mobile-app/
├── iosApp/           # SwiftUI + navigation + light DI
├── androidApp/       # Jetpack Compose + ViewModels + Retrofit/Ktor
└── shared-contracts/ # Shared OpenAPI / Protobuf schemas (client generation)
```

### Profile B: offline-first / KMP or shared core
```text
enterprise-mobile-app/
├── shared/
│   ├── domain/       # Pure models, use cases, state machines (0 OS dependency)
│   ├── data/         # Repositories, HTTP client, SQLite/SQLDelight/Room KMP, outbox
│   ├── sync/         # Idempotent sync engine, backoff, conflict resolution
│   └── presentation/ # Shared StateHolders / ViewModels (StateFlow -> SKIE on iOS)
├── androidApp/       # Compose UI, WorkManager, Keystore, AppConfig RestrictionsManager
└── iosApp/           # SwiftUI, BGTaskScheduler, Keychain, AppConfig UserDefaults
```

## 4. Concurrency, UDF, and *Process Death* survival

- **Unidirectional Data Flow (UDF / MVI):** The UI renders an immutable state (`StateFlow<UiState>` / Swift `@Observable`) and emits user intents. One-off events (navigation, toast) go through properly consumed streams, never through forgotten booleans in the state.
- **Zero Main Thread blocking:** On Android, blocking the Main Thread for more than 5 s triggers an **ANR** (*Application Not Responding*) that heavily penalizes Play Store ranking. On iOS, the *Watchdog* kills the app instantly if launch or the main thread blocks too long. All disk/network/crypto I/O runs on `Dispatchers.IO` / `Dispatchers.Default` or a Swift `actor` / `Task.detached`.
- **Surviving *Process Death*:** Pass only **primitive identifiers** (`itemId: String`) in navigation routes, never large serialized objects (heavy `Parcelize` leads to Android `TransactionTooLargeException` above 1 MB). The screen rehydrates its data from local storage using the restored ID.
