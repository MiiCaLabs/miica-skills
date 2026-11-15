# KB-01: System Architecture, Cargo Workspace, and the "Resident Daemon" Model

## 1. Paradigm: persistent daemon vs UI surfaces

For a critical desktop application (synchronization, orchestration, monitoring), separate the **resident business engine** from the **interaction surfaces**:

```text
+-------------------------------------------------------------------------+
|                    PERSISTENT RUST PROCESS (ENGINE)                     |
|                                                                         |
|  [ Sync / Job Engine ] <---> [ SQLite WAL + CAS ] <---> [ App Core ]    |
|            |                                                 |          |
|            +---------------> ( Event / Watch Bus ) <---------+          |
|                                 |        |        |                     |
+---------------------------------|--------|--------|---------------------+
                                  v        v        v
                   +--------------+    +-------+    +--------------------+
                   | Tray & Menu  |    | Notif |    | UI windows         |
                   | Controller   |    | Engine|    | - Popover (hidden) |
                   +--------------+    +-------+    | - Main (destroyed) |
                                                    +--------------------+
                                                              ^
                   [ CLI Companion ] --(UDS / Named Pipe auth)+
```

- **Window memory strategy:**
  - **Heavy main window:** On close (`WindowEvent::CloseRequested`), let the WebView be destroyed to free 80 to 150 MB of RAM.
  - **Tray popover:** Do not destroy its WebView on every focus loss; keep it hidden (`window.hide()`) so reopening is instant (< 50 ms).
  - **Process exit:** Under Tauri v2, intercept `RunEvent::ExitRequested` only when `code.is_none()` (last window closed), while letting the *Quit* menu or the updater call `app_handle.exit(0)` explicitly, and use `App::run_return` for clean final cleanup.

```rust
// Tauri v2 pattern: keep the engine alive while still allowing a real Quit
app.run_return(|app_handle, event| match event {
    tauri::RunEvent::ExitRequested { api, code, .. } if code.is_none() => {
        api.prevent_exit(); // Last window closed: the engine stays resident
    }
    tauri::RunEvent::Exit => {
        // Flush actors and PRAGMA wal_checkpoint(TRUNCATE) before exit
    }
    _ => {}
});
```

## 2. Cargo workspace sizing

### Profile A: standard business app (2 to 3 crates)
```text
enterprise-app/
├── Cargo.toml
├── crates/app-core/            # Business domain, HTTP client, light SQLite cache
├── src-tauri/                  # IPC commands, ACL, tray, windows
└── frontend/                   # pnpm monorepo (React/Svelte/Solid)
```

### Profile B: local-first / full daemon (5 to 7 crates)
```text
enterprise-desktop-app/
├── Cargo.toml                  # Root workspace + [workspace.dependencies]
├── crates/
│   ├── app-domain/             # Pure models, state machines, business errors (0 I/O)
│   ├── app-storage/            # SQLite (WAL, FTS5), migrations, CAS blob storage
│   ├── app-sync/               # Sync engine, outbox, HLC clocks, conflicts
│   ├── app-workflows/          # Business orchestration (builds, jobs, pipelines...)
│   ├── app-os/                 # System integration (Keychain, sleep/wake, network)
│   ├── app-daemon/             # Actors, UDS/Named Pipe server for the CLI
│   ├── app-ui/                 # src-tauri backend (IPC, tray, windows) or GPUI
│   └── app-cli/                # Optional companion binary
└── frontend/                   # (Tauri only) static SPA
```

## 3. Architectural trade-off (Tauri v2 vs GPUI)

| Criterion | Tauri v2 (enterprise default) | GPUI (specialized cases only) |
| :--- | :--- | :--- |
| **Maturity and governance** | **Stable ecosystem (2.x)**, tracked release cycle, built-in ACL audit | `crates.io` frozen at `0.2.2`; often requires a git pin on the Zed repo or a community fork |
| **Rendering budget** | Standard 60 FPS (OS WebView) | **120 FPS (8.3 ms/frame)** via GPU rendering (Metal/Vulkan/DX) |
| **Memory footprint** | 80-180 MB with window open (~35 MB closed) | **30-50 MB** constant |
| **WCAG 2.2 AA accessibility** | **Native** via DOM/ARIA and OS screen readers | **Costly** (NSAccessibility/UIA bridges and keyboard navigation must be built) |
| **UI richness and OS integration** | Full web ecosystem + official plugins (Tray, Updater, Dialog) | Complex widgets to build and maintain in-house |
| **Target use case** | **90% of enterprise apps** (dashboards, forms, workflows) | High-density editors, inspectors for millions of log lines, creative tools |

## 4. Concurrency, SQLite single-writer, and IPC contracts

- **Single-writer actor pattern:** Each critical subsystem (`SyncEngine`, `WorkflowOrchestrator`) is an actor driven through `tokio::sync::mpsc` (commands) that exposes its state through `tokio::sync::watch` (lock-free reads).
- **Dedicated SQLite writer actor:** Do not share the SQLite write connection in a multi-task async pool (it causes `SQLITE_BUSY` even in WAL mode). Use **a single writer thread/actor** (`rusqlite` or `sqlx`) and reserve the pool for concurrent reads:

```rust
// Minimal SQLite writer actor that eliminates SQLITE_BUSY in an async context
pub struct DbWriter {
    tx: tokio::sync::mpsc::Sender<Box<dyn FnOnce(&mut rusqlite::Connection) + Send>>,
}

impl DbWriter {
    pub async fn write<R: Send + 'static>(
        &self,
        f: impl FnOnce(&mut rusqlite::Connection) -> rusqlite::Result<R> + Send + 'static,
    ) -> anyhow::Result<R> {
        let (resp_tx, resp_rx) = tokio::sync::oneshot::channel();
        self.tx.send(Box::new(move |conn| { let _ = resp_tx.send(f(conn)); })).await?;
        Ok(resp_rx.await??)
    }
}
```

- **UI thread isolation:** No disk, network, or SQL I/O on the main thread (`tokio::spawn` / `spawn_blocking` under Tauri, `cx.background_executor()` under GPUI).
- **Typed contracts (contract-first):**
  - Under Tauri v2, `tauri-specta` v2 (still `2.0.0-rc.x`, so pin the exact version together with `specta`) generates the TypeScript bindings. If enterprise policy forbids `rc` dependencies, prefer `ts-rs` + versioned JSON schemas.
  - Use `tauri::ipc::Channel<T>` for continuous streams (progress, logs) and asynchronous custom URI protocols for large binaries.
