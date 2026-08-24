# Adaptable snippets

Replace every placeholder with the target product's field API names, Creator link names, connection names, and expected response fields. Verify each task in the target editor before deployment.

## Creator form validation

Use in a supported Creator form event.

```deluge
if(input.Email == null || input.Email.isBlank())
{
    alert "Email is required";
    cancel submit;
}
```

## Add a Creator record

```deluge
customer_id = insert into Customers
[
    Name.first_name = input.First_Name
    Name.last_name = input.Last_Name
    Email = input.Email
    Status = "Active"
];
```

## Fetch and update Creator records

```deluge
matches = Customers[Email == input.Email];
if(matches.count() > 0)
{
    matches.Last_Contact = zoho.currentdate;
    matches.Status = "Active";
}
```

This updates the first matching record. Use a `for each` loop when every match must be updated.

## Insert a Creator subform row

```deluge
item = Orders.Items();
item.Product = product_id;
item.Quantity = 1;

items = Collection();
items.insert(item);
input.Items.insert(items);
```

## Create a CRM record

```deluge
lead_data = Map();
lead_data.put("Last_Name", last_name);
lead_data.put("Company", company_name);
lead_data.put("Email", email);

response = zoho.crm.createRecord("Leads", lead_data);
if(response.containKey("code"))
{
    info response;
}
else
{
    lead_id = response.get("id");
}
```

## Update a CRM record

```deluge
update_data = {"Lead_Status" : "Contacted"};
response = zoho.crm.updateRecord("Leads", lead_id, update_data);

if(response.containKey("code"))
{
    info response;
}
```

## JSON API call with HTTP status handling

```deluge
payload = {"name" : contact_name, "email" : contact_email};

response = invokeUrl
[
    url: "https://api.example.com/v1/contacts"
    type: POST
    headers: {"Content-Type" : "application/json"}
    body: payload.toString()
    connection: "example_oauth"
    detailed: true
];

if(response.get("responseCode") >= 400)
{
    info response.get("responseText");
}
else
{
    response_body = response.get("responseText");
}
```

## Runtime exception handling

```deluge
try
{
    item = values.get(target_index);
    converted = item.toLong();
}
catch(e)
{
    info "Line " + e.lineNo + ": " + e.message;
}
```

## Bounded CRM pagination

```deluge
pages = {1, 2, 3, 4, 5};
per_page = 200;
all_contacts = List();

for each page in pages
{
    contacts = zoho.crm.getRecords("Contacts", page, per_page);
    all_contacts.addAll(contacts);

    if(contacts.size() < per_page)
    {
        break;
    }
}
```

The five-page ceiling is deliberate. Raise it only after checking expected volume and external-call limits.

## Iterate through a Map

```deluge
payload = {"name" : "Ada", "status" : "Active"};
for each key in payload.keys()
{
    info key + ": " + payload.get(key);
}
```

## Send an attachment

```deluge
sendmail
[
    from: zoho.adminuserid
    to: recipient_email
    subject: "Requested report"
    message: "The requested report is attached."
    Attachments: file:report_file
];
```

Verify sender and attachment support in the host product.

## Idempotent cross-system write

```deluge
existing = zoho.crm.searchRecords("Contacts", "(External_ID:equals:" + external_id + ")");
if(existing.size() == 0)
{
    contact_data = {"Last_Name" : last_name, "External_ID" : external_id};
    response = zoho.crm.createRecord("Contacts", contact_data);
}
else
{
    crm_id = existing.get(0).get("id");
    update_data = {"Last_Name" : last_name};
    response = zoho.crm.updateRecord("Contacts", crm_id, update_data);
}
```

Replace `External_ID` with a real unique CRM field API name. Concurrent executions can still race unless the target system enforces uniqueness.

## Sources

- https://www.zoho.com/deluge/help/data-access/add-record.html
- https://www.zoho.com/deluge/help/data-access/update-records.html
- https://www.zoho.com/deluge/help/miscellaneous/insert-subform-row.html
- https://www.zoho.com/deluge/help/crm/create-record.html
- https://www.zoho.com/deluge/help/crm/update-record.html
- https://www.zoho.com/deluge/help/crm/get-records.html
- https://www.zoho.com/deluge/help/webhook/invokeurl-api-task.html
- https://www.zoho.com/deluge/help/misc-statements/try-catch.html
- https://www.zoho.com/deluge/help/misc-statements/send-mail.html
