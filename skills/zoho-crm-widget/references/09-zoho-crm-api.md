# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM API

-   addNotes ( config )

    Add Notes to a record

    Return Promise : Resolved with notes creation status

    name type description config Object Configuration Object. config.Entity String SysRefName of the module. config.RecordID Long RecordID to associate the notes. config.Title String Notes Title. config.Content String Notes Content.

    Example

    ZOHO.CRM.API.addNotes({ Entity: "Leads", RecordID: "1475615000000292033", Title: "Notes Title", Content: "TitleContent" }).then(function(data){ console.log(data); });

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2017-12-20T14:08:56+05:30",
           "Modified\_By": {
             "name": "NareshTesting",
             "id": "1000000031157"
           },
           "Created\_Time": "2017-12-20T14:08:56+05:30",
           "id": "1000000044101",
           "Created\_By": {
             "name": "NareshTesting",
             "id": "1000000031157"
           }
         },
         "message": "record added",
         "status": "success"
       }
     \]
    }

    Show More

-   approveRecord ( config )

    approve the record

    Return Promise : Resolved with the details of approval

    name type description config object configuration object config.Entity string SysRefName of module config.RecordID string id of the record. config.actionType string type of action Allowed values "approve" | "delegate" | "resubmit" | "reject" config.comments string comments (optional) config.user string only for delegate

    Example

    var config \= { Entity: "Leads", RecordID: "111155000000036014", actionType: "approve" } ZOHO.CRM.API.approveRecord(config).then(function(data){ console.log(data); });

    Output

    {
     "code": "SUCCESS",
     "details": {
       "id": "111155000000036014"
     },
     "message": "Record approved successfully",
     "status": "success"
    }

    Show More

-   attachFile ( config )

    To delink the relation between the records

    Return Promise : Resolved user Upload acknowledgement

    name type description config object Configuration Object config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes. config.File object File Object config.File.Name String File Name config.File.Content object File Content

    Example

    ZOHO.CRM.API.attachFile({ Entity: "Leads", RecordID: "1000000031092", File: { Name: "myFile.txt", Content: blob } }).then(function(data){ console.log(data); });

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2017-12-20T14:22:30+05:30",
           "Modified\_By": {
             "name": "NareshTesting",
             "id": "1000000031157"
           },
           "Created\_Time": "2017-12-20T14:22:30+05:30",
           "id": "1000000044106",
           "Created\_By": {
             "name": "NareshTesting",
             "id": "1000000031157"
           }
         },
         "message": "attachment uploaded successfully",
         "status": "success"
       }
     \]
    }

    Show More

-   coql ( queryObject )

    Get records from the module through COQL query API.

    Return Promise : Resolved with list of record(s) matching the query.

    name type description queryObject Object Config Json. queryObject.select\_query String Select query.

    Example

    var config \= { "select\_query": "select Last\_Name, First\_Name, Full\_Name from Contacts where Last\_Name = 'Boyle' and First\_Name is not null limit 2" } ZOHO.CRM.API.coql(config).then(function(data){ console.log(data); });

    Output

    {
        "data": \[
            {
                "First\_Name": null,
                "Last\_Name": null,
                "id": "111118000000047003"
            }
        \],
        "info": {
            "count": 1,
            "more\_records": false
        }
    }

    Show More

-   deleteRecord ( config )

    To delete a record from a module

    Return Promise : Resolved with Response to update record

    name type description config Object Configuration Object. config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes.

    Example

    ZOHO.CRM.API.deleteRecord({ Entity: "Leads", RecordID: "1000000049031" }).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "id": "3000000040015"
         },
         "message": "record deleted",
         "status": "success"
       }
     \]
    }

    Show More

-   delinkRelatedRecord ( config )

    To delink the relation between the records

    Return Promise : Resolved user matching userID

    name type description config object Configuration Object config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes. config.RelatedListName String SysRefName of the relatedList. config.RelatedRecordID String Related Record ID

    Example

    ZOHO.CRM.API.delinkRelatedRecord({ Entity: "Leads", RecordID: "1000000079113", RelatedList: "Campaigns", RelatedRecordID: "1000000080041" }).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "id": "3000000040055"
         },
         "message": "record deleted",
         "status": "success"
       }
     \]
    }

    Show More

