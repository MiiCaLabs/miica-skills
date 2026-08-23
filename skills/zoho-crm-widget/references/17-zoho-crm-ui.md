# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM UI

-   Resize ( dimensions )

    Resize Widget to the given dimensions

    Return Promise : Resolved with true | false

    name type description dimensions Object Dimension of Dialer. dimensions.height Integer Height in px dimensions.width Integer Width in px

    Example

    ZOHO.CRM.UI.Resize({ height: "200", width: "1000" }).then(function(data){ console.log(data); });

    Output

    True

    Show More
