# KB-02: Mobile Persistence, Encryption, and Resilient Synchronization

## 1. SQLite WAL, Room/SQLDelight, and SQLCipher

- **Local engine:** Prefer **Room (now KMP)** or **SQLDelight** for compile-time-typed, reactive queries (`Flow<List<T>>`), configured with `journal_mode = WAL` and `foreign_keys = ON`.
- **SQLCipher, pragmatic trade-off:**
  - iOS (`NSFileProtectionComplete` / `CompleteUntilFirstUserAuthentication`) and Android (File-Based Encryption since Android 10+) already encrypt the disk at OS level when the device is locked.
  - Add **SQLCipher** (application-level encryption of the whole database) **only if an explicit regulatory requirement** (health, defense, strict finance) demands it: SQLCipher adds CPU/memory overhead, complicates native binary size (**16 KB** alignment is mandatory on Android), and requires rigorous management of a key stored in the hardware Keychain/Keystore.
- **Safe migrations:** Never enable `fallbackToDestructiveMigration()` in production. Always test incremental migrations from version `N-3` to `N` in CI with exported schemas.

## 2. Blob storage and Apple iCloud Backup rules

- **Outside SQLite:** Never store images, PDFs, or attachments as `BLOB`s in SQLite. Write atomically (temporary file in the same directory + `rename`) into application folders (`filesDir` / `Application Support`).
- **Critical iOS pitfall (`NSURLIsExcludedFromBackupKey`):** By default, iOS backs up the content of `Documents/` and `Application Support/` to iCloud. If the app stores synchronized caches or downloadable media without marking those files `isExcludedFromBackup = true` (or without using `Caches/`), **Apple rejects the App Store submission** (violation of the *App Store Review Guidelines* on iCloud storage).
- **Quota and LRU cleanup:** Implement a bounded periodic GC to purge viewed, non-pinned media so users do not uninstall the app to free storage.

## 3. Transactional outbox and mobile idempotency

On an unstable mobile network (signal lost in an elevator right after the HTTP request is sent, before the `200 OK` arrives), duplicates are unavoidable without idempotency:

```text
User action
   │
   ▼ (single SQLite transaction)
[ Business table (status = Pending) ] + [ sync_outbox (op_id = UUIDv4, payload) ]
   │
   ▼ (Network worker with header Idempotency-Key: <op_id>)
Enterprise API ──(Timeout/network drop)──► Retry with the SAME op_id (deduplicated server-side)
   │
   └──(200 OK / 409 Conflict)──► Local update + outbox deletion
```

- **Golden rule:** Every `sync_outbox` write generates a client-side `op_id` (UUID) sent in the `Idempotency-Key` header. The backend guarantees that a network retry never creates a business duplicate.

## 4. Resilient large transfers and conflict resolution

- **Background transfers delegated to the OS:** For heavy photo/document uploads or offline bundle downloads, **do not use a classic in-memory HTTP client** (killed as soon as the screen turns off):
  - **iOS:** Use `URLSessionConfiguration.background(withIdentifier:)` (the `nsurlsessiond` system daemon completes the transfer even if the app is killed and wakes the app at the end).
  - **Android:** Use `WorkManager` with `Constraints` (`NetworkType.CONNECTED` or `UNMETERED`, `BatteryNotLow`) and `OutOfQuotaPolicy` if urgent.
- **Proportionate conflict resolution:**
  - *90% of enterprise apps:* Optimistic versioning (`ETag` / `version`), server-side field-by-field merge, or a local `Conflict` state for explicit user arbitration.
  - *CRDTs:* Reserved for simultaneous offline collaborative editing (shared note-taking/drawing), because storage cost and history compaction hurt mobile RAM.
