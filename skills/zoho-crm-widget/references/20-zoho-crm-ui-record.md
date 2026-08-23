# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM UI.Record

-   create ( data )

    Open CreatePage of the specified Record

    Return Promise : Resolved with true | false

    name type description data object Configuration Object data.Entity String SysRefName of the module.

    Example

    ZOHO.CRM.UI.Record.create({ Entity: "Leads" }).then(function(data){ console.log(data) })

-   edit ( data )

    open EditPage of the specified Record

    Return Promise : Resolved with true | false

    name type description data object Configuration Object data.Entity String SysRefName of the module. data.RecordID String RecordID to open

    Example

    ZOHO.CRM.UI.Record.edit({ Entity: "Leads", RecordID: "1000000036062" }).then(function(data){ console.log(data) })

-   open ( data )

    Open DetailPage of the specified Record

    Return Promise : Resolved with true | false

    name type description data object Configuration Object data.Entity String SysRefName of the module. data.RecordID String RecordID to open

    Example

    ZOHO.CRM.UI.Record.open({ Entity: "Leads", RecordID: "1000000036062" }).then(function(data){ console.log(data) })

-   populate ( RecordData )

    Populate the given data in the entity form

    Return Promise : Resolved with true | false

    name type RecordData object

    Example

    ZOHO.CRM.UI.Record.populate({ Annual\_Revenue: "500", Description: "Populating test data", Phone: "85663655785" }).then(function(data){ console.log(data) })
