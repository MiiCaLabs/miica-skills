# Built-in Functions Reference (by data type)

Deluge groups its built-in functions by the data type they operate on. Call them with dot notation on the value (`value.functionName(args)`) - most also work as a plain function call with the value as the first argument (`functionName(value, args)`), per the official docs. This file is a **name-level catalog** extracted from `https://www.zoho.com/deluge/help/built-in-functions.html` and its 14 category pages - use it to know a function exists and roughly what it does; if you need the exact parameter list for a function you don't already know, fetch `https://www.zoho.com/deluge/help/functions/<category>/<functionname>.html` (lowercase) to confirm current signature before relying on it in generated code.

## Text functions (62)

Membership / matching: `contains`, `notContains`, `containsIgnoreCase`, `isEmpty`, `startsWith`, `startsWithIgnoreCase`, `endsWith`, `endsWithIgnoreCase`, `equalsIgnoreCase`, `matches` (regex), `find` (regex search).

Extraction: `getAlpha` (strip non-letters), `getAlphaNumeric` (strip non-alphanumerics), `getOccurenceCount`, `getPrefix`, `getPrefixIgnoreCase`, `getSuffix`, `getSuffixIgnoreCase`, `indexOf`, `lastIndexOf`, `left`, `right`, `mid`, `subText`/`substring` (`text.subText(start[, end])` - 0-based, start inclusive, end exclusive), `len`/`length`.

Transform: `toLowerCase`, `toUpperCase`, `proper` (title case), `trim`, `ltrim`, `rtrim`, `reverse`, `leftpad`, `rightpad`, `repeat`, `concat`, `text` (format a value as text), `hexToText`, `textToHex`.

Replace/remove: `remove`, `removeAllAlpha`, `removeAllAlphaNumeric`, `removeFirstOccurence`, `removeLastOccurence`, `replaceAll`, `replaceAllIgnoreCase`, `replaceFirst`, `replaceFirstIgnoreCase`.

Conversion out of text: `toList`, `toMap`, `toLong`, `toNumber`, `toString`, `toText`, `toJSONList`, `toListString`, `toDecimal`, `toTime`, `toDate`.

Other: `isAscii`.

```deluge
name = "  Zoho Deluge  ";
info name.trim().toLowerCase();          // "zoho deluge"
info name.trim().subText(0, 4);          // "Zoho"
info "Order#1234".getAlphaNumeric();     // "Order1234"
```

## Number functions (37)

Trigonometry: `sin`, `asin`, `sinh`, `asinh`, `cos`, `acos`, `cosh`, `acosh`, `tan`, `atan`, `tanh`, `atanh`, `atan2`.

Rounding / magnitude: `abs`, `ceil`, `floor`, `round`, `frac` (fractional part), `sqrt`, `power`, `exp`, `log`, `log10`.

Aggregate (called on a List of numbers): `average`, `median`, `max`, `min`, `largest`, `smallest`, `nthLargest`, `nthSmallest`.

Conversion: `toHex`, `toDecimal`, `toLong`, `toWords` (spells the number out as text; supports a language code parameter, e.g. `'pt'` for Portuguese, added March 2026).

Other: `randomNumber`, `isNumber`, `isEven`, `isOdd`.

```deluge
info (-4.7).abs();      // 4.7
info 17.round();        // 17
info 1234.toWords();    // "one thousand two hundred thirty four"
```

## Date-Time functions (52)

Add/subtract: `addDay`, `subDay`, `addWeek`, `subWeek`, `addMonth`, `subMonth`, `addYear`, `subYear`, `addHour`, `subHour`, `addMinutes`, `subMinutes`, `addSeconds`, `subSeconds`, `addBusinessDay`, `subBusinessDay`.

Get components: `getDay`, `getMonth`, `getYear`, `getHour`, `getMinutes`, `getSeconds`, `getDayOfYear`, `getWeekOfYear`, `day`, `month`, `hour`, `minute`, `second`, `weekday`.

Boundaries / ranges: `toStartOfMonth`, `toStartOfWeek`, `eomonth` (end of month), `edate`, `days360`.

Formatting / conversion: `toDate`, `toDateTime`, `toTime`, `toString`, `text` (format with a custom pattern).

Comparison: `isSameDay`, `isBefore`, `isAfter`, `isBetween`.

Other: `now`, `today`, `currencySymbol`, `diff` (days/months between dates).

```deluge
today = zoho.currentdate;
tomorrow = today.addDay(1);
info tomorrow.toString();  // formatted date string
```

## Time functions (10)

`toTime`, `getHour`, `getMinutes`, `getSeconds`, `addHour`, `addMinutes`, `addSeconds`, `toString`, `text`, `compare`.

```deluge
t = '10:30 AM';
t_later = t.addHour(2);  // '12:30 PM'
```

