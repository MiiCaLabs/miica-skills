# Per-Product Integration Task Catalog

Every Zoho product exposes its own namespace of integration tasks (wrappers over that product's REST API, billed against external-call limits - same rules as `invokeUrl`, see `references/integrations-and-tasks.md`). This file catalogs the **task names** documented per product at `https://www.zoho.com/deluge/help/<product>-tasks.html`, so you know what exists before reaching for a raw `invokeUrl`. Task names below are as titled in the official docs; the callable Deluge syntax generally follows the `zoho.<product>.<taskName>(<args in defined order>)` pattern shown in `references/integrations-and-tasks.md` for the well-established products (CRM, Books, Desk, Creator, People) - **confirm exact current argument order/signature from the live docs** (`https://www.zoho.com/deluge/help/<product>-tasks.html`) before shipping a call to a task you haven't used before, since Zoho revises these periodically (e.g. CRM's V8 task set added April 2026).

## Zoho CRM

Extension/vertical-solution-oriented tasks: **Get User Data**, **Invoke Connector Task**, **Set Organization Variable**, **Get Organization Variable**, **Get Module Metadata**, **Get All Module Metadata**, **Get Organization Information**.

Standard record CRUD (`zoho.crm.*` / `zoho.crm.v8.*`): `getRecords`, `getRecordById`, `insertRecords`, `updateRecords`, `deleteRecords`, `searchRecords`, `getRelatedRecords`, `convertLead`, `getUsers` - see `references/integrations-and-tasks.md` for the general calling convention. As of **April 2026**, Zoho CRM V8 integration tasks were introduced (`crm-integration-tasks-V8.html`) adding 13 operations including record creation, updates, searches, and file attachments - prefer the V8 task set for new scripts if the product/account supports it.

## Zoho Books

**Get Organizations**, **Create Record**, **Update Record**, **Get Records**, **Get Records By ID**, **Mark Status**, **Get Templates**.

## Zoho Desk

**Get Records**, **Get Record By ID**, **Create**, **Update**, **Search Records**, **Get Related Records**, **Get Related Record By ID**, **Create Related Record**, **Update Related Record**, **Move** (ticket to a department), **Split** (a reply into a new ticket), **Merge** (two or more tickets).

## Zoho Creator (calling one Creator app's data from another script/app)

**Get Records**, **Get Record by ID**, **Create Record**, **Update Records**, **Update Record**.

## Zoho Mail

**Get folders**, **Move to folder**, **Create folder**, **Set flag**, **Remove flag**, **Mark as read**, **Mark as unread**, **Get message**, **Create tag**, **Get Labels**, **Set Tag**.

## Zoho Cliq

Messaging: **Post to chat**, **Post to chat as admin**, **Post to channel**, **Post to channel as admin**, **Post to bot**, **Post to bot as admin**, **Post to user**.

Cliq database: **Create Record**, **Get Records**, **Get Record by ID**, **Update Record**, **Delete Record**, **Delete Records**.

## Zoho People

**Get Records**, **Create**, **Get Record By ID**, **Update**.

## Zoho Sheet

**Get Sheets**, **Create Records**, **Get Records**, **Update Records**, **Find**, **Replace**, **Insert CSV**.

## Zoho Projects

**Get Portals**, **Get Project Details**, **Create Project**, **Get Records**, **Get Record By ID**, **Create**, **Update**, **Associate Logs** (time log), **Update Associated Logs**.

## Zoho Recruit

**Add Records**, **Get Record By ID**, **Get Records**, **Search Records**, **Update Record**, **Upload File**.

## Zoho WorkDrive

**Upload File**, **Create Folder**, **Create Team Folder**.

## Zoho Writer

**Get Documents**, **Upload Document**, **Share Document**, **Get Merge Fields**, **Merge And Send** / **Merge And Send V2**, **Sign Document**, **Get All Fields**, **Merge and Sign**, **Merge and Store V2**, **Merge and Invoke**, **Mark or Unmark Favorite Document**, **Rename Document**, **Enable or Disable Track Changes**, **Add or Update Description**, **Lock or Unlock Documents**, **Mark Document as Ready**, **Mark or Revert Final Documents**, **Get Merge Templates**, **Get Sign Templates**, **Get Fillable Templates**, **V2 Sign Documents**, **Generate Fillable Link**.

## Zoho Connect

**My Networks**, **My Groups**, **Add Post**, **Get Post**, **Get Post by TPID**, **Update Post**, **Delete Post**, **Send Me Private Message**, **Add Comment**, **Add Users to a Group**.

## Zoho Bookings

**Get workspaces**, **Get record by ID**, **Get Related Records**, **Get available slots**, **Create appointment**, **Update records**.

## Zoho Calendar

**Create Event** (a minimal task set as of this crawl - confirm current docs for any additions).

## Zoho Inventory

**Get organization**, **Get Records**, **Get Records By ID**, **Create Record**, **Update Record**, **Mark Status**.

## Zoho Invoice

**Get Records**, **Get Record By ID**, **Create**, **Update**.

## Zoho Billing (Subscriptions)

**Get Organization**, **Get List**, **Retrieve**, **Create**, **Update**.

## Other products with dedicated task pages (not deep-crawled - fetch on demand)

Zoho Analytics (`analytics-tasks.html`), Zoho SalesIQ (`salesiq-tasks.html`), Zoho Sign (`sign-tasks.html`), Zoho Map (`map-tasks.html`), Zoho Notebook (`notebook-tasks.html`), SDP Cloud (`sdp-tasks.html`). If a task is needed for one of these, fetch `https://www.zoho.com/deluge/help/<name>-tasks.html` directly - don't guess task names/signatures for products not cataloged above.

## Newer/recently added integration surfaces (per release notes, as of this crawl)

- **Zoho Webinar** - 17 new tasks (added ~Feb 2026).
- **Zoho Show** - 5 new tasks (added ~Feb 2026).

These are recent enough that they may not appear in older training data - always verify current syntax against `https://www.zoho.com/deluge/help/` if the user needs one of them.
