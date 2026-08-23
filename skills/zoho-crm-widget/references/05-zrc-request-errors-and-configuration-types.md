# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

Request Configuration and Error Types

-   Request Configuration
    -   Property Type Default Applicable In Description headers Object All methods Custom request headers (e.g., Content-Type: 'application/json'). connection String Connection-based requests [Connection](https://www.zoho.com/deluge/help/connections.html) link name to be used. baseUrl String Connection-based requests & [createInstance()](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_methods#createinstance) API Domain (e.g., https://api.example.com). Mandatory if path is relative URL. params Object All methods Query parameters passed as key-value pairs. responseType 'json' | 'text' | 'blob' | 'arraybuffer' 'json' All methods Format of the response: 'json', 'text', 'blob', 'arraybuffer'. body Any [zrc.request()](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_methods#request) only Data to be sent in the request payload. method String 'GET' [zrc.request()](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_methods#request) & [createInstance()](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_methods#createinstance) HTTP method like 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'. path String [zrc.request()](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_methods#request) only Absolute URL or relative path to which the request should be made. baseUrl is appended if path is relative.

        Sample

        copy

        RequestConfig: { headers: { // supported headers to be sent with the request 'content-type': 'application/json'; ... }; // while making connection requests, you must provide API domain either in baseUrl or in the path argument itself connection: string; // link name of the connection responseType: 'json' | 'text' | 'arraybuffer' | 'blob'; //If the response type not mentioned, Response will be parsed based on content-type header params: { // key-value pairs to be sent as query params in request // json and arrays are auto serialized if you need more customization, please add queryparams directly in the path variable, e.g. /path/to/myservice?name=brad&city=jaipur }; // body is auto serialized if json, form data or URL Search params is provided body: any; // mandatory for zrc.request() and zrc.createInstance() method: string; // only applicable in zrc.request() and zrc.createInstance() method path: string; // only applicable in zrc.request() method };

-   Error Types

    Note: Always wrap your zrc calls inside a **try...catch** block to handle errors properly.

    -   Error Type Description ZrcError Error occurred while setting up the request. ZrcValidationError Validation error due to incorrect arguments passed to ZRC methods. ApiError Server-side issue, such as status >= 300, server unreachable, or no response received. ConnectionError Issues specific to connection-based API calls.

        Sample

        copy

        try{ const res \= await zrc.request({ method: 'GET', path: 'https://api.myservice.com/users/999', connection: 'MyService\_Conn' }); console.log(res.data); } catch (error){ if(error.name \=== 'ZrcValidationError') { console.error('Validation failed:', error.message); } else if(error.name \=== 'ApiError') { console.error('API issue:', error.message, ' Status:', error.status); } else if(error.name \=== 'ConnectionError') { console.error('Connection issue:', error.message); } else if(error.name \=== 'ZrcError') { console.error('Request setup issue:', error.message); } else { console.error('Unexpected error:', error); } }

        Output

        {
          "name": "ApiError",
          "message": "Request failed with status code 404",
          "status": 404,
          "details": {
            "error": "User not found"
          }
        }

        Show More
