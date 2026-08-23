# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

-   CDN URL: https://live.zwidgets.com/js-sdk/1.5/ZohoEmbededAppSDK.min.js

    Initialise widgets to start listening to events

    init

    Primary initialization function of widgets used to initialize the widget to start listening to events

    Example

    //Subscribe to the EmbeddedApp onPageLoad event before initializing ZOHO.embeddedApp.on("PageLoad", function(data){ console.log(data); //Custom Business logic goes here }) //Initializing the widget. ZOHO.embeddedApp.init();

-   To register Listeners with EmbededApp

    DialerActive

    Triggered everytime softphone window is toggled

    Example

    ZOHO.embeddedApp.on("DialerActive", function(){ console.log("Dialer Activated"); });

-   Dial

    Triggered when Call icon inside ZohoCRM is clicked

    Example

    ZOHO.embeddedApp.on("Dial", function(data){ console.log("Number Dialed"); });

-   Notify

    Triggered when Client Script flyout notify call is triggered

    Example

    ZOHO.embeddedApp.on("Notify", function(data){ console.log("Client Script flyout notification", data); });

-   NotifyAndWait

    Triggered when Client Script flyout notify call is triggered synchronously

    Example

    ZOHO.embeddedApp.on("NotifyAndWait", function(data){ console.log("Client Script synchronous flyout notification", data); ZDK.Client.sendResponse(data.id, { choice: 'mail', value: 'example@zoho.com' }); });

-   PageLoad

    Triggered whenever an entity Page (Detail page) is loaded

    Example

    ZOHO.embeddedApp.on("PageLoad", function(data){ console.log(data); });

    Output

    Related List

    {
      "Entity": "Leads",
      "EntityId": "3000000032096"
    }

    Show More

-   ContextUpdate

    Triggered each time the Wizard's form is modified.

    Example

    ZOHO.embeddedApp.on("ContextUpdate", function(data){ console.log(data); });
