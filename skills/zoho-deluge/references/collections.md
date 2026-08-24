# List, Map, and Collection

Deluge distinguishes LIST, KEY-VALUE (Map), and COLLECTION. Similar-looking methods are not interchangeable.

## List

```deluge
products = {"CRM", "Creator"};
products.add("Books");
products.addAll({"Desk", "People"});

first_product = products.get(0);
product_count = products.size();
has_crm = products.contains("CRM");
```

Common documented List functions include:

- `add()`, `addAll()`, `clear()`
- `contains()`, `notContains()`
- `get()`, `indexOf()`, `lastIndexOf()`
- `remove()`, `removeElement()`, `removeAll()`
- `size()`, `isEmpty()`, `distinct()`, `intersect()`
- `sort()`, `subList()`
- `average()`, `largest()`, `smallest()`, `median()`, `nthLargest()`, `nthSmallest()`

Indexes are zero-based. Check `.size()` before calling `.get(index)`.

```deluge
if(products.size() > 0)
{
    info products.get(0);
}
```

## Key-value and Map

```deluge
contact = {"First_Name" : "Ada", "Last_Name" : "Lovelace"};
contact.put("Email", "ada@example.com");

if(contact.containKey("Email"))
{
    info contact.get("Email");
}

for each key in contact.keys()
{
    info key + ": " + contact.get(key);
}
```

Common documented Map functions include:

- `put()`, `putAll()`, `get()`, `remove()`, `clear()`
- `containKey()`, `containValue()`, `notContains()`
- `keys()`, `size()`, `isEmpty()`
- `toMap()`, `toJSONList()`

Map search methods are named `containKey()` and `containValue()`, without the second `s`.

## Collection

`Collection()` creates either an indexed value collection or a key-value collection.

```deluge
values = Collection("CRM", "Creator");
values.insert("Books");

details = Collection("Product" : "Creator", "Company" : "Zoho");
details.insert("Edition" : "Enterprise");

if(details.containsKey("Product"))
{
    info details.get("Product");
}
```

Collection methods include `insert()`, `update()`, `delete()`, `containsKey()`, `containsValue()`, `keys()`, `values()`, and `size()`. Their signatures depend on whether the collection stores values or key-value pairs.

Creator supports up to 25,000 collection elements. Other Zoho services support up to 50,000 according to the Collection data-type documentation. Treat these as platform ceilings, not batch-size targets.

## Choose the right type

- Use List for ordered values and positional access.
- Use Key-value or Map for API payloads and named values.
- Use Collection when a Deluge task specifically requires collection operations, including Creator subform row insertion.
- Use Creator fetched-record collections only for records returned by `Form[criteria]`. Count those with `.count()`, not `.size()`.

## Sources

- https://www.zoho.com/deluge/help/datatypes/list.html
- https://www.zoho.com/deluge/help/datatypes/key-value.html
- https://www.zoho.com/deluge/help/datatypes/collection.html
- https://www.zoho.com/deluge/help/functions/list.html
- https://www.zoho.com/deluge/help/functions/key-value.html
- https://www.zoho.com/deluge/help/functions/collection.html
- https://www.zoho.com/deluge/help/miscellaneous/insert-subform-row.html
