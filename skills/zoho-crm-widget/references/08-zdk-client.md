# Zoho CRM Developer Space - APIs, Widgets, Client Script & SlyteUI Documentation

ZDK.Client

-   getInput ( options , heading , accept\_message , reject\_message )

    Note: The presence of an active loader restricts the availability of other pop-ups.

    Get one or more input.

    Return Object : Get input response

    name type attributes default description options Object options.type Array.<{type: ('text'|'number'|'textarea'|'picklist'|'multiselectpicklist')}> <optional> 'text' Max Value Limit Input options - 7
    \`text\` - 120 characters
    \`number\` - 50 digits
    \`textarea\` - 2000 characters
    \`picklist options\` - 2000 options (each option - 120 characters)
    \`multiselectpicklist options\` - 2000 options (each option - 120 characters) options.label String <optional> label for input field options.default\_value String, Array <optional> multiselectpicklist accepts array of Strings, others accept String as default value options.list\_options Array.<{actual\_value: string, display\_value: string}> <optional> list of options for picklist heading String <optional> Heading accept\_message String <optional> Okay accept button message reject\_message String <optional> Cancel reject button message

    Text Input

    ZDK.Client.getInput(\[{ type: 'number', label: 'Enter No. of employees' }, { type: 'text', label: 'Enter batch name' }\], 'Employees', 'OK', 'Cancel');

    Output

    \['120', 'Batch A'\]

    Default value sample

    ZDK.Client.getInput(\[{ type: 'textarea', label: 'Enter batch name', default\_value: 'sample' }\], 'Employees', 'OK', 'Cancel');

    Output

    \['sample'\]

    For picklist,

    ZDK.Client.getInput(\[{ type: 'picklist', label: 'Enter branch', list\_options: \[{ actual\_value: "Sales", display\_value: "Sales Department" }, { actual\_value: "HR", display\_value: "HR Department" }\], default\_value: "HR" }\], 'Employees', 'OK', 'Cancel');

    Output

    \['HR'\]

    For multiselectpicklist,

    ZDK.Client.getInput(\[{ type: 'multiselectpicklist', label: 'Areas of Interest', list\_options: \[{ actual\_value: "Artificial Intelligence", display\_value: "Artificial Intelligence (AI)" }, { actual\_value: "Data Analytics", display\_value: "Data Analytics" }, { actual\_value: "Cybersecurity", display\_value: "Cybersecurity" }\], default\_value: \["Artificial Intelligence", "Cybersecurity"\] }\], 'Interest Areas', 'OK', 'Cancel');

    Output

    \[ \['Artificial Intelligence', 'Cybersecurity'\]\]

-   hideLoader ( )

    Hides the Loader

    Example

    Sample

    ZDK.Client.hideLoader();

-   openPopup ( config , data )

    Note: The presence of an active loader restricts the availability of other pop-ups.

    Open popup widget and await a response from the widget's [$Client.close()](/explore/widgets/v1.5/$Client#close). Moreover, custom data can be passed to widget's ['PageLoad'](/explore/widgets/v1.5/jssdk#PageLoad) event. Supported Widget SDK version >= 1.2.

    Return object | string | number | boolean : Response from widget's [$Client.close()](/explore/widgets/v1.5/$Client#close)

    name type attributes default description config Object config.api\_name String api name of the widget(Custom Button type) config.type String widget config.header String <optional> ${widget name} header for the popup
      \`undefined\` - hides the header config.close\_icon Boolean <optional> true toggle close icon config.close\_on\_escape Boolean <optional> toggle close on Esc key config.animation\_type 1, 2, 3, 4, 5, 6 <optional> 1 define the animation style of the popup
      \`1\` - slides popup from top
      \`2\` - slides popup from right
      \`3\` - slides popup from left
      \`4\` - slides popup from bottom
      \`5\` - fades in and fades out the popup
      \`6\` - zoom in and zoom out the popup config.height '200px', '20vh' <optional> '70vh' popup height config.width '500px', '50vw' <optional> '60vw' popup width config.top '0', '20px', 'center' <optional> '0' popup offset > top config.left '0', '20px', 'center' <optional> 'center' popup offset > left config.bottom '0', '20px', 'center' <optional> popup offset > bottom (overrides top property) config.right '0', '20px', 'center' <optional> popup offset > right (overrides left property) data any <optional> data to be passed as ['PageLoad'](/explore/widgets/v1.5/jssdk#PageLoad) event data in Widget

    Example

    Sample

    ZDK.Client.openPopup({ api\_name: 'sample\_widget', type: 'widget', header: 'Sample Widget', animation\_type: 4, height: '450px', width: '450px', left: '10px' }, { data: 'sample data to be passed to "PageLoad" event of widget' });

-   sendResponse ( request\_uuid , data )

    Send response to widget

    name type attributes description request\_uuid String unique id received in 'NotifyAndWait' event of the flyout widget data Any <optional> response to be passed

    Example

    Sample

    ZDK.Client.sendResponse('0deec96f-2d55-4349-ace9-d45499fd004c', { choice: 'mail', value: 'example@zoho.com' });

-   showAlert ( message , heading , accept\_message )

    Note: The presence of an active loader restricts the availability of other pop-ups.

    Show Alert message with markdown support.

    name type attributes default description message String primary text to be displayed heading String <optional> heading to be displayed accept\_message String <optional> Okay accept button message

    Simple Alert

    ZDK.Client.showAlert('First Name will be mandatory from next week');

    Customised Alert with link, heading and button message

    ZDK.Client.showAlert('You can \[click here\](https://www.zylker.com) to visit the page.', 'Notice', 'Got it!');

    Alert with bold, break and underline

    ZDK.Client.showAlert('This is an \_\_important\_\_ message\\n This is an \*important\* message');

    Alert with image

    ZDK.Client.showAlert('!\[alt text\](https://link-to/sample.png)');

-   showConfirmation ( message , accept\_message , reject\_message )

    Note: The presence of an active loader restricts the availability of other pop-ups.

    Show confirmation box with markdown support and accept/reject message.

    Return Boolean : Confirmation response

    name type attributes default description message String text to be displayed accept\_message String <optional> Yes, Proceed accept button message reject\_message String <optional> Cancel reject button message

    Simple Confirmation Box

    ZDK.Client.showConfirmation('Are you sure?');

    Customised Confirmation Box

    ZDK.Client.showConfirmation('Are you \*sure\*?', 'Yes. Got it!', 'Nope');

    Output

    true | false

-   showLoader ( config )

    Note: The presence of an active loader restricts the availability of other pop-ups.

    Display the loader with message.

    name type attributes default description config Object config.type 'page' <optional> 'page' type of loader config.template 'spinner', 'vertical-bar', 'standard' <optional> 'standard' templates of loader (Note: spinner and vertical bar can be used when invoking time consuming APIs) config.message 'String' <optional> message to be displayed \`limit\` 240 characters

    Example

    Sample

    ZDK.Client.showLoader({ type: 'page', template: 'vertical-bar', message: 'Loading ...' });

-   showMessage ( message , options )

    Note: The presence of an active loader restricts the availability of other pop-ups. Image Markdown not supported for showMessage.
     

    ```
    Italics       - _text_
    Bold        - *text*
    Underline   - __text__
    Strikeout   - ~text~
    Code        - `text`
    Heading1    - # text
    Heading3    - ### text
    Blockquote  - !text
    Hyperlink   - [click here](https://www.zoho.com)
    ```



    Show a toast message in Page with following markdown support.

    name type attributes default description message String text to be displayed options Object <optional> message options options.type 'info', 'error', 'warning', 'success' <optional> info type of message

    Example

    Warning with bold

    ZDK.Client.showMessage('This is an \*important\* warning.', { type: 'warning' });
