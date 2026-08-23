# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM HTTP

-   delete ( request )

    Invoke HTTP delete

    Return Promise : Resolved with response of the initiated request

    name type description request Object Request Object request.params Object Request Params request.headers Object Request Headers request.body Object Request Body

    Example

    var request \= { url: "https://crm.zoho.com/crm/v2/Leads/111158000000045188", headers: { Authorization: "\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*", } } ZOHO.CRM.HTTP.delete(request).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "id": "111158000000045188"
         },
         "message": "record deleted",
         "status": "success"
       }
     \]
    }

    Show More

-   get ( request )

    Invoke HTTP get

    Return Promise : Resolved with response of the initiated request

    name type description request Object Request Object request.params Object Request Params request.headers Object Request Headers

    Example

    var request \= { url: "https://crm.zoho.com/crm/private/xml/Users/getUsers", params: { scope: "crmapi", type: "AllUsers" }, headers: { Authorization: "\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*", } } ZOHO.CRM.HTTP.get(request).then(function(data){ console.log(data) })

    Output

    {
      "users": {
        "user": \[
          {
            "zip": "null",
            "country": "null",
            "website": "null",
            "role": "Acquisition Manager",
            "city": "null",
            "timezone": "Asia\\/Calcutta",
            "profile": "Administrator",
            "mobile": "null",
            "language": "en\_US",
            "content": "Patricia Boyle",
            "zuid": "51857638",
            "confirm": "true",
            "phone": "null",
            "street": "null",
            "id": "1475615000000083003",
            "state": "null",
            "fax": "null",
            "email": "naresh.babu+demo1@zylker.com",
            "status": "active"
          },
          {
            "zip": "null",
            "country": "null",
            "website": "null",
            "role": "Standard",
            "city": "null",
            "timezone": "Asia\\/Calcutta",
            "profile": "testProfile",
            "mobile": "null",
            "language": "en\_US",
            "content": "Naresh Babu",
            "zuid": "61712147",
            "confirm": "true",
            "phone": "null",
            "street": "null",
            "id": "1475615000000185001",
            "state": "null",
            "fax": "null",
            "email": "naresh.babu+demo2@zylker.com",
            "status": "active"
          }
        \]
      }
    }

    Show More

-   patch ( request )

    Invoke HTTP patch

    Return Promise : Resolved with response of the initiated request

    name type description request Object Request Object request.params Object Request Params request.headers Object Request Headers request.body Object Request Body

    Example

    var data \= { name: "name", age: "23" }; var request \= { url: "https://www.example.com/patch", params: { scope: "apiscope", }, headers: { Authorization: "\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*", }, body: data } ZOHO.CRM.HTTP.patch(request).then(function(data){ console.log(data) })

    Output

    {
     "args": {},
     "data": "",
     "files": {},
     "form": {},
     "headers": {
       "Accept": "application/json",
       "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
       "Content-Length": "0"
     },
     "json": null,
     "url": "https://www.example.com/patch"
    }

    Show More

-   post ( request )

    Invoke HTTP post

    Return Promise : Resolved with response of the initiated request

    name type description request Object Request Object request.params Object Request Params request.headers Object Request Headers request.body Object Request Body

    Example

    var data \= '<Contacts><row no="1"><FL val="First Name">Amy</FL><FL val="Last Name">Dawson</FL><FL val="Email">testing@testing.com</FL><FL val="Title">Manager</FL><FL val="Phone">1234567890</FL><FL val="Mobile">292827622</FL><FL val="Account Name"> <!\[CDATA\["A & A"\]\]> </FL></row></Contacts>'; var request \= { url: "https://crm.zoho.com/crm/private/xml/CustomModule1/insertRecords", params: { scope: "crmapi", xmlData: data }, headers: { Authorization: "\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*", } } ZOHO.CRM.HTTP.post(request).then(function(data){ console.log(data) })

    Output

    <?xml version="1.0" encoding="UTF-8"?>
    <response uri="/crm/private/xml/Contacts/insertRecords">
     <result>
       <message>Record(s) added successfully</message>
       <recorddetail>
         <FL val="Id">457154000000952001</FL>
         <FL val="Created Time">2018-10-24 13:55:56</FL>
         <FL val="Modified Time">2018-10-24 13:55:56</FL>
         <FL val="Created By"><!\[CDATA\[NareshAutomation\]\]></FL>
         <FL val="Modified By"><!\[CDATA\[NareshAutomation\]\]></FL>
       </recorddetail>
     </result>
    </response>

    Show More

-   put ( request )

    Invoke HTTP put

    Return Promise : Resolved with response of the initiated request

    name type description request Object Request Object request.params Object Request Params request.headers Object Request Headers request.body Object Request Body

    Example

    var apidata \= \[{ "Last\_Name": "testupdate", id: "457154000000952001" }\]var request \= { url: "https://crm.zoho.com/crm/v2/Contacts", headers: { Authorization: "\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*", }, body: { data: apidata } } ZOHO.CRM.HTTP.put(request).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2018-10-24T14:08:57+05:30",
           "Modified\_By": {
             "name": "NareshAutomation",
             "id": "457154000000148011"
           },
           "Created\_Time": "2018-10-24T13:55:56+05:30",
           "id": "457154000000952001",
           "Created\_By": {
             "name": "NareshAutomation",
             "id": "457154000000148011"
           }
         },
         "message": "record updated",
         "status": "success"
       }
     \]
    }

    Show More