-   getAllActions ( config )

    We can view all the available actions that can be performed on a particular record.

    Return Promise : Resolved List of actions be the specified module record.

    name type description config object Configuration Object config.Entity String SysRefname of module config.RecordID String id of the particular record.

    Example

    var config \= { Entity: "Leads", RecordID: "518440000000222778" } ZOHO.CRM.API.getAllActions(config).then(function(data){ console.log(data) })

    Output

    {
     "actions": \[
       {
         "http\_method": "GET",
         "name": "custom\_links",
         "href": "/v2/Leads/111155000000036014/actions/custom\_links"
       },
       {
         "http\_method": "POST",
         "name": "change\_owner",
         "href": "/v2/Leads/111155000000036014/actions/change\_owner"
       },
       {
         "http\_method": "POST",
         "name": "approvals",
         "href": "/v2/Leads/111155000000036014/actions/approvals",
         "params": \[
           {
             "name": "action",
             "type": "text",
             "value": \[
               "approve",
               "delegate",
               "reject",
               "resubmit"
             \]
           },
           {
             "name": "comments",
             "type": "text"
           }
         \]
       }
     \]
    }



    The above response is obtained if the record is waiting for the approval and if the caller has administrator access.
    If the record has no valid approval pending or the record id is invalid, the following is the response obtained.



    {
     "actions": \[
       {
         "http\_method": "GET",
         "name": "custom\_links",
         "href": "/v2/Leads/111155000000036014/actions/custom\_links"
       },
       {
         "http\_method": "POST",
         "name": "change\_owner",
         "href": "/v2/Leads/111155000000036014/actions/change\_owner"
       }
     \]
    }

    Show More

-   getAllProfiles ( )

    To get all the profiles in the app

    Return Promise : Resolved with all the profiles present in the app

    Example

    ZOHO.CRM.API.getAllProfiles().then(function(data){ console.log(data); });

    Output

    {
       "profiles": \[
        {
           "created\_time": null,
           "modified\_time": null,
           "name": "Administrator",
           "modified\_by": null,
          "description": "This profile will have all the permissions. Users with Administrator profile will be able to view and manage all the data within the organization \*. \*        account by default.",
           "id": "12000000029855",
           "category": false,
           "created\_by": null
         },
         {
           "created\_time": null,
           "modified\_time": null,
           "name": "Standard",
           "modified\_by": null,
           "description": "This profile will have all the permissions except administrative privileges.",
           "id": "12000000029858",
           "category": false,
           "created\_by": null
         },
         {
           "created\_time": "2018-02-05T14:20:38+05:30",
           "modified\_time": "2018-02-05T17:44:58+05:30",
           "name": "TestUser",
           "modified\_by": {
             "name": "Arun ",
             "id": "12000000032013"
           },
           "description": "TestUser API",
           "id": "12000000033045",
           "category": true,
           "created\_by": {
             "name": "Arun ",
             "id": "12000000032013"
           }
        }
       \]
     }

    Show More

-   getAllRecords ( config )

    get list of all records in a module

    Return Promise : Resolved with data of record matching with RecordID

    name type attributes description config Object Configuration Object. config.Entity String SysRefName of the module. config.sort\_order String <optional> To sort records. allowed values {asc|desc} config.converted String <optional> To get the list of converted records config.approved String <optional> To get the list of approved records config.page String <optional> To get the list of records from the respective pages config.per\_page String <optional> To get the list of records available per page

    Example

    ZOHO.CRM.API.getAllRecords({ Entity: "Leads", sort\_order: "asc", per\_page: 2, page: 1 }).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "Owner": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Company": "Testrec1",
         "Email": null,
         "Description": null,
         "$currency\_symbol": "$",
         "$photo\_id": null,
         "Website": null,
         "Twitter": null,
         "$upcoming\_activity": null,
         "Salutation": null,
         "Last\_Activity\_Time": "2017-12-16T09:54:37+05:30",
         "First\_Name": null,
         "Full\_Name": "Testrec1",
         "Lead\_Status": null,
         "Industry": null,
         "Modified\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Skype\_ID": null,
         "$converted": false,
         "$process\_flow": false,
         "Phone": null,
         "Street": null,
         "Zip\_Code": null,
         "id": "3000000032009",
         "Email\_Opt\_Out": false,
         "$approved": true,
         "Designation": null,
         "$approval": {
           "delegate": false,
           "approve": false,
           "reject": false
         },
         "Modified\_Time": "2017-12-16T09:54:37+05:30",
         "Created\_Time": "2017-12-16T09:54:37+05:30",
         "$converted\_detail": {},
         "$followed": false,
         "$editable": true,
         "City": null,
         "No\_of\_Employees": null,
         "Mobile": null,
         "Last\_Name": "Testrec1",
         "State": null,
         "$status": "cv\_1",
         "Lead\_Source": null,
         "Country": null,
         "Created\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Fax": null,
         "Annual\_Revenue": null,
         "Secondary\_Email": null
       },
       {
         "Owner": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Company": "Testrec2",
         "Email": null,
         "Description": null,
         "$currency\_symbol": "$",
         "$photo\_id": null,
         "Website": null,
         "Twitter": null,
         "$upcoming\_activity": null,
         "Salutation": null,
         "Last\_Activity\_Time": "2017-12-16T09:54:58+05:30",
         "First\_Name": null,
         "Full\_Name": "Testrec2",
         "Lead\_Status": null,
         "Industry": null,
         "Modified\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Skype\_ID": null,
         "$converted": false,
         "$process\_flow": false,
         "Phone": null,
         "Street": null,
         "Zip\_Code": null,
         "id": "3000000032091",
         "Email\_Opt\_Out": false,
         "$approved": true,
         "Designation": null,
         "$approval": {
           "delegate": false,
           "approve": false,
           "reject": false
         },
         "Modified\_Time": "2017-12-16T09:54:58+05:30",
         "Created\_Time": "2017-12-16T09:54:58+05:30",
         "$converted\_detail": {},
         "$followed": false,
         "$editable": true,
         "City": null,
         "No\_of\_Employees": null,
         "Mobile": null,
         "Last\_Name": "Testrec2",
         "State": null,
         "$status": "c\_1",
         "Lead\_Source": null,
         "Country": null,
         "Created\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Fax": null,
         "Annual\_Revenue": null,
         "Secondary\_Email": null
       }
     \],
     "info": {
       "per\_page": 2,
       "count": 2,
       "page": 1,
       "more\_records": true
     }
    }

    Show More

