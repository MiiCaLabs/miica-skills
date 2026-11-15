# KB-04: Injections (`A05:2025`), Uploads, Errors (`A10:2025`), and AI

## 1. Injections and parsers (`A05:2025`)

- **SQL injection:** Require parameterized queries everywhere. **Classic audit trap:** ORMs protect values (`WHERE id = ?`), but developers often concatenate dynamic sorting (`ORDER BY ${sortField} ${dir}`), `LIKE`, or table/column names. Impose a **strict allowlist** mapped to authorized constants.
- **Command injection:** Ban `exec()`, `system()`, `os.system()`, and `shell: true` with user input. Use APIs that take an argument array with no shell (`execFile`, `subprocess.run(..., shell=False)`, `std::process::Command`).
- **Path traversal:** On every file open by name/path (`download?file=...`, `.zip`/`.tar` extraction, *Zip Slip*):
  1. Reject absolute paths and `..`.
  2. Resolve the real path (`realpath` / `canonicalize` to resolve symlinks) and verify it strictly starts with the authorized root directory (`resolved.startsWith(baseDir + sep)`).
- **Other critical injections:**
  - **SSTI (*Server-Side Template Injection*):** Never compile a template (Jinja2, Handlebars, EJS, Pug) from a user-entered string.
  - **XXE:** Explicitly disable DTDs and external entities on every XML parser.
  - **Untrusted deserialization:** Ban `pickle` (Python), unfiltered `ObjectInputStream` (Java), `yaml.load` (prefer `safe_load`), and `unserialize()` (PHP) on any external data.
  - **XSS / DOM-XSS:** Automatic contextual encoding, no `innerHTML`/`dangerouslySetInnerHTML`/`v-html` without strict DOMPurify, and URL scheme validation (`https:`/`http:` only, block `javascript:`).

## 2. File upload security

A poorly controlled upload frequently leads to stored XSS, SSRF, or RCE:
1. Check the maximum size **before** loading into memory/disk (DoS protection).
2. Check the real format by **inspecting magic bytes** (and re-encode/strip EXIF for images), never through the `Content-Type` header or the extension alone (beware double extensions and SVGs containing `<script>`).
3. Rename the file with a random server-side UUID.
4. Store outside the executable directory and serve uploads from a **separate sandbox domain** (for example `usercontent.example.com`) with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`.

## 3. Exceptional conditions and business logic (`A10:2025`, new)

- **Systematic fail-closed:** Audit all `try/catch` blocks, `if err != nil`, timeouts, and default values (a `switch` without `default` that rejects the action). A `catch` block that logs the error and continues executing a security check is a **Critical** flaw.
- **Error leaks:** Production `4xx`/`5xx` responses must return a generic message and a `correlation_id`, never a stack trace, file path, exact DBMS version, or SQL query.
- **Race conditions / TOCTOU (*Time-of-Check to Time-of-Use*):** Audit concurrent operations on limited resources (bank withdrawal, single-use coupon/promo code, quota creation). Require atomic database locks (`UPDATE ... WHERE balance >= amount`, `SELECT ... FOR UPDATE`, `UNIQUE` constraints, or `SERIALIZABLE` transactions) rather than an application-level `if (check()) { update() }`.

## 4. Systems with AI / LLM agents (if applicable)

- **Prompt injection (direct and indirect):** Treat content from RAG documents, emails, web pages, or external tools as untrusted; never trust instructions found in data.
- **Least privilege on tool calls:** The agent must not hold global admin rights; each tool call (SQL, API, email) runs **within the strict ACL context of the current user**, with explicit confirmation (*human-in-the-loop*) for irreversible or destructive actions.
- **ACLs in RAG:** Filter vector embeddings/chunks according to the user's document permissions **before** or **during** retrieval (otherwise an unauthorized user exfiltrates HR/confidential documents through the LLM).
