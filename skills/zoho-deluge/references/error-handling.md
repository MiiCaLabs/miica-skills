# Error handling

Deluge supports `try-catch` for runtime errors.

```deluge
try
{
    products = {"Creator", "CRM", "Cliq"};
    product = products.get(10);
}
catch(e)
{
    info e.lineNo;
    info e.message;
}
```

Official reference: https://www.zoho.com/deluge/help/misc-statements/try-catch.html

## Use guards before exceptions

`try-catch` does not replace validation. Guard expected empty states and use `catch` for exceptional failures.

```deluge
if(divisor != 0)
{
    result = numerator / divisor;
}
```

```deluge
records = Customers[Email == input.Email];
if(records.count() > 0)
{
    info records.Name;
}
```

## Integration responses

Integration tasks often return an error response rather than throwing. Inspect the response shape documented for the task.

```deluge
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

For raw HTTP calls, request a detailed response when status handling matters:

```deluge
response = invokeUrl
[
    url: api_url
    type: GET
    detailed: true
];

if(response.get("responseCode") >= 400)
{
    info response.get("responseText");
}
```

## Error categories

- Save errors: invalid syntax, unavailable task, wrong argument count, wrong argument type, or unsupported product context.
- Runtime exceptions: null operations, invalid indexes, failed conversions, divide by zero, or timeouts. Use guards and `try-catch`.
- Service errors: valid Deluge execution with a failed CRM, Books, Desk, Creator, or third-party operation. Inspect returned status fields.

## Common checks

- Verify List indexes against `.size()`.
- Verify Creator fetched-record collections with `.count()`.
- Verify Map keys with `.containKey()` before assuming a value exists.
- Parse external text only after checking status code and content type.
- Log identifiers and error codes, not credentials or full customer payloads.

## Sources

- https://www.zoho.com/deluge/help/misc-statements/try-catch.html
- https://www.zoho.com/deluge/help/error-messages.html
- https://www.zoho.com/deluge/help/crm/create-record.html
- https://www.zoho.com/deluge/help/webhook/invokeurl-api-task.html