-   getAllUsers ( config )

    To retrieve list of users in ZohoCRM

    Return Promise : Resolved List of users matching specified Type

    name type attributes description config object Configuration Object config.Type String Allowed values "AllUsers | ActiveUsers | DeactiveUsers | ConfirmedUsers | NotConfirmedUsers | DeletedUsers | ActiveConfirmedUsers | AdminUsers | ActiveConfirmedAdmins" config.page number <optional> To get the list of users from the respective pages config.per\_page number <optional> To get the list of users available per page

    Example

    ZOHO.CRM.API.getAllUsers({ Type: "AllUsers" }).then(function(data){ console.log(data) })

    Output

    {
     "users": \[
       {
         "confirm": true,
         "full\_name": "NareshTesting ",
         "role": {
           "name": "CEO",
           "id": "3000000029719"
         },
         "territories": \[\],
         "profile": {
           "name": "Administrator",
           "id": "3000000029725"
         },
         "last\_name": null,
         "alias": null,
         "id": "3000000031045",
         "first\_name": "NareshTesting",
         "email": "naresh.babu+dev2@zylker.com",
         "zuid": "5073288",
         "status": "active"
       }
     \],
     "info": {
       "per\_page": 200,
       "count": 1,
       "page": 1,
       "more\_records": false
     }
    }

    Show More

-   getApprovalById ( config )

    To get details of the particular approval.

    Return Promise : Resolved details of the approval.

    name type description config object configuration object config.id string id of the approval

    Example

    var config \= { id: "518440000000222786" } ZOHO.CRM.API.getApprovalById(config).then(function(d){ console.log(d); })

    Output

    {
     "data": \[
       {
         "owner": {
           "phone": null,
           "name": "milestone2 ",
           "mobile": null,
           "id": "111155000000032023",
           "history": \[\],
           "email": "uk@zylker.com"
         },
         "initiated\_time": "2018-07-16T10:16:54+05:30",
         "criteria": \[
           {
             "api\_name": "Annual\_Revenue",
             "field\_label": "Annual Revenue",
             "value": "$1.00"
           }
         \],
         "module": "Leads",
         "rule": {
           "name": "Name",
           "id": "111155000000036006"
         },
         "id": "518440000000222786",
         "type": "approval",
         "entity": {
           "name": "uk",
           "id": "111155000000036014"
         },
         "default\_layout": true,
         "waiting\_for": {
           "name": "uk ",
           "id": "111155000000035012"
         }
       }
     \],
     "info": {
       "per\_page": 200,
       "count": 1,
       "page": 1,
       "more\_records": false
     }
    }

    Show More

