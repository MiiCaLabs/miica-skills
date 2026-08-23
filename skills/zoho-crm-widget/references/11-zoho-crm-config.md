# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZOHO.CRM CONFIG

-   getCurrentUser ( )

    get Current User info

    Return Promise : Resolved with User info

    Example

    ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){ console.log(data); });

    Output

    {
      "confirm": true,
      "full\_name": "asd devvv",
      "role": {
        "name": "CEO",
        "id": "1000000028936"
      },
      "profile": {
        "name": "Administrator",
        "id": "1000000028942"
      },
      "last\_name": "asd devvv",
      "alias": null,
      "id": "1000000030132",
      "first\_name": null,
      "email": "naresh.babu+dev1@zylker.com",
      "zuid": "4253443",
      "status": "active"
    }

-   getOrgInfo ( )

    get plugins configuration data

    Return Promise : Resolved with Plugin Configuration

    Example

    ZOHO.CRM.CONFIG.getOrgInfo().then(function(data){ console.log(data); });

    Output

    {
     "Success": {
      "Content": "12345"
     }
    }

-   getUserPreference ( )

    get Current user's preference

    Return Promise : Resolved with current user's preference

    Example

    ZOHO.CRM.CONFIG.getUserPreference().then(function(data){ console.log(data); });

    Output

    {
      "mode": "day"
    }
