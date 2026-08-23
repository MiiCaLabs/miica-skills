# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM WIZARD

-   post ( record\_data )

    Send data to wizard

    Return Promise : Resolved when the data is set to the record in wizard

    name type description record\_data Object Field data to be set to the record in wizard

    Example

    var record\_data \= { "field\_api\_name1": "field\_value", "field\_api\_name2": "field\_value" }; ZOHO.CRM.WIZARD.post(record\_data);
