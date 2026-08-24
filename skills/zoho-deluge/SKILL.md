---
name: zoho-deluge
description: Write, review, refactor, or debug Zoho Deluge scripts across Zoho Creator, CRM, Books, Desk, People, Cliq, Flow, Sheet, and other Zoho products. Use for Deluge syntax, custom functions, Creator data access, invokeUrl, sendmail, List, Map, Collection, zoho.* integration tasks, workflow scripts, or .deluge files. Identify the host product before choosing product-specific syntax and verify volatile task signatures against official Zoho documentation.
---

# Zoho Deluge

Treat Deluge as a product-hosted language. Syntax and task availability vary by Zoho service and workflow event.

## Required workflow

1. Identify host product and execution context: Creator workflow, Creator function, CRM function, Flow function, Cliq handler, Sheet function, or another service.
2. Read only the relevant references below.
3. Prefer native integration tasks over raw API calls when the task exists and its signature fits.
4. Verify product-specific signatures against the live official page before shipping code. Zoho adds tasks and changes availability often.
5. Return complete Deluge code with field API names, connection names, module names, and event assumptions stated when they are placeholders.

## Reference routing

| Need | Reference |
|---|---|
| Variables, types, operators, comments | `references/fundamentals.md` |
| Conditions, loops, break, continue | `references/control-flow.md` |
| List, Map, Collection | `references/collections.md` |
| Creator records and criteria | `references/records-and-criteria.md` |
| invokeUrl, connections, mail, SMS, AI tasks | `references/integrations-and-tasks.md` |
| Custom functions and product differences | `references/functions.md` |
| Runtime and save errors | `references/error-handling.md` |
| Review and performance guidance | `references/best-practices.md` |
| Adaptable examples | `references/snippets.md` |
| Built-in function discovery | `references/builtin-functions.md` |
| Creator-only tasks | `references/creator-tasks.md` |
| Zoho variables and on-premise limits | `references/system-variables.md` |
| Product integration namespaces | `references/integration-tasks-catalog.md` |

## Core rules

- End executable statements with `;`. Task blocks and control blocks follow their documented grammar.
- Assign normal variables without `var`, `let`, or `const`.
- Use `info <expression>;` for diagnostic output.
- Use `try { ... } catch(e) { ... }` for runtime exceptions. Read `e.message` and `e.lineNo`. Deluge does not document a general `throw` statement.
- Use `for each <value> in <list>` or `for each index <index> in <list>`. Deluge has no documented C-style `for` or `while` statement.
- Use `.size()` for List and Map size. Use `.count()` for Zoho Creator fetched-record collections and aggregate record counts.
- Use documented Map functions such as `.containKey()`, `.containValue()`, `.get()`, `.put()`, `.putAll()`, `.remove()`, `.keys()`, and `.size()`.
- Use Creator data-access grammar for records in the same Creator app: `insert into`, `Form[criteria]`, field assignment, and `delete from`.
- Use integration tasks for remote services, for example `zoho.crm.createRecord()` and `zoho.creator.updateRecord()`.
- Do not put commas between attributes in `invokeUrl`, `sendmail`, or `sendsms` blocks.
- Do not set both `body` and `parameters` in one `invokeUrl` call.
- Set `Content-Type: application/json` when sending JSON text. A TEXT body defaults to `text/plain`.
- Inspect task responses for documented error fields. HTTP success and Deluge execution success do not prove the business operation succeeded.
- Use connections for credentials. Never hardcode tokens or log secrets.

## Product boundaries

- Creator alone supports native form data access such as `Form[criteria]`, `insert into`, composite fields, subform tasks, and client actions.
- Custom-function declarations and calls vary by host product. Creator calls current-app functions with `thisapp.<function_name>(...)`. Other services may expose only the function body and configure arguments in the UI.
- Integration-task arguments are positional. To provide a later optional argument, supply required preceding placeholders exactly as documented.
- Some tasks and built-in functions have service-specific availability. Never infer support from another Zoho product.

## Authoritative sources

- Deluge help: https://www.zoho.com/deluge/help/
- Deluge tasks: https://www.zoho.com/deluge/help/deluge-tasks.html
- Built-in functions: https://www.zoho.com/deluge/help/built-in-functions.html
- Error messages: https://www.zoho.com/deluge/help/error-messages.html
- Limitations: https://www.zoho.com/deluge/help/limitations.html
- Release notes: https://www.zoho.com/deluge/help/release-notes.html

Use official Zoho documentation as factual authority. Treat community posts and implementation experience as diagnostic context, not language specification.
