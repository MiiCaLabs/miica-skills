# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM CONNECTOR

-   authorize ( nameSpace )

    Prompts the Connector Authorize window

    Return Promise : Resolved with true on successful Authorization

    name type description nameSpace String NameSpace of Connector to authorize

    Example

    var connectorName \= "zoho.authorize"; ZOHO.CRM.CONNECTOR.authorize(connectorName);

-   invokeAPI ( nameSpace , data )

    Invokes Connector API

    Return Promise : Resolved with response of the Connector API

    name type description nameSpace String NameSpace of Connector API to invoke data Object Connector API Data data.VARIABLES Object Dynamic Data represented by placeholders in connectorAPI data.CONTENT\_TYPE Object ContentType - multipart for multipart request data.PARTS Array For multipart request provide parts config here data.FILE Object To include a file in your multipart request

    Example 1

    var data \= { "apikey": "\*\*\*\*\*\*\*\*\*", "First\_Name": "Naresh", "Last\_Name": "Babu", "email": "naresh.babu@zylker.com" } ZOHO.CRM.CONNECTOR.invokeAPI("MailChimp.sendSubscription", data).then(function(data){ console.log(data) })

    Example 2

    var data \= { "CONTENT\_TYPE": "multipart", "PARTS": \[{ "headers": { "Content-Type": "application/json" }, "content": { "mimeType": "application/vnd.google-apps.folder", "title": "NareshFolder" } }\] } ZOHO.CRM.CONNECTOR.invokeAPI("ex10.testconnector.uplaodfile", data).then(function(data){ console.log(data) })

    Example 3

    var file \= document.getElementById("File").files\[0\]; var fileType; if(file.type \=== "application/pdf") { fileType \= file.type; } else if (file.type \=== "image/jpeg") { fileType \= file.type; } else if (file.type \=== "text/plain") { fileType \= "application/msword"; } else if (file.type \=== "") { fileType \= "application/msword"; } console.log(file); var data \= { "VARIABLES": { "pathFileName": "/Zoho CRM/myFile/" + file.name }, "CONTENT\_TYPE": "multipart", "PARTS": \[{ "headers": { "Content-Type": "application/json" }, "content": { "mimeType": fileType, "description": "TestFile to upload", "title": file.name } }, { "headers": { "Content-Disposition": "file;" }, "content": "\_\_FILE\_\_" }\], "FILE": { "fileParam": "content", "file": file }, } console.log(data); ZOHO.CRM.CONNECTOR.invokeAPI("ex10.testconnector.uplaodfile", data).then(function(data){ console.log(data) })
