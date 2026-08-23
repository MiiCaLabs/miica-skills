---
name: zoho-deluge
description: Write, review, refactor, or debug Zoho Deluge scripts used across Zoho Creator, CRM, Books, Desk, People, Cliq, Flow, Sheet, and other Zoho products. Use whenever a request mentions Deluge, Zoho custom functions or workflow scripts, invokeUrl, record criteria, Creator tasks, zoho.* integration tasks, or a .deluge file. Covers syntax, control flow, List and Map collections, record operations, REST calls, custom functions, defensive error handling, built-in functions, Creator-only tasks, system variables, and product-specific integrations. Consult the matching references before writing or editing Deluge code.
---

# Zoho Deluge Scripting

Deluge ("Data Enriched Language for the Universal Grid Environment") is Zoho's proprietary low-code scripting language, embedded across Zoho Creator, CRM, Books, Desk, People, Cliq, Flow, Sheet, and more. It has its own syntax - it is **not** JavaScript, Python, or Java, even though it superficially resembles C-family languages. Do not import assumptions from those languages (e.g. there is no `try/catch`, no classes, semicolons are mandatory, `=` is used for both assignment and map literals depending on context).

This skill gives you the core syntax, task reference, and idiomatic patterns needed to write correct, efficient Deluge. For deep dives on a specific area, read the matching reference file - don't guess.

## Quick orientation: what kind of task is this?

| The user wants... | Read this reference |
|---|---|
| Basics: variables, data types, operators, expressions, comments | `references/fundamentals.md` |
| if/else, `for each`, `break`/`continue`, bounded/counted loops | `references/control-flow.md` |
| Working with `List()` / `Map()` / Collection | `references/collections.md` |
| Fetching, filtering, creating, updating, deleting Zoho records; criteria syntax `[field == value]` | `references/records-and-criteria.md` |
| Calling an external REST API (`invokeUrl`), webhooks, connections, sending mail/SMS | `references/integrations-and-tasks.md` |
| Writing a custom function, calling a function from another function, return values | `references/functions.md` |
| A script is throwing an error / won't save / behaves unexpectedly | `references/error-handling.md` |
| "Is this good Deluge?" / code review / performance concerns | `references/best-practices.md` |
| Ready-to-adapt code snippets for common jobs | `references/snippets.md` |
| A specific built-in function (string/number/date-time/time/list/map/file/encryption/XML/type-check) | `references/builtin-functions.md` |
| Zoho Creator-only tasks: AI/Zia tasks, Blueprint tasks, composite fields, client functions (hide/show/enable), subform rows, file-upload-field functions, `openUrl`, `executeXpath`, misc tasks (cancel submit/delete, getFieldValue) | `references/creator-tasks.md` |
| `zoho.*` system variables, notification types overview, which Zoho products support Deluge, on-premise/ServiceDesk Plus differences | `references/system-variables.md` |
| Which task names exist for a specific product's integration namespace (`zoho.crm.*`, `zoho.books.*`, `zoho.desk.*`, Cliq, Mail, Sheet, Projects, Recruit, WorkDrive, Writer, Connect, Bookings, Calendar, Inventory, Invoice, Billing, etc.) | `references/integration-tasks-catalog.md` |

If a request spans multiple areas (e.g. "fetch CRM leads and email the top 5"), read all the relevant reference files before writing code - don't rely on general programming instinct where Deluge's syntax diverges.

## Non-negotiable syntax rules

These trip up even experienced developers coming from other languages, so check every script against them before presenting it:

