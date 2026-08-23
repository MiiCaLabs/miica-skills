# Zoho System Variables, Notifications, Platform Coverage & On-Premise Notes

Source: `https://www.zoho.com/deluge/help/system-variables.html`, `notifications-using-deluge.html`, `zoho-services-supporting-deluge.html`, `on-premise.html`.

## `zoho.*` system variables

System variables are read-only values that Zoho populates at runtime. Use them to avoid hardcoding app-specific identifiers.

| Variable | Type | Example | Notes |
|---|---|---|---|
| `zoho.currentdate` | Date | `zoho.currentdate` | Today's date in the account's timezone. |
| `zoho.currenttime` | Date-Time | `zoho.currenttime` | Current date and time. |
| `zoho.loginuser` | Map | `zoho.loginuser.name`, `zoho.loginuser.role` | The authenticated user's details (Creator only for role). |
| `zoho.loginuser.name` | Text | `"John Doe"` | Display name of the logged-in user. |
| `zoho.loginuserid` | Text | `"123456789"` | User ID of the logged-in user (use for sendmail `from`). |
| `zoho.adminuser` | Map | `zoho.adminuser.name` | The organization admin's details. |
| `zoho.adminuserid` | Text | `"123456789"` | Organization admin's user ID (use for sendmail `from` when a script runs in admin context). |
| `zoho.appname` | Text | `"My App"` | The form/app name where the script runs. |
| `zoho.appuri` | Text | `"https://creatorapp.zoho.com/..."` | The full URL of the form/app. |
| `zoho.ipaddress` | Text | `"192.168.1.1"` | Client IP address (available in some contexts). |
| `zoho.device.type` | Text | `"desktop"` or `"mobile"` | Device type from which the form was accessed. |

```deluge
today = zoho.currentdate;
admin_email = zoho.adminuserid;
app_url = zoho.appuri;

// Using in sendmail
sendmail
[
    from: zoho.adminuserid,
    to: customer_email,
    subject: "Update from " + zoho.appname,
    message: "Your form was updated on " + zoho.currentdate
];
```

## Notifications overview

Deluge can trigger notifications (email, SMS, push, etc.) in workflows. Common notification types:

| Notification Type | Trigger | Example |
|---|---|---|
| **Email** | `sendmail` task | Send to users, admins, or external addresses. |
| **SMS** | `sendsms` task | Send to phone numbers; requires SMS credits. |
| **Slack** | Post to Slack via `invokeUrl` | Webhook integration to post messages. |
| **In-app notification** | `notify` task (Creator) | Display a message in the user's notification center. |

See `references/integrations-and-tasks.md` for `sendmail` and `sendsms` syntax.

## Zoho services supporting Deluge (40+)

Deluge is available across these Zoho products:

**Core platforms**: Zoho Creator, CRM, Books, Desk, People, Cliq, Flow, Sheet, Projects, Recruit, WorkDrive, Writer, Connect, Bookings, Calendar, Inventory, Invoice, Billing.

**Specialized**: Mail, SalesIQ, Sign, Map, Notebook, Analytics, SDP Cloud, Webinar (added ~Feb 2026), Show (added ~Feb 2026).

**Zoho Ecosystem**: Forms, Survey, PageSense (analytics), Sprints, Campaigns, Subscriptions.

Each product has its own integration task namespace (`zoho.crm.*`, `zoho.books.*`, etc.) - see `references/integration-tasks-catalog.md` for the full task list per product.

## On-Premise & ServiceDesk Plus differences

On-premise deployments (Creator on-premise, ManageEngine ServiceDesk Plus, and other ManageEngine products) have a materially restricted feature surface:

### Not available on-premise

1. **System variables** - Most `zoho.*` variables (like `zoho.loginuserid`, `zoho.appname`) are **not** available on-premise, except:
   - **Creator on-premise**: `zoho.currentdate`, `zoho.currenttime`, `zoho.loginuserid` are available.
   - **ServiceDesk Plus**: Very limited `zoho.*` support; check product-specific docs.

2. **Zoho integration tasks** - `zoho.crm.*`, `zoho.books.*`, `zoho.desk.*`, etc. are **not available**. On-premise instances cannot call Zoho cloud services.

3. **invokeUrl** - Restricted on some on-premise products; check product configuration and firewall rules.

4. **AI/Zia tasks** - Not available on-premise.

5. **Client functions** (hide/show/enable/disable) - Creator on-premise supports these; ServiceDesk Plus and other ManageEngine products do not.

6. **Connections (OAuth)** - Limited support; most on-premise products use basic auth or API keys only.

7. **Editor preferences** - Customization options (font, syntax builder) are limited or unavailable.

### On-Premise + Cloud hybrid

Some on-premise deployments allow scripts to call external APIs via `invokeUrl` (if outbound network access is enabled), but:
- No Zoho cloud service calls.
- Network and firewall policy restrictions apply.
- No managed connections or OAuth - use connection strings or tokens directly (security risk; use with caution).

### Checking environment

There is no `zoho.environment` variable. To detect on-premise vs. cloud at runtime:

```deluge
// Try to access a cloud-only feature; catch failure defensively
try_response = invokeUrl[ url: url type: GET ];
if(!isNull(try_response))
{
    // likely cloud
}
else
{
    // could be on-premise without outbound access
}
```

### Migration path

Scripts written for cloud Deluge often need refactoring for on-premise:
- Replace `zoho.crm.getRecords()` etc. with raw `invokeUrl` calls to on-premise REST APIs.
- Remove AI/Zia task calls.
- Test client functions (hide/show) thoroughly; on-premise support varies by product.
- Avoid system variables if targeting on-premise - use hardcoded values or config files instead.

### ServiceDesk Plus specific notes

ServiceDesk Plus (ManageEngine's on-premise ticketing) has:
- Very limited Deluge support (compared to Zoho Creator).
- No `zoho.*` system variables except `zoho.currentdate`.
- No Zoho integration tasks.
- Basic custom function support.
- Refer to ServiceDesk Plus docs for the exact Deluge feature set available in your version.

**Always confirm the target environment (cloud vs. on-premise, and product version) before writing Deluge scripts** - assumptions about feature availability can cause silent failures or unrecognizable errors.
