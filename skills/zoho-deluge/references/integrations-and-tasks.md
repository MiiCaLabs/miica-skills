# Integrations and External Tasks: invokeUrl, Webhooks, Connections, Mail/SMS

## invokeUrl - calling external REST APIs

`invokeUrl` is the general-purpose HTTP request task. It's billed against external-call limits (commonly 1 unit per call).

### Basic syntax

```deluge
response = invokeUrl
[
    url: "https://api.example.com/endpoint",
    type: GET
];
info response;
```

### Common parameters

| Parameter | Type | Default | Notes |
|---|---|---|---|
| `url` | Text | required | The full URL including query string or path. |
| `type` | GET / POST / PUT / DELETE / PATCH / HEAD | GET | HTTP method. |
| `headers` | Map | empty | Custom headers; `{"Authorization": "Bearer token", "Content-Type": "application/json"}`. |
| `body` | Text / File / Key-Value | empty | Request body (typically JSON string for POST/PUT). |
| `parameters` | Text / Key-Value | empty | Older/alternate body mechanism - see "parameters vs body" below. Cannot be combined with `body` in the same call. |
| `files` | Map | empty | For multipart/form-data uploads; `{"fieldname": file_obj}`. |
| `connection` | Text | none | Named connection supplying auth (see Connections below). |
| `timeout` | Number | 40 seconds | Request timeout in seconds. |
| `detailed` | true / false | false | When `true`, response includes status code/headers, not just the body. |
| `response-format` | TEXT / MAP / FILE | TEXT | How to coerce the response before returning it. |
| `response-decoding` | Text (charset) | UTF-8 | Character-set override for decoding the response body. |

### `parameters` vs `body` - pick one, and mind the content-type

`invokeUrl` accepts **either** `parameters` **or** `body`, never both in the same call - passing both is a save-time error.

- `body` is the newer, explicit mechanism: pass a TEXT (JSON string), FILE, or KEY-VALUE (Map) value. With a KEY-VALUE `body`, the default content-type is `multipart/form-data` (override to `x-www-form-urlencoded` if the API expects that).
- `parameters` is the older mechanism, still common in existing/legacy scripts (and in some CRM connection-based examples). When `parameters` is given a **TEXT** value (e.g. `payload.toString()` from a Map), Deluge does **not** auto-detect JSON and defaults the request's content-type to `text/plain`.