-   getApprovalRecords ( config )

    This method is called by the one who has to approve.If it is called by others, they will get 204 response.

    **"others\_awaiting"** gives the list of all approvals pending regardless of who has to approve it. Usually, Super Admin and administrator will be able to use this API whereas standard user will still get a 204 empty response.


    Return Promise : Resolved List of records for waiting the approval.

    name type description config object configuration object config.type string Allowed values "awaiting | others\_awaiting"

    Example 1

    ZOHO.CRM.API.getApprovalRecords().then(function(data){ console.log(data) })It returns the pending approval records of the current user

    Output

    {
     "data": \[
       {
         "owner": {
           "phone": null,
           "name": "milestone2 ",
           "mobile": null,
           "id": "111155000000032023",
           "email": "uk@zylker.com"
         },
         "initiated\_time": "2018-07-16T10:16:54+05:30",
         "module": "Leads",
         "rule": {
           "name": "Name",
           "id": "111155000000036006"
         },
         "id": "111155000000036021",
         "type": "approval",
         "entity": {
           "name": "uk",
           "id": "111155000000036014"
         },
         "default\_layout": true,
         "waiting\_for": {
           "name": "uk ",
           "id": "111155000000035012"
         }
       }
     \],
     "info": {
       "per\_page": 200,
       "count": 1,
       "page": 1,
       "more\_records": false
     }
    }

    Show More

    Example 2

    var config \= { type: "others\_awaiting" } ZOHO.CRM.API.getApprovalRecords(config).then(function(data){ console.log(data) })It returns the pending approval records which should be approve by other user.

-   getApprovalsHistory ( )

    View the history of records put up for approval

    Return Promise : Resolved List of records for waiting the approval.

    Example

    ZOHO.CRM.API.getApprovalsHistory().then(function(data){ console.log(data); });

    Output

    {
     "data": \[
       {
         "audit\_time": "2018-07-16T15:46:54+05:30",
         "done\_by": {
           "name": "milestone2 ",
           "id": "111155000000032023"
         },
         "module": "Leads",
         "record": {
           "name": "uk",
           "id": "111155000000036014"
         },
         "related\_module": null,
         "action": "Submitted",
         "rule": "111155000000036006",
         "account": null,
         "related\_name": "milestone2 ",
         "territory": null
       }
     \],
     "info": {
       "per\_page": 200,
       "count": 1,
       "page": 1,
       "more\_records": false
     }
    }

    Show More

-   getBluePrint ( config )

    Get blueprint details

    Return Promise : Resolved with data of record matching with RecordID

    name type description config object configuration object config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes.

    Example

    var config \= { "Entity": "Leads", "RecordID": "111126000000036019" } ZOHO.CRM.API.getBluePrint(config).then(function(data){ console.log(data) })

    Output

    {
     "blueprint": {
       "process\_info": {
         "field\_id": "111126000000000885",
         "is\_continuous": false,
         "api\_name": "Lead\_Status",
         "continuous": false,
         "field\_label": "Lead Status",
         "name": "Lprint",
         "column\_name": "STATUS",
         "field\_value": "Pre Qualified",
         "id": "111126000000035049",
         "field\_name": "Lead Status"
       },
       "transitions": \[
         {
           "next\_transitions": \[
             {
               "name": "lost lead",
               "id": "111126000000035025"
             }
           \],
           "data": {},
           "next\_field\_value": "Not Qualified",
           "name": "not qualify",
           "criteria\_matched": true,
           "id": "111126000000035019",
           "fields": \[\],
           "criteria\_message": null,
           "percent\_partial\_save": 0
         },
         {
           "next\_transitions": \[\],
           "data": {},
           "next\_field\_value": "Contacted",
           "name": "contact",
           "criteria\_matched": true,
           "id": "111126000000035007",
           "fields": \[\],
           "criteria\_message": null,
           "percent\_partial\_save": 0
         }
       \]
     }
    }

    Show More

-   getFile ( )

    get file from file id

    Return Promise : Resolved with data of file binary string

    Example

    var config \= { id: "b12bb1b005f171ac797b3773040438ba7da026eb056f272271d511e95581689b" } ZOHO.CRM.API.getFile(config);

-   getOrgVariable ( )

    get plugins configuration data

    Return Promise : Resolved with Plugin Configuration

    Example 1

    ZOHO.CRM.API.getOrgVariable("variableNamespace").then(function(data){ console.log(data); });

    Output

    {
     "Success": {
      "Content": "12345"
     }
    }

    Show More

    Example 2

    var data \= { apiKeys: \["key1", "key2", "ke3"\] }; ZOHO.CRM.API.getOrgVariable(data).then(function(data){ console.log(data); }); { "Success": { "content": { "apikey": { "value": "BNMMNBVHJ" }, "authtoken": { "value": "IUYTRERTYUI" }, "apiscret": { "value": "848ksmduo389jd" } } } }

