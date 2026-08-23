# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

Overview

-   What is ZRC?

    Zoho Request Client (ZRC) is a built-in SDK in Zoho CRM that provides a unified way to make REST calls across all developer-centric features of Zoho CRM. Whether you're calling [CRM APIs](https://www.zoho.com/crm/developer/docs/api/), using [Connections](https://www.zoho.com/deluge/help/connections.html), or accessing external public APIs, ZRC streamlines the process with consistent syntax, built-in authentication support, and reliable error handling.

-   Key Features
    -   CRM API Requests

        Make REST calls to all supported Zoho CRM API versions, including the latest (e.g., /crm/v8/Leads). For invoking the Zoho CRM APIs, you can use the **API endpoint alone** and the API domain will be auto-resolved based on the logged-in user's Data Center (DC).

        Notes : Below samples use zrc.get and zrc.post methods to send GET and POST requests respectively. Refer [ZRC Methods](/explore/widgets/v1.5/zrc_methods) to invoke other HTTP request methods

        Sample to get users. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/get-users.html)

        copy

        const users \= await zrc.get('/crm/v8/users');

        Output

        {
          "status": 200,
          "data": {
            "users": \[
              {
                "id": "3891457000000556001",
                "full\_name": "Catherin",
                "Modified\_Time": "2025-04-24T18:10:09+05:30",
                ...
              }
            \],
            "info": {
              "per\_page": 200,
              "count": 1,
              ...
            }
          },
          "headers": {
            "cache-control": "no-store, no-cache, must-revalidate, private",
            ...
          }
        }

        Show More

        Sample to get the details of a specific record in Deals module. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/get-records.html)

        copy

        const deal \= await zrc.get('/crm/v8/Deals/981234567810001', { params: { fields: 'Deal\_Name,Stage,Amount' } });

        Output

        {
          "status": 200,
          "data": {
            "data": \[
              {
                "id": "3891457000000567925",
                "Deal\_Name": "Benton",
                "Stage": "Qualification",
                "Modified\_Time": "2025-02-14T12:08:35+05:30",
                ...
              }
            \]
          },
          "headers": {
            "cache-control": "no-store, no-cache, must-revalidate, private",
            ...
          }
        }

        Show More

        Sample to create records in Deals module. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/insert-records.html)

        copy

        const deal \= await zrc.post('/crm/v8/Deals', { data: \[{ Deal\_Name: 'New Deal', Amount: 50000, Stage: 'Qualification' }, { Deal\_Name: 'My Deal', Amount: 10000, Stage: 'Qualification' }\] });

        Output

        {
          "status": 201,
          "data": {
            "data": \[
              {
                "code": "SUCCESS",
                "message": "record added",
                "status": "success"
              }
            \]
          }
        },
          "headers": {
            "clientversion": "10942545",
            ...
          }

        Show More

    -   Connection-based Requests

        Interact with third-party services using Zoho [Connections](https://www.zoho.com/deluge/help/connections.html), which handle authentication internally. For Connection-based requests, you need to specify the connection's link name in the [request configuration](/explore/widgets/v1.5/zrc_request_configuration_and_error_types) and use **fully qualified (absolute) URLs.** All other request configuration like request body, params, headers behave the same way for both Zoho CRM APIs and Connection-based requests.

        Notes : Create and use a reusable [ZRC instance](/explore/widgets/v1.5/zrc_methods#createinstance) with the connection name and baseUrl in the request config to avoid repeating configuration in every request.

        Sample to get spreadsheet details from Google Sheets using a connection named 'google\_sheets'.

        copy

        const res \= await zrc.get('https://sheets.googleapis.com/v4/spreadsheets/98711121211100', { connection: 'google\_sheets' });

        Sample with reusable ZRC instance

        copy

        const sheetZrc \= zrc.createInstance({ baseUrl: 'https://sheets.googleapis.com/v4', connection: 'google\_sheets' }); const sheet\_info \= await sheetZrc.get('/spreadsheets/98711121211100'); const sheet\_value1 \= await sheetZrc.get('/spreadsheets/98711121211102/values/A1'); const sheet\_value2 \= await sheetZrc.get('/spreadsheets/98711121211102/values/A2');

    -   External API Requests

        Call REST APIs directly from the browser with no request limits. External API requests with ZRC is a syntactic sugar over the standard [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in Client Script, providing a simpler interface.

        Sample

        copy

        const posts \= await zrc.get('https://zylker.com/posts');

        Output

        {
          "status": 200,
          "data": \[
            {
              "userId": 1,
              "id": 1
            },
            ...
          \],
          "headers": {
            "cache-control": "max-age=43200",
            "content-type": "application/json; charset=utf-8",
            ...
          }
        }

        Show More

-   Why use ZRC ?
    -   -   Supports any version of CRM APIs

            While [CRM Web APIs](/explore/client-script/webapi) methods mainly support v2 APIs, ZRC can call any publicly available CRM API version, offering more flexibility.

        -   File uploads via Connection or External API

            Unlike [ZDK.Apps.CRM.Connections.invoke](/explore/client-script/webapi/Connections#invoke) method, Connection-based requests from ZRC support file uploads / downloads.

        -   Consistent syntax for making API calls

            Whether it's CRM, Connection, or External API calls, ZRC uses the same syntax.

        -   No authentication needed for same-org API calls

            ZRC automatically authenticates requests made to your own Zoho CRM Org. No need to manage tokens or credentials manually.

        -   Async/await support for cleaner code

            ZRC is fully compatible with JS async/await syntax and promises, making your asynchronous API workflows easier to read and manage.

        -   Reusable ZRC instances

            ZRC allows you to create [reusable instances](/explore/widgets/v1.5/zrc_methods#createinstance) with custom configurations, making it easy to manage API requests within the same API domain / connection.

        -   Automatic JSON data handling in response

            ZRC automatically parses responses as JSON. For parsing the response body as text / blob / arraybuffer simply use the [requestConfig.responseType](/explore/widgets/v1.5/zrc_request_configuration_and_error_types) property.

        -   Automatic query parameters encoding

            ZRC automatically encodes query parameters for you. Just provide them as key-value pairs in the [requestConfig.params](/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object.

        -   Automatic request body serialization

            JSON, FormData and URLSearchParams request payloads are supported out of the box and don't require explicit request headers to be set.