**Gotcha:** if you send a JSON string through `parameters` (or `body`) intending a JSON API call, you must explicitly set `headers: {"Content-Type": "application/json", ...}` - otherwise the receiving API (Zoho CRM's own REST API included) may reject or silently misparse the payload as plain text/form data.

```deluge
// WRONG - server likely receives this as text/plain, not JSON
payload = {"data": records};
response = invokeUrl
[
    url: apiUrl
    type: PUT
    parameters: payload.toString()
    connection: "my_connection"
];

// CORRECT - content-type made explicit
headers = Map();
headers.put("Content-Type","application/json");
response = invokeUrl
[
    url: apiUrl
    type: PUT
    parameters: payload.toString()
    headers: headers
    connection: "my_connection"
];
```

When writing new scripts prefer `body` over `parameters` (it's the currently-documented mechanism), but when editing an existing script that already uses `parameters`, keep it - just make sure `Content-Type` is set explicitly whenever the payload is JSON.

### GET request (simplest case)

```deluge
response = invokeUrl
[
    url: "https://api.example.com/users?id=123",
    type: GET
];
```

### POST with JSON body

```deluge
payload = {"name": "Alice", "email": "alice@example.com"};
response = invokeUrl
[
    url: "https://api.example.com/users",
    type: POST,
    headers: {"Content-Type": "application/json"},
    body: payload.toString()  // convert Map to JSON string
];
```

### Parsing the response

```deluge
response = invokeUrl[ url: "https://api.example.com/data" type: GET ];
if(!isNull(response) && !response.isBlank())
{
    data = response.toMap();  // parse JSON response
    info data.get("status");
}
else
{
    info "Empty or null response";
}
```

### Handling errors

Since there's no try/catch, validate responses defensively:

```deluge
response = invokeUrl[ url: url type: POST body: payload.toString() ];
if(!isNull(response) && response.contains("error"))
{
    info "API returned an error: " + response;
}
else if(!isNull(response))
{
    result = response.toMap();
}
```

## Connections (OAuth & API keys)

Named **connections** centralize credential management and avoid hardcoding secrets:

```deluge
response = invokeUrl
[
    url: "https://api.example.com/endpoint",
    type: GET,
    connection: "my_connection_name"
];
```

The connection stores the API key, OAuth token, or basic auth credentials securely. Zoho manages credential rotation and refreshes tokens automatically.

## sendmail - sending email

```deluge
sendmail
[
    from: zoho.adminuserid,
    to: "recipient@example.com",
    subject: "Order Confirmation",
    message: "<h1>Thank you for your order</h1>"
];
```

### Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `from` | Text (email) | Yes | Must be `zoho.adminuserid` or `zoho.loginuserid` (or equivalent org account email). |
| `to` | Text (email) | Yes | Recipient email address. |
| `cc` | Text (email or List) | No | Carbon copy; if set, `from` must be `zoho.adminuserid`. |
| `bcc` | Text (email or List) | No | Blind carbon copy; if set, `from` must be `zoho.adminuserid`. |
| `subject` | Text | Yes | Email subject. |
| `message` | Text (HTML) | Yes | Email body; supports HTML. |
| `attachment` | File object or List | No | File(s) to attach. |

### Example with HTML and attachment

```deluge
file = invokeUrl[ url: "https://example.com/report.pdf" type: GET ];
sendmail
[
    from: zoho.adminuserid,
    to: customer_email,
    subject: "Your Report",
    message: "<p>Attached is your requested report.</p>",
    attachment: file
];
```

### sendmail rules

- If `cc` or `bcc` is used, `from` must be `zoho.adminuserid` - using `zoho.loginuserid` with CC/BCC will throw a save error.
- Recipient emails must be valid text - if pulling from a user field, guard against null/blank.
- Multiple recipients in `to`/`cc`/`bcc`: pass a List or a comma-separated string.

## sendsms - sending SMS

```deluge
sendsms
[
    to: "+1234567890",
    message: "Your code is 1234"
];
```

### Parameters

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `to` | Text (phone number) | Yes | Recipient phone number in E.164 format (e.g., +1234567890). |
| `message` | Text | Yes | SMS message body (max ~160 chars; longer messages may be split). |

## Webhooks (receiving data)

Some Zoho products allow workflows to be triggered via webhooks. When a webhook is called, Deluge receives the POST body via the `input` keyword (a Map or JSON-like structure):

```deluge
// Inside a webhook-triggered workflow
webhook_data = input;
id = webhook_data.get("id");
info "Received webhook for ID: " + id;
```

No explicit parsing needed - the webhook payload is automatically available as `input`.

## Direct integrations (shortcuts for common tasks)

These are aliases for common `invokeUrl` patterns; refer to the integration tasks page for each product for current syntax:

- **Zoho CRM**: `zoho.crm.getRecords()`, `zoho.crm.insertRecords()`, `zoho.crm.updateRecords()`, etc. (see `references/integration-tasks-catalog.md`)
- **Zoho Books**: `zoho.books.getRecords()`, `zoho.books.createRecord()`, etc.
- **Zoho Desk**: `zoho.desk.getRecords()`, `zoho.desk.createRecord()`, etc.
- And ~20+ other products (see `references/integration-tasks-catalog.md` for full list)

These tasks handle JSON encoding/decoding and error codes automatically, so they're preferred over raw `invokeUrl` when available for your product.

## Rate limits and external-call units

- Each `invokeUrl` call consumes 1 external-call unit (shared across the Zoho org).
- `invokeUrl` inside a 1000-iteration loop → 1000 units consumed.
- Zoho plans have monthly external-call limits; scripts exceeding the limit fail silently.
- Batch API calls where possible (send 10 records per call instead of 1 record per call × 10).

## Timeout and retry patterns

The default timeout is 40 seconds. If a remote API is slow, retry a bounded number of times - Deluge has no `while` loop, so use `for each` over a fixed-size literal list and `break` once a response comes back:

```deluge
response = null;
retryAttempts = {1,2,3};
for each attempt in retryAttempts
{
    try_response = invokeUrl[ url: url type: GET timeout: 60 ];
    if(!isNull(try_response))
    {
        response = try_response;
        break;
    }
}
```

(Note: Deluge has no actual try/catch, but this pattern simulates conditional retry logic.)