-   getProfile ( config )

    To get a particular profile's details with ProfileID as input

    Return Promise : Resolved with the details of the profile for the given ProfileID

    name type description config Object Configuration Object. config.ID String ProfileID

    Example

    ZOHO.CRM.API.getProfile({ ID: "12000000029858" }).then(function(data){ console.log(data); });

    Output

    {
        "profiles": \[{
            "created\_time": null,
            "modified\_time": null,
            "permissions\_details": \[{
                    "display\_label": "Email Integration ( POP3 / IMAP )",
                    "module": null,
                    "name": "Crm\_Implied\_Zoho\_Mail\_Integ",
                    "id": "12000000030788",
                    "enabled": true
                },
                {
                    "display\_label": "BCC Dropbox",
                    "module": null,
                    "name": "Crm\_Implied\_BCC\_Dropbox",
                    "id": "12000000030752",
                    "enabled": true
                },
                {
                    "display\_label": "Show Chat Bar",
                    "module": null,
                    "name": "Crm\_Implied\_Chat\_Bar",
                    "id": "12000000030806",
                    "enabled": true
                },
                {
                    "display\_label": null,
                    "module": null,
                    "name": "Crm\_Implied\_Social\_Integration",
                    "id": "12000000030734",
                    "enabled": false
                }
            \],
            "name": "Standard",
            "modified\_by": null,
            "description": "This profile will have all the permissions except administrative privileges.",
            "id": "12000000029858",
            "category": false,
            "created\_by": null,
            "sections": \[{
                "name": "template",
                "categories": \[{
                        "display\_label": "Email & Chat Settings",
                        "permissions\_details": \[
                            "12000000030788",
                            "12000000030752",
                            "12000000030806"
                        \],
                        "name": "email\_chat"
                    },
                    {
                        "display\_label": "Manage Templates",
                        "permissions\_details": \[
                            "12000000029984",
                            "12000000029987",
                            "12000000030698"
                        \],
                        "name": "template"
                    }
                \]
            }\]
        }\]
    }

    Show More

-   getRecord ( config )

    get all Details of a record

    Return Promise : Resolved with data of record matching with RecordID

    name type attributes default description config Object Configuration Object. config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes. config.approved String <optional> true To get approved record

    Example

    ZOHO.CRM.API.getRecord({ Entity: "Leads", approved: "both", RecordID: "1000000030132" }).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "Owner": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Company": "ZohoCorp",
         "Email": null,
         "Description": null,
         "$currency\_symbol": "$",
         "$photo\_id": null,
         "Website": null,
         "Twitter": null,
         "$upcoming\_activity": null,
         "Salutation": null,
         "Last\_Activity\_Time": "2017-12-22T03:27:23+05:30",
         "First\_Name": null,
         "Full\_Name": "Naresh",
         "Lead\_Status": null,
         "Industry": null,
         "Modified\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Skype\_ID": null,
         "$converted": false,
         "$process\_flow": false,
         "Phone": null,
         "Street": null,
         "Zip\_Code": null,
         "id": "3000000040016",
         "Email\_Opt\_Out": false,
         "$approved": true,
         "Designation": null,
         "$approval": {
           "delegate": false,
           "approve": false,
           "reject": false
         },
         "Modified\_Time": "2017-12-22T03:27:23+05:30",
         "Created\_Time": "2017-12-22T03:27:23+05:30",
         "$converted\_detail": {},
         "$followed": false,
         "$editable": true,
         "City": null,
         "No\_of\_Employees": 0,
         "Mobile": null,
         "Last\_Name": "Naresh",
         "State": null,
         "$status": "cv\_1",
         "Lead\_Source": null,
         "Country": null,
         "Created\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Fax": null,
         "Annual\_Revenue": 0,
         "Secondary\_Email": null
       }
     \]
    }

    Show More

-   getRelatedRecords ( config )

    To retrive related list records

    Return Promise : Resolved user matching userID

    name type attributes description config object Configuration Object config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes. config.RelatedListName String SysRefName of the relatedList. config.page Number <optional> To get the list of related records from the respective page. config.per\_page Number <optional> To get the list of related records available per page.

    Example

    ZOHO.CRM.API.getRelatedRecords({ Entity: "Leads", RecordID: "1000000030132", RelatedList: "Notes", page: 1, per\_page: 200 }).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "Owner": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Modified\_Time": "2017-12-22T03:58:20+05:30",
         "$attachments": null,
         "Created\_Time": "2017-12-22T03:58:20+05:30",
         "Parent\_Id": {
           "name": "Peterson",
           "id": "3000000040011"
         },
         "$editable": true,
         "$se\_module": "Leads",
         "Modified\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "$size": null,
         "$voice\_note": false,
         "$status": null,
         "id": "3000000040059",
         "Created\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Note\_Title": null,
         "Note\_Content": "Notes2"
       },
       {
         "Owner": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Modified\_Time": "2017-12-22T03:58:16+05:30",
         "$attachments": null,
         "Created\_Time": "2017-12-22T03:58:16+05:30",
         "Parent\_Id": {
           "name": "Peterson",
           "id": "3000000040011"
         },
         "$editable": true,
         "$se\_module": "Leads",
         "Modified\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "$size": null,
         "$voice\_note": false,
         "$status": null,
         "id": "3000000040055",
         "Created\_By": {
           "name": "NareshTesting ",
           "id": "3000000031045"
         },
         "Note\_Title": null,
         "Note\_Content": "Notes1"
       }
     \],
     "info": {
       "per\_page": 200,
       "count": 2,
       "page": 1,
       "more\_records": false
     }
    }

    Show More

