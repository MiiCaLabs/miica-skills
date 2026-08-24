# Control flow

## Conditions

```deluge
if(status == "Active")
{
    info "Active";
}
else if(status == "Pending")
{
    info "Pending";
}
else
{
    info "Inactive";
}
```

Deluge also supports conditional `if` as an expression:

```deluge
label = if(age >= 18, "adult", "minor");
fallback = ifNull(input.Name, "Unknown");
```

Deluge does not document the `condition ? a : b` operator.

Official reference: https://www.zoho.com/deluge/help/conditional-statements/condition.html

## Loop over values

```deluge
products = {"Creator", "CRM", "Desk"};
for each product in products
{
    info product;
}
```

## Loop over indexes

```deluge
products = {"Creator", "CRM", "Desk"};
for each index product_index in products
{
    info product_index + ": " + products.get(product_index);
}
```

The index variable starts at `0` and holds the last processed index after iteration.

Official reference: https://www.zoho.com/deluge/help/list-manipulations/for-each-index.html

## Bounded repeated work

Deluge has no documented C-style `for` or `while` statement. Use a bounded List and stop early:

```deluge
pages = {1, 2, 3, 4, 5};
for each page in pages
{
    records = zoho.crm.getRecords("Contacts", page, 200);
    if(records.isEmpty())
    {
        break;
    }
    // Process this page.
}
```

Use `continue;` to skip the remainder of the current iteration and `break;` to leave the loop.

```deluge
for each number in {1, 2, 3, 4, 5}
{
    if(number == 3)
    {
        continue;
    }
    if(number == 4)
    {
        break;
    }
    info number;
}
// Output: 1, 2
```

## Creator record iteration

```deluge
active_employees = Employees[Status == "Active"];
for each employee in active_employees
{
    info employee.Name;
}
```

This native form syntax is Creator-only.

## Map iteration

Iterate a Map through its keys. This avoids undocumented Java-style entry APIs.

```deluge
config = {"host":"example.com", "port":443};
for each key in config.keys()
{
    info key + " = " + config.get(key);
}
```

## Null safety

Do not iterate a value that may be null.

```deluge
if(items != null && !items.isEmpty())
{
    for each item in items
    {
        info item;
    }
}
```

## Source

- https://www.zoho.com/deluge/help/conditional-statements/condition.html
- https://www.zoho.com/deluge/help/list-manipulations.html
- https://www.zoho.com/deluge/help/misc-statements/break.html
- https://www.zoho.com/deluge/help/misc-statements/continue.html
