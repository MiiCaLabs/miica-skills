# Custom Functions: Defining, Calling, Return Types

## Defining a custom function

Functions encapsulate reusable logic. Deluge functions have a return type (or `void`), parameters with types, and a body.

### Syntax

```deluge
<ReturnType> function_name(<ParamType1> param1, <ParamType2> param2, ...)
{
    // function body
    return <value>;  // only if ReturnType is not void
}
```

### Example: function that returns a value

```deluge
Number calculate_tax(Decimal amount, Decimal rate)
{
    tax = amount * rate / 100;
    return tax.toDecimal();
}

// Call it
total = 100;
tax_amount = calculate_tax(total, 10);  // 10.0
```

### Example: function with no return (void)

```deluge
void log_action(Text action, Text user_id)
{
    timestamp = zoho.currentdate;
    info user_id + " performed " + action + " at " + timestamp;
    // no return statement
}

// Call it
log_action("login", "user123");
```

## Parameter types (required)

Parameters must have explicit types:

```deluge
// Allowed types for parameters
Text send_welcome_email(Text email, Text name)
{
    subject = "Welcome, " + name;
    sendmail[ from: zoho.adminuserid, to: email, subject: subject, message: "Hello!" ];
    return email;
}

// Type mismatch errors
result = send_welcome_email(123, "John");  // 123 is Number, not Text → save error
```

## Return type (required)

Every function must declare a return type, even if it's `void`:

```deluge
void do_nothing() { }
Number get_count() { return 5; }
Text get_greeting() { return "Hello"; }
Map get_config() { return {"host": "example.com"}; }
List get_items() { return {"a", "b", "c"}; }
```

**Note:** Missing a `return` statement for a non-void function causes a save error: "Missing return statement: Provide <TYPE> expression to return".

## Function scope and nesting

- Functions are defined at the top level (not inside other functions in most Zoho products).
- Functions are scoped to the script/form where they're defined (or globally if defined in a library, depending on product).
- Calling a non-existent function is a save error: "Not able to find '<function>' function".

## Calling a function from another function

```deluge
Number double(Number x)
{
    return x * 2;
}

Number quadruple(Number x)
{
    doubled = double(x);      // call double() from within quadruple()
    return double(doubled);   // or: return doubled * 2
}

info quadruple(5);  // 20
```

## Optional parameters / default values

Deluge does not support optional parameters or default values. All parameters must be provided at the call site.

If you need defaults, use overloading (multiple functions with the same name but different arities - check your product's support) or use a Map to pass a dictionary of optional settings:

```deluge
// Workaround: pass config as a Map
void send_email(Text to, Map options)
{
    subject = ifNull(options.get("subject"), "No Subject");
    body = ifNull(options.get("body"), "");
    sendmail
    [
        from: zoho.adminuserid,
        to: to,
        subject: subject,
        message: body
    ];
}

// Call with selective options
send_email("user@example.com", {"subject": "Hello", "body": "Test"});
```

## Variable scope inside functions

Variables declared inside a function are local to that function:

```deluge
void outer_function()
{
    x = 10;  // local to outer_function
    inner_function();
}

void inner_function()
{
    x = 20;  // different x, local to inner_function
}

outer_function();
info x;  // error: x is not defined in this scope
```

## Recursion (calling a function from itself)

Recursion is allowed, but the 60-second execution timeout and statement-count limits mean deep recursion will fail:

```deluge
Number factorial(Number n)
{
    if(n <= 1)
    {
        return 1;
    }
    return n * factorial(n - 1);
}

info factorial(5);  // 120
```

For large datasets, use loops instead of recursion.

## Function naming conventions

- Use snake_case (e.g., `get_user_email`, `validate_age`) - not camelCase or PascalCase (which are reserved for built-in functions).
- Prefix with a verb if the function performs an action (`validate_`, `fetch_`, `send_`, `calculate_`).
- Be descriptive: `calculate_sales_tax()` is better than `calc_tax()`.

## Common function patterns

### Guard pattern (defensive return)

```deluge
Map get_user_data(Text email)
{
    if(email.isBlank())
    {
        return Map();  // empty Map on error
    }
    users = Form[Email == email];
    if(users.count() > 0)
    {
        return {"user": users.get(0)};
    }
    return Map();  // not found
}
```

### Transformation function

```deluge
List uppercase_list(List items)
{
    result = List();
    for each item in items
    {
        result.add(item.toUpperCase());
    }
    return result;
}
```

### Aggregation function

```deluge
Decimal sum_decimals(List values)
{
    total = 0;
    for each val in values
    {
        if(val.isNumber() || val.isDecimal())
        {
            total = total + val.toDecimal();
        }
    }
    return total;
}
```

## Function visibility and reuse

- **Creator**: functions can be called from form workflows and other scripts within the same app.
- **CRM / other products**: custom functions are typically available within the script where they're defined or in a shared library (if the product supports it).
- To reuse a function across multiple scripts/forms, define it in a shared custom function library if your product supports it.
