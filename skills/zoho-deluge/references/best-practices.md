# Review and implementation guidance

Separate platform rules from implementation judgment. Official documentation defines syntax, availability, and limits. Practical guidance below helps produce reliable production workflows.

## Source-backed rules

- Push Creator filters into `Form[criteria]` instead of fetching all records and filtering every row in Deluge.
- Prefer exact comparisons and narrow criteria. Avoid unnecessary clauses and broad text matching.
- Prefer `&&` to `||` where the business rule allows it.
- Add `sort by` when processing order matters. Add a deterministic range for bounded Creator batches.
- Count List and Map values with `.size()`. Count Creator fetched-record collections with `.count()`.
- Each executed integration task or `invokeUrl` call consumes an external call under the host service's plan, including calls inside loops.
- `invokeUrl` fails with a socket timeout when the endpoint takes more than 40 seconds. No documented attribute changes that timeout.
- Deluge documents execution ceilings including 5,000 executed statements and 75 function calls. The limitations page warns that listed values can change, so verify the current page and product plan.
- Use exact API names, form link names, report link names, and connection link names.
- Verify task availability in the target product. Cloud, Creator on-premise, and other on-premise platforms differ.

## Reliability guidance

These recommendations come from production implementation practice:

- Guard null, blank, missing-key, empty-list, and empty-record states before dereferencing values.
- Use `try-catch` for runtime exceptions. Also inspect service responses because many failed integration calls return error Maps rather than throw.
- Keep fetch, transform, write, and notification stages visible in longer workflows.
- Make retried create or update operations idempotent using stable external identifiers where available.
- Avoid external calls inside a record loop when the service offers a bulk task or batch endpoint.
- Bound pagination explicitly. Stop on a short page or the response's documented continuation flag.
- Validate destructive criteria with a fetch and count before deploying delete logic.
- Record durable processing status when partial completion would otherwise cause duplicate effects.
- Test the exact trigger context with representative nulls, permissions, and service errors.

## Security guidance

- Use named connections instead of embedding tokens or passwords.
- Grant only scopes required by the task.
- Never log credentials, authorization headers, or complete sensitive payloads.
- Treat Creator hide and disable client functions as presentation controls, not authorization.
- Validate inbound webhook data before using IDs, URLs, field names, or query fragments.
- Confirm data-handling approval before sending customer data to AI tasks or third-party APIs.

## Maintainability guidance

- Name variables after business concepts, not temporary mechanics.
- Comment why a non-obvious rule exists.
- Extract repeated business logic into a custom function only when reuse is real.
- Document product, trigger, connection, API-name, and deployment assumptions next to the script.
- Keep production scripts in version control or use the product's version history where available.
- Preserve an observable identifier for each cross-system operation.

## Review checklist

- Host product and workflow event identified
- Product-specific syntax verified in current official documentation
- Placeholders separated from real API and link names
- Required fields and argument order confirmed
- Null and empty states handled
- Integration success and error shapes checked
- External call count bounded
- Retry behavior and duplicate-write risk considered
- Secrets and personal data excluded from logs
- Delete and broad update criteria reviewed
- Sandbox or controlled-record validation completed where supported

## Common corrections

| Incorrect pattern | Correct direction |
|---|---|
| `for(i = 0; ... )` or `while(...)` | `for each` or `for each index` over a bounded List |
| "Deluge has no exception handling" | Use documented `try-catch` for runtime errors |
| `records.get(0).update()` for Creator records | Fetch with `Form[criteria]`, then assign fields on the fetched record |
| `Form.insert(map)` | `insert into Form [ Field = value ]` |
| `zoho.crm.insertRecords()` | Use the documented CRM task, such as `zoho.crm.createRecord()` |
| `map.containsKey()` | `map.containKey()` for KEY-VALUE; `collection.containsKey()` for Collection |
| Commas between `invokeUrl` attributes | One attribute per line without commas |
| `timeout:` in `invokeUrl` | Design for the fixed documented 40-second socket timeout |
| JSON body without matching content type | Set `Content-Type: application/json` and send a JSON-compatible body |
| Creator Name or Address treated as a Map | Use documented composite subfields such as `.first_name` or `.country` |
| Hidden field treated as protected | Enforce permissions and server-side access rules |

## Sources

- https://www.zoho.com/deluge/help/criteria.html
- https://www.zoho.com/deluge/help/limitations.html
- https://www.zoho.com/deluge/help/integration-tasks.html
- https://www.zoho.com/deluge/help/webhook/invokeurl-api-task.html
- https://www.zoho.com/deluge/help/misc-statements/try-catch.html
- https://www.zoho.com/deluge/help/on-premise.html
- https://www.zoho.com/deluge/help/client-functions/hide-show.html
