# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

Limitations & Considerations

-   CRM API Calls
    -   -   Execution scope

            All Zoho CRM APIs are executed under the logged-in user's authorization

        -   Request/response limits

            No enforced limits in ZRC client, since requests are sent directly from the browser

        -   Timeouts

            Follows the default timeout behavior of the browser

        -   API limits

            Subject to standard Zoho [CRM API limits](https://www.zoho.com/crm/developer/docs/api/v8/api-limits.html)

-   For Connection APIs
    -   -   Response limit

            Accepts responses up to 100 MB

        -   Timeout

            Uses a 40-second read timeout from the target service
