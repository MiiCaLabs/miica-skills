# Integration task catalog

Deluge integration tasks wrap selected Zoho REST APIs.

```deluge
response = zoho.<service>.<action>(<parameters>);
```

Use this file for routing, not as a frozen API catalog. Open the current product page before writing the call.

## Supported service families

The official index currently links task catalogs for:

- SDP Cloud
- Zoho Analytics, Bookings, Books, Billing, Calendar, Creator, CRM, CRM V8, Desk, Inventory, Invoice, Mail, Map, Notebook, People, Projects, Recruit, SalesIQ, Sheet, Sign, WorkDrive, and Writer
- Zoho Cliq and Zoho Connect

Release notes can expose additions before the main index is refreshed. Recent official notes also list Zoho Webinar, Show, Learn, One, and Directory integrations. Availability in a given host product can be narrower than the global index.

## CRM examples

Standard CRM tasks include operations such as:

```deluge
record = zoho.crm.getRecordById("Leads", lead_id);
records = zoho.crm.getRecords("Leads", page, per_page);
matches = zoho.crm.searchRecords("Leads", criteria);
created = zoho.crm.createRecord("Leads", record_data);
updated = zoho.crm.updateRecord("Leads", lead_id, update_data);
```

Use module and field API names. Do not substitute generic names such as `insertRecords()` or `updateRecords()` for these documented tasks.

CRM V8 uses its own namespace:

```deluge
created = zoho.crm.v8.createRecord(
    "Leads",
    record_data,
    options_map,
    connection_name
);
```

The options and connection arguments are positional. If a later optional argument is supplied, include preceding placeholders as documented.

Do not silently replace standard CRM tasks with V8 tasks. The namespace, available actions, options, and response contracts differ. Choose one deliberately and verify the target host supports it.

## Creator integration examples

Remote Creator tasks use owner, application link name, form or report link name, input values, parameters, and connection arguments in a task-specific order.

```deluge
created = zoho.creator.createRecord(
    owner_name,
    app_link_name,
    form_link_name,
    input_values,
    other_params,
    connection_name
);
```

These tasks are separate from same-app Creator grammar such as `insert into Form [...]`.

## Selection rules

1. Check whether the target service has a native integration task.
2. Verify that the task is available from the host product.
3. Verify the current signature, API names, scopes, options, and response shape.
4. Use a connection when required or when cross-account access is intended.
5. Use `invokeUrl` only when the native task does not expose the required API behavior.

Each executed task consumes an external call under the host service's plan. Calls in a loop count per execution, including failures that return a response.

## Sources

- https://www.zoho.com/deluge/help/integration-tasks.html
- https://www.zoho.com/deluge/help/crm-integration-tasks-V8.html
- https://www.zoho.com/deluge/help/crm/create-record.html
- https://www.zoho.com/deluge/help/crm/create-record-V8.html
- https://www.zoho.com/deluge/help/creator-tasks.html
- https://www.zoho.com/deluge/help/creator/create-record.html
- https://www.zoho.com/deluge/help/webhook/invokeurl-api-task.html
- https://www.zoho.com/deluge/help/release-notes.html
