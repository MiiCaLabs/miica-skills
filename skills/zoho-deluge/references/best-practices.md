# Best Practices & Performance

Consolidated from Zoho's official Deluge/Creator best-practices guidance. Apply these whenever writing new scripts or reviewing existing ones.

## Performance

- **Never fetch all records then filter in Deluge.** Push the filter into the criteria (`Form[Status=="Open"]`) and let Zoho's query engine do it - fetching everything and looping to check a condition generates unnecessary load and can cause performance issues at scale.
- **Prefer `&&` over `||` in criteria.** OR requires evaluating conditions separately and is less efficient; restructure logic (e.g. two narrower fetches, or an `in` list) where possible.
- **Filter on indexed / unique fields** (ID, Email, Username) for faster, more reliable fetches rather than free-text fields.
- **Use `contains` sparingly** - only on short text fields; it's comparatively expensive on long text.
- **Use `sort by` explicitly if order matters.** Unsorted fetch order (often "oldest added first") is not guaranteed to remain stable over time.
- **Avoid heavy nesting of loops/conditionals.** Deeply nested `for each` + `if` blocks are hard to read and to optimize - extract nested logic into a custom function instead.
- **Watch execution limits.** Scripts commonly run under a 60-second timeout and a per-run statement-count limit - a script that must process large volumes should use scheduled/batch functions and pagination (`page`, `per_page` params on integration tasks) rather than one big loop.
- **`invokeUrl` / integration task calls inside a loop cost one external-call unit per actual execution**, not per line of script - a call inside a 1000-iteration loop consumes 1000 calls against your plan's limit. Batch API calls where the target API supports it, or reconsider whether the loop is necessary.
- **Use built-in functions instead of hand-rolled logic** where one exists (e.g. `equalsIgnoreCase()` instead of manually lowercasing both sides) - built-ins are optimized internally.

## Style & maintainability

- **Meaningful variable names.** `customer_email`, not `x` or `temp2`.
- **Comment non-obvious logic**, especially multi-step scripts touching several forms/services - explain *why*, not just restate *what* the line does.
- **Extract repeated logic into custom functions** (see `references/functions.md`) rather than copy-pasting the same block (e.g. a sendmail call) across multiple workflow events.
- **Use system variables instead of hardcoding app-specific identifiers** where available (e.g. `zoho.appuri`, `zoho.appname`, `zoho.loginuserid`, `zoho.adminuserid`) so scripts don't silently break if the app is renamed/transferred or embedded elsewhere.
- **Leave `info` debug statements** where they aid future troubleshooting, but strip any that would log sensitive data (tokens, passwords, full PII) in a production script.
- **Test in staging/sandbox before production** where the product supports it, especially for scripts that create/update/delete records or call paid external APIs.
- **Keep scripts under version control / change history** where the product supports script history, so changes can be reviewed and rolled back.

## Defensive coding (see also `references/error-handling.md`)

- Guard every field/list/map read that could be null or absent with `isNull()`, `isBlank()`, `ifNull()`, or a `.count() > 0` / `.size() > 0` check before acting on it - there's no exception handling to fall back on.
- Validate external API responses before parsing them as JSON/Map - a failed or malformed response will throw a runtime "Invalid JSON Format String" error if you convert it blindly.
- When updating/deleting records, always double-check the criteria is as narrow as intended - an overly broad delete criteria is unrecoverable without a backup.

## Security

- Prefer named **connections** (OAuth) over embedding raw API keys/tokens as string literals in a script - connections centralize credential rotation and reduce leakage risk if the script is viewed/shared.
- Don't log secrets, tokens, or full customer PII via `info` in scripts that might be visible to other users/developers with access to execution logs.

## Editor & environment notes

- The Deluge script editor supports drag-and-drop task tiles from a sidebar as well as typed syntax; auto-suggestion (`Ctrl`/`⌃` + Space) and hint tags (`Cmd/Ctrl + .` next, `Cmd/Ctrl + ,` previous) help discover available methods via the dot operator. Common shortcuts: Save (`Cmd/Ctrl+S`), Execute (`Cmd/Ctrl+E`), Comment/Uncomment (`Cmd/Ctrl+/`), Find (`Cmd/Ctrl+F`), Find & Replace (`Cmd/Ctrl+Alt+F` win / `Cmd+Opt+F` mac), Go to Line (`Cmd/Ctrl+L`).
- Editor **preferences** (font, word wrap, syntax builder, beta error-highlighter) are per-account/OS and don't transfer between operating systems; they don't change script behavior, only the authoring experience.
- **On-premise deployments** (Creator on-premise, ManageEngine ServiceDesk Plus and other ManageEngine products) have a materially smaller feature surface - no `zoho.*` system variables (except Creator on-premise), no Zoho integration tasks/AI tasks/`invokeUrl` in most cases, no editor preference customization. See `references/system-variables.md` for the full breakdown. Confirm the target is cloud vs. on-premise before assuming a feature is available.

## Common anti-patterns to flag in review

| Anti-pattern | Why it's a problem | Fix |
|---|---|---|
| `Form[ID != 0]` fetch followed by an in-Deluge `if` filter inside the loop | Loads far more data than needed | Move the condition into the criteria itself |
| Checking `.count() > 0` from one fetch, then fetching the *same* criteria again to use the records | Doubles the fetch cost | Reuse the first fetch's collection directly inside the loop |
| Deeply nested `if` inside `if` inside `for each` inside `for each` | Unreadable, hard to optimize/debug | Extract into named custom functions with early returns/guards |
| Hardcoded API tokens or account IDs as string literals | Security risk, breaks on rotation | Use a connection; parameterize IDs |
| No comments on a script doing several unrelated things (fetch + transform + 3 API calls + email) | Unmaintainable by anyone else (or future you) | Add section comments per logical block |
| `==` for text comparison where case may differ | Silent mismatches | `equalsIgnoreCase()` |
| Reusing the same loop variable name across nested `for each` loops | Shadowing bugs | Give each loop variable a distinct, descriptive name |
| `for(i = 1; i <= n; i = i + 1) { }` (C-style indexed loop) or `while(...)` | Neither exists in Deluge - "Improper Statement" save error | Rewrite as `for each` over a fixed-size literal list, breaking on the real stopping condition - see `references/control-flow.md` |
| `{"type":"ActiveConfirmedAdmins"}` (or any made-up `type` value) in a `zoho.crm.getRecords("users", ...)` criteria map | Not a real value - the API only accepts `AllUsers`, `AdminUsers`, `ActiveUsers`, `DeactiveUsers` - so the call likely errors or silently returns the wrong set | Use `AdminUsers`/`ActiveUsers` and check `status`/`confirm` on each returned user in Deluge if you need a narrower combination |
| Scanning every element of a `for each` after the target has already been found (e.g. paginated admin/user lookup) | Wastes iterations, and if the outer loop also has a page-fetch cost, wastes external-call units | `break` out of the inner loop the moment the match is found, and include the found-flag in the outer loop's exit condition |
| Sending a JSON string via `invokeUrl`'s `body`/`parameters` without an explicit `Content-Type: application/json` header | `parameters`/TEXT `body` default to `text/plain` - receiving API (including Zoho's own REST APIs) may reject or misparse the payload | Always set `headers: {"Content-Type": "application/json", ...}` when the payload is JSON; see `references/integrations-and-tasks.md` |
