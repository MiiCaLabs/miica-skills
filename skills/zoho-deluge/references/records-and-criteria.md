# Records and Criteria (Fetching, Creating, Updating, Deleting)

## Criteria syntax

Criteria filter records using `[<field> <operator> <value>]` syntax. The square brackets are mandatory.

### Basic criteria

```deluge
// Single condition
Form[Status == "Active"];
Form[Email == user_email];
Form[Age > 18];

// Multiple conditions (AND)
Form[Status == "Active" && Age > 18];
Form[Status == "Active" && Role != "Guest"];

// OR conditions (group with && or fetch twice)
Form[Status == "Active" || Status == "Pending"];
```

### Supported operators in criteria

| Operator | Meaning | Example |
|---|---|---|
| `==` | equals | `Status == "Active"` |
| `!=` | not equals | `Role != "Guest"` |
| `>` | greater than | `Age > 18` |
| `<` | less than | `Salary < 50000` |
| `>=` | greater or equal | `Score >= 80` |
| `<=` | less or equal | `Limit <= 100` |
| `contains` | substring (text fields) | `Name contains "John"` |
| `startsWith` | text starts with | `Email startsWith "admin"` |
| `endsWith` | text ends with | `Domain endsWith ".com"` |
| `in` | value in a list | `Status in {"Active", "Pending"}` |

### Complex criteria

```deluge
// IN list
Form[Status in {"Active", "Pending", "Approved"}];

// Combining AND/OR (AND has higher precedence)
Form[Status == "Active" && (Age > 18 || HasConsent == true)];

// Nested field criteria (e.g., linked records)
Form[LinkedUser.Status == "Active"];
```

**Performance tip:** Use indexed fields (ID, Email, unique fields) for faster criteria evaluation. Complex OR criteria should be broken into multiple fetches if possible.

## Fetching records (Creator)

### Fetch with criteria (Creator only)

```deluge
records = Form[Email == user_email];
```

This returns a List of records matching the criteria.

### Fetch all records

```deluge
all_records = Form[];  // empty criteria = all records
```

### Fetch with count and iteration

```deluge
active = Form[Status == "Active"];
if(active.count() > 0)
{
    for each rec in active
    {
        info rec.Name;  // access fields with dot notation
        info rec.Salary;
    }
}
```

### Fetch a single record safely

```deluge
matches = Form[Email == email];
if(matches.count() > 0)
{
    record = matches.get(0);
}
else
{
    info "No match found";
}
```

## Fetching records (other products: CRM, Books, Desk, etc.)

Non-Creator products use integration tasks:

```deluge
// Zoho CRM
records = zoho.crm.getRecords("Leads", 1, 10);

// Zoho Books
records = zoho.books.getRecords("Contacts");

// Zoho Desk
tickets = zoho.desk.getRecords("Tickets", 1, 20);
```

See `references/integration-tasks-catalog.md` and `references/integrations-and-tasks.md` for per-product task syntax.

## Creating records

### Creator: insert into form

```deluge
new_record = Map();
new_record.put("Name", "Alice");
new_record.put("Email", "alice@example.com");
new_record.put("Status", "Active");
Form.insert(new_record);
```

### Other products: integration task

```deluge
data = {"Name": "Alice", "Email": "alice@example.com"};
result = zoho.crm.insertRecords("Contacts", data);
```

## Updating records

### Creator: update records

```deluge
updates = Map();
updates.put("Status", "Inactive");
Form[ID == rec_id].update(updates);
```

### Fetch, modify, then update (safer pattern)

```deluge
matches = Form[ID == rec_id];
if(matches.count() > 0)
{
    record = matches.get(0);
    record.Status = "Inactive";
    record.update();
}
```

### Other products: integration task

```deluge
data = {"Name": "Alice Updated", "Status": "Active"};
result = zoho.crm.updateRecords("Contacts", rec_id, data);
```

## Deleting records

### Creator: delete with criteria

```deluge
Form[Status == "Archived"].delete();
```

**CAUTION:** Test the criteria thoroughly - this is irreversible. Consider soft-delete (set a status field) instead.

### Delete a specific record

```deluge
Form[ID == rec_id].delete();
```

### Other products: integration task

```deluge
result = zoho.crm.deleteRecords("Contacts", rec_id);
```

## Accessing record fields

### Fetched records (dot notation)

```deluge
record = Form[ID == rec_id].get(0);
name = record.Name;           // fetch field value
email = record.Email;
created = record.Created_Time;
```

Field names are case-sensitive and use the exact field link name.

### Map/manual records (`.get()`)

```deluge
data = {"name": "John", "age": 30};
name = data.get("name");      // "John"
age = data.get("age");        // 30
missing = data.get("city");   // null (key doesn't exist)
```

## Sorting and pagination

### Creator: sort by

```deluge
records = Form[Status == "Active"] sorted by Created_Time desc;
```

### Pagination in integration tasks

```deluge
// Fetch page 2, 10 records per page
records = zoho.crm.getRecords("Contacts", 2, 10);
```

## Defensive record fetching

Always guard against null/empty results:

```deluge
criteria_results = Form[Email == input_email];
if(!isNull(criteria_results) && criteria_results.count() > 0)
{
    first_record = criteria_results.get(0);
    // process record
}
else
{
    info "No matching record found";
}
```

## Anti-patterns to avoid

1. **Fetch all, then filter in Deluge** - Fetch all records then use an `if` to filter them. Instead, push the filter into the criteria.
   ```deluge
   // Bad
   all_records = Form[];
   for each rec in all_records
   {
       if(rec.Status == "Active") { ... }
   }

   // Good
   active = Form[Status == "Active"];
   for each rec in active { ... }
   ```

2. **Double-fetching the same criteria** - Check `.count() > 0` then fetch again.
   ```deluge
   // Bad
   if(Form[Email == email].count() > 0)
   {
       records = Form[Email == email];  // fetch twice
   }

   // Good
   records = Form[Email == email];
   if(records.count() > 0) { ... }
   ```

3. **Unsafe field access on null records** - Always check `.count() > 0` before `.get()`.
   ```deluge
   // Bad
   record = Form[Email == email].get(0);  // crashes if empty

   // Good
   matches = Form[Email == email];
   if(matches.count() > 0)
   {
       record = matches.get(0);
   }
   ```
