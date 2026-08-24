# Zoho variables and deployment boundaries

Zoho variables are predefined, read-only values. Availability and returned values depend on the host product and execution context.

## Common variables

| Variable | Documented value |
|---|---|
| `zoho.currentdate` | Current date in the application's configured format |
| `zoho.currenttime` | Current date and time in the application's configured format |
| `zoho.loginuser` | Current user's username, or `Public` in public contexts |
| `zoho.loginuser.name` | Current user's name in Creator |
| `zoho.loginuserid` | Current user's email address, or null where no authenticated user is available |
| `zoho.adminuser` | Application owner's username |
| `zoho.adminuserid` | Application owner's email address |
| `zoho.appname` | Current Creator application link name |
| `zoho.appuri` | Creator path `/<admin_username>/<application_link_name>/` |
| `zoho.ipaddress` | Current user's public IP address, or null without a user session |
| `zoho.device.type` | Creator device type: `web`, `phone`, or `tablet` |

Examples:

```deluge
today = zoho.currentdate;
now = zoho.currenttime;
actor_email = zoho.loginuserid;
device = zoho.device.type;
```

Do not treat `zoho.loginuser` or `zoho.adminuser` as Maps. Do not treat variables ending in `userid` as internal numeric user IDs: these documented variables return email addresses.

`zoho.device.type` is Creator-only and returns `web` by default when an exact device cannot be determined, including some scheduled workflows.

Creator environments expose deployment-aware attributes:

```deluge
environment_type = thisapp.environment.type;
environment_link_name = thisapp.environment.linkname;
```

Use these attributes to prevent development or stage workflows from writing to production integrations. External Creator API callers must pass the environment explicitly because `thisapp.environment` resolves only inside Creator.

## Context checks

- Public Creator forms can return `Public` or null for login variables.
- Scheduled and backend workflows may not have an interactive user or device.
- Product-specific variables outside this list must be verified in that product's documentation or generated editor context.
- Do not build authorization solely from UI context or a user-supplied email. Enforce product permissions and server-side record rules.

## On-premise Deluge

On-premise Deluge is not identical to cloud Deluge.

For non-Creator on-premise products, the official support table states:

- Zoho variables and predefined Zoho integration tasks are unavailable.
- `invokeUrl` and custom connections are available with limits.
- Basic, API key, OAuth2, and header-token authentication are supported. OAuth1 and AWS authentication are not.
- AI tasks, native data access, Creator client functions, subform tasks, and blueprint tasks are unavailable.

For Creator on-premise, the official support table states:

- User-defined and Zoho variables are supported.
- Most Deluge tasks are supported, except Zia AI tasks.
- Predefined Zoho integration tasks remain unavailable.
- Custom connections support a broader authentication set, with documented limitations.

Use the live on-premise table as authority. Product releases can change the matrix.

## Sources

- https://www.zoho.com/deluge/help/zoho-variables.html
- https://www.zoho.com/deluge/help/environment-attributes.html
- https://www.zoho.com/deluge/help/on-premise.html
- https://www.zoho.com/deluge/help/deluge-in-zoho-services.html
