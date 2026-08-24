# Records and criteria

Native record syntax in this file applies to Zoho Creator forms in the same application. Remote Creator and CRM operations use integration tasks.

## Fetch Creator records

```deluge
customers = Customers[Status == "Active"];
all_customers = Customers[ID != 0];
```

Use field link names, not display labels. A fetched-record collection exposes fields and supports iteration.

```deluge
for each customer in customers
{
    info customer.Name;
}

if(customers.count() > 0)
{
    info customers.Name;
}
```

`customers.Name` returns the first record's field value. Use a loop when more than one record can match.

## Sort and range

```deluge
recent = Orders[Status == "Open"] sort by Added_Time desc range from 0 to 99;
```

Creator range positions are zero-based and inclusive. Use deterministic sorting when paging through records.

## Add a Creator record

```deluge
customer_id = insert into Customers
[
    Name = input.Name
    Email = input.Email
    Status = "Active"
];
```

The task returns the new record ID. Required fields must be supplied. Creator does not use `Customers.insert(map)` for same-app form records.

## Update Creator records

Update the first fetched record:

```deluge
customer = Customers[ID == input.Customer_ID];
if(customer.count() > 0)
{
    customer.Status = "Active";
}
```

Update every matching record:

```deluge
for each customer in Customers[Status == "Pending"]
{
    customer.Status = "Active";
}
```

## Delete Creator records

```deluge
delete from Temporary_Imports[Added_Time < cutoff_time];
```

Deletion uses `delete from Form[criteria]`. Confirm the criteria with a fetch and count before destructive production operations.

## Criteria

```deluge
active = Customers[Status == "Active" && Email != null];
matched = Customers[Name.contains("Labs")];
prefix = Customers[Email.startsWith("sales@")];
```

Built-in criteria operators use method syntax such as `.contains()` and `.startsWith()`. Supported operators vary by Creator field type.

Criteria best practices from Zoho include:

- Use `==` where possible instead of broad text matching.
- Avoid unnecessary criteria clauses.
- Prefer `&&` over `||` where the business rule allows it.
- Fetch only records needed by the workflow.

## CRM records

CRM tasks use module API names and field API names.

```deluge
lead_data = Map();
lead_data.put("Last_Name", "Lovelace");
lead_data.put("Company", "Analytical Engines");

create_response = zoho.crm.createRecord("Leads", lead_data);
if(create_response.containKey("code"))
{
    info create_response;
}
else
{
    lead_id = create_response.get("id");
    update_data = {"Lead_Status" : "Contacted"};
    update_response = zoho.crm.updateRecord("Leads", lead_id, update_data);
}
```

Inspect each response for documented error fields before using returned IDs.

## Remote Creator records

Use the report link name for remote fetch and update tasks, and a configured connection where the signature requires one.

```deluge
response = zoho.creator.createRecord(
    owner_name,
    app_link_name,
    form_link_name,
    input_values,
    other_params,
    connection_name
);
```

Do not mix remote integration signatures with same-app Creator data-access grammar.

## Sources

- https://www.zoho.com/deluge/help/fetch-records/fetch-collection-records.html
- https://www.zoho.com/deluge/help/data-access/add-record.html
- https://www.zoho.com/deluge/help/data-access/update-records.html
- https://www.zoho.com/deluge/help/data-access/delete-records.html
- https://www.zoho.com/deluge/help/criteria.html
- https://www.zoho.com/deluge/help/crm/create-record.html
- https://www.zoho.com/deluge/help/crm/update-record.html
- https://www.zoho.com/deluge/help/creator/create-record.html
- https://www.zoho.com/deluge/help/creator/update-record.html