1. **Every statement ends in a semicolon `;`.** Missing semicolons are the #1 "Improper Statement" save error.
2. **No `var`, `let`, `const`, or type declarations for normal variables.** Just `name = "John";`. (Custom function parameters and return types are the exception - see `references/functions.md`.)
3. **String concatenation uses `+`.** `full_name = first + " " + last;`
4. **Method calls use dot notation on the value itself**, Deluge calls these "built-in functions": `myText.toUpperCase()`, `myList.size()`, `myMap.containsKey("x")`.
5. **There is no `try`/`catch`/`throw`.** Prevent runtime errors defensively - check `isNull()`, `isBlank()`, `count() > 0` before acting on a value. See `references/error-handling.md`.
6. **Blocks use `{ }`, no indentation-based scoping**, but always indent for readability anyway.
7. **Record/Map access**: `record.Field_Link_Name` (dot notation) fetches a field value from a fetched record; `map.get("key")` / `map.get(key)` for Map variables you built yourself.
8. **List and Map literals**: `myList = {"a", "b", "c"};` and `myMap = {"key1": "value1", "key2": "value2"};` - or use `List()` / `Map()` constructors and `.add()` / `.put()`.
9. **Comments**: `//` single line, `/* ... */` multi-line.
10. **`info <expr>;`** is the debug/print statement - not `console.log` or `print`.
11. Execution has hard limits depending on the product (commonly a **60-second** execution timeout and a statement-count limit per run) - loops over large record sets need criteria/pagination, not "fetch everything then filter in Deluge."
12. **No C-style `for(init; condition; increment)` loop, and no `while` loop either.** `while` is not a Deluge keyword - it has no official doc page, is absent from the reserved-keywords list, and is an "Improper Statement" save error like a C-style `for`. The only loop construct is `for each`. An indexed/counted loop (e.g. manual pagination) must be written as `for each` over a fixed-size literal list, with `break` on the real stopping condition - see `references/control-flow.md`.
13. **`invokeUrl`'s `parameters` key defaults to `text/plain` for TEXT values** - sending a JSON string (`map.toString()`) through `parameters` (or `body`) without an explicit `headers: {"Content-Type": "application/json"}` will likely be rejected or misparsed by the receiving API. `parameters` and `body` can never both be set in the same call. See `references/integrations-and-tasks.md`.
14. **No `?:` ternary operator.** `condition ? a : b` does not exist in Deluge (it's a long-standing community feature request, never shipped). The documented inline-conditional-expression equivalent is `if(<criteria>, <valueIfTrue>, <valueIfFalse>)` - the same `if` keyword as the block statement, but called with three comma-separated arguments and used as an expression: `status = if(age >= 18, "adult", "minor");`.

## Workflow for this skill

1. Identify which Zoho product the script runs in if known (Creator, CRM, Books, Desk, Cliq, Flow, Sheet, etc.) - some tasks (e.g. `for each record in Form [...]`, subform access) are Creator-specific, while `invokeUrl`, `sendmail`, custom functions, and core syntax are common across products. If unclear and it matters for the answer, ask.
2. Read the relevant reference file(s) from the table above.
3. Write the script following the non-negotiable rules above.
4. Before presenting the script, re-check: semicolons present, no null-unsafe field access, criteria syntax uses `[ ]` not `( )`, loop variables aren't reused, no C-style `for(;;)` or `while(...)` loop anywhere (rule 12), and any external call has sane defaults (GET unless stated otherwise, explicit `Content-Type: application/json` header whenever a JSON string is sent via `body` or `parameters` - rule 13).
5. If the script is long or does several distinct things, add `//` comments explaining each block - this is explicitly a Zoho-recommended practice for maintainability.

## Where scripts run (context matters)

Deluge is not a standalone language - it always runs inside a Zoho product's editor, in one of these contexts, which affects what's available:
- **Zoho Creator**: workflow scripts on form events (On Load, On Validate, On Success, On User Input, subform add/delete row), custom functions, schedules, approvals. Only Creator has `for each <var> in <Form>[<criteria>]` record iteration and subform-specific syntax.
- **Zoho CRM, Books, Desk, People, Cliq, etc.**: workflow rules, custom functions, button actions, Cliq bots/message handlers. Use product-specific integration tasks like `zoho.crm.getRecords`, `zoho.books.getRecords`.
- **Zoho Flow**: custom function blocks inside a visual flow - same Deluge syntax, deployed as one editor block.
- **Zoho Sheet**: custom functions callable as spreadsheet formulas, must declare a return type.

When a task's availability differs by product (noted in the official docs as "this task can be used in the following events" or "applicable only to Zoho Creator"), mention that constraint rather than assuming the same script works everywhere.

## Recent Deluge changes (as of this skill's last content crawl)

These are new enough that older training data likely predates them - verify current syntax against the live docs before relying on them for anything nontrivial:
- **May 2026**: `base64Encode`/`base64Decode` gained a `character_set` parameter (UTF-8/UTF-16LE/UTF-16BE); new `base32Encode`/`base32Decode` tasks.
- **April 2026**: `convertToPDF` gained 20+ optional layout parameters (scale, orientation, margins); Zoho CRM V8 integration tasks introduced (13 operations).
- **March 2026**: `toWords()` gained Portuguese (`'pt'`) language support.
- **February 2026**: New integration task suites for Zoho Webinar (17 tasks) and Zoho Show (5 tasks).
- **January 2026**: `Translate` task expanded to 74 total supported languages.

## Source

Reference content in this skill was extracted from the official Zoho Deluge documentation site and every section reachable from its left sidebar, including subpages: `https://www.zoho.com/deluge/help/` (introduction, data types, operators, variables, expressions, system variables, notifications, on-premise, Zoho services list), the Deluge-tasks category pages (AI tasks, Creator blueprint tasks, conditions, data access, composite fields, client functions, miscellaneous, debug, list/map manipulations, subform tasks, file-upload-field tasks, user roles & properties, XML manipulation, openUrl), the built-in function category pages at `https://www.zoho.com/deluge/help/functions/*` (text, number, date-time, time, list, map/key-value, collection, logical, type-check, conversion, utilities, XML, encryption), the file-functions page, ~20 product-specific integration-task pages (`<product>-tasks.html` for CRM, Books, Desk, Creator, Mail, Cliq, People, Sheet, Projects, Recruit, WorkDrive, Writer, Connect, Bookings, Calendar, Inventory, Invoice, Billing), the error-messages and release-notes pages, the deluge-editor and deluge-preferences pages, the function index at `https://deluge.zoho.com/help/`, and the interactive tutorial at `https://deluge.zoho.com/learndeluge`. A few lower-traffic product task pages (Analytics, SalesIQ, Sign, Map, Notebook, SDP Cloud) were catalogued but not deep-crawled - see `references/integration-tasks-catalog.md`. When something isn't covered here or you need to confirm current behavior (Zoho updates task parameters and adds new task suites fairly often - see "Recent Deluge changes" above), web-search or fetch the relevant `zoho.com/deluge/help/...` page rather than guessing.
