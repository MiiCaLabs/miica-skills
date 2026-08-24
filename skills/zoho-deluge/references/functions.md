# Custom functions

Function creation differs by Zoho product. Identify the host product before writing a declaration or call.

## Zoho Creator

Creator functions have a configured name, namespace, return type, and typed arguments. The editor generates a declaration similar to:

```deluge
int getAverage(int total, int count)
{
    if(count == 0)
    {
        return 0;
    }
    return total / count;
}
```

Use `void` when the function returns no value.

Call a current-application function with `thisapp`:

```deluge
average = thisapp.getAverage(total, count);
```

Call a function in another Creator application in the same account with that application's link name:

```deluge
average = Analytics_App.getAverage(total, count);
```

The number and data types of parameters must match the declared arguments. Use Creator's function picker or generated syntax when namespaces are configured.

## Other Zoho services

CRM, Books, Desk, Flow, Sheet, Cliq, and other products expose different function editors and triggers. Some generate a full declaration. Others configure arguments in the UI and expose only the body.

Do not paste a Creator declaration into another product without checking that product's editor. Do not assume `thisapp` exists outside Creator.

## Product context

Document these assumptions with each function:

- Host product
- Trigger or workflow event
- Argument names and types
- Expected return type
- Input variable shape
- Required connection names and scopes
- API names or Creator link names used by the body

## Practical design guidance

These are implementation recommendations, not Deluge language rules:

- Keep orchestration in the workflow and reusable business logic in functions.
- Pass IDs or small maps instead of complete external payloads when possible.
- Return a predictable Map for multi-value results, including an explicit success or error signal.
- Make retryable functions idempotent when they create records or trigger external effects.
- Keep recursion bounded. Deluge documents a maximum of 75 function calls per execution.

## Sources

- https://www.zoho.com/deluge/help/misc-statements/call-function-in-creator.html
- https://www.zoho.com/deluge/help/misc-statements/call-function.html
- https://help.zoho.com/portal/en/kb/creator/developer-guide/workflows/create-and-manage-functions/articles/create-new-deluge-function
- https://www.zoho.com/deluge/help/deluge-in-zoho-services.html
- https://www.zoho.com/deluge/help/limitations.html
