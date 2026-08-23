# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM META

-   getAssignmentRules ( config )

    get Assignment rules details

    Return Promise : Resolved with data of Assignment rules matching with Entity

    name type description config Object Configuration Object. config.Entity String SysRefName of the module.

    Example

    ZOHO.CRM.META.getAssignmentRules({ "Entity": "Contacts" }).then(function(data){ console.log(data); });

    Output

    {
     "assignment\_rules": \[
       {
         "module": {
           "api\_name": "Leads",
           "id": "13000000000039"
         },
         "name": "Lead rule",
         "id": "13000000036019",
         "created\_date": "2017-05-12",
         "created\_by": {
           "name": " uk",
           "id": "13000000030480"
         }
       },
       {
         "module": {
          "api\_name": "Leads",
           "id": "13000000000039"
        },
         "name": "Lead second entry",
        "id": "13000000036045",
         "created\_date": "2017-05-12",
         "created\_by": {
           "name": " uk",
           "id": "13000000030480"
         }
       }
     \]
    }

    Show More

-   getCustomViews ( config )

    get Custom Views of a module

    Return Promise : Resolved with data of Assignment rules matching with Entity

    name type attributes description config Object Configuration Object. config.Entity String SysRefName of the module. config.Id String <optional> layout ID.

    Example 1

    ZOHO.CRM.META.getCustomViews({ "Entity": "Contacts" }).then(function(data){ console.log(data); });

    Output

    {
    "categories": \[
      {
        "display\_value": "Created By Me",
        "actual\_value": "created\_by\_me"
      },
      {
        "display\_value": "Shared With Me",
        "actual\_value": "shared\_with\_me"
      }
    \],
    "custom\_views": \[
      {
        "display\_value": "All Contacts",
        "offline": true,
        "default": true,
        "system\_name": "ALLVIEWS",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "All Contacts",
        "id": "3000000028135",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "Mailing Labels",
        "offline": true,
        "default": false,
        "system\_name": "ALLVIEWS",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "Mailing Labels",
        "id": "3000000028144",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "My Contacts",
        "offline": true,
        "default": false,
        "system\_name": "MYVIEWS",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "My Contacts",
        "id": "3000000028333",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "New Last Week",
        "offline": true,
        "default": false,
        "system\_name": "lastweek",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "New Last Week",
        "id": "3000000028183",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "New This Week",
        "offline": true,
        "default": false,
        "system\_name": "thisweek",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "New This Week",
        "id": "3000000028171",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "Recently Created Contacts",
        "offline": true,
        "default": false,
        "system\_name": "RECENTLYCREATED",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "Recently Created Contacts",
        "id": "3000000028195",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "Recently Modified Contacts",
        "offline": true,
        "default": false,
        "system\_name": "RECENTLYMODIFIED",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "Recently Modified Contacts",
        "id": "3000000028207",
        "category": "shared\_with\_me",
        "favorite": null
      },
      {
        "display\_value": "Unread Contacts",
        "offline": true,
        "default": false,
        "system\_name": "UNREADVIEWS",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "name": "Unread Contacts",
        "id": "3000000028156",
        "category": "shared\_with\_me",
        "favorite": null
      }
    \],
    "info": {
      "per\_page": 8,
      "default": "3000000028135",
      "count": 8,
      "page": 1,
      "more\_records": false
    }
    }

    Show More

    Example 2

    ZOHO.CRM.META.getCustomViews({ "Entity": "Contacts", "Id": "3000000028135" }).then(function(data){ console.log(data); });

    Output

    {
    "categories": \[
      {
        "display\_value": "Created By Me",
        "actual\_value": "created\_by\_me"
      },
      {
        "display\_value": "Shared With Me",
        "actual\_value": "shared\_with\_me"
      }
    \],
    "custom\_views": \[
      {
        "display\_value": "All Contacts",
        "criteria": null,
        "system\_name": "ALLVIEWS",
        "module": {
          "api\_name": "Contacts",
          "id": "3000000000045"
        },
        "sort\_by": null,
        "offline": true,
        "default": true,
        "name": "All Contacts",
        "id": "3000000028135",
        "category": "shared\_with\_me",
        "fields": \[
          {
            "api\_name": "Full\_Name",
            "id": "3000000000681"
          },
          {
            "api\_name": "Account\_Name",
            "id": "3000000000683"
          },
          {
            "api\_name": "Email",
            "id": "3000000000687"
          },
          {
            "api\_name": "Phone",
            "id": "3000000000695"
          },
          {
            "api\_name": "Owner",
            "id": "3000000000673"
          }
        \],
        "favorite": null,
        "sort\_order": null
      }
    \]
    }

    Show More

