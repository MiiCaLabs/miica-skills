# Control Flow: if/else, loops, conditions

## Deluge has exactly one loop construct: `for each`

There is **no** `for(init; condition; increment)` C-style loop, and - despite how natural it would be to reach for one - **no `while` loop either**. `while` is not a Deluge keyword: it's absent from the official reserved-keywords list (`https://www.zoho.com/deluge/help/keywords.html`), no official doc page documents it (the `break` statement's own doc page describes it purely in terms of `for each`, with no mention of `while`), and writing one is an "Improper Statement" save error - confirmed both by that omission and by multiple real-world reports of the same error when developers try it. The only loop construct is `for each`, iterating over a collection (List, Map, or fetched-record set).

```deluge
// WRONG - neither of these exist in Deluge
for(i = 1; i <= 10; i = i + 1) { info i; }

i = 1;
while(i <= 10) { info i; i = i + 1; }

// CORRECT - for each over a literal collection
for each i in {1,2,3,4,5,6,7,8,9,10}
{
    info i;
}
```

### Indexed / counted / "until a condition" loops (manual pagination, retry-until-success, search-until-found)

With no counter-driven loop available, write these as a `for each` over a **fixed-size literal list** that bounds the maximum number of iterations, and `break` out early once the real stopping condition is met:

```deluge
// Manual pagination: scan up to 5 pages (a hard, explicit cap - never build
// this list with a loop, since generating it is exactly the problem you're
// routing around), stopping as soon as the target is found or the API
// reports there's nothing left.
pageNumbers = {1,2,3,4,5};
pageSize = 200;
found = false;
moreRecords = true;
for each page in pageNumbers
{
    response = zoho.crm.getRecords("users",page,pageSize,{"type":"ActiveUsers"});
    for each user in ifnull(response.get("users"),List())
    {
        if(user.get("email") == targetEmail)
        {
            found = true;
            break;   // stop scanning this page once matched
        }
    }
    info_map = response.get("info");
    moreRecords = if(info_map == null, false, ifnull(info_map.get("more_records"),false));
    if(found || !moreRecords)
    {
        break;       // stop paging once found, or once the API says there's no more
    }
}
```

Size the literal list deliberately for the scenario (5 pages × 200 = 1,000 records comfortably covers an admin/user lookup in almost any org) and always put the exit checks (`found`, `moreRecords`) at the end of the loop body so both the found-case and the exhausted-case stop paging on the same iteration.

## if / else / else-if

```deluge
if(<condition>)
{
    // executed if condition is true
}
else if(<condition2>)
{
    // executed if condition2 is true
}
else
{
    // fallback
}
```

Conditions are Boolean expressions - typically using relational operators (`==`, `!=`, `>`, `<`, `>=`, `<=`) or logical operators (`&&`, `||`, `!`).

```deluge
status = "active";
if(status == "active")
{
    info "User is active";
}
else if(status == "pending")
{
    info "User is pending approval";
}
else
{
    info "User is inactive";
}
```

**Style note:** Always use `{ }` even for single-statement blocks - it prevents bugs when code is later extended. Indentation is not enforced but is essential for readability.

## No `?:` ternary operator - use inline `if(...)` instead

Deluge has no `condition ? a : b` ternary (it's a long-requested but never-shipped community feature request). The documented inline-conditional-expression form reuses the `if` keyword, called with three comma-separated arguments and used as an expression rather than a block statement:

```deluge
// WRONG - does not exist in Deluge
status = age >= 18 ? "adult" : "minor";

// CORRECT
status = if(age >= 18, "adult", "minor");
```

This is the same construct `ifnull(value, default)` is built from - `if(<criteria>, <valueIfTrue>, <valueIfFalse>)` returns the first value when the criteria is true, the second otherwise. It nests like any other function call: `if(a > b, if(a > c, a, c), if(b > c, b, c))`.

## for each (iterating over collections)

### Iterating over a List or Map

```deluge
items = {"apple", "banana", "orange"};
for each item in items
{
    info item;
}
```

The loop variable (`item`) is local to the loop and holds one element per iteration.

### Iterating over a fetched record collection (Creator only)

Creator allows direct iteration over form records:

```deluge
for each record in Employees [Status == "Active"]
{
    info record.Name;
    info record.Salary;
}
```

This fetches and iterates all records matching the criteria in one statement. Other products use `zoho.crm.getRecords()` etc. and loop over the returned collection.

### Iterating over a Map (key-value pairs)

```deluge
config = {"host": "example.com", "port": "8080"};
for each entry in config
{
    info entry.getKey() + " = " + entry.getValue();
}
```

Or assign both at once (if the Map's values are themselves Maps/collections):

```deluge
data = {"user1": {"age": 25}, "user2": {"age": 30}};
for each key, value in data
{
    info key + ": " + value.get("age");
}
```

### Empty iteration

If the collection is null or empty, the loop body does not execute:

```deluge
items = null;
for each item in items
{
    // never runs
}
```

## break and continue

- `break;` - exit the loop immediately, skip remaining iterations.
- `continue;` - skip the rest of the current iteration, move to the next one.

```deluge
for each i in {1, 2, 3, 4, 5}
{
    if(i == 3)
    {
        continue;  // skip 3
    }
    if(i == 4)
    {
        break;     // stop at 4
    }
    info i;        // prints 1, 2, 5
}
```

Output: `1`, `2`, `5` (3 is skipped by `continue`, loop exits before 4).

## Combining conditions (logical operators)

- `&&` (AND) - both conditions must be true.
- `||` (OR) - at least one must be true.
- `!` (NOT) - negates the condition.

```deluge
age = 25;
status = "active";
if(age >= 18 && status == "active")
{
    info "User is eligible";
}

if(age < 13 || status == "banned")
{
    info "User cannot proceed";
}

if(!isNull(email))
{
    info "Email exists";
}
```

## Short-circuit evaluation

Deluge evaluates `&&` and `||` left-to-right and stops as soon as the result is determined:
- `false && <anything>` → `false` (second part not evaluated).
- `true || <anything>` → `true` (second part not evaluated).

Use this to avoid null-pointer errors:

```deluge
if(!isNull(user) && user.age > 18)
{
    // user.age is only checked if user is not null
}
```

## Guard patterns (defensive control flow)

Since Deluge has no try/catch, use `if` to guard against bad states:

```deluge
records = Form[Email == input.email];
if(records.count() > 0)
{
    record = records.get(0);
    info "Found: " + record.Name;
}
else
{
    info "No matching record";
}
```

## Early return in custom functions

In a function, `return;` (void return) or `return <value>;` exits immediately:

```deluge
Number validate_age(age)
{
    if(age < 0)
    {
        return -1;  // error code
    }
    if(age > 150)
    {
        return -1;  // error code
    }
    return age;     // success
}
```

See `references/functions.md` for full function syntax.
