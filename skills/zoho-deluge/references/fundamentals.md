# Deluge fundamentals

## Variables

Assign normal variables without a declaration keyword.

```deluge
customer_name = "Ada Lovelace";
quantity = 3;
unit_price = 49.95;
active = true;
tags = {"priority", "renewal"};
contact = {"Email" : "ada@example.com"};
```

Variable names are case-sensitive. A variable can hold a different data type after reassignment, but stable types make scripts easier to validate and maintain.
Variables are local to the action script where they are assigned. Deluge does not document global variables.

## Common data types

| Type | Example | Notes |
|---|---|---|
| TEXT | `"Creator"` | Text literals use double quotes |
| NUMBER | `42` | Whole-number value |
| DECIMAL | `42.5` | Decimal value |
| BOOLEAN | `true` | `true` or `false` |
| DATE-TIME | `zoho.currenttime` | Date and time value |
| TIME | `'19:00:00'` | Creator-only time value, independent of a date |
| LIST | `{"CRM", "Creator"}` | Ordered values |
| KEY-VALUE | `{"name" : "Ada"}` | Unique keys mapped to values |
| COLLECTION | `Collection()` | Deluge collection operations |
| FILE | Returned by a supported file task | Availability depends on product and context |
| Null constant | `null` | Missing value; not a data type |

Zoho Creator field values have field-specific data types. Do not assume a fetched file-upload field is a general Deluge FILE object or that a composite field is a Map.

## Operators

```deluge
total = quantity * unit_price;
is_open = status == "Open";
is_actionable = is_open && total > 0;

if(status == "Open" || status == "Pending")
{
    info "Needs review";
}
```

Common operators:

- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `&&`, `||`, `!`
- Assignment: `=`

Criteria syntax has additional operators and restrictions. Use the criteria reference when fetching Creator records.

## Null and blank checks

Use built-ins only where their documented input types fit.

```deluge
if(value == null)
{
    info "No value";
}

if(text_value.isBlank())
{
    info "Blank text";
}
```

Type-check functions documented by Deluge are `isDate()`, `isFile()`, `isNumber()`, and `isText()`. Product availability can differ.

## Comments and logging

```deluge
// Single-line comment

/*
Multi-line comment
*/

info "Processing record " + record_id;
```

Use `info` for diagnostics. Avoid logging access tokens, secrets, or complete customer payloads.

## Sources

- https://www.zoho.com/deluge/help/datatypes.html
- https://www.zoho.com/deluge/help/datatypes/time.html
- https://www.zoho.com/deluge/help/operators.html
- https://www.zoho.com/deluge/help/variables.html
- https://www.zoho.com/deluge/help/functions/type-check.html
- https://www.zoho.com/deluge/help/creator-field-datatype.html
- https://www.zoho.com/deluge/help/composite-fields-usage.html
