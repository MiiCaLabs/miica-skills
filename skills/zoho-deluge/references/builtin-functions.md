# Built-in function guide

Use the live built-in index for exhaustive discovery. Function availability and behavior can differ between Creator and other Zoho services.

## High-use categories

| Category | Examples |
|---|---|
| Text | `isBlank()`, `contains()`, `startsWith()`, `replaceAll()`, `getPrefix()`, `getSuffix()` |
| Number | `round()`, `ceil()`, `floor()`, `abs()`, `randomNumber()` |
| Date-time | `addDay()`, `subDay()`, `daysBetween()`, `toString()` |
| Time | `addHour()`, `addMinutes()`, `subSeconds()`, `getHour()` |
| List | `add()`, `get()`, `contains()`, `distinct()`, `size()`, `sort()` |
| Map | `containKey()`, `get()`, `put()`, `keys()`, `size()` |
| Collection | `insert()`, `update()`, `delete()`, `containsKey()`, `values()` |
| Conversion | `toDate()`, `toDecimal()`, `toLong()`, `toString()`, `toTime()`, `toList()`, `toMap()` |
| Type check | `isDate()`, `isFile()`, `isNumber()`, `isText()` |
| XML and JSON | `toXML()`, `toJSONList()`, `getJSON()` |

Always open the function page before relying on optional arguments, return types, or product availability.

## Naming traps

- Map uses `containKey()` and `containValue()`.
- Collection uses `containsKey()` and `containsValue()`.
- List and Map size uses `.size()`.
- Creator fetched-record collections use `.count()`.
- Conversion uses `toString()` or `toText()`, not a generic `json()` function.
- Documented type checks do not include generic `isBoolean()` or `isDateTime()` functions.

## Utility, encryption, and file namespaces

Utility functions are limited. Check the current category rather than guessing from another language.

```deluge
encoded_url = encodeUrl(raw_url);
json_value = json_text.getJSON("name");
```

Encryption functions use the `zoho.encryption` namespace.

```deluge
cipher_text = zoho.encryption.aesEncode(secret_key, plain_text);
plain_text = zoho.encryption.aesDecode(secret_key, cipher_text);
digest = zoho.encryption.sha256(value);
```

Use an IV where the current encryption function supports it. Store keys outside source code.

File functions and tasks vary by product and file origin. PDF conversion uses the namespace form:

```deluge
pdf_file = zoho.file.convertToPDF(content_or_url, options);
```

Check the current signature and input restrictions before applying file functions to Creator upload fields or downloaded files.

## AI tasks

AI operations are Deluge tasks, not a generic set of text-generation built-ins. Use the current AI task index. Supported tasks include Zia, sentiment analysis, language prediction, phone parsing, OCR, named-entity recognition, address parsing, translation, keyword extraction, object detection, and face detection.

## Release drift

Do not freeze a "latest functions" list in generated code or documentation. Check Deluge release notes and the exact function page when a task depends on a recent addition.

## Sources

- https://www.zoho.com/deluge/help/built-in-functions.html
- https://www.zoho.com/deluge/help/functions/list.html
- https://www.zoho.com/deluge/help/functions/key-value.html
- https://www.zoho.com/deluge/help/functions/collection.html
- https://www.zoho.com/deluge/help/functions/conversion.html
- https://www.zoho.com/deluge/help/functions/type-check.html
- https://www.zoho.com/deluge/help/functions/utilities.html
- https://www.zoho.com/deluge/help/functions/xml.html
- https://www.zoho.com/deluge/help/encryption-tasks.html
- https://www.zoho.com/deluge/help/file-methods.html
- https://www.zoho.com/deluge/help/functions/file/convert-to-pdf.html
- https://www.zoho.com/deluge/help/ai-tasks.html
- https://www.zoho.com/deluge/help/release-notes.html
