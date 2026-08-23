# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM UI.Widget

-   open ( )

    open a WebTab Widget with custom onLoad Data

    Return Promise : Resolved with true | false

    Example

    var message \= { arg1: "Argument 1", arg2: "Argument 2", arg3Nested: { subArg1: "SubArgument 1", subArg2: "SubArgument 2", subArg3: "SubArgument 3", } } ZOHO.CRM.UI.Widget.open({ Entity: "WebTab1\_Widget", Message: message }).then(function(data){ console.log(data) })