-   getUser ( config )

    To retrieve list of users in ZohoCRM

    Return Promise : Resolved user matching userID

    name type description config object Configuration Object config.ID String UserID

    Example

    ZOHO.CRM.API.getUser({ ID: "3000000029719" }).then(function(data){ console.log(data) })

    Output

    {
     "users": \[
       {
         "country": null,
         "role": {
           "name": "CEO",
           "id": "3000000029719"
         },
         "customize\_info": {
           "notes\_desc": null,
           "show\_right\_panel": null,
           "bc\_view": null,
           "show\_home": false,
           "show\_detail\_view": true,
           "unpin\_recent\_item": null
         },
         "city": null,
         "signature": null,
         "name\_format": "Salutation,First Name,Last Name",
         "language": "en\_US",
         "locale": "en\_US",
         "personal\_account": true,
         "ntc\_notification\_type": \[
           3000000020985,
           3000000020988,
           3000000020991,
           3000000020994,
           3000000020997,
           3000000021012,
           3000000021003,
           3000000021006,
           3000000021009,
           3000000021078,
           3000000021072,
           3000000021075,
           3000000021069,
           3000000021081,
           3000000021084,
           3000000021087
         \],
         "default\_tab\_group": "0",
         "street": null,
         "alias": null,
         "theme": {
           "normal\_tab": {
             "font\_color": "#FFFFFF",
             "background": "#222222"
           },
           "selected\_tab": {
             "font\_color": "#FFFFFF",
             "background": "#222222"
           },
           "new\_background": null,
           "background": "#F3F0EB",
           "screen": "fixed",
           "type": "default"
         },
         "id": "3000000031045",
         "state": null,
         "country\_locale": "en\_US",
         "fax": null,
         "first\_name": "NareshTesting",
         "email": "naresh.babu+dev2@zylker.com",
         "telephony\_enabled": false,
         "imap\_status": false,
         "zip": null,
         "decimal\_separator": "en\_US",
         "website": null,
         "time\_format": "hh:mm a",
         "profile": {
           "name": "Administrator",
           "id": "3000000029725"
         },
         "mobile": null,
         "last\_name": null,
         "time\_zone": "Asia/Kolkata",
         "zuid": "5073288",
         "confirm": true,
         "rtl\_enabled": false,
         "full\_name": "NareshTesting ",
         "ezuid": "6ca2127e9d60c217",
         "territories": \[\],
         "phone": null,
         "dob": null,
         "date\_format": "MM/dd/yyyy",
         "ntc\_enabled": true,
         "status": "active"
       }
     \]
    }

    Show More

-   insertRecord ( config )

    Insert record to a modue

    Return Promise : Resolved with response data

    name type description config Object Configuration Object. config.Entity String SysRefName of the module. config.Trigger list The trigger input can be "workflow", "approval" or "blueprint". If the trigger is not mentioned, the workflows, approvals and blueprints related to the API will get executed. Enter the trigger value as \[\] to not execute the workflows config.APIData Object RecordID to associate the notes.

    Example 1

    var recordData \= { "Company": "Zylker", "Last\_Name": "Peterson" } ZOHO.CRM.API.insertRecord({ Entity: "Leads", APIData: recordData, Trigger: \["workflow"\] }).then(function(data){ console.log(data); });

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2017-12-22T03:24:39+05:30",
           "Modified\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           },
           "Created\_Time": "2017-12-22T03:24:39+05:30",
           "id": "3000000040011",
           "Created\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           }
         },
         "message": "record added",
         "status": "success"
       }
     \]
    }

    Show More

    Example 2

    var data \= \[{ "Company": "ZohoCorp", "Last\_Name": "Babu" }, { "Company": "ZohoCorp", "Last\_Name": "Naresh" }\]; ZOHO.CRM.API.insertRecord({ Entity: "Leads", APIData: data, Trigger: \["workflow"\] }).then(function(data){ console.log(data); });

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2017-12-22T03:27:23+05:30",
           "Modified\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           },
           "Created\_Time": "2017-12-22T03:27:23+05:30",
           "id": "3000000040015",
           "Created\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           }
         },
         "message": "record added",
         "status": "success"
       },
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2017-12-22T03:27:23+05:30",
           "Modified\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           },
           "Created\_Time": "2017-12-22T03:27:23+05:30",
           "id": "3000000040016",
           "Created\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           }
         },
         "message": "record added",
         "status": "success"
       }
     \]
    }

    Show More