-   getFields ( config )

    get field lables and api names

    Return Promise : Resolved with data of record matching with Entity and type

    name type description config Object Configuration Object. config.Entity String SysRefName of the module.

    Example

    ZOHO.CRM.META.getFields({ "Entity": "Contacts" }).then(function(data){ console.log(data); });

    Output

    {
    fields:\[
     {
       "custom\_field": false,
       "lookup": {

       },
       "visible": true,
       "json\_type": "jsonobject",
       "field\_label": "Contact Owner",
       "length": 120,
       "column\_name": "SMOWNERID",
       "view\_type": {
         "view": true,
         "edit": true,
         "quick\_create": false,
         "create": true
       },
       "created\_source": "default",
       "show\_type": 7,
       "ui\_type": 8,
       "read\_only": false,
       "api\_name": "Owner",
       "unique": {

       },
       "businesscard\_supported": true,
       "data\_type": "ownerlookup",
       "formula": {

       },
       "currency": {

       },
       "id": "14000000000649",
       "decimal\_place": null,
       "pick\_list\_values": \[

       \],
       "auto\_number": {

       }
     },
     {
       "custom\_field": false,
       "lookup": {

       },
       "visible": true,
       "json\_type": "string",
       "field\_label": "Lead Source",
       "length": 120,
       "column\_name": "LEADSOURCE",
       "view\_type": {
         "view": true,
         "edit": true,
         "quick\_create": false,
         "create": true
       },
       "created\_source": "default",
       "show\_type": 7,
       "ui\_type": 2,
       "read\_only": false,
       "api\_name": "Lead\_Source",
       "unique": {

       },
       "businesscard\_supported": true,
       "data\_type": "picklist",
       "formula": {

       },
       "currency": {

       },
       "id": "14000000000651",
       "decimal\_place": null,
       "pick\_list\_values": \[
         {
           "display\_value": "None",
           "actual\_value": "-None-"
         },
         {
           "display\_value": "Advertisement",
           "actual\_value": "Advertisement"
         },
         {
           "display\_value": "Cold Call",
           "actual\_value": "Cold Call"
         },
         {
           "display\_value": "Employee Referral",
           "actual\_value": "Employee Referral"
         },
         {
           "display\_value": "External Referral",
           "actual\_value": "External Referral"
         },
         {
           "display\_value": "Partner",
           "actual\_value": "Partner"
         },
         {
           "display\_value": "Public Relations",
           "actual\_value": "Public Relations"
         },
         {
           "display\_value": "Trade Show",
           "actual\_value": "Trade Show"
         },
         {
           "display\_value": "Web Form",
           "actual\_value": "Web Form"
         },
         {
           "display\_value": "Search Engine",
           "actual\_value": "Search Engine"
         },
         {
           "display\_value": "Facebook",
           "actual\_value": "Facebook"
         },
         {
           "display\_value": "Twitter",
           "actual\_value": "Twitter"
         }
       \],
       "auto\_number": {

       }
     },
     {
       "custom\_field": false,
       "lookup": {

       },
       "visible": true,
       "json\_type": "string",
       "field\_label": "First Name",
       "length": 40,
       "column\_name": "FIRSTNAME",
       "view\_type": {
         "view": false,
         "edit": true,
         "quick\_create": true,
         "create": true
       },
       "created\_source": "default",
       "show\_type": 7,
       "ui\_type": 27,
       "read\_only": false,
       "api\_name": "First\_Name",
       "unique": {

       },
       "businesscard\_supported": false,
       "data\_type": "text",
       "formula": {

       },
       "currency": {

       },
       "id": "14000000000653",
       "decimal\_place": null,
       "pick\_list\_values": \[

       \],
       "auto\_number": {

       }
     },
     {
       "custom\_field": false,
       "lookup": {

       },
       "visible": true,
       "json\_type": "string",
       "field\_label": "Last Name",
       "length": 80,
       "column\_name": "LASTNAME",
       "view\_type": {
         "view": true,
         "edit": true,
         "quick\_create": true,
         "create": true
       },
       "created\_source": "default",
       "show\_type": 7,
       "ui\_type": 127,
       "read\_only": false,
       "api\_name": "Last\_Name",
       "unique": {

       },
       "businesscard\_supported": false,
       "data\_type": "text",
       "formula": {

       },
       "currency": {

       },
       "id": "14000000000655",
       "decimal\_place": null,
       "pick\_list\_values": \[

       \],
       "auto\_number": {

       }
     },
     {
       "custom\_field": false,
       "lookup": {

       },
       "visible": true,
       "json\_type": "string",
       "field\_label": "Full Name",
       "length": 80,
       "column\_name": "FULLNAME",
       "view\_type": {
         "view": true,
         "edit": false,
         "quick\_create": false,
         "create": false
       },
       "created\_source": "default",
       "show\_type": 0,
       "ui\_type": 1,
       "read\_only": false,
       "api\_name": "Full\_Name",
       "unique": {

       },
       "businesscard\_supported": false,
       "data\_type": "text",
       "formula": {

       },
       "currency": {

       },
       "id": "14000000000657",
       "decimal\_place": null,
       "pick\_list\_values": \[

       \],
       "auto\_number": {

       }
     }
    \]
    }

    Show More

