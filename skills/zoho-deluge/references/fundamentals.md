# Deluge Fundamentals: Variables, Data Types, Operators, Expressions

## Variables

No declaration keyword - a variable is created the moment you assign it.

```deluge
<variable_name> = <expression>;
```

```deluge
name = "John";
```

Variable names should be meaningful (`customer_email`, not `x1`) - this is an explicit Zoho style recommendation for maintainability.

**Naming rules (official):**
- Start with an uppercase letter, lowercase letter, or underscore (`_`) - never a digit.
- Contain only letters, digits, and underscores - no spaces or other special characters.
- Case-sensitive: `var` and `Var` are different variables.
- Cannot be one of the reserved words: `true`, `false`, `null`, `void`, `return`.

**Scope:** a variable is local to the action/function script where it's assigned - Deluge has no global-variable mechanism for arbitrary user variables (persistent cross-script data goes through a form/record, a connection, or a system variable instead).

## Data types

Deluge is dynamically typed for normal variables. Core types (per the official data-types reference):

| Type | Example | Notes |
|---|---|---|
| Text (String) | `"Milk"` | Must be double-quoted. |
| Number (Bigint) | `22` | Whole numbers; an operation mixing Number and Decimal produces a Decimal result. |
| Decimal | `3.14` | Floating point - currency/percentage-style values. |
| Boolean (Bool) | `true` / `false` | Lowercase, unquoted, case-insensitive keyword. |
| Date / Date-Time | `'01-Jan-2019 10:15:30'` | Single-quoted literal; format follows the app's date-time settings. Time portion defaults to 0 if omitted. Use `toDate()`/`toDateTime()` to parse text into a real date value. |
| Time | e.g. `'10:15 AM'` | Independent time-of-day value (12h or 24h), separate from Date-Time. |
| List | `{"a","b","c"}` or `List()` | Ordered collection; elements can be mixed types. |
| Map / Key-Value | `{"key":"value"}` or `Map()` | Key-value pairs; duplicate keys overwrite the earlier value. |
| Collection | `Collection("Mobile phone","Laptop","Adapter")` | The generic supertype behind List/Map - holds *either* an ordered list *or* key-value pairs, not both at once. |
| File | returned by `invokeUrl`, file-upload fields, `toFile()` | Binary/file object; only File-type built-in functions apply (see `references/builtin-functions.md`) - not usable on a file fetched via a Creator "fetch records" task or the `input` keyword. |
| Null | `null` | Built-in constant meaning "no value"; belongs to no specific type. |

```deluge
age = 22;          // Bigint
pi = 3.14;         // Decimal
isWeekend = false; // Bool
```

## Expressions (by result type)

An expression is "a combination of values, constants, variables, operators, or functions, evaluated to produce another value" (official definition). Deluge classifies expressions by the data type of their result: Boolean, Number, Decimal, Text, Date-time, List, and Key-value expressions.

```deluge
total = 1 + 2;                 // Number expression
name = "John" + "Smith";       // Text expression -> "JohnSmith"
if (a == b) { ... }            // Boolean expression used as an if-condition
```

## Operators

The official docs group operators into four categories:

- **Arithmetic** - `+ - * / %` (mod); `+` also concatenates text values.
- **Relational** - `== != > < >= <=`, used to compare two values and return a boolean (most common inside `if(...)` and `[...]` criteria).
- **Logical** - `&& || !`, combine boolean conditions (typically multiple criteria conditions).
- **Assignment** - simple `=` (assign right-hand value to the left-hand variable) plus compound assignment forms that combine an operation with assignment.

```deluge
C = 39;
F = C * 9/5 + 32;
info F;
```

**Style note (official best practice):** for text comparisons, prefer `equalsIgnoreCase()` / `equals()` over `==` for case-insensitive or safer comparisons - `==` on two non-matching types throws a save/runtime error rather than returning false.

Calling a built-in function on a value uses dot notation:

```deluge
first_name = "John";
last_name = "Smith";
full_name = first_name + " " + last_name;
info full_name.length();       // built-in function via dot notation
info full_name.toLowerCase();
```

See `references/builtin-functions.md` for the full catalog of built-in functions by data type.

## Comments

```deluge
// single line comment
/* multi
   line
   comment */
```

An unterminated `/* ... */` block is a common save error ("Comment Task is not closed properly") - always close block comments.

## The `info` statement (debugging)

```deluge
info <expression>;
```

Prints the expression to the output console. This is Deluge's `print`/`console.log` equivalent - use it liberally while developing, and the official docs recommend leaving informative `info` statements in place to aid future debugging where appropriate (remove ones that would leak sensitive data in production, e.g. API keys or PII in logs).

## Type-checking / conversion functions (COMMON functions)

These guard against runtime type errors - use them before operating on a value of uncertain type or origin (user input, API responses, fetched fields):

- `isNull(<expr>)` - true if null
- `isBlank(<expr>)` - true if empty
- `isDate(<expr>)`, `isNumber(<expr>)`, `isText(<expr>)`
- `toText(<expr>)`, `toNumber(<expr>)`, `toDecimal(<expr>)`, `toDate(<expr>)`, `toDateTime(<expr>)`
- `text(<expr>, <targetFormat>)` - format conversion

```deluge
if(input.email.isBlank())
{
    alert "Email is required";
    cancel submit;
}
```
