# KB-03: Native OS Integration, Enterprise Networking, Tray, and CLI

## 1. In-process daemon vs separate OS service

Choose the process architecture explicitly:
- **In-process (Tauri default model):** The engine runs in the main process with no visible window. Simple deployment and atomic auto-update, but a native WebView/GPU crash interrupts background tasks.
- **Separate OS service (`launchd` LaunchAgent / Windows Service):** Required only if synchronization must run before user login or survive a UI crash. Note: **on Windows, a running service binary locks its `.exe`/`.dll` files**, so the service must be stopped before any update.

## 2. Power and enterprise network resilience

- **Single instance and clean shutdown:** Lock at startup (`tauri-plugin-single-instance` or a local socket). On a stop signal (`SIGTERM`/`SIGINT` or `Exit`), stop workers, flush `sync_outbox`, and run `PRAGMA wal_checkpoint(TRUNCATE);`.
- **Sleep / wake cycle:** Listen to system events (`NSWorkspaceWillSleepNotification` / `didWakeNotification` on macOS, `WM_POWERBROADCAST` on Windows):
  - *Before sleep:* Cleanly pause transfers and save offsets.
  - *On wake:* Immediately purge HTTP/WebSocket pools (half-open sockets) and trigger a reconciliation.
- **Topology and enterprise network (critical):**
  - Native monitoring via `NWPathMonitor` (macOS) / Windows network APIs to detect Wi-Fi/VPN switches, and reduced cadence in power-saving mode (*Low Power Mode*).
  - **TLS inspection and corporate proxies:** In `reqwest` / `rustls`, **never rely on `webpki-roots` alone**. Use **`rustls-platform-verifier`** (or `native-tls`) to trust internal certificate authorities injected by MDM (Zscaler, Netskope, corporate proxy), and honor OS proxy / PAC / `HTTPS_PROXY` settings.
  - **Hybrid post-quantum key exchange:** `rustls` negotiates `X25519MLKEM768` by default since 0.23.27. The ClientHello grows from about 300 bytes to 1.3 KB and some older TLS inspection appliances reject it. Test behind customer proxies, expose an option (MDM profile or configuration file) to fall back to classical groups, and surface negotiation failures in *Doctor*.

## 3. System tray and Dual-Window architecture

- **Reactive TrayController:** Subscribed to `watch::Receiver<DaemonStatus>`, updating the icon (`isTemplate = true` on macOS + *Idle / Syncing / Error* status badge) and contextual actions.
- **Dual-Window strategy:**
  - *Tray left click (or global shortcut `Cmd+Shift+Space`):* Shows a compact **popover** with no title bar, kept hidden in memory (`hide()` on focus loss) for instant opening. On Windows 11 (where the tray may be in the overflow menu), handle multi-DPI positioning fallback when the icon coordinates are outside the visible area.
  - *Right click / dedicated action:* Opens (or recreates on demand) the full **main window** (diffs, detailed logs, configuration), destroyed when closed.

## 4. Notification pipeline and secure CLI companion

- **Anti-spam pipeline:** `DomainEvent` -> **deduplication** -> **coalescing (1.5 s sliding window)** -> **severity routing** (native OS notification with action button + `monapp://...` deep-link URI for critical alerts; silent in-app center for informational ones).
- **CLI companion (`monapp-cli`), mandatory local authentication:**
  - Communicates through a **Unix Domain Socket** (macOS/Linux) or **Named Pipe** (Windows).
  - **Local IPC security:** Never create an open socket in `/tmp` without access control. Place the socket in a per-user `0700` folder (`~/Library/Application Support/<app>/` or `$XDG_RUNTIME_DIR/<app>/`), check the caller's UID (`SO_PEERCRED` on Linux, `LOCAL_PEERCRED` / `getpeereid` on macOS), and configure a **DACL restricted to the current user's SID** on the Windows Named Pipe.