-   searchRecord ( config , page , per\_page )

    To retrieve the records that matches your search criteria

    Return Promise : Resolved with search result

    name type description config object Configuration Object config.Entity String SysRefName of module config.Type String Allowed values "email|phone|word|criteria" config.Query String query String config.delay boolean query String page String Pagination - Page number per\_page String Pagination - per page limit

    Example 1

    ZOHO.CRM.API.searchRecord({ Entity: "Leads", Type: "phone", Query: "123456789", delay: false }).then(function(data){ console.log(data) })

    Example 2

    ZOHO.CRM.API.searchRecord({ Entity: "Leads", Type: "email", Query: "test@zoho.com" }).then(function(data){ console.log(data) })

    Example 3

    ZOHO.CRM.API.searchRecord({ Entity: "Leads", Type: "word", Query: "ZohoCrop" }).then(function(data){ console.log(data) })

    Example 4

    ZOHO.CRM.API.searchRecord({ Entity: "Leads", Type: "criteria", Query: "(Company:equals:Zoho)" }).then(function(data){ console.log(data) })

    Example 5

    ZOHO.CRM.API.searchRecord({ Entity: "Leads", Type: "criteria", Query: "((Company:equals:Zoho)or(Company:equals:zylker))" }).then(function(data){ console.log(data) })

-   updateBluePrint ( config )

    update blueprint details for particular record.

    Return Promise : Resolved with data of record matching with RecordID

    name type description config Object Configuration Object. config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes. config.BlueprintData object blueprint data to update

    Example

    var BlueprintData \= { "blueprint": \[{ "transition\_id": "111126000000035019", "data": { "Phone": "8940372937", "Notes": "Updated via blueprint" } }\] } update attachment with blueprint var BlueprintData \= { "blueprint": \[{ "transition\_id": "1000000031897", "data": { "Attachments": { "$file\_id": \["59cf260313b6907ffc56957f4241bd94ba3e0b6aad53b50f8b38583a859d623a", "59cf260313b6907ffc56957f4241bd94ba3e0b6aad53b50f8b38583a859d624d"\] } } }\] } update link with blueprint{ "blueprint": \[{ "transition\_id": "2000000031536", "data": { "Attachments": { "$link\_url": "facebook.com" }, "Notes": "Dileep checking Notes outside" } }\] } var config \= { Entity: "Leads", RecordID: "111126000000036019", BlueprintData: BlueprintData } ZOHO.CRM.API.updateBluePrint(config).then(function(data){ console.log(data); });

    Output

    {
       "code": "SUCCESS",
       "details": {},
       "message": "transition updated successfully",
       "status": "success"
    }

    Show More

-   updateProfile ( config )

    To update permissions for the given ProfileID

    Return Promise : Resolved with a response message (Success or failure ) after updating the permissions

    name type description config Object Configuration Object. config.ID String ProfileID config.APIData Object Permission Data (PermissionID : true | false)

    Example

    var permissionData \= { "profiles": \[{ "permissions\_details": \[{ "id": "12000000030827", "enabled": false }, { "id": "12000000029879", "enabled": true }\] }\] } ZOHO.CRM.API.updateProfile({ ID: "12000000033045", APIData: permissionData }).then(function(data){ console.log(data); });

    Output

    {
     "profiles": \[
       {
         "code": "SUCCESS",
         "details": {},
         "message": "profile updated successfully",
         "status": "success"
       }
     \]
    }

    Show More

