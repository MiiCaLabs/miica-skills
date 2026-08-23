# Error Handling in Deluge

**Deluge has no `try`/`catch`/`throw`.** Robustness comes from defensive checks before an operation, not from catching exceptions after. Design every script assuming an unchecked null, empty value, or unexpected type will hard-fail execution.

## Two error categories (per official docs)

1. **Save errors** - prevent the script from saving at all; almost always a syntax/structure problem.
2. **Runtime errors** - occur during execution, typically from an operation on bad data (null, wrong type, out-of-range index, divide by zero).

## Common save errors and their fix

| Error | Cause | Fix |
|---|---|---|
| `Improper Statement Error might be due to missing ';' at end of the line or incomplete expression` | missing `;`, unclosed string quotes, string ending in `\` before the closing quote | terminate every statement; escape trailing backslashes or restructure the string |
| `Variable '<x>' is not defined` | used before assignment | assign before use |
| `Expecting '}' but found '<EOF>'` | mismatched braces/parens | check brace pairing, especially in nested if/for |
| `Comment Task is not closed properly` | unterminated `/* ... */` | close every block comment |
| `In Criteria left expression is of type <type1> and right expression is of type <type2> and the operator <op> is not valid` | comparing two incompatible types in a `[...]` criteria | make both sides the same type, or convert one side first |
| `Number of Arguments mismatches` / `No. of arguments mismatches for the function <name>` | wrong arg count to a built-in/task/custom function | check the function's signature |
| `Argument type mismatches for the function <name> at index <n>` | wrong argument type at a specific position | pass the type the function expects at that position |
| `Missing return statement: Provide <TYPE> expression to return` | function's declared return type has no matching `return` | add a `return <value>;` matching the declared return type |
| `Not able to find '<function>' function` | called before defined, or a non-void call's result wasn't captured | define the function first; assign its return value |
| `<function> function needs to be assigned to a variable` | non-void function's return value discarded | assign it: `x = myFunc();` |
| `<function> function cant be assigned to variable or used in expression` | tried to assign result of a void function | don't assign it: `myFunc();` |
| `Invalid module name for the function <task> at index <n>` | wrong/unsupported module name passed to an integration task | use a valid module name for that task/product |
| `<integration_task> is not supported for this function` | task run in the wrong product context, or (Cliq) missing the `connections` parameter | run in the correct product; supply `connections` where required |
| `'FROM'/'TO'/'SUBJECT'/'MESSAGE' message is missing for sendmail task` (and the SMS equivalents `'TO'`/`'MESSAGE'` for `sendsms`) | a mandatory `sendmail`/`sendsms` field was omitted | supply every mandatory field |
| `Invalid email address found` | `from`/`to` assigned a non-text or malformed value | assign a valid email address as text |
| `In cases where From: address is not zoho.adminuserid...` / `Invalid CC:`/`Invalid BCC:` errors | `sendmail` with a non-admin/login `from` plus `cc`/`bcc`, or mismatched `to` | use `zoho.adminuserid`/`zoho.loginuserid` per the sendmail rule in `references/integrations-and-tasks.md` |

## Common runtime errors and their fix

| Error | Cause | Fix |
|---|---|---|
| `Invalid JSON Format String` | converting malformed text to a key-value collection | validate/log the raw text before parsing; confirm the API actually returned JSON |
| `Error in performing the Operation / : Divide by zero error` | division where divisor evaluated to 0 | check `divisor != 0` first |
| `Given index <n> is greater than the list size` | `.get(i)` beyond actual list/collection size | check `.size()` before indexing |
| `Given string is lesser than the applied boundary, so index out of bounds exception arisen` | `subText`/`substring` (or a collection index) beyond actual length | check text length / `.size()` before indexing |
| `Null value occurred while performing <operation> operation` | arithmetic/operation on a null | `isNull()` check first, or use `ifNull()` |
| `On performing mod operation mismatch of data type expressions found` | `%` (modulo) with a null or non-number operand | assign a number to both operands before `%` |
| `An error occurred while performing this action` (relational op on non-numeric operands) | comparing two non-numeric values with `> < >= <=` | ensure both operands are numeric, or use text-appropriate operators/functions |
| `'<value>' can not be cast to 'MAP'` / `'TEXT' can not be cast to '[BIGINT]'` / `'TEXT' can not be cast to '[DECIMAL, NUMBER, DATE, DATE-TIME]'` | passing a value of the wrong type where a number/date/map was expected | convert explicitly with `toNumber()`/`toDate()`/`toDecimal()`/`toMap()` before use |
| `Incompatible types for function at argument index <n> Required: [<TYPE>] Found: <TYPE>` | wrong type passed at a specific argument position (common on date functions) | pass the required type at that position |
| `UnParsable date` | text isn't a recognized date format | confirm format matches account's date-time settings, or use `toDate()`/`toDateTime()` with explicit parsing |
| `Invalid XML or Invalid XPath` | malformed XML, or an XPath expression that doesn't match the document | validate the XML and XPath before calling `executeXpath`/`toXmlList` |
| socket timeout error (invokeUrl) | remote API took >40s | add retry logic at the calling layer, or contact the API owner about response time |

Source: the full current list is at `https://www.zoho.com/deluge/help/error-messages.html` - check it directly for an error string not covered above.

## Defensive patterns to use everywhere

```deluge
// Guard before dividing
if(divisor != 0)
{
    result = numerator / divisor;
}
```

```deluge
// Guard before indexing / after fetch
matched = Form_link_name[Email == inputEmail];
if(matched.count() > 0)
{
    record = matched.get(0);
}
else
{
    info "No matching record found";
}
```

```deluge
// Guard before using a possibly-null value with ifNull
displayName = ifNull(user.get("name"), "Guest");
```

```deluge
// Guard around parsing an external API's JSON response
response = invokeUrl[ url: apiUrl type: GET ];
if(!isNull(response) && !response.isBlank())
{
    data = response.toMap(); // or getJson(...) depending on shape
}
else
{
    info "Empty or missing API response";
}
```

```deluge
// Guard before type-sensitive comparisons/functions
if(inputValue.isNumber())
{
    total = inputValue.toDecimal() * rate;
}
```

## "Fail gracefully" pattern for multi-step scripts

Since there's no exception propagation, structure risky multi-step logic (e.g. several sequential API calls) as a chain of `if` guards, so a failure at step N skips remaining steps cleanly instead of crashing on a null from an earlier failed call:

```deluge
step1_ok = false;
resp1 = invokeUrl[ url: url1 type: GET ];
if(!isNull(resp1))
{
    step1_ok = true;
    // use resp1 for step 2 only if step 1 succeeded
    if(step1_ok)
    {
        resp2 = invokeUrl[ url: url2 body: resp1.toString() type: POST ];
        // etc.
    }
}
else
{
    info "Step 1 failed - aborting subsequent steps";
}
```

For tracking multiple potential failure points at once (e.g. batch processing many records where some may fail), accumulate failures into a List/Map as you go rather than trying to "catch" anything - then report/act on the failure collection at the end.
