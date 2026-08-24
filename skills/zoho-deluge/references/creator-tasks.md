# Zoho Creator tasks

These features are Creator-specific. Availability also depends on workflow event, field type, account rollout, and deployment model.

## Client functions

Client functions run only in supported form events.

```deluge
if(input.Contact_Mode == "Email")
{
    show Email;
    hide Phone;
    enable Email;
}
else
{
    hide Email;
    show Phone;
    enable Phone;
}
```

Use field link names without quotes. Hiding a field changes the UI only. It does not secure the field or its data.

Other client functions include focus, add or append, select or deselect, clear, alert, and reload. Confirm event support on each function page.

## Dynamic field access

```deluge
values = Map();
for each field_name in getFieldNames()
{
    values.put(field_name, getFieldValue(field_name));
}
```

`getFieldNames()` and the direct `getFieldValue()` form work in supported workflows, not Creator custom functions. A fetched record can use `record.getFieldValue("Field_Link_Name")`.

## Composite fields

Name and Address fields use subfield syntax, not Map access.

```deluge
input.Customer_Name.first_name = "Ada";
input.Customer_Name.last_name = "Lovelace";
input.Billing_Address.country = "United Kingdom";
```

Add a record with subfields:

```deluge
customer_id = insert into Customers
[
    Customer_Name.first_name = "Ada"
    Customer_Name.last_name = "Lovelace"
    Billing_Address.district_city = "London"
];
```

Use the exact generated subfield link names. Additional fields of the same composite type can receive numeric suffixes.

## Subform rows

```deluge
new_row = Orders.Items();
new_row.Product = product_id;
new_row.Quantity = 1;

rows = Collection();
rows.insert(new_row);
input.Items.insert(rows);
```

The parent form and subform link names create a row object. Insert the row or a row collection into the input subform. Custom sorting and workflow-event restrictions apply.

## Blueprint

Blueprint attributes are available through:

```deluge
info input.Blueprint.Name;
info input.Blueprint.Current_Stage;
info input.Blueprint.Status;
```

Blueprint tasks require form, blueprint, transition or stage, and record ID link values in the documented order.

```deluge
thisapp.blueprint.executeTransition(
    "Orders",
    "Order_Flow",
    "Mark_Delivered",
    input.ID
);

thisapp.blueprint.changeStage(
    "Orders",
    "Order_Flow",
    "Delivered",
    input.ID
);
```

Conditions on a transition still apply. Deluge documents a maximum of 50 blueprint statements per function.

## Approvals

Creator approval workflows are configured in the application builder. Do not invent generic functions such as `sendForApproval()`, `approveRecord()`, or `getApprovalStatus()` unless the target product's current editor and documentation explicitly provide them.

## File-upload fields

Creator documents File Upload field values as TEXT in form and fetched-record contexts. Do not assume every upload field value is a general FILE object. File task support depends on how the file was obtained and the workflow context.

## Sources

- https://www.zoho.com/deluge/help/client-functions.html
- https://www.zoho.com/deluge/help/client-functions/hide-show.html
- https://www.zoho.com/deluge/help/miscellaneous/getfieldnames.html
- https://www.zoho.com/deluge/help/miscellaneous/getfieldvalue.html
- https://www.zoho.com/deluge/help/composite-fields-usage.html
- https://www.zoho.com/deluge/help/miscellaneous/insert-subform-row.html
- https://www.zoho.com/deluge/help/creator-blueprint-tasks.html
- https://www.zoho.com/deluge/help/creator-blueprint-tasks/blueprint-attributes.html
- https://www.zoho.com/deluge/help/creator-blueprint-tasks/execute-transition.html
- https://www.zoho.com/deluge/help/creator-blueprint-tasks/change-stage.html
- https://www.zoho.com/deluge/help/creator-field-datatype.html