-   updateRecord ( config )

    To update a record in a module

    Return Promise : Resolved with data of update Record Response

    name type description config Object Configuration Object. config.Entity String SysRefName of the module. config.Trigger list The trigger input can be "workflow", "approval" or "blueprint". If the trigger is not mentioned, the workflows, approvals and blueprints related to the API will get executed. Enter the trigger value as \[\] to not execute the workflows config.APIData String Update Record Data.

    Example

    var config \= { Entity: "Leads", APIData: { "id": "1000000049031", "Company": "Zylker", "Last\_Name": "Peterson" }, Trigger: \["workflow"\] } ZOHO.CRM.API.updateRecord(config).then(function(data){ console.log(data) })

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "Modified\_Time": "2017-12-22T03:29:57+05:30",
           "Modified\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           },
           "Created\_Time": "2017-12-22T03:27:23+05:30",
           "id": "3000000040016",
           "Created\_By": {
             "name": "NareshTesting ",
             "id": "3000000031045"
           }
         },
         "message": "record updated",
         "status": "success"
       }
     \]
    }

    Show More

-   updateRelatedRecords ( config )

    To update the relation between the records

    Return Promise : Resolved user matching userID

    name type description config object Configuration Object config.Entity String SysRefName of the module. config.RecordID String RecordID to associate the notes. config.RelatedListName String SysRefName of the relatedList. config.RelatedRecordID String Related Record ID config.APIData String Data to be updated in the related record

    Example

    var APIData \= { Description: "Test description" } ZOHO.CRM.API.updateRelatedRecords({ Entity: "Leads", RecordID: "1000000079113", RelatedList: "Campaigns", RelatedRecordID: "1000000080041", APIData: APIData }).then(function(data){ console.log(data) })

    Output

    {
     "data":\[
      {
        "code": "SUCCESS",
        "details": {
          "id": 1000000080041
        },
        "message": "relation updated",
        "status": "success"
      }
        \]
    }

    Show More

-   uploadFile ( )

    upload the files in to zoho server and return appname and id

    Return Promise : Resolved with data of file

    Example

    var file \= $( "#attachmentinput")var file \= document.getElementById("attachmentinput").files\[0\]; var fileType \= file.type; var config \= { "CONTENT\_TYPE": "multipart", "PARTS": \[{ "headers": { "Content-Disposition": "file;" }, "content": "\_\_FILE\_\_" }\], "FILE": { "fileParam": "content", "file": file } } ZOHO.CRM.API.uploadFile(config).then(function(data){ console.log(data); })

    Output

    {
     "data": \[
       {
         "code": "SUCCESS",
         "details": {
           "name": "desk.png",
           "id": "b12bb1b005f171ac797b3773040438ba7da026eb056f272271d511e95581689b"
         },
         "message": "desk.png uploaded Succeessfully",
         "status": "success"
       }
     \]
    }

    Show More

-   upsertRecord ( config )

    Insert record or update matching existing record

    Return Promise : Resolved with response data

    name type description config Object Configuration Object. config.Entity String SysRefName of the module. config.Trigger list The trigger input can be "workflow", "approval" or "blueprint". If the trigger is not mentioned, the workflows, approvals and blueprints related to the API will get executed. Enter the trigger value as \[\] to not execute the workflows config.APIData Object insert json details config.duplicate\_check\_fields Object this param will update existing record,add multiple fields with comma separated

    Example

    var data \= \[{ "Company": "zoho", "Last\_Name": "zylker", "Email": "zylker@gmail.com", "Mobile": "1234567890", "Website": "https://www.zoho.com" }, { "Company": "zoho", "Last\_Name": "zylker", "Email": "zylkder@gmail.com", "Website": "http://www.google.com", "Mobile": "8393749473934739" }, \]; ZOHO.CRM.API.upsertRecord({ Entity: "Leads", APIData: data, duplicate\_check\_fields: \["Website", "Mobile"\], Trigger: \["workflow"\] }).then(function(data){ console.log(data); });

    Output

    \[
     {
       "code": "SUCCESS",
       "duplicate\_field": "Mobile",
       "action": "update",
       "details": {
         "Modified\_Time": "2018-10-11T12:06:47+05:30",
         "Modified\_By": {
           "name": "test ",
           "id": "111134000000033383"
         },
         "Created\_Time": "2018-10-11T11:55:10+05:30",
         "id": "111134000000036225",
         "Created\_By": {
           "name": "test ",
           "id": "111134000000033383"
         }
       },
       "message": "record updated",
       "status": "success"
     },
     {
       "code": "SUCCESS",
       "duplicate\_field": "Website",
       "action": "update",
       "details": {
         "Modified\_Time": "2018-10-11T12:06:47+05:30",
         "Modified\_By": {
           "name": "test ",
           "id": "111134000000033383"
         },
         "Created\_Time": "2018-10-11T11:55:10+05:30",
         "id": "111134000000036226",
         "Created\_By": {
           "name": "test ",
           "id": "111134000000033383"
         }
       },
       "message": "record updated",
       "status": "success"
     }
    \]

    Show More
