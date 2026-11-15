# KB-02: Local-First Persistence, CAS Storage, and Synchronization Engine

## 1. Hybrid storage (SQLite WAL + CAS)

- **SQLite configured for concurrency and robustness:**
  - Mandatory on every connection open: `PRAGMA journal_mode = WAL;`, `PRAGMA synchronous = NORMAL;`, `PRAGMA foreign_keys = ON;`, `PRAGMA busy_timeout = 5000;`.
  - Full-text indexing with **SQLite FTS5** for instant local search.
  - **Expand & Contract migrations + anti-downgrade guard:** Never destructively drop a column in a minor version. Check `PRAGMA user_version` at startup: if the local database is newer than the version the binary supports (for example a return from *Canary* to *Stable*), refuse to open it with an explicit message instead of corrupting invariants.
- **Content-Addressable Storage (CAS):**
  - Heavy binary artifacts are not stored as SQLite `BLOB`s. They live in `blobs/sha256/<first-2-hex>/<sha256>`.
  - **Windows-compatible atomic write:** Create the `.tmp` file **in the same directory/volume** as the target blob (avoid `%TEMP%`, which may be on another partition and break `rename` atomicity). On Windows, add a short retry with backoff (for example 3x 20 ms) on `PermissionDenied` / `SharingViolation` caused by real-time antivirus scanning (Windows Defender).
  - **LRU garbage collector:** A periodic worker applies retention policies (pinned items + last N versions) and purges orphan blobs against a configurable disk quota.

## 2. Synchronization engine state machine

```text
Idle --(Timer / FileWatcher / Push / OS wake)--> ScanningLocal
  ^                                                  |
  |                                                  v
Backoff(Jitter) <--(Network error / 429/5xx)-- PushingOutbox --> PullingDelta --> Reconciling
```

- **Transactional outbox (`sync_outbox`):** Every local mutation writes to the business table and to `sync_outbox` in the same SQLite transaction, guaranteeing zero loss on crash.
- **Delta sync and monotonic cursors:** Incremental synchronization through server sequence cursors. Use **Hybrid Logical Clocks (HLC)** only if the system is truly decentralized or has no authoritative server clock.
- **Conflict resolution proportionate to the need:**
  - *Metadata / structured entities with an authoritative server (90% of cases):* Optimistic versioning (`ETag` / `version` + server-side 3-way or field-by-field merge).
  - *Collaborative multi-user text documents offline:* CRDTs (`yrs` / `automerge`) only if offline real-time collaboration is a core requirement.
  - *Non-mergeable binary artifacts:* Distributed pessimistic locking (file locking with TTL and visible owner) or quarantine in a `Conflict` state for manual arbitration.

## 3. Local watching and hybrid network transport

- **File system watcher (`notify`) with echo suppression:**
  - Adaptive debouncer (groups write bursts) + `.syncignore` exclusion rules (`.git`, `node_modules`, editor temp files).
  - **Critical rule (anti-loop):** Always mark or filter writes performed by the sync engine itself (temporary registry of path + expected hash/mtime) so an incoming sync does not trigger an endless upload cycle.
- **Push + polling fallback:** Persistent channel (WebSocket / SSE / gRPC stream) with an application heartbeat, automatically falling back to adaptive `ETag` polling behind corporate proxies that cut long-lived WebSockets.
