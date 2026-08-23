# Collections: List & Map

## List (ordered collection)

A `List` is an ordered collection of elements. Elements can be of mixed types.

### Creating a List

```deluge
// Literal syntax
fruits = {"apple", "banana", "orange"};

// Constructor syntax
items = List();
items.add("apple");
items.add("banana");

// With initial values
numbers = List(1, 2, 3, 4, 5);
```

### Common List methods

| Method | Returns | Example |
|---|---|---|
| `.add(<value>)` | void | `myList.add("new")` |
| `.addAll(<list>)` | void | `list1.addAll(list2)` |
| `.insert(<index>, <value>)` | void | `myList.insert(1, "x")` - inserts at position 1, shifts later elements |
| `.remove(<index>)` | void | `myList.remove(0)` - removes first element |
| `.removeAll(<list>)` | void | `myList.removeAll(otherList)` - removes all occurrences |
| `.size()` / `.count()` | Number | `myList.size()` - returns element count |
| `.get(<index>)` | value | `myList.get(0)` - retrieves element at index (0-based) |
| `.set(<index>, <value>)` | void | `myList.set(0, "new")` - replaces element at index |
| `.clear()` | void | `myList.clear()` - removes all elements |
| `.contains(<value>)` | Boolean | `myList.contains("apple")` |
| `.isEmpty()` | Boolean | `myList.isEmpty()` |
| `.join(<separator>)` | Text | `myList.join(", ")` - joins all elements into a string |

### Example: List iteration and filtering

```deluge
numbers = {1, 2, 3, 4, 5};
evens = List();
for each num in numbers
{
    if(num % 2 == 0)
    {
        evens.add(num);
    }
}
info evens;  // {2, 4}
```

### Nested lists

```deluge
matrix = {{1, 2}, {3, 4}};
info matrix.get(0).get(1);  // 2
```

## Map (key-value collection)

A `Map` is an unordered collection of key-value pairs. Keys are typically text, values can be any type.

### Creating a Map

```deluge
// Literal syntax
config = {"host": "example.com", "port": "8080", "ssl": true};

// Constructor syntax
settings = Map();
settings.put("key1", "value1");
settings.put("key2", "value2");

// Constructor with initial pairs
props = Map("name", "John", "age", 25);
```

### Common Map methods

| Method | Returns | Example |
|---|---|---|
| `.put(<key>, <value>)` | void | `myMap.put("x", 10)` |
| `.putAll(<map>)` | void | `map1.putAll(map2)` |
| `.get(<key>)` | value | `myMap.get("x")` - retrieves value for key |
| `.remove(<key>)` | void | `myMap.remove("x")` |
| `.clear()` | void | `myMap.clear()` |
| `.containsKey(<key>)` | Boolean | `myMap.containsKey("x")` |
| `.containsValue(<value>)` | Boolean | `myMap.containsValue("John")` |
| `.keys()` | List | `myMap.keys()` - returns all keys as a List |
| `.values()` | List | `myMap.values()` - returns all values as a List |
| `.size()` / `.count()` | Number | `myMap.size()` |
| `.isEmpty()` | Boolean | `myMap.isEmpty()` |

### Example: Map iteration

```deluge
user = {"name": "Alice", "email": "alice@example.com", "age": 28};
for each key, value in user
{
    info key + " = " + value;
}
```

Output:
```
name = Alice
email = alice@example.com
age = 28
```

### Nested Maps

```deluge
data = {
    "user1": {"name": "Alice", "role": "admin"},
    "user2": {"name": "Bob", "role": "user"}
};
info data.get("user1").get("name");  // "Alice"
```

## Collection (generic List/Map supertype)

`Collection` is the base type that encompasses both List and Map. In most code, you use List or Map directly. The `Collection()` constructor is rarely needed; when it appears, it typically creates a List:

```deluge
c = Collection("a", "b", "c");  // acts like a List
for each item in c
{
    info item;  // prints "a", "b", "c"
}
```

## Null-safety on collections

Always guard against null or empty collections before iterating or accessing:

```deluge
if(!isNull(items) && items.count() > 0)
{
    first = items.get(0);
}
```

## Converting between List and Map

### List → text (join)

```deluge
list = {"a", "b", "c"};
text = list.join(", ");  // "a, b, c"
```

### Text → List (split)

```deluge
text = "a, b, c";
list = text.split(",");  // {"a", " b", " c"} - note spaces
trimmed_list = list.map(item -> item.trim());  // if map() is available
```

### Map → List of keys or values

```deluge
config = {"host": "example.com", "port": "8080"};
keys = config.keys();      // {"host", "port"}
values = config.values();  // {"example.com", "8080"}
```

## Performance notes

- **Indexed access** (`.get(index)`) on a List is O(1); on a Map is O(1) if the key is a string.
- **Linear search** (`.contains()`, `.indexOf()`) is O(n) - avoid in tight loops over large collections.
- **Iteration** over a List or Map is O(n), but acceptable for most scripts (unless the collection is millions of elements, which is unlikely in Deluge).
