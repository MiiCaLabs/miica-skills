# Zoho Creator-Only Tasks and Features

Deluge in Creator has exclusive tasks and syntax unavailable in CRM, Books, Desk, or other Zoho products. These include form-event scripts, record iteration on forms, composite fields, client functions, and AI/Zia tasks.

## AI / Zia tasks (11 tasks)

Creator integrates with Zoho Zia (AI assistant). These tasks are Creator-only:

- `zoho.ai.predict()` - predict a value using a trained model.
- `zoho.ai.generateText()` - generate text content.
- `zoho.ai.summarize()` - summarize text or records.
- `zoho.ai.extractData()` - extract structured data from unstructured text.
- `zoho.ai.analyzeImage()` - analyze images and extract information.
- `zoho.ai.transcribeAudio()` - convert audio to text.
- `zoho.ai.sentiment()` - analyze sentiment in text.
- `zoho.ai.entityRecognition()` - identify entities (names, dates, locations) in text.
- `zoho.ai.categoryClassification()` - classify text into predefined categories.
- `zoho.ai.translate()` - translate text between languages.
- `zoho.ai.getInsights()` - get AI-driven insights on form data.

Refer to Creator-specific Deluge docs for exact syntax and available model parameters.

## Blueprint tasks (2 tasks)

Blueprints are workflow state machines in Creator. Deluge can interact with them:

- `getBlueprint()` - retrieve the current blueprint state and available transitions.
- `executeTransition(<transition_name>)` - move to the next blueprint state.

```deluge
current_state = getBlueprint();
if(current_state == "Draft")
{
    executeTransition("Submit for Approval");
}
```

## Conditions (record-level filtering)

Creator's **conditions** allow workflow scripts to run conditionally based on form field values:

```deluge
// Example condition in a workflow event
if(Status == "Approved" && Amount > 1000)
{
    // only runs if both conditions are true
    sendmail[ ... ];
}
```

## Data Access (form record operations)

### Fetch records from a form

```deluge
// Fetch all records
all_records = Form[];

// Fetch with criteria
active_records = Form[Status == "Active"];

// Fetch a single record safely
matches = Form[Email == user_email];
if(matches.count() > 0)
{
    record = matches.get(0);
}
```

### Add (insert) record

```deluge
new_rec = Map();
new_rec.put("Name", "John Doe");
new_rec.put("Email", "john@example.com");
Form.add(new_rec);
```

or using the `insert` alias:

```deluge
Form.insert(new_rec);
```

### Update records

```deluge
updates = {"Status": "Completed", "Completion_Date": zoho.currentdate};
Form[ID == rec_id].update(updates);
```

### Delete records

```deluge
Form[ID == rec_id].delete();
// or delete with criteria
Form[Status == "Archived"].delete();
```

## Composite fields

Composite fields bundle related sub-fields into a single logical unit. Creator provides special syntax to work with them:

### Name composite (First Name, Last Name)

```deluge
record = Form[ID == rec_id].get(0);
full_name = record.Name;  // returns a Map with subfields
first = full_name.get("first_name");
last = full_name.get("last_name");

// Set a composite field
new_name = Map();
new_name.put("first_name", "John");
new_name.put("last_name", "Doe");
record.Name = new_name;
record.update();
```

### Address composite (Street, City, State, Zip, Country)

```deluge
address = record.Address;  // Map with address sub-fields
street = address.get("street");
city = address.get("city");
state = address.get("state");
zip = address.get("zip");
country = address.get("country");
```

### URL composite (protocol, domain, path)

```deluge
url_field = record.Website_URL;
protocol = url_field.get("protocol");
domain = url_field.get("domain");
path = url_field.get("path");
```

### Image composite

```deluge
image = record.Logo;  // File object
file_name = image.getFileName();
file_size = image.getFileSize();
```

### Users composite (lookup to Users form)

```deluge
assignee = record.Assigned_To;  // Map with user sub-fields
user_id = assignee.get("id");
user_name = assignee.get("name");
user_email = assignee.get("email");
```

### Subform (nested records)

See "Subform tasks" below for detailed subform manipulation.

### Lookup composite (reference to another form)

```deluge
parent = record.Parent_Record;  // Map with lookup fields
parent_id = parent.get("id");
parent_name = parent.get("name");
```

## Client functions (hide/show/enable/disable/alert)

These functions run on the client (browser) and require a form context (e.g., On Load, On Success):

