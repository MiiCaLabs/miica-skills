# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM FUNCTIONS

-   execute ( func\_name , req\_data )

    Invoke a Function

    Return Promise : Resolved with response of the function executed

    name type description func\_name String Function Name req\_data Object Request Data

    Example

    var func\_name \= "custom\_function4"; var req\_data \= { "arguments": JSON.stringify({ "mailid": "siprxx.xxx@xxxx.com" }) }; ZOHO.CRM.FUNCTIONS.execute(func\_name, req\_data).then(function(data){ console.log(data) })

    Output

    {
      "code": "success",
      "details": {
        "type":"VOID",
          "output": null,
          "id": "944000000003001"
      },
      "message": "function executed successfully"
    }
