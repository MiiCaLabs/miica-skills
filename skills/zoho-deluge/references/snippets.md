# Ready-to-Adapt Code Snippets

Copy and modify these snippets for common Deluge tasks.

## Form Validation (On Validate event, Creator)

```deluge
// Validate required fields
if(input.email.isBlank())
{
    alert "Email is required";
    cancel submit;
}

if(!input.email.contains("@"))
{
    alert "Invalid email format";
    cancel submit;
}

// Validate numeric range
age = toNumber(input.age);
if(age < 18)
{
    alert "Must be 18 or older";
    cancel submit;
}
```

## Fetch and Update Records (Creator)

```deluge
// Fetch a record and update it
matches = Customers[Email == input_email];
if(matches.count() > 0)
{
    customer = matches.get(0);
    customer.Last_Contact = zoho.currentdate;
    customer.Status = "Active";
    customer.update();
    info "Updated customer: " + customer.Name;
}
else
{
    info "Customer not found";
}
```

## Loop and Transform Data

```deluge
// Transform a list of records
customers = Customers[];
transformed = List();
for each cust in customers
{
    transformed.add(
        {
            "id": cust.ID,
            "name": cust.Name,
            "email": cust.Email,
            "city": cust.Address.get("city")
        }
    );
}
info transformed;
```

## REST API Call (invokeUrl with JSON)

```deluge
// Call an external API and parse response
url = "https://api.example.com/users";
payload = {
    "name": "John Doe",
    "email": "john@example.com"
};

response = invokeUrl
[
    url: url,
    type: POST,
    headers: {"Content-Type": "application/json"},
    body: payload.toString()
];

if(!isNull(response) && !response.isBlank())
{
    result = response.toMap();
    user_id = result.get("id");
    info "Created user: " + user_id;
}
else
{
    info "API call failed or returned empty";
}
```

## Send Email with Attachment

```deluge
// Fetch a file and email it
file = invokeUrl
[
    url: "https://example.com/report.pdf",
    type: GET
];

if(!isNull(file))
{
    sendmail
    [
        from: zoho.adminuserid,
        to: recipient_email,
        subject: "Your Report",
        message: "<h2>Attached Report</h2><p>Please find your requested report attached.</p>",
        attachment: file
    ];
    info "Email sent with attachment";
}
```

## Batch Process Records (Handle Large Datasets)

```deluge
// Process records in batches to avoid timeout. Deluge has no while loop, so
// the page counter is bounded by a fixed literal list instead, with break
// firing as soon as a short page tells us there's nothing left.
pageNumbers = {1,2,3,4,5,6,7,8,9,10};  // hard cap: 10 pages x 100 = 1,000 records
page_size = 100;
for each page in pageNumbers
{
    records = Customers[] sorted by ID asc;  // Creator syntax
    // For other products: records = zoho.crm.getRecords("Contacts", page, page_size);

    for each rec in records
    {
        // Process each record
        rec.Last_Processed = zoho.currentdate;
        rec.update();
    }

    if(records.count() < page_size)
    {
        break;  // short page - nothing left to fetch
    }
}
info "Batch processing complete";
```

## Error-Safe Field Access

```deluge
// Safely access nested field values
customer = Customers[ID == cust_id].get(0);

// Guard against null
if(!isNull(customer))
{
    // Guard composite fields
    address = customer.Address;
    if(!isNull(address))
    {
        city = address.get("city");
        state = address.get("state");
        info "Address: " + city + ", " + state;
    }
}
```

## Pagination with invokeUrl

```deluge
// Fetch paginated API results. Deluge has no while loop, so the page count
// is bounded by a fixed literal list, with break firing once the API says
// there's no next page.
pageNumbers = {1,2,3,4,5,6,7,8,9,10};  // hard cap: 10 pages x 50 = 500 users
all_users = List();
for each page in pageNumbers
{
    url = "https://api.example.com/users?page=" + page + "&limit=50";
    response = invokeUrl
    [
        url: url,
        type: GET,
        headers: {"Authorization": "Bearer " + api_token}
    ];

    if(isNull(response))
    {
        break;
    }

    data = response.toMap();
    users = data.get("results");  // assume API returns {"results": [...], "has_next": boolean}

    for each user in users
    {
        all_users.add(user);
    }

    if(!data.get("has_next").toBoolean())
    {
        break;
    }
}
info "Fetched " + all_users.count() + " total users";
```

## Check if Current CRM User Is an Admin (paginated)

