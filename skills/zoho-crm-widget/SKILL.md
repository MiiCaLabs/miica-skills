---
name: zoho-crm-widget
description: Build, review, or debug Zoho CRM widgets and client-side extensions that use Embedded App SDK 1.5, ZRC, ZDK.Client, or ZOHO.CRM APIs. Use when a request mentions a Zoho CRM widget, embeddedApp events, widget initialization, ZRC, ZDK Client Script APIs, CRM records or metadata, blueprints, connections, connectors, functions, HTTP calls, popups, resize behavior, or communication between a widget and its host page.
---

# Zoho CRM widget

Use the bundled SDK 1.5 references before writing code. Keep embedded widgets, Client Scripts, and ZRC code on their correct execution surfaces.

## Choose the execution surface

1. Identify where the code runs.
   - Embedded widget: use `ZOHO.embeddedApp` and `ZOHO.CRM`.
   - CRM Client Script: use `ZDK.Client` and related ZDK APIs.
   - ZRC application: follow the ZRC lifecycle and method references.
2. Identify the CRM location, event, module, and record context.
3. Read only the references needed for that surface.
4. Ask for missing context when it changes the API or event lifecycle.

Do not mix APIs from different surfaces merely because their method names look similar.

## Read the matching references

| Need | Read |
| --- | --- |
| Embedded App SDK initialization and events | `references/01-js-sdk-init.md` |
| SDK changes and supported behavior | `references/02-changelog.md` |
| ZRC concepts and lifecycle | `references/03-zrc-overview.md` |
| ZRC methods | `references/04-zrc-methods.md` |
| ZRC request errors and configuration | `references/05-zrc-request-errors-and-configuration-types.md` |
| ZRC limitations | `references/06-zrc-limitations-and-consideration.md` |
| ZRC examples | `references/07-zrc-code-samples.md` |
| CRM Client Script UI through `ZDK.Client` | `references/08-zdk-client.md` |
| CRM record and organization APIs | `references/09-zoho-crm-api.md` |
| Blueprint operations | `references/10-zoho-crm-blueprint.md` |
| Configuration variables | `references/11-zoho-crm-config.md` |
| Connectors | `references/13-zoho-crm-connector.md` |
| CRM custom functions | `references/14-zoho-crm-functions.md` |
| HTTP requests | `references/15-zoho-crm-http.md` |
| Module, field, layout, and related-list metadata | `references/16-zoho-crm-meta.md` |
| CRM UI entry points | `references/17-zoho-crm-ui.md` |
| Dialer UI | `references/18-zoho-crm-ui-dialer.md` |
| Popup UI | `references/19-zoho-crm-ui-popup.md` |
| Record UI | `references/20-zoho-crm-ui-record.md` |
| Widget-to-host communication | `references/21-zoho-crm-ui-widget.md` |
| Wizard operations | `references/22-zoho-crm-wizard.md` |
| `$Client` helpers | `references/23-$client.md` |

## Implementation rules

- Register required `ZOHO.embeddedApp` event listeners before calling `ZOHO.embeddedApp.init()`.
- Await SDK promises and handle rejected responses at the boundary that initiated the call.
- Use module, field, layout, and related-list API names rather than display labels.
- Read the event payload instead of assuming a record or module context.
- Keep credentials out of widget code. Use Zoho connections for authenticated external requests.
- Validate record IDs, module names, and required fields before mutating CRM data.
- Use documented resize, popup, and host communication methods instead of direct assumptions about the parent window.
- Check the ZRC changelog and limitations before relying on a method in a ZRC application.
- Preserve the existing framework and packaging setup unless the request includes a migration.

## Workflow

1. Inspect the current widget entry point, SDK loading, and event registration order.
2. Read the matching references from the table.
3. Implement the smallest change that fits the selected execution surface.
4. Check asynchronous errors and every CRM mutation path.
5. Validate the behavior in the intended Zoho CRM location. Local browser success alone does not prove host integration.
6. If a bundled reference does not settle a current API detail, verify it against the official Zoho CRM developer documentation before proceeding.