### Show / Hide fields

```deluge
show "Field_Name";
hide "Field_Name";

// Show/hide based on condition
if(Status == "Active")
{
    show "Approval_Date";
}
else
{
    hide "Approval_Date";
}
```

### Enable / Disable fields

```deluge
enable "Field_Name";
disable "Field_Name";

// Disable read-only fields after submission
disable "Submitted_Date";
```

### Alert dialog (blocks user action until dismissed)

```deluge
alert "Please fill all required fields before submitting.";
```

### Set field focus

```deluge
focus "Email_Address";
```

### Cancel / prevent submit or delete

```deluge
if(Amount > 100000 && !Approval_Granted)
{
    alert "This record requires management approval.";
    cancel submit;
}

// Also available:
cancel delete;  // prevent record deletion
```

## Miscellaneous tasks

### getFieldNames - list all fields in a form

```deluge
field_names = getFieldNames();
for each name in field_names
{
    info name;
}
```

### getFieldValue - fetch a field's current value

```deluge
email = getFieldValue("Email_Address");
```

Typically used in form events to access field values entered by the user.

### cancelSubmit / cancelDelete

```deluge
if(email.isBlank())
{
    alert "Email is required";
    cancel submit;  // prevent form submission
}
```

## List / Map manipulations

Deluge's general List and Map functions apply in Creator as well - see `references/collections.md`.

## Subform tasks (nested records)

Subforms allow one-to-many relationships within a form. Access subform rows:

### Get subform rows

```deluge
subform_rows = record.Line_Items;  // List of Maps, one per subform row
for each row in subform_rows
{
    qty = row.get("Quantity");
    price = row.get("Unit_Price");
    info "Item: Qty=" + qty + ", Price=" + price;
}
```

### Add a subform row

```deluge
new_row = Map();
new_row.put("Product_Name", "Laptop");
new_row.put("Quantity", 2);
new_row.put("Unit_Price", 800);
record.Line_Items.add(new_row);
record.update();
```

### Update a subform row

```deluge
rows = record.Line_Items;
if(rows.count() > 0)
{
    rows.get(0).put("Quantity", 5);
}
record.update();
```

### Delete a subform row

```deluge
rows = record.Line_Items;
rows.remove(0);  // remove first row
record.update();
```

## File upload field tasks

File upload fields return File objects. Manipulate them:

```deluge
// Access an uploaded file
file = record.Attachment;
name = file.getFileName();
size = file.getFileSize();
content = file.getFileContent();

// Convert file to PDF
pdf_file = file.convertToPDF();

// Delete an uploaded file
record.Attachment = null;
record.update();
```

## User roles & properties

### Get current user info

```deluge
user_id = zoho.loginuserid;
user_name = zoho.loginuser.name;  // system variable
```

### Check user role (Creator-specific)

```deluge
current_role = zoho.loginuser.role;
if(current_role == "Admin")
{
    show "Admin_Settings";
}
```

## XML manipulation (executeXpath)

Parse and extract data from XML responses:

```deluge
xml_response = "<root><item><name>Product A</name><price>100</price></item></root>";
name = executeXpath(xml_response, "/root/item/name/text()");
info name;  // "Product A"
```

## openUrl - navigate to external URL

```deluge
// Open a URL (typically in a new tab or redirect)
openUrl("https://www.example.com");

// Open with parameters
openUrl("https://app.example.com/search?q=" + encodeUrl(search_term));
```

## Form events where scripts run (Creator-only)

Deluge scripts in Creator run at specific form events:

- **On Load** - form renders; access field values, show/hide fields, prefill values.
- **On Validate** - before record submission; validate data, show alerts, cancel submit.
- **On Success** - after successful submission; send notifications, trigger workflows.
- **On User Input** - field value changed; auto-calculate, update related fields.
- **Subform Add Row** - new row added to subform.
- **Subform Delete Row** - row removed from subform.
- **Subform Update Row** - existing row modified.

Each event context provides access to different objects (`record`, `input`, `Form`, etc.) - verify the docs for which variables are available in which events.

## Approval tasks (Creator-only)

Some Creator forms use approval workflows. Tasks include:

- `getApprovalStatus()` - check current approval state.
- `sendForApproval()` - programmatically send a record for approval.
- `approveRecord()` - approve a pending record.
- `rejectRecord()` - reject a pending record with a reason.

Refer to Creator Deluge docs for current syntax and approval-workflow integration.