```deluge
// Confirm zoho.loginuserid is an active, confirmed CRM administrator.
// zoho.crm.getRecords("users", ...) only accepts type values AllUsers,
// AdminUsers, ActiveUsers, DeactiveUsers - there is no combined
// "active+confirmed+admin" filter, so fetch AdminUsers and check the
// status/confirm fields on each candidate in Deluge.
loginEmail = ifnull(zoho.loginuserid,"").toString().trim();
adminFound = false;
pageSize = 200;
pageNumbers = {1,2,3,4,5};  // hard cap: 5 pages x 200 = 1,000 admins
moreRecords = true;
for each page in pageNumbers
{
    response = zoho.crm.getRecords("users",page,pageSize,{"type":"AdminUsers"});
    for each user in ifnull(response.get("users"),List())
    {
        email = ifnull(user.get("email"),"").toString();
        status = ifnull(user.get("status"),"").toString().toLowerCase();
        confirmed = ifnull(user.get("confirm"),"false").toString().toLowerCase() == "true";
        if(email.toLowerCase() == loginEmail.toLowerCase() && status == "active" && confirmed)
        {
            adminFound = true;
            break;
        }
    }
    info_map = response.get("info");
    moreRecords = if(info_map == null, false, ifnull(info_map.get("more_records"),false));
    if(adminFound || !moreRecords)
    {
        break;
    }
}
if(!adminFound)
{
    info "Not an administrator - abort privileged action";
}
```

Note: this is a `for each` loop over a fixed-size literal page list, not a `while` or C-style `for(;;)` - neither exists in Deluge (see `references/control-flow.md`).

## Conditional Email Notification

```deluge
// Send different emails based on conditions
if(status == "Approved" && amount > 5000)
{
    recipients = "finance@example.com";
    subject = "Large Approval Alert: " + amount;
    message = "<h3>High-Value Record Approved</h3><p>Amount: " + amount + "</p>";
}
else if(status == "Rejected")
{
    recipients = requester_email;
    subject = "Your Request Was Rejected";
    message = "<p>Your request has been rejected. Please contact support.</p>";
}
else
{
    recipients = manager_email;
    subject = "Workflow Update";
    message = "<p>A new record requires your attention.</p>";
}

sendmail
[
    from: zoho.adminuserid,
    to: recipients,
    subject: subject,
    message: message
];
```

## Map Transformation

```deluge
// Transform a Map of user data
user_data = {"first_name": "John", "last_name": "Doe", "email": "john@example.com"};

// Combine first and last name
user_data.put("full_name", user_data.get("first_name") + " " + user_data.get("last_name"));

// Remove raw name fields
user_data.remove("first_name");
user_data.remove("last_name");

info user_data;  // {"full_name": "John Doe", "email": "john@example.com"}
```

## Date Calculation

```deluge
// Calculate business days until deadline
today = zoho.currentdate;
deadline = '15-Aug-2026';

// Add 5 business days to today
future_date = today.addBusinessDay(5);

// Calculate days between two dates
days_left = deadline.diff(today);  // negative if past due
if(days_left < 0)
{
    alert "Deadline has passed!";
}
else
{
    info days_left + " days remaining";
}
```

## Regex Pattern Matching

```deluge
// Validate phone number format
phone = input.phone;
if(phone.matches("^[0-9\\-\\(\\)\\s]+$"))  // simple numeric + formatting chars
{
    info "Valid phone format";
}
else
{
    alert "Invalid phone number";
}

// Extract area code (first 3 digits)
area_code = phone.find("[0-9]{3}");  // regex match
info "Area code: " + area_code;
```

## Generate Unique ID

```deluge
// Create a simple unique ID (timestamp-based)
timestamp = zoho.currenttime.toString().replaceAll(" ", "").replaceAll("-", "").replaceAll(":", "");
unique_id = "ORD" + timestamp;
info unique_id;  // e.g., "ORD01Aug202609153045"
```

## Subform Operations (Creator)

```deluge
// Add a row to a subform
record = Orders[ID == order_id].get(0);
line_item = Map();
line_item.put("Product", "Laptop");
line_item.put("Qty", 2);
line_item.put("Price", 800.00);
record.Line_Items.add(line_item);
record.update();

// Iterate and sum subform values
total = 0;
for each item in record.Line_Items
{
    qty = item.get("Qty").toNumber();
    price = item.get("Price").toDecimal();
    total = total + (qty * price);
}
record.Total_Amount = total;
record.update();
```

## Log Action for Audit Trail

```deluge
// Create an audit trail entry
void log_action(Text action, Text object_type, Text object_id, Text user_id)
{
    audit_rec = Map();
    audit_rec.put("Action", action);
    audit_rec.put("Object_Type", object_type);
    audit_rec.put("Object_ID", object_id);
    audit_rec.put("User_ID", user_id);
    audit_rec.put("Timestamp", zoho.currenttime);
    audit_rec.put("IP_Address", zoho.ipaddress);
    AuditLog.insert(audit_rec);
}

// Call it
log_action("UPDATE", "Customer", cust_id, zoho.loginuserid);
```