-   getLayouts ( config )

    get Layout details of a module

    Return Promise : Resolved with data of Assignment rules matching with Entity

    name type attributes description config Object Configuration Object. config.Entity String SysRefName of the module. config.Id String <optional> layout ID.

    Example 1

    ZOHO.CRM.META.getLayouts({ "Entity": "Contacts" }).then(function(data){ console.log(data); });

    Output

    {
     "layouts": \[
       {
         "created\_time": null,
         "modified\_time": null,
         "visible": true,
         "name": "Standard",
         "modified\_by": null,
         "profiles": \[
           {
             "default": true,
             "name": "Administrator",
             "id": "3000000029725"
           },
           {
             "default": true,
             "name": "Standard",
             "id": "3000000029728"
           }
         \],
         "id": "3000000000169",
         "created\_by": null,
         "sections": \[
           {
             "display\_label": "Contact Information",
             "sequence\_number": 1,
             "column\_count": 2,
             "name": "Contact Information",
             "fields": \[
               {
                 "json\_type": "jsonobject",
                 "field\_label": "Contact Owner",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 8,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000673",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "SMOWNERID",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 1,
                 "show\_type": 7,
                 "api\_name": "Owner",
                 "unique": {},
                 "data\_type": "ownerlookup",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Lead Source",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 2,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000675",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "LEADSOURCE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 2,
                 "show\_type": 7,
                 "api\_name": "Lead\_Source",
                 "unique": {},
                 "data\_type": "picklist",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[
                   {
                     "display\_value": "-None-",
                     "sequence\_number": 1,
                     "maps": \[\],
                     "actual\_value": "-None-"
                   },
                   {
                     "display\_value": "Advertisement",
                     "sequence\_number": 2,
                     "maps": \[\],
                     "actual\_value": "Advertisement"
                   },
                   {
                     "display\_value": "Cold Call",
                     "sequence\_number": 3,
                     "maps": \[\],
                     "actual\_value": "Cold Call"
                   },
                   {
                     "display\_value": "Employee Referral",
                     "sequence\_number": 4,
                     "maps": \[\],
                     "actual\_value": "Employee Referral"
                   },
                   {
                     "display\_value": "External Referral",
                     "sequence\_number": 5,
                     "maps": \[\],
                     "actual\_value": "External Referral"
                   },
                   {
                     "display\_value": "Partner",
                     "sequence\_number": 6,
                     "maps": \[\],
                     "actual\_value": "Partner"
                   },
                   {
                     "display\_value": "Public Relations",
                     "sequence\_number": 7,
                     "maps": \[\],
                     "actual\_value": "Public Relations"
                   },
                   {
                     "display\_value": "Trade Show",
                     "sequence\_number": 8,
                     "maps": \[\],
                     "actual\_value": "Trade Show"
                   },
                   {
                     "display\_value": "Web Form",
                     "sequence\_number": 9,
                     "maps": \[\],
                     "actual\_value": "Web Form"
                   },
                   {
                     "display\_value": "Search Engine",
                     "sequence\_number": 10,
                     "maps": \[\],
                     "actual\_value": "Search Engine"
                   },
                   {
                     "display\_value": "Facebook",
                     "sequence\_number": 11,
                     "maps": \[\],
                     "actual\_value": "Facebook"
                   },
                   {
                     "display\_value": "Twitter",
                     "sequence\_number": 12,
                     "maps": \[\],
                     "actual\_value": "Twitter"
                   }
                 \],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "First Name",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 27,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000677",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 40,
                 "column\_name": "FIRSTNAME",
                 "view\_type": {
                   "view": false,
                   "edit": true,
                   "quick\_create": true,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 3,
                 "show\_type": 7,
                 "api\_name": "First\_Name",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Last Name",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": true,
                 "ui\_type": 127,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000679",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 80,
                 "column\_name": "LASTNAME",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": true,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 4,
                 "show\_type": 7,
                 "api\_name": "Last\_Name",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Full Name",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000681",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 80,
                 "column\_name": "FULLNAME",
                 "view\_type": {
                   "view": true,
                   "edit": false,
                   "quick\_create": false,
                   "create": false
                 },
                 "default\_value": null,
                 "sequence\_number": 5,
                 "show\_type": 0,
                 "api\_name": "Full\_Name",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "jsonobject",
                 "field\_label": "Account Name",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 4,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000683",
                 "custom\_field": false,
                 "lookup": {
                   "display\_label": "Contacts",
                   "api\_name": "Contacts",
                   "module": {
                     "api\_name": "Accounts",
                     "id": "3000000000043"
                   },
                   "id": "3000000003935"
                 },
                 "visible": true,
                 "length": 120,
                 "column\_name": "ACCOUNTID",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": true,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 6,
                 "show\_type": 7,
                 "api\_name": "Account\_Name",
                 "unique": {},
                 "data\_type": "lookup",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "jsonobject",
                 "field\_label": "Vendor Name",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 9,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000685",
                 "custom\_field": false,
                 "lookup": {
                   "display\_label": "Contacts",
                   "api\_name": "Contacts",
                   "module": {
                     "api\_name": "Vendors",
                     "id": "3000000000099"
                   },
                   "id": "3000000012263"
                 },
                 "visible": true,
                 "length": 120,
                 "column\_name": "VENDORID",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 7,
                 "show\_type": 7,
                 "api\_name": "Vendor\_Name",
                 "unique": {},
                 "data\_type": "lookup",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Email",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 25,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000687",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 100,
                 "column\_name": "EMAIL",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": true,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 8,
                 "show\_type": 7,
                 "api\_name": "Email",
                 "unique": {},
                 "data\_type": "email",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Title",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000691",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 100,
                 "column\_name": "TITLE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 10,
                 "show\_type": 7,
                 "api\_name": "Title",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Department",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000693",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 50,
                 "column\_name": "DEPARTMENT",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 11,
                 "show\_type": 7,
                 "api\_name": "Department",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Phone",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 33,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000695",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 50,
                 "column\_name": "PHONE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": true,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 12,
                 "show\_type": 7,
                 "api\_name": "Phone",
                 "unique": {},
                 "data\_type": "phone",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Home Phone",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 33,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000697",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "HOMEPHONE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 13,
                 "show\_type": 7,
                 "api\_name": "Home\_Phone",
                 "unique": {},
                 "data\_type": "phone",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Other Phone",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 33,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000699",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "OTHERPHONE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 14,
                 "show\_type": 7,
                 "api\_name": "Other\_Phone",
                 "unique": {},
                 "data\_type": "phone",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Fax",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 35,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000701",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "FAX",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 15,
                 "show\_type": 7,
                 "api\_name": "Fax",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Mobile",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 33,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000703",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "MOBILE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 16,
                 "show\_type": 7,
                 "api\_name": "Mobile",
                 "unique": {},
                 "data\_type": "phone",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Date of Birth",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 24,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000705",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 20,
                 "column\_name": "BIRTHDAY",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 17,
                 "show\_type": 7,
                 "api\_name": "Date\_of\_Birth",
                 "unique": {},
                 "data\_type": "date",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Assistant",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000707",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 50,
                 "column\_name": "ASSISTANT",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 18,
                 "show\_type": 7,
                 "api\_name": "Assistant",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Asst Phone",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 33,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000709",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "ASSISTANTPHONE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 19,
                 "show\_type": 7,
                 "api\_name": "Asst\_Phone",
                 "unique": {},
                 "data\_type": "phone",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Reports To",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000711",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 50,
                 "column\_name": "REPORTSTO",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 20,
                 "show\_type": 7,
                 "api\_name": "Reports\_To",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "boolean",
                 "field\_label": "Email Opt Out",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 301,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000713",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 5,
                 "column\_name": "EMAILOPTOUT",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": false,
                 "sequence\_number": 21,
                 "show\_type": 7,
                 "api\_name": "Email\_Opt\_Out",
                 "unique": {},
                 "data\_type": "boolean",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Skype ID",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 37,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000715",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 50,
                 "column\_name": "SKYPEIDENTITY",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 22,
                 "show\_type": 7,
                 "api\_name": "Skype\_ID",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "jsonobject",
                 "field\_label": "Created By",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 20,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000717",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "SMCREATORID",
                 "view\_type": {
                   "view": true,
                   "edit": false,
                   "quick\_create": false,
                   "create": false
                 },
                 "default\_value": null,
                 "sequence\_number": 23,
                 "show\_type": 7,
                 "api\_name": "Created\_By",
                 "unique": {},
                 "data\_type": "ownerlookup",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "jsonobject",
                 "field\_label": "Modified By",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 20,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000719",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "MODIFIEDBY",
                 "view\_type": {
                   "view": true,
                   "edit": false,
                   "quick\_create": false,
                   "create": false
                 },
                 "default\_value": null,
                 "sequence\_number": 24,
                 "show\_type": 7,
                 "api\_name": "Modified\_By",
                 "unique": {},
                 "data\_type": "ownerlookup",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Created Time",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 200,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000721",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "CREATEDTIME",
                 "view\_type": {
                   "view": true,
                   "edit": false,
                   "quick\_create": false,
                   "create": false
                 },
                 "default\_value": null,
                 "sequence\_number": 25,
                 "show\_type": 7,
                 "api\_name": "Created\_Time",
                 "unique": {},
                 "data\_type": "datetime",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Modified Time",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 200,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000723",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "MODIFIEDTIME",
                 "view\_type": {
                   "view": true,
                   "edit": false,
                   "quick\_create": false,
                   "create": false
                 },
                 "default\_value": null,
                 "sequence\_number": 26,
                 "show\_type": 7,
                 "api\_name": "Modified\_Time",
                 "unique": {},
                 "data\_type": "datetime",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Salutation",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 2,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000727",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "SALUTATION",
                 "view\_type": {
                   "view": false,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 28,
                 "show\_type": 8,
                 "api\_name": "Salutation",
                 "unique": {},
                 "data\_type": "picklist",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[
                   {
                     "display\_value": "-None-",
                     "sequence\_number": 1,
                     "maps": \[\],
                     "actual\_value": "-None-"
                   },
                   {
                     "display\_value": "Mr.",
                     "sequence\_number": 2,
                     "maps": \[\],
                     "actual\_value": "Mr."
                   },
                   {
                     "display\_value": "Mrs.",
                     "sequence\_number": 3,
                     "maps": \[\],
                     "actual\_value": "Mrs."
                   },
                   {
                     "display\_value": "Ms.",
                     "sequence\_number": 4,
                     "maps": \[\],
                     "actual\_value": "Ms."
                   }
                 \],
                 "auto\_number": {}
               },
               {
                 "json\_type": "boolean",
                 "field\_label": "Add to QuickBooks",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 301,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000729",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 5,
                 "column\_name": "ADDTOQUICKBOOKS",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": false,
                 "sequence\_number": 29,
                 "show\_type": 7,
                 "api\_name": "Add\_to\_QuickBooks",
                 "unique": {},
                 "data\_type": "boolean",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Secondary Email",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 25,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000731",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 100,
                 "column\_name": "ADDN\_EMAIL",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 30,
                 "show\_type": 7,
                 "api\_name": "Secondary\_Email",
                 "unique": {},
                 "data\_type": "email",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Last Activity Time",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 786,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000737",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 120,
                 "column\_name": "LASTACTIVITYTIME",
                 "view\_type": {
                   "view": true,
                   "edit": false,
                   "quick\_create": false,
                   "create": false
                 },
                 "default\_value": null,
                 "sequence\_number": 33,
                 "show\_type": 8,
                 "api\_name": "Last\_Activity\_Time",
                 "unique": {},
                 "data\_type": "datetime",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Twitter",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 22,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000739",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 50,
                 "column\_name": "TWITTER",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 34,
                 "show\_type": 7,
                 "api\_name": "Twitter",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               }
             \]
           },
           {
             "display\_label": "Address Information",
             "sequence\_number": 2,
             "column\_count": 2,
             "name": "Address Information",
             "fields": \[
               {
                 "json\_type": "string",
                 "field\_label": "Mailing Street",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000747",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 250,
                 "column\_name": "MAILINGSTREET",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 1,
                 "show\_type": 7,
                 "api\_name": "Mailing\_Street",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Other Street",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000749",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 250,
                 "column\_name": "OTHERSTREET",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 2,
                 "show\_type": 7,
                 "api\_name": "Other\_Street",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Mailing City",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000751",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "MAILINGCITY",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 3,
                 "show\_type": 7,
                 "api\_name": "Mailing\_City",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Other City",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000753",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "OTHERCITY",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 4,
                 "show\_type": 7,
                 "api\_name": "Other\_City",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Mailing State",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000755",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "MAILINGSTATE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 5,
                 "show\_type": 7,
                 "api\_name": "Mailing\_State",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Other State",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000757",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "OTHERSTATE",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 6,
                 "show\_type": 7,
                 "api\_name": "Other\_State",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Mailing Zip",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000759",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "MAILINGZIP",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 7,
                 "show\_type": 7,
                 "api\_name": "Mailing\_Zip",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Other Zip",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000761",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "OTHERZIP",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 8,
                 "show\_type": 7,
                 "api\_name": "Other\_Zip",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Mailing Country",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000763",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "MAILINGCOUNTRY",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 9,
                 "show\_type": 7,
                 "api\_name": "Mailing\_Country",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               },
               {
                 "json\_type": "string",
                 "field\_label": "Other Country",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 1,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000765",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 30,
                 "column\_name": "OTHERCOUNTRY",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 10,
                 "show\_type": 7,
                 "api\_name": "Other\_Country",
                 "unique": {},
                 "data\_type": "text",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               }
             \]
           },
           {
             "display\_label": "Description Information",
             "sequence\_number": 3,
             "column\_count": 1,
             "name": "Description Information",
             "fields": \[
               {
                 "json\_type": "string",
                 "field\_label": "Description",
                 "tooltip": null,
                 "created\_source": "default",
                 "required": false,
                 "ui\_type": 3,
                 "read\_only": false,
                 "currency": {},
                 "id": "3000000000767",
                 "custom\_field": false,
                 "lookup": {},
                 "visible": true,
                 "length": 1000,
                 "column\_name": "DESCRIPTION",
                 "view\_type": {
                   "view": true,
                   "edit": true,
                   "quick\_create": false,
                   "create": true
                 },
                 "default\_value": null,
                 "sequence\_number": 1,
                 "show\_type": 7,
                 "api\_name": "Description",
                 "unique": {},
                 "data\_type": "textarea",
                 "formula": {},
                 "decimal\_place": null,
                 "pick\_list\_values": \[\],
                 "auto\_number": {}
               }
             \]
           },
           {
             "display\_label": "Score Summary",
             "sequence\_number": 4,
             "column\_count": 2,
             "name": "Score Summary",
             "fields": \[\]
           }
         \],
         "status": 0
       }
     \]
    }

    Show More

    Example 2

    ZOHO.CRM.META.getLayouts({ "Entity": "Contacts", "LayoutId": "5000000000169" }).then(function(data){ console.log(data); });

-   getModules ( )

    get Modules list

    Return Promise : Resolved with data of all modules

    Example

    ZOHO.CRM.META.getModules().then(function(data){ console.log(data); });

    Output

    {
     "modules": \[{
         "global\_search\_supported": false,
         "deletable": false,
         "creatable": false,
         "modified\_time": null,
         "plural\_label": "Home",
         "presence\_sub\_menu": false,
         "id": "457154000000000123",
         "visible": true,
         "visibility": 1,
         "convertable": false,
         "editable": false,
         "profiles": \[{
             "name": "Administrator",
             "id": "457154000000015972"
           },
           {
             "name": "Standard",
             "id": "457154000000015975"
           }
         \],
         "filter\_supported": false,
         "web\_link": null,
         "sequence\_number": 1,
         "singular\_label": "Home",
         "viewable": true,
         "api\_supported": false,
         "api\_name": "Home",
         "quick\_create": false,
         "modified\_by": null,
         "generated\_type": "default",
         "feeds\_required": false,
         "scoring\_supported": false,
         "arguments": \[\],
         "module\_name": "Home",
         "business\_card\_field\_limit": 0,
         "parent\_module": {}
       },
       {
         "global\_search\_supported": false,
         "deletable": false,
         "creatable": false,
         "modified\_time": null,
         "plural\_label": "SalesInbox",
         "presence\_sub\_menu": false,
         "id": "457154000000129001",
         "visible": true,
         "visibility": 1,
         "convertable": false,
         "editable": false,
         "profiles": \[{
             "name": "Administrator",
             "id": "457154000000015972"
           },
           {
             "name": "Standard",
             "id": "457154000000015975"
           }
         \],
         "filter\_supported": false,
         "web\_link": null,
         "sequence\_number": 2,
         "singular\_label": "SalesInbox",
         "viewable": true,
         "api\_supported": false,
         "api\_name": "SalesInbox",
         "quick\_create": false,
         "modified\_by": null,
         "generated\_type": "default",
         "feeds\_required": false,
         "scoring\_supported": false,
         "arguments": \[\],
         "module\_name": "SalesInbox",
         "business\_card\_field\_limit": 0,
         "parent\_module": {}
       },
       {
         "global\_search\_supported": false,
         "deletable": false,
         "creatable": false,
         "modified\_time": null,
         "plural\_label": "Feeds",
         "presence\_sub\_menu": false,
         "id": "457154000000059001",
         "visible": true,
         "visibility": 1,
         "convertable": false,
         "editable": false,
         "profiles": \[\],
         "filter\_supported": false,
         "web\_link": null,
         "sequence\_number": 3,
         "singular\_label": "Feeds",
         "viewable": true,
         "api\_supported": false,
         "api\_name": "Feeds",
         "quick\_create": false,
         "modified\_by": null,
         "generated\_type": "default",
         "feeds\_required": false,
         "scoring\_supported": false,
         "arguments": \[\],
         "module\_name": "Feeds",
         "business\_card\_field\_limit": 0,
         "parent\_module": {}
       },
       {
         "global\_search\_supported": true,
         "deletable": true,
         "creatable": true,
         "modified\_time": "2018-10-23T11:39:36+05:30",
         "plural\_label": "Leads",
         "presence\_sub\_menu": true,
         "id": "457154000000000125",
         "visible": true,
         "visibility": 1,
         "convertable": true,
         "editable": true,
         "profiles": \[{
             "name": "Administrator",
             "id": "457154000000015972"
           },
           {
             "name": "Standard",
             "id": "457154000000015975"
           }
         \],
         "filter\_supported": true,
         "web\_link": null,
         "sequence\_number": 4,
         "singular\_label": "Lead",
         "viewable": true,
         "api\_supported": true,
         "api\_name": "Leads",
         "quick\_create": true,
         "modified\_by": {
           "name": "NareshAutomation",
           "id": "457154000000148011"
         },
         "generated\_type": "default",
         "feeds\_required": false,
         "scoring\_supported": true,
         "arguments": \[\],
         "module\_name": "Leads",
         "business\_card\_field\_limit": 5,
         "parent\_module": {}
       },
       {
         "global\_search\_supported": true,
         "deletable": true,
         "creatable": true,
         "modified\_time": null,
         "plural\_label": "Accounts",
         "presence\_sub\_menu": true,
         "id": "457154000000000127",
         "visible": true,
         "visibility": 1,
         "convertable": false,
         "editable": true,
         "profiles": \[{
             "name": "Administrator",
             "id": "457154000000015972"
           },
           {
             "name": "Standard",
             "id": "457154000000015975"
           }
         \],
         "filter\_supported": true,
         "web\_link": null,
         "sequence\_number": 5,
         "singular\_label": "Account",
         "viewable": true,
         "api\_supported": true,
         "api\_name": "Accounts",
         "quick\_create": true,
         "modified\_by": null,
         "generated\_type": "default",
         "feeds\_required": false,
         "scoring\_supported": true,
         "arguments": \[\],
         "module\_name": "Accounts",
         "business\_card\_field\_limit": 5,
         "parent\_module": {}
       }
     \]
    }

-   getRelatedList ( config )

    get RelatedList meta info of a module

    Return Promise : Resolved with data of Assignment rules matching with Entity

    name type description config Object Configuration Object. config.Entity String SysRefName of the module.

    Example

    ZOHO.CRM.META.getRelatedList({ "Entity": "Contacts" }).then(function(data){ console.log(data); });

    Output

    {
     "related\_lists": \[
       {
         "display\_label": "Attachments",
         "visible": true,
         "api\_name": "Attachments",
         "module": {
           "api\_name": "Attachments",
           "id": "3000000000111"
         },
         "name": "Attachments",
         "id": "3000000003968",
         "href": "Contacts/{ENTITYID}/Attachments",
         "type": "default"
       },
       {
         "display\_label": "Deals",
         "visible": true,
         "api\_name": "Deals",
         "module": {
           "api\_name": "Deals",
           "id": "3000000000047"
         },
         "name": "Deals",
         "id": "3000000003974",
         "href": "Contacts/{ENTITYID}/Deals",
         "type": "default"
       },
       {
         "display\_label": "Notes",
         "visible": true,
         "api\_name": "Notes",
         "module": {
           "api\_name": "Notes",
           "id": "3000000000069"
         },
         "name": "Notes",
         "id": "3000000003971",
         "href": "Contacts/{ENTITYID}/Notes",
         "type": "default"
       },
       {
         "display\_label": "Open Activities",
         "visible": true,
         "api\_name": "Activities",
         "module": {
           "api\_name": "Activities",
           "id": "3000000000049"
         },
         "name": "Activities",
         "id": "3000000003965",
         "href": "Contacts/{ENTITYID}/Activities",
         "type": "default"
       },
       {
         "display\_label": "Closed Activities",
         "visible": true,
         "api\_name": "Activities\_History",
         "module": {
           "api\_name": "Activities",
           "id": "3000000000049"
         },
         "name": "Activities History",
         "id": "3000000003962",
         "href": "Contacts/{ENTITYID}/Activities\_History",
         "type": "default"
       },
       {
         "display\_label": "Products",
         "visible": true,
         "api\_name": "Products",
         "module": {
           "api\_name": "Products",
           "id": "3000000000097"
         },
         "name": "Products",
         "id": "3000000003977",
         "href": "Contacts/{ENTITYID}/Products",
         "type": "default"
       },
       {
         "display\_label": "Invited Events",
         "visible": true,
         "api\_name": "Invited\_Events",
         "module": {
           "api\_name": "Events",
           "id": "3000000000065"
         },
         "name": "Invited Events",
         "id": "3000000004001",
         "href": "Contacts/{ENTITYID}/Invited\_Events",
         "type": "default"
       },
       {
         "display\_label": "Cases",
         "visible": true,
         "api\_name": "Cases",
         "module": {
           "api\_name": "Cases",
           "id": "3000000000093"
         },
         "name": "Cases",
         "id": "3000000003980",
         "href": "Contacts/{ENTITYID}/Cases",
         "type": "default"
       },
       {
         "display\_label": "Quotes",
         "visible": true,
         "api\_name": "Quotes",
         "module": {
           "api\_name": "Quotes",
           "id": "3000000000103"
         },
         "name": "Quotes",
         "id": "3000000003983",
         "href": "Contacts/{ENTITYID}/Quotes",
         "type": "default"
       },
       {
         "display\_label": "Sales Orders",
         "visible": true,
         "api\_name": "SalesOrders",
         "module": {
           "api\_name": "Sales\_Orders",
           "id": "3000000000105"
         },
         "name": "SalesOrders",
         "id": "3000000003986",
         "href": "Contacts/{ENTITYID}/SalesOrders",
         "type": "default"
       },
       {
         "display\_label": "Purchase Orders",
         "visible": true,
         "api\_name": "PurchaseOrders",
         "module": {
           "api\_name": "Purchase\_Orders",
           "id": "3000000000107"
         },
         "name": "PurchaseOrders",
         "id": "3000000003989",
         "href": "Contacts/{ENTITYID}/PurchaseOrders",
         "type": "default"
       },
       {
         "display\_label": "Invoices",
         "visible": true,
         "api\_name": "Invoices",
         "module": {
           "api\_name": "Invoices",
           "id": "3000000000109"
         },
         "name": "Invoices",
         "id": "3000000003995",
         "href": "Contacts/{ENTITYID}/Invoices",
         "type": "default"
       },
       {
         "display\_label": "Campaigns",
         "visible": true,
         "api\_name": "Campaigns",
         "module": {
           "api\_name": "Campaigns",
           "id": "3000000000055"
         },
         "name": "Campaigns",
         "id": "3000000003998",
         "href": "Contacts/{ENTITYID}/Campaigns",
         "type": "default"
       },
       {
         "display\_label": "Social",
         "visible": true,
         "api\_name": "Social",
         "module": {
           "api\_name": "Social",
           "id": "3000000000087"
         },
         "name": "Social",
         "id": "3000000004067",
         "href": null,
         "type": "default"
       }
     \]
    }