## List functions

Access: `.get(index)`, `.set(index, value)`.

Modification: `.add(value)`, `.addAll(list)`, `.insert(index, value)`, `.remove(index)`, `.removeAll(list)`, `.clear()`.

Query: `.size()`, `.count()`, `.contains(value)`, `.isEmpty()`, `.indexOf(value)`, `.lastIndexOf(value)`.

Aggregation: `.join(separator)`, `.min()`, `.max()`, `.average()`, `.sum()`, `.median()`.

Transform: `.reverse()`, `.sort()`, `.distinct()`.

## Map functions

Mutation: `.put(key, value)`, `.putAll(map)`, `.remove(key)`, `.clear()`.

Query: `.get(key)`, `.containsKey(key)`, `.containsValue(value)`, `.size()`, `.count()`, `.isEmpty()`.

Access: `.keys()` (returns a List), `.values()` (returns a List), `.entries()`.

## Collection functions

Collections are the supertype of List and Map. Most operations are identical to List or Map depending on whether the collection holds an ordered list or key-value pairs.

## Logical functions (type-checking)

- `isNull(<expr>)` - true if value is null.
- `isBlank(<expr>)` - true if value is empty (null, blank text, empty collection).
- `isEmpty(<expr>)` - true if collection is empty.
- `isNumber(<expr>)`, `isDecimal(<expr>)`, `isText(<expr>)`, `isDate(<expr>)`, `isDateTime(<expr>)`, `isTime(<expr>)`, `isBoolean(<expr>)`.
- `ifNull(<value>, <default>)` - returns default if value is null.
- `ifBlank(<value>, <default>)` - returns default if value is blank.

```deluge
name = ifNull(input.name, "Unknown");
```

## Conversion functions (type-casting)

- `toText(<expr>)`, `toNumber(<expr>)`, `toDecimal(<expr>)`, `toLong(<expr>)`, `toBoolean(<expr>)`.
- `toDate(<text>)`, `toDateTime(<text>)`, `toTime(<text>)` - parse text into date/time types.
- `toList(<expr>)`, `toMap(<expr>)`, `toJSONList(<text>)`.

```deluge
age = toNumber("25");  // converts string "25" to number 25
```

## Utilities

- `encodeUrl(<text>)` - URL-encode a string.
- `decodeUrl(<text>)` - URL-decode a string.
- `getJSON(<text>, <path>)` - extract a value from JSON using a dot-notation path (faster than `.toMap()` for large JSON).
- `json(<map>)` - convert a Map to JSON string.

## XML functions

- `toXml(<map>)` - convert a Map to XML.
- `toXmlList(<xml>)` - parse XML into a list of maps.
- `executeXpath(<xml>, <xpath>)` - extract values from XML using XPath.

## Encryption / Hashing functions

- **Base64**: `base64Encode(<text> [, character_set])`, `base64Decode(<text>)` - character_set can be UTF-8, UTF-16LE, UTF-16BE (added May 2026).
- **Base32**: `base32Encode(<text>)`, `base32Decode(<text>)` (added May 2026).
- **AES**: `aesEncrypt(<plaintext>, <key>, <mode>)`, `aesDecrypt(<ciphertext>, <key>, <mode>)`.
- **HMAC**: `hmacSHA256(<plaintext>, <key>)`, `hmacSHA512(<plaintext>, <key>)`.
- **Hashes**: `md5(<text>)`, `sha1(<text>)`, `sha256(<text>)`, `sha512(<text>)`.
- **URL/HTML**: `urlEncode(<text>)`, `urlDecode(<text>)`, `htmlEncode(<text>)`, `htmlDecode(<text>)`.

```deluge
hashed = "password".md5();
encoded = "hello world".base64Encode();
```

## File functions

Available on File objects (returned by `invokeUrl`, file-upload fields, or `toFile()`):

- `.getFileContent()` - returns file as text or bytes.
- `.getFileName()` - returns file name.
- `.getFileSize()` - returns file size in bytes.
- `.convertToPDF([options])` - convert to PDF (added April 2026: 20+ optional layout parameters for scale, orientation, margins, etc.).

Note: File type constraints - File objects from `invokeUrl` work with these functions; Files from Creator "fetch records" or `input` keyword do not have File-type functions available.

## Recent function additions (May 2026 – January 2026)

- `base32Encode` / `base32Decode` - Base32 encoding (May 2026).
- `base64Encode` / `base64Decode` - Added `character_set` parameter: UTF-8, UTF-16LE, UTF-16BE (May 2026).
- `convertToPDF` - Added 20+ optional layout parameters: scale, orientation, margins, etc. (April 2026).
- `toWords()` - Added Portuguese (`'pt'`) language support (March 2026).
- `Translate` task - Expanded to 74 total supported languages (January 2026).
