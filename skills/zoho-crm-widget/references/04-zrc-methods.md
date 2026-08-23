# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZRC Methods

-   Quick API Request Methods
    -   get ( path, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends a GET request.

        Notes : Passing query parameters as key-value pairs in requestConfig.params automatically encodes them.

        Name Type Attributes Description path string API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object optional Additional options like headers, params etc.,

        Sample to get details of a particular Lead. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/get-records.html)

        copy

        await zrc.get('/crm/v8/Leads/3705319000000662013')

        Output

        {
          "status": 200,
          "data": {
            "data": \[
              {
                "First\_Name": "Rahul",
                "Last\_Name": "Sharma",
                "id": "3705319000000662013"
              }
            \]
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

        Sample with query params. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/get-records.html)

        copy

        await zrc.get('/crm/v8/Leads', { params: { fields: 'Last\_Name,First\_Name' } })

        Output

        {
          "status": 200,
          "data": {
            "data": \[
              {
                "First\_Name": "Rahul",
                "Last\_Name": "Sharma",
                "id": "3705319000000662013"
              }
            \],
            ...
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

    -   post ( path, body, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends a POST request.

        Notes : The zrc.post, zrc.put, zrc.patch, and zrc.request methods natively support JSON, FormData, and URLSearchParams payloads in the body. These formats are handled automatically, so you don't need to manually set request headers.

        Name Type Attributes Description path string API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests body object Data to send as request payload [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object optional Additional options like headers, params etc.,

        Sample to create records in Leads module. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/insert-records.html)

        copy

        await zrc.post('/crm/v8/Leads', { data: \[{ Last\_Name: 'Doe', Company: 'Zylker' }\] });

        Output

        {
          "status": 201,
          "data": {
            "data": \[
              {
                "code": "SUCCESS",
                "details": {
                  "id": "3705319000001037013",
                  ...
                },
                "message": "record added",
                "status": "success"
              }
            \]
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

        Sample with Form data to upload an attachment to a particular Lead. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/upload-attachment.html)

        copy

        const formData \= new FormData(); formData.append("file", fileBlob, "resume.pdf"); const uploadRes \= await zrc.post("/crm/v8/Leads/4000001234567/Attachments", formData);

        Output

        {
          "status": 200,
          "data": {
            "data": \[
              {
                "code": "SUCCESS",
                "details": {
                  "id": "4000001234567",
                  ...
                },
                "message": "attachment uploaded successfully",
                "status": "success"
              }
            \]
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

        Sample with URLSearchParams

        copy

        const params \= new URLSearchParams(); params.append("data", "My URL encoded data"); const response \= await zrc.post("https://myapi.example.com/posts", params);

    -   put ( path, body, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends a PUT request to update a record.

        Name Type Attributes Description path string API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests body object Data to send [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object optional Additional options like headers, params etc.,

        Sample to update a particular Lead. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/update-records.html)

        copy

        await zrc.put('/crm/v8/Leads/3705319000001037013', { data: \[{ Last\_Name: 'Updated Name' }\] });

        Output

        {
          "status": 200,
          "data": {
            "data": \[
              {
                "code": "SUCCESS",
                "details": {
                  "id": "3705319000001037013",
                  ...
                },
                "message": "record updated",
                "status": "success"
              }
            \]
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

    -   patch ( path, body, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends a PATCH request for partial updates.

        Name Type Attributes Description path string API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests body object Partial data [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object Additional options like headers, params etc.,

        Sample to add options to an existing picklist field. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/update-custom-fields.html)

        copy

        await zrc.patch('/crm/v8/settings/fields/111112000000067259?module=Leads', { fields: \[{ pick\_list\_values: \[{ display\_value: "North\_East", actual\_value: "IN\_North\_East" }\] }\] });

        Output

        {
          "status": 200,
          "data": {
            "fields": \[
              {
                "code": "SUCCESS",
                "details": {
                  "id": "111112000000067259"
                },
                "message": "field updated",
                "status": "success"
              }
            \]
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

    -   delete ( path, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends a DELETE request

        Name Type Attributes Description path string API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object optional Additional options like headers, params etc.,

        Sample to delete a lead. [Reference API](https://www.zoho.com/crm/developer/docs/api/v8/delete-records.html)

        copy

        await zrc.delete('/crm/v8/Leads/3705319000001037013');

        Output

        {
          "status": 200,
          "data": {
            "data": \[
              {
                "code": "SUCCESS",
                "details": {
                  "id": "3705319000001037013"
                },
                "message": "record deleted",
                "status": "success"
              }
            \]
          },
          "headers": {
            "content-type": "application/json;charset=UTF-8",
            ...
          }
        }

        Show More

    -   head ( path, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends a HEAD request to retrieve headers without the response body.

        Name Type Attributes Description path string API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object optional Additional options like headers, params etc.,

        Sample

        copy

        await zrc.head('https://someexamplewebsite.to/test');

        Output

        {
          "status": 200,
          "headers": {
            "Content-Type": "application/json; charset=utf-8",
            ...
          }
        }

        Show More

    -   options ( path, [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Sends an OPTIONS request to know the supported HTTP methods for a resource.

        Name Type Attributes Description path object API endpoint for Zoho CRM APIs (or) absolute URL for Connection-based requests [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object optional Additional options like headers, params etc.,

        Sample

        copy

        await zrc.options('https://someexamplewebsite.to/test/options');

        Output

        {
          "status": 204,
          "headers": {
            "Allow": "GET, POST, PUT, DELETE, OPTIONS",
            "Content-Length": "0"
          }
        }

        Show More

-   Custom API Request
    -   request ( [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { Promise }

        Make fully customizable API requests with complete control over the method, endpoint, headers, body, and other request configurations.

        Name Type Attributes Description [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object Full request setup including method, path, headers, body. Must include method, path, etc.

        Sample GET request

        copy

        const response \= await zrc.request({ path: 'https://zylker.com/posts' }); console.log(response);

        Output

        {
          "status": 200,
          "data": {
            "id": 101,
            "title": "Test GET",
            "body": "This is a sample body",
            "userId": 1
          },
          "headers": {
            "Content-Type": "application/json; charset=utf-8"
          }
        }

        Show More

        Sample POST request

        copy

        const response \= await zrc.request({ method: 'POST', path: 'https://zylker.com/posts', body: { title: 'Test Post', body: 'This is a sample body', userId: 1 } }); console.log(response);

        Output

        {
          "status": 201,
          "data": {
            "id": 101,
            "title": "Test Post",
            "body": "This is a sample body",
            "userId": 1
          },
          "headers": {
            "Content-Type": "application/json; charset=utf-8"
          }
        }

        Show More

-   Reusable API Instance
    -   createInstance ( [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) ) { ZRC Instance }

        Creates a reusable ZRC instance with default configurations (like connection link name, base URL, headers, etc.), reducing repetition in multiple requests. Per-request overrides are allowed without affecting the base config.

        Notes : The body is not accepted in requestConfig for createInstance and will be ignored if provided.

        Name Type Attributes Description [requestConfig](https://www.zohocrm.dev/explore/widgets/v1.5/zrc_request_configuration_and_error_types) object Base config for future API calls

        Connection-based requests with Google spreadsheets API

        copy

        const sheetZrc \= zrc.createInstance({ baseUrl: 'https://sheets.googleapis.com/v4', connection: 'google\_sheets' }); const sheet\_info \= await sheetZrc.get('/spreadsheets/98711121211100'); const sheet\_value1 \= await sheetZrc.get('/spreadsheets/98711121211102/values/A1'); const sheet\_value2 \= await sheetZrc.get('/spreadsheets/98711121211102/values/A2');

        External API Requests reusable instance

        copy

        const myApi \= zrc.createInstance({ baseUrl: 'https://api.myservice.com', headers: { Authorization: 'Bearer YOUR-TOKEN' } }); const allUserRes \= await myApi.get('/users/'); const oneUserRes \= await myApi.get('/users/123'); const createUserRes \= await myApi.post('/users/', { users: \[{ first\_name: 'Rahul', email: 'rahul@zylkermail.com' }\] }); const updateUserRes \= await myApi.put('/users/123', { users: \[{ first\_name: 'KL Rahul' }\] }); const deleteUserRes \= await myApi.delete('/users/123'); console.log({ allUsers: allUserRes.data, oneUser: oneUserRes.data, newUser: createUserRes.data, updatedUser: updateUserRes.data, deletedUser: deleteUserRes.data });

        Output

        {
          "allUsers": \[
            {
              "id": "101",
              "first\_name": "Rahul",
              "email": "rahul@zylkermail.com"
            },
            {
              "id": "102",
              "first\_name": "Virat",
              "email": "virat@zylkermail.com"
            }
          \],
          "oneUser": {
            "id": "101",
            "first\_name": "Rahul",
            "email": "rahul@zylkermail.com"
          },
          "newUser": {
            "id": "103",
            "first\_name": "Rahul",
            "email": "rahul@zylkermail.com"
          },
          "updatedUser": {
            "id": "101",
            "first\_name": "KL Rahul",
            "email": "rahul@zylkermail.com"
          },
          "deletedUser": {
            "id": "101",
            "status": "deleted"
          }
        }

        Show More
