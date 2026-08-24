# Integrations and tasks

## Prefer native tasks when available

Native `zoho.*` tasks usually provide a shorter, product-aware interface. Use `invokeUrl` when no suitable task exists or when direct API control is required. Verify the current task signature and product availability before implementation.

## Connections

Use a named connection for OAuth or other supported authentication.

```deluge
response = invokeUrl
[
    url: "https://api.example.com/v1/resources"
    type: GET
    connection: "example_oauth"
];
```

Connection scopes must cover the operation. Connection links are environment-specific, so keep them explicit placeholders in shared examples.

## invokeUrl

JSON request with a detailed response:

```deluge
payload = {"name" : "Ada", "active" : true};
headers = {"Content-Type" : "application/json"};

response = invokeUrl
[
    url: "https://api.example.com/v1/contacts"
    type: POST
    headers: headers
    body: payload.toString()
    connection: "example_oauth"
    detailed: true
];

if(response.get("responseCode") >= 400)
{
    info response.get("responseText");
}
```

Rules:

- Do not put commas between task attributes.
- Do not specify both `body` and `parameters`.
- TEXT body defaults to `text/plain`; set a matching `Content-Type` for JSON or XML.
- KEY-VALUE body defaults to `multipart/form-data` unless overridden.
- `parameters` on GET and DELETE becomes query parameters.
- Supported methods include GET, POST, PUT, PATCH, DELETE, and OPTIONS.
- `detailed: true` returns `responseCode`, `responseHeader`, and `responseText`.
- `response-format` accepts NONE, STRING, or FILE. STRING and FILE are not applicable in Creator.
- `invokeUrl` has a fixed 40-second socket timeout. It has no documented `timeout` attribute.
- Each call consumes the host service's external-call allowance according to its plan.

## Native task response handling

Many integration tasks return an error Map instead of throwing.

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

Inspect the exact success and failure response documented for each task. A returned Map is not automatically a successful business operation.

## sendmail

```deluge
sendmail
[
    from: zoho.adminuserid
    to: recipient_email
    subject: "Invoice " + invoice_number
    message: "Your invoice is attached."
    Attachments: file:invoice_pdf
];
```

Allowed sender values and attachment support vary by host product and account configuration. Use a verified sender. Never assume an arbitrary From address will be accepted.

## sendsms

`sendsms` availability, sender rules, and regional restrictions vary. Generate its syntax from the target product's editor and verify the current official page before use.

## AI tasks

AI task availability depends on the host product. Current Deluge tasks include:

- `Zia[...]`
- `zoho.ai.analyseSentiment()`
- `zoho.ai.predictLanguage()`
- `zoho.ai.parsePhoneNumber()`
- `zoho.ai.recognizeText()`
- `zoho.ai.findNamedEntities()`
- `zoho.ai.parseAddress()`
- `zoho.ai.translate()`
- `zoho.ai.extractKeywords()`
- `zoho.ai.detectObject()`
- `zoho.ai.detectFace()`

The Zia task uses block syntax:

```deluge
response = Zia
[
    message: prompt
    context: context_text
    parameters: model_parameters
];
```

Files, context, and parameters are optional. Check the current task page for model availability, limits, file types, and rollout status. Do not send personal, confidential, or regulated data without an approved data-handling basis.

## Operational guidance

The following recommendations come from implementation practice:

- Include a stable external ID or idempotency key when an API supports one.
- Retry only operations documented as safe to retry.
- Log request identifiers, HTTP codes, and vendor error codes, not credentials or sensitive bodies.
- Separate authentication failures, rate limits, validation errors, and transport failures in diagnostics.
- Test connections and task signatures in the exact Zoho product and data center used for deployment.

## Sources

- https://www.zoho.com/deluge/help/integration-tasks.html
- https://www.zoho.com/deluge/help/webhook/invokeurl-api-task.html
- https://www.zoho.com/deluge/help/connections.html
- https://www.zoho.com/deluge/help/misc-statements/send-mail.html
- https://www.zoho.com/deluge/help/misc-statements/send-sms.html
- https://www.zoho.com/deluge/help/crm/create-record.html
- https://www.zoho.com/deluge/help/ai-tasks.html
- https://www.zoho.com/deluge/help/ai-tasks/zia-task.html
