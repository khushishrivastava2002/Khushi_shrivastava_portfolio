# Python Interview Questions & Answers (Hinglish)

Ye file Core Python ke top 100 interview questions cover karti hai — basics se lekar advanced concurrency aur project-based scenarios tak, taaki interview ke pehle ek hi jagah revision ho jaye.

## 1. Python Basics (Data Types, Mutability, Variables, Memory Management)

### Q1. Python interpreted language hai ya compiled?
Python dono hi bola ja sakta hai — pehle source code `.py` se bytecode (`.pyc`) mein compile hota hai, phir vo bytecode Python Virtual Machine (PVM) par interpret hota hai. Isliye ise "interpreted" bola jata hai but internally compilation step bhi hota hai. Ye hi wajah hai ki Python C/C++ jaisi languages se slow hoti hai kyunki final machine code nahi banta, bytecode interpret hota hai.

### Q2. Python mein data types kitne type ke hote hain?
Mainly numeric (`int`, `float`, `complex`), sequence (`str`, `list`, `tuple`, `range`), mapping (`dict`), set types (`set`, `frozenset`), boolean (`bool`) aur `NoneType`. Har type object hota hai — Python mein "everything is an object", chahe wo int ho ya function.

### Q3. Mutable aur immutable data types mein kya difference hai?
Mutable objects ka content change ho sakta hai without changing their identity/memory address — jaise `list`, `dict`, `set`. Immutable objects ek baar create hone ke baad change nahi hote — jaise `int`, `str`, `tuple`, `float`. Agar tuple ke andar list hai to tuple immutable rahega but uski andar wali list mutable rahegi.
```python
t = (1, [2, 3])
t[1].append(4)   # ye chalega, list mutable hai
# t[0] = 5       # ye TypeError dega
```

### Q4. `is` aur `==` mein kya difference hai?
`==` value equality check karta hai (do objects ki value same hai ya nahi), jabki `is` identity check karta hai (dono same memory location point kar rahe hain ya nahi). Interview mein classic trap `a = [1,2]; b = [1,2]; a == b` True hai but `a is b` False hai.

### Q5. Python mein variable declare karte waqt data type kyun nahi likhte?
Python dynamically typed language hai — variable ka type runtime par uske assigned value se decide hota hai, compile time par fix nahi karna padta. Same variable ko ek line mein int, next line mein string bhi assign kar sakte ho. Internally variable ek object ko reference karta hai, us object ka type hota hai, variable ka nahi.

### Q6. Python mein memory management kaise hota hai?
Python ka apna private heap hota hai jisme saare objects aur data structures store hote hain. Memory allocation Python memory manager handle karta hai, aur cleanup ke liye reference counting + generational garbage collector use hota hai. Developer ko manually malloc/free nahi karna padta jaise C mein.

### Q7. Reference counting kya hai aur garbage collection kaise trigger hota hai?
Har object ka ek internal counter hota hai jo track karta hai ki kitni references us object ko point kar rahi hain. Jab count 0 ho jata hai, memory turant free ho jaati hai. Lekin circular references (jaise do objects ek dusre ko reference karein) ko reference counting handle nahi kar pata, isliye Python ka `gc` module generational garbage collector se cyclic garbage ko periodically clean karta hai.

### Q8. `id()` function kya karta hai?
`id()` object ka unique identifier return karta hai jo CPython mein usually uska memory address hota hai. Iska use `is` comparison ke internal working samajhne ke liye hota hai — agar do variables ka `id()` same hai to wo same object point kar rahe hain.

### Q9. Small integer caching / string interning kya hota hai?
CPython performance ke liye -5 se 256 tak ke integers aur kuch simple strings ko cache/intern kar leta hai, taaki baar baar naya object na banana pade. Isliye `a = 100; b = 100; a is b` True aata hai but `a = 1000; b = 1000; a is b` implementation-dependent False bhi aa sakta hai.

### Q10. Python mein pass by value hai ya pass by reference?
Actually Python "pass by object reference" follow karta hai. Function ko object ka reference milta hai — agar object mutable hai (list, dict) aur function usme modify kare (append, update) to changes caller ko dikhenge. Lekin agar function reference ko naye object se reassign kare (`x = x + [1]`), to original object unaffected rehta hai.

### Q11. Python mein comments aur docstrings mein kya difference hai?
Comments (`#`) sirf readability ke liye hote hain, runtime par completely ignore ho jaate hain. Docstrings (`"""..."""`) function/class/module ke first statement ke roop mein likhe jate hain aur `__doc__` attribute mein store hote hain — `help()` function inhe use karta hai documentation dikhane ke liye.

### Q12. Python mein type conversion (casting) kaise hoti hai?
Implicit conversion Python khud handle karta hai jaise `int + float = float`. Explicit conversion ke liye `int()`, `float()`, `str()`, `list()` jaise built-in functions use karte hain. Example: `int("10")` string ko int mein convert karega, but `int("10.5")` error dega — pehle `float()` phir `int()` karna padega.

### Q13. Global aur local variable scope kaise kaam karta hai (LEGB rule)?
Python variable resolve karte waqt LEGB order follow karta hai — Local, Enclosing, Global, Built-in. Function ke andar naya variable by default local hota hai; global variable modify karne ke liye `global` keyword aur nested function mein enclosing variable modify karne ke liye `nonlocal` keyword use karna padta hai.
```python
count = 0
def increment():
    global count
    count += 1
```

### Q14. `None` kya hai aur ise kab use karte hain?
`None` Python ka special singleton object hai jo "no value" represent karta hai, ye `NoneType` ka instance hai. Default function return value, default argument, ya kisi variable ko initialize karne ke liye use hota hai jab abhi meaningful value assign nahi karni. Comparison hamesha `is None` se karo, `== None` se nahi, kyunki `is` identity check fast aur reliable hai.

### Q15. Python mein `*` aur `**` operators ka basic use kya hai (multiplication ke alawa)?
`*` aur `**` unpacking ke liye bhi use hote hain — function call mein iterable/dict unpack karna, aur function definition mein variable number of positional/keyword arguments lena. Detail decorators/functions section mein aayega, lekin basic level par `*args` sequence collect karta hai aur `**kwargs` dictionary collect karta hai.

## 2. Data Structures (List, Tuple, Dict, Set, Comprehensions)

### Q16. List aur Tuple mein kya difference hai?
List mutable hai, tuple immutable. Tuple list se thoda fast hota hai kyunki fixed size hone ki wajah se memory allocation simple hota hai. Tuple ko dictionary key ya set element bana sakte hain (kyunki hashable hai), list nahi ban sakti. Real projects mein fixed record (jaise coordinates, DB row) ke liye tuple aur growing collection ke liye list use karte hain.

### Q17. Dictionary kaise kaam karti hai internally?
Dictionary hash table pe based hai — har key ka hash compute hota hai jo decide karta hai key-value pair kahan store hoga. Isi wajah se average case mein lookup, insert, delete O(1) time complexity mein hote hain. Python 3.7+ mein dictionaries insertion order bhi maintain karti hain.

### Q18. Set ka use case kya hai aur ye list se kaise different hai?
Set unordered collection hai jisme duplicate values allowed nahi hain, aur ye bhi hash table based hai isliye membership check (`in`) list se bahut fast hota hai (O(1) vs O(n)). Duplicates remove karne, ya do collections ke common/unique elements nikaalne (union, intersection, difference) ke liye set best hai.

### Q19. List comprehension kya hai, iska syntax aur advantage?
List comprehension ek concise way hai list banane ka single line mein, loop + condition ke saath. Ye normal for-loop se readable aur usually thoda fast hota hai kyunki internally optimized C-level loop chalta hai.
```python
squares = [x*x for x in range(10) if x % 2 == 0]
```

### Q20. Dictionary comprehension aur set comprehension ka example do.
```python
d = {x: x*x for x in range(5)}          # dict comprehension
s = {x % 3 for x in range(10)}          # set comprehension
```
Ye dono list comprehension jaisi hi syntax follow karte hain, bas brackets `{}` hote hain aur dict mein key:value pair likhna padta hai.

### Q21. Shallow copy aur deep copy mein kya difference hai?
Shallow copy (`copy.copy()` ya `list.copy()`) top-level object ka naya container banata hai but nested objects ka reference same rehta hai — inner mutable object modify karne par dono copies affect hoti hain. Deep copy (`copy.deepcopy()`) recursively har nested object ka bhi naya copy banata hai, poori tarah independent.

### Q22. `list.append()` aur `list.extend()` mein farak?
`append()` single element ko list ke end mein add karta hai (chahe wo khud ek list ho to bhi as-a-whole add hoga). `extend()` iterable leta hai aur uske elements ko individually list mein add karta hai.
```python
a = [1,2]; a.append([3,4])   # [1, 2, [3, 4]]
b = [1,2]; b.extend([3,4])   # [1, 2, 3, 4]
```

### Q23. Tuple immutable hone ke bawajood kab use hoti hai?
Tuple tab use karo jab data change nahi hona chahiye — jaise function se multiple values return karna, dictionary keys banana, ya fixed configuration values store karna. Immutability ki wajah se tuple thread-safe bhi hoti hai aur accidental modification se bachati hai.

### Q24. `frozenset` kya hota hai?
`frozenset` set ka immutable version hai — ek baar bane ke baad add/remove nahi kar sakte. Iska use tab hota hai jab set ko dictionary key ya kisi aur set ke element ke roop mein use karna ho, kyunki normal set unhashable hota hai.

### Q25. List slicing kaise kaam karti hai?
Slicing syntax `list[start:stop:step]` hai — negative indices aur negative step bhi support karta hai. Slicing hamesha naya list object return karti hai (shallow copy), original list modify nahi hoti jab tak assignment na kiya jaye.
```python
a = [1,2,3,4,5]
a[::-1]     # [5,4,3,2,1] - reverse
a[1:4]      # [2,3,4]
```

### Q26. `dict.get()` aur direct key access (`dict[key]`) mein farak?
`dict[key]` agar key exist nahi karti to `KeyError` raise karta hai. `dict.get(key, default)` agar key nahi milti to error ke bajaye default value (ya None) return karta hai, jisse code crash nahi hota. Production code mein `get()` safer choice hoti hai jab key ka existence guaranteed na ho.

### Q27. Named tuple kya hota hai aur kyun use karte hain?
`collections.namedtuple` (ya `typing.NamedTuple`) tuple ki tarah hi immutable aur lightweight hota hai but fields ko name se access karne deta hai, jisse code readable banta hai — index ke bajaye `point.x` likh sakte ho.
```python
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)
print(p.x, p.y)
```

## 3. OOP Concepts (Classes, Inheritance, Polymorphism, Encapsulation, Abstraction, Dunder Methods)

### Q28. Python mein class aur object kaise define karte hain?
`class` keyword se class define hoti hai, aur uska instance banane ke liye class ko call karte hain jaise function. Constructor `__init__` method mein initial attributes set hote hain jo har instance ke liye automatically call hota hai jab object create hota hai.
```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary
```

### Q29. `self` kya hai aur ye zaruri kyun hai?
`self` current instance ka reference hota hai jo instance methods ka first parameter hota hai — isse har object apne khud ke attributes access kar pata hai. Ye Python explicitly pass karta hai (auto nahi hota jaise Java ke `this` mein), isliye method define karte waqt likhna padta hai, lekin call karte waqt nahi.

### Q30. Encapsulation Python mein kaise achieve karte hain?
Python mein strict private/public nahi hota jaise Java mein, but convention follow karte hain — single underscore `_var` protected (internal use) suggest karta hai, double underscore `__var` name mangling trigger karta hai jo class ke bahar se direct access mushkil banata hai. Encapsulation ka matlab hai data ko getter/setter ya `@property` ke through control karna.

### Q31. Inheritance kya hai aur multiple inheritance kaise handle hoti hai?
Inheritance se ek class (child) doosri class (parent) ke attributes/methods reuse kar sakti hai. Python multiple inheritance support karta hai — ek class multiple parents se inherit kar sakti hai. Conflict resolve karne ke liye Python MRO (Method Resolution Order) use karta hai jo C3 linearization algorithm follow karta hai.
```python
class A: pass
class B: pass
class C(A, B): pass
print(C.__mro__)
```

### Q32. MRO (Method Resolution Order) kya hota hai?
MRO decide karta hai ki multiple inheritance mein method/attribute kaunse order mein search hoga. Python `C3 linearization` algorithm use karta hai jo depth-first but consistent order maintain karta hai. `ClassName.__mro__` ya `ClassName.mro()` se dekh sakte ho.

### Q33. Polymorphism ka Python mein example do.
Polymorphism ka matlab hai ek hi interface, different implementations. Python mein duck typing ki wajah se ye naturally aata hai — agar do classes mein same method name ho (jaise `speak()`), to unhe ek hi loop mein bina type check kiye call kar sakte ho.
```python
class Dog:
    def speak(self): return "Woof"
class Cat:
    def speak(self): return "Meow"
for animal in [Dog(), Cat()]:
    print(animal.speak())
```

### Q34. Abstraction Python mein kaise implement karte hain?
`abc` module ke `ABC` class aur `@abstractmethod` decorator se abstract base class banate hain. Abstract class ka direct instance nahi ban sakta — child class ko compulsory sabhi abstract methods override karne padte hain, warna `TypeError` aayega.
```python
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self): pass
```

### Q35. Dunder (magic) methods kya hote hain, kuch common examples do.
Dunder methods (double underscore, jaise `__init__`, `__str__`, `__len__`, `__eq__`) Python ke built-in operators aur functions ko customize karne dete hain jab custom object par apply hote hain. Isse operator overloading possible hoti hai.
```python
class Vector:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, other): return Vector(self.x+other.x, self.y+other.y)
    def __repr__(self): return f"Vector({self.x}, {self.y})"
```

### Q36. `__str__` aur `__repr__` mein kya difference hai?
`__str__` readable/user-friendly string return karta hai jo `print()` ya `str()` call karne par use hota hai. `__repr__` developer-focused unambiguous representation deta hai jo ideally eval karke wapas object ban sake, aur ye debugging/console mein default fallback hota hai jab `__str__` define na ho.

### Q37. Class method, static method aur instance method mein farak?
Instance method (`self` first param) object ke data ke saath kaam karta hai. `@classmethod` (`cls` first param) class-level data ke saath kaam karta hai aur alternate constructors banane mein use hota hai. `@staticmethod` na `self` na `cls` leta hai — bas ek utility function hai jo logically class ke andar rakha gaya hai.
```python
class MyClass:
    count = 0
    @classmethod
    def increment_count(cls): cls.count += 1
    @staticmethod
    def add(a, b): return a + b
```

### Q38. `super()` ka use kya hai?
`super()` parent class ke methods ko call karne ke liye use hota hai, especially `__init__` mein taaki parent ka initialization logic reuse ho aur repeat na karna pade. Multiple inheritance mein `super()` MRO follow karke sahi next class ka method call karta hai.
```python
class Animal:
    def __init__(self, name): self.name = name
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed
```

### Q39. Operator overloading kya hai?
Operator overloading matlab custom classes mein built-in operators (`+`, `-`, `==`, `<`) ka apna behavior define karna dunder methods ke through — jaise `__add__` for `+`, `__eq__` for `==`. Isse custom objects built-in types jaisa natural behave karte hain.

### Q40. Composition aur inheritance mein kab kya use karna chahiye?
Inheritance "is-a" relationship ke liye use hota hai (Dog is an Animal), composition "has-a" relationship ke liye (Car has an Engine — Car apne andar Engine object rakhta hai instead of inheriting). Generally composition ko prefer kiya jata hai kyunki ye flexible hota hai aur tight coupling avoid karta hai ("favor composition over inheritance").

### Q41. `__slots__` OOP context mein kyun use karte hain?
Normally har instance ka apna `__dict__` hota hai attributes store karne ke liye jo extra memory leta hai. `__slots__` define karke fixed attributes ki list dete hain, jisse `__dict__` create nahi hota, memory kam lagti hai aur attribute access thoda fast ho jata hai — bahut saare objects banane wale scenarios (jaise ML data records) mein useful hai.
```python
class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y): self.x, self.y = x, y
```

### Q42. Class variable aur instance variable mein kya difference hai?
Class variable saari instances ke beech shared hota hai (class body mein directly define hota hai), instance variable har object ka apna alag hota hai (usually `__init__` mein `self.` se set hota hai). Agar class variable ko mutable object banaya (jaise list) aur ek instance usse modify kare bina naya assign kiye, to sab instances par effect padega — ye common bug source hai.

## 4. Functions (Args/Kwargs, Decorators, Lambda, Closures, Generators, Iterators)

### Q43. `*args` aur `**kwargs` kya hote hain?
`*args` variable number ke positional arguments ko tuple mein collect karta hai, `**kwargs` variable number ke keyword arguments ko dictionary mein collect karta hai. Ye tab use karte hain jab pehle se pata na ho function ko kitne arguments milenge — jaise flexible API wrappers likhte waqt.
```python
def demo(*args, **kwargs):
    print(args, kwargs)
demo(1, 2, name="Khushi")   # (1, 2) {'name': 'Khushi'}
```

### Q44. Default arguments mein mutable default value ka danger kya hai?
Default argument sirf ek baar function definition ke time evaluate hota hai, baar baar call hone par nahi. Agar default value mutable object (list/dict) di, to har call jo default use karti hai wahi shared object modify karti rehti hai — ye ek famous Python gotcha hai.
```python
def add_item(item, items=[]):   # galat pattern
    items.append(item)
    return items
# sahi tareeka:
def add_item(item, items=None):
    if items is None: items = []
    items.append(item)
    return items
```

### Q45. Lambda function kya hai aur normal function se kab better hai?
Lambda ek anonymous, single-expression function hai jo `def` ke bina inline define hota hai. Chhote, one-off functions ke liye use karte hain — jaise `sorted()`, `map()`, `filter()` ke andar key/condition dene ke liye. Complex logic ke liye normal `def` function better hai kyunki lambda multi-statement support nahi karta.
```python
nums = [5, 2, 8, 1]
sorted_nums = sorted(nums, key=lambda x: -x)
```

### Q46. Decorator kya hai aur ye kaise kaam karta hai?
Decorator ek function hai jo doosre function ko input leta hai aur uska modified/wrapped version return karta hai, bina original function ka code change kiye. Cross-cutting concerns jaise logging, authentication, timing, caching ke liye bahut use hota hai.
```python
def logger(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logger
def greet(name):
    return f"Hello {name}"
```

### Q47. Closures kya hote hain?
Closure ek nested function hota hai jo apne enclosing (outer) function ke variables ko "remember" kar leta hai, chahe outer function ka execution khatam ho jaaye. Ye decorators aur function factories banane ka base hai.
```python
def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply
double = make_multiplier(2)
print(double(5))   # 10
```

### Q48. Generator kya hai aur ye normal function se kaise different hai?
Generator function `yield` keyword use karta hai return ke bajaye, jisse function ek iterator return karta hai jo values ko lazily (on-demand, ek-ek karke) produce karta hai — poori list memory mein ek saath nahi banti. Ye large datasets process karte waqt memory-efficient hota hai.
```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```

### Q49. Iterator aur Iterable mein kya difference hai?
Iterable wo object hai jiske upar loop chala sakte hain (jisme `__iter__` method ho), jaise list, tuple, string. Iterator wo object hai jo `__iter__` aur `__next__` dono implement kare aur state maintain kare ki agla element kaunsa dena hai. Har iterator iterable hota hai but har iterable iterator nahi hota — list iterable hai but iterator nahi (uska `iter()` call karke iterator banta hai).

### Q50. Custom iterator kaise banate hain?
`__iter__` aur `__next__` dunder methods implement karke apni class ka custom iterator bana sakte hain. `__next__` mein jab elements khatam ho jaayein to `StopIteration` raise karna padta hai.
```python
class Counter:
    def __init__(self, limit): self.limit, self.n = limit, 0
    def __iter__(self): return self
    def __next__(self):
        if self.n >= self.limit: raise StopIteration
        self.n += 1
        return self.n
```

### Q51. `map()`, `filter()`, `reduce()` ka use kya hai?
`map(func, iterable)` har element par function apply karke naya iterator deta hai. `filter(func, iterable)` sirf wo elements rakhta hai jinke liye func True return kare. `reduce(func, iterable)` (`functools` se) saare elements ko ek single value mein cumulatively combine karta hai — jaise sum ya product.
```python
from functools import reduce
nums = [1,2,3,4]
print(list(map(lambda x: x*2, nums)))     # [2,4,6,8]
print(list(filter(lambda x: x%2==0, nums)))  # [2,4]
print(reduce(lambda a,b: a+b, nums))      # 10
```

### Q52. Function ke return type hint kaise likhte hain aur ye kyun useful hai?
Python type hints (`def greet(name: str) -> str:`) runtime par enforce nahi hote, lekin IDE autocomplete, static analysis tools (mypy) aur readability ke liye bahut helpful hote hain, especially FastAPI jaise frameworks mein jahan Pydantic type hints se hi request/response validate karta hai.

### Q53. Recursion kya hai aur Python mein recursion limit kya hoti hai?
Recursion matlab function khud ko call kare kisi problem ko chhote sub-problems mein todne ke liye (base case + recursive case). Python default recursion limit ~1000 hoti hai (`sys.getrecursionlimit()`), jo `sys.setrecursionlimit()` se badhayi ja sakti hai, lekin bahut deep recursion mein `RecursionError` ka risk rehta hai — usually iterative solution ya tail-call jaisa optimization better hota hai (Python tail-call optimization nahi karta).

### Q54. Generator expression aur list comprehension mein kya farak hai?
Syntax same hai bas brackets different — list comprehension `[]` use karta hai aur poori list memory mein bana deta hai turant. Generator expression `()` use karta hai aur values lazily generate karta hai on-demand, memory-efficient hota hai bade datasets ke liye.
```python
list_comp = [x*x for x in range(1000000)]     # sab memory mein
gen_expr = (x*x for x in range(1000000))      # lazy, ek ek karke
```

### Q55. `yield` aur `yield from` mein kya difference hai?
`yield` ek value generator se produce karta hai aur execution pause karta hai. `yield from` ek nested generator/iterable ko delegate karta hai — sub-generator ke saare values automatically yield ho jaate hain bina manual loop likhe, aur ye sub-generator ka return value bhi propagate kar sakta hai.
```python
def inner():
    yield 1
    yield 2
def outer():
    yield from inner()
    yield 3
```

### Q56. Function argument passing order (positional, default, `*args`, keyword-only, `**kwargs`) kya hai?
Order hai: positional/default arguments, phir `*args`, phir keyword-only arguments (jo `*` ke baad likhe jaate hain), aur last mein `**kwargs`. Ye order follow na karne par `SyntaxError` aata hai.
```python
def func(a, b=2, *args, c, **kwargs):
    pass
```

### Q57. Decorator mein arguments kaise pass karte hain?
Jab decorator ko khud arguments chahiye hote hain, to ek extra outer function layer add karni padti hai — decorator factory pattern. Iska common real-world example hota hai retry decorator jisme retry count parameter diya jata hai.
```python
def retry(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception:
                    continue
        return wrapper
    return decorator

@retry(times=3)
def flaky_call():
    ...
```

## 5. Exception Handling & File Handling

### Q58. Try-except-else-finally block kaise kaam karta hai?
`try` block mein risky code likhte hain, `except` mein specific exception handle karte hain, `else` sirf tab chalta hai jab try block mein koi exception na aaya ho, aur `finally` hamesha chalta hai chahe exception aaya ho ya nahi — cleanup (jaise file close, connection close) ke liye best jagah hai.
```python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print("Success:", result)
finally:
    print("Done")
```

### Q59. Custom exception kaise banate hain?
Python ke built-in `Exception` class ko inherit karke apna custom exception class bana sakte hain, jisse domain-specific errors clearly identify ho paate hain (jaise `InsufficientBalanceError`, `InvalidOTPError`).
```python
class InsufficientBalanceError(Exception):
    def __init__(self, message="Balance not sufficient"):
        super().__init__(message)

raise InsufficientBalanceError()
```

### Q60. Multiple exceptions ko ek saath kaise handle karte hain?
Ek `except` block mein tuple use karke multiple exception types ek saath catch kar sakte hain, ya multiple `except` blocks alag alag handling ke liye likh sakte hain. Order matter karta hai — specific exceptions pehle likhne chahiye, generic `Exception` sabse last mein.
```python
try:
    ...
except (ValueError, TypeError) as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected: {e}")
```

### Q61. `raise` aur `raise from` mein kya farak hai?
`raise` naya exception throw karta hai. `raise NewError() from original_error` exception chaining karta hai jisse pata chalta hai ki current exception kisi doosre exception ki wajah se aaya — debugging mein original root cause dikhta rehta hai traceback mein.

### Q62. File open karne ke different modes kya hain?
`'r'` read, `'w'` write (overwrite), `'a'` append, `'x'` exclusive create (agar file exist karti hai to error), aur `'b'` binary mode ke saath combine hote hain (`'rb'`, `'wb'`). Text mode default hota hai jisme encoding automatically handle hoti hai.

### Q63. File handling ke liye `with` statement kyun use karte hain?
`with open(...) as f:` context manager use karta hai jo guarantee karta hai file automatically close ho jaayegi, chahe block ke andar exception hi kyun na aa jaaye. Manually `f.close()` call karna bhool sakte ho ya exception ki wajah se skip ho sakta hai, isliye `with` safer aur idiomatic tareeka hai.
```python
with open("data.txt", "r") as f:
    content = f.read()
```

### Q64. Exception handling mein bare `except:` use karna kyun bura practice hai?
Bare `except:` (bina exception type specify kiye) har type ka exception catch kar leta hai, including `KeyboardInterrupt` aur `SystemExit` jaise system-level signals bhi, jisse program silently unexpected behave karta hai aur real bug hide ho jata hai. Hamesha specific exception catch karo, ya kam se kam `except Exception:` use karo.

### Q65. `try` ke andar `return` ho aur `finally` mein bhi `return` ho to kya hoga?
`finally` block ka `return` hamesha win karta hai — chahe `try` ya `except` mein return, break, ya exception kuch bhi ho raha ho, `finally` ka return statement usse override kar dega. Isliye `finally` mein `return` likhna generally bad practice mana jata hai kyunki ye confusing control flow banata hai.

## 6. Modules, Packages, Virtual Environments, Pip

### Q66. Module aur Package mein kya difference hai?
Module ek single `.py` file hoti hai jisme functions/classes/variables defined hote hain. Package ek directory hoti hai jisme multiple modules ho aur ek `__init__.py` file ho (Python 3.3+ mein namespace packages ke liye ye optional bhi ho sakti hai) jo us directory ko importable package banati hai.

### Q67. Virtual environment kyun zaruri hai aur kaise banate hain?
Virtual environment har project ke liye isolated Python environment deta hai, jisse ek project ki dependencies doosre project ya system-wide Python packages se conflict nahi karti. Bina isके, agar do projects ko ek hi library ke different versions chahiye ho to dikkat aati hai.
```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
```

### Q68. `pip freeze` aur `requirements.txt` ka use kya hai?
`pip freeze > requirements.txt` current environment mein installed saari packages aur unke exact versions ek file mein save kar deta hai. Ye file team members ya deployment servers ke saath share karke `pip install -r requirements.txt` se same environment reproduce kar sakte hain — reproducibility ke liye zaruri hai.

### Q69. `import module`, `from module import x`, aur `import module as alias` mein farak?
`import module` poora module namespace laata hai, access karne ke liye `module.function()` likhna padta hai. `from module import x` sirf specific function/class directly namespace mein la deta hai. `as alias` naam short/conflict-free banane ke liye use hota hai (jaise `import numpy as np`).

### Q70. `if __name__ == "__main__":` kyun likha jata hai?
Ye check karta hai ki file directly run ho rahi hai ya kisi doosri file se import ki gayi hai. Agar directly run ho rahi hai to `__name__` ki value `"__main__"` hoti hai. Isse module ke andar test/demo code ya script logic likh sakte ho jo tab hi chale jab file directly execute ho, import hone par nahi.

### Q71. Relative import aur absolute import mein kya farak hai?
Absolute import poora path module se start karta hai (`from myproject.utils import helper`), jo clear aur unambiguous hota hai. Relative import current package ke relative se hota hai dots use karke (`from .utils import helper`, `from ..models import User`) — sirf packages ke andar kaam karta hai, standalone scripts mein nahi.

## 7. Multithreading, Multiprocessing, GIL, Async/Await, Asyncio

### Q72. GIL (Global Interpreter Lock) kya hai?
GIL ek mutex hai jo CPython interpreter mein ek waqt sirf ek thread ko Python bytecode execute karne deta hai, chahe machine mein multiple CPU cores hi kyun na hon. Iska matlab hai CPU-bound tasks mein Python threads true parallelism nahi de paate, lekin I/O-bound tasks (file read, network call) mein GIL waiting time ke dauraan release ho jata hai isliye threading fayda deta hai.

### Q73. Multithreading kab use karni chahiye aur multiprocessing kab?
I/O-bound tasks (API calls, DB queries, file I/O jahan program wait karta hai) ke liye multithreading achhi hoti hai kyunki GIL waiting ke time release ho jata hai. CPU-bound tasks (heavy computation, image processing, ML model inference) ke liye multiprocessing better hai kyunki har process apna alag Python interpreter aur memory space leta hai, GIL ka restriction nahi lagta, aur real parallel execution multiple cores par hoti hai.

### Q74. Python mein thread kaise create karte hain?
`threading` module ka `Thread` class use hota hai. Thread create karke `.start()` se run karte hain aur `.join()` se main thread ko wait karwate hain jab tak thread complete na ho jaaye.
```python
import threading
def task():
    print("running in thread")

t = threading.Thread(target=task)
t.start()
t.join()
```

### Q75. Multiprocessing kaise implement karte hain?
`multiprocessing` module ka `Process` class use karke separate processes spawn karte hain, jisme har process ki apni memory hoti hai (isliye data share karne ke liye `Queue`, `Pipe`, ya `Manager` use karna padta hai).
```python
from multiprocessing import Process

def worker(n):
    print(n * n)

if __name__ == "__main__":
    p = Process(target=worker, args=(5,))
    p.start()
    p.join()
```

### Q76. Race condition kya hai aur ise Python mein kaise avoid karte hain?
Race condition tab hoti hai jab multiple threads ek shared resource (variable, file) ko simultaneously modify karne ki koshish karte hain aur final result timing par depend kar jata hai — unpredictable/incorrect behavior aata hai. Isse avoid karne ke liye `threading.Lock()` use karte hain jo ek waqt sirf ek thread ko critical section execute karne deta hai.
```python
lock = threading.Lock()
with lock:
    shared_counter += 1
```

### Q77. `async`/`await` kya hai aur ye threading se kaise different hai?
`async`/`await` cooperative multitasking model hai jo single thread mein hi concurrency deta hai — jab ek coroutine `await` par kisi I/O ka wait kar raha hota hai, to event loop control doosre coroutine ko de deta hai. Threading mein OS-level context switching hoti hai (preemptive), asyncio mein event loop khud decide karta hai kab switch karna hai (cooperative) — isliye asyncio mein locks ki zarurat threading jitni nahi padti, but blocking calls poore event loop ko rok sakti hain.

### Q78. Asyncio mein coroutine kaise define aur run karte hain?
`async def` se coroutine function define hota hai, aur usko run karne ke liye `asyncio.run()` use karte hain, ya kisi doosre coroutine ke andar `await` karte hain.
```python
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return "data"

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

### Q79. Multiple async tasks ko concurrently kaise run karte hain?
`asyncio.gather()` ya `asyncio.create_task()` use karke multiple coroutines ko concurrently schedule karte hain, taaki wo sequentially wait karne ke bajaye ek saath progress karein.
```python
async def main():
    results = await asyncio.gather(
        fetch_data("url1"),
        fetch_data("url2"),
        fetch_data("url3"),
    )
```

### Q80. FastAPI mein `async def` route aur normal `def` route mein kya farak hai?
`async def` route asynchronous, non-blocking I/O ke liye hota hai — jaise async DB drivers ya external API calls with `httpx`/`motor`. Normal `def` route FastAPI internally ek threadpool mein run karta hai taaki blocking code bhi event loop ko block na kare. Galti se `async def` route mein blocking (synchronous) call (jaise normal `requests.get`) daal dena poore event loop ko freeze kar sakta hai — ye common production mistake hai.

### Q81. `threading`, `multiprocessing`, aur `asyncio` mein kab kya choose karoge?
I/O-bound with lots of concurrent connections (jaise web scraping, multiple API calls) ke liye `asyncio` best hai kyunki lightweight coroutines lakhon tak scale ho sakte hain. Simple I/O-bound with blocking libraries (jo async support nahi karti) ke liye `threading` use karte hain. CPU-heavy parallel computation ke liye `multiprocessing` chahiye taaki multiple cores actually use ho sakein GIL ke bypass ke saath.

## 8. Advanced Topics (Context Managers, Metaclasses, `@property`, `__slots__`, Memory Optimization)

### Q82. Context manager kya hota hai aur custom context manager kaise banate hain?
Context manager `__enter__` aur `__exit__` dunder methods implement karke `with` statement ke saath resource setup/cleanup automate karta hai — jaise file handling, DB connection, ya lock acquire/release. `__exit__` exceptions ko bhi handle kar sakta hai.
```python
class DBConnection:
    def __enter__(self):
        self.conn = connect_to_db()
        return self.conn
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()

with DBConnection() as conn:
    conn.query(...)
```

### Q83. `contextlib.contextmanager` decorator ka use kya hai?
Ye ek simpler way deta hai context manager banane ka bina poori class likhe — generator function likhte hain jisme `yield` se pehle ka code `__enter__` jaisa aur baad ka code `__exit__` jaisa behave karta hai.
```python
from contextlib import contextmanager

@contextmanager
def open_resource():
    print("acquiring")
    yield "resource"
    print("releasing")

with open_resource() as r:
    print(r)
```

### Q84. `@property` decorator kya karta hai?
`@property` kisi method ko attribute jaisa access karne deta hai (bina parentheses ke), jisse getter/setter logic add kar sakte ho without changing existing attribute-access syntax. Isse validation ya computed values encapsulate karna easy hota hai.
```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):
        return 3.14 * self._radius ** 2

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius can't be negative")
        self._radius = value
```

### Q85. Metaclass kya hota hai?
Metaclass "class ka class" hota hai — jaise class object ka blueprint hai, metaclass class ka blueprint hai. Default metaclass `type` hai. Metaclass se class creation ke time hi behavior control kar sakte ho (jaise automatically methods add karna, validation lagana) — Django ORM aur SQLAlchemy jaise frameworks internally metaclasses use karte hain models banane ke liye. Practical projects mein rarely khud likhna padta hai, lekin concept samajhna zaruri hai.
```python
class Meta(type):
    def __new__(cls, name, bases, dct):
        print(f"Creating class {name}")
        return super().__new__(cls, name, bases, dct)

class MyClass(metaclass=Meta):
    pass
```

### Q86. `__slots__` memory optimization mein kaise help karta hai?
Normally har instance apna `__dict__` banata hai jo attributes dynamically store karta hai, but ye extra memory leta hai. `__slots__` define karke fixed set of attributes declare karte hain, jisse per-instance `__dict__` avoid ho jata hai aur bahut saari instances banane par (jaise lakhon records) significant memory bachti hai.

### Q87. Python mein memory optimization ke liye kaunse techniques use karte ho?
Generators use karo poori list ke bajaye jab lazy evaluation kaafi ho, `__slots__` use karo classes mein agar bahut instances banni hain, unnecessary object copies avoid karo, `del` ya scope end hone dो se references release karo taaki GC unhe clean kar sake, aur bade data processing mein `itertools` jaise memory-efficient tools use karo instead of materializing full lists.

### Q88. `functools.lru_cache` kya karta hai?
`lru_cache` decorator function ke results ko cache kar leta hai based on input arguments, taaki same arguments ke saath dobara call hone par expensive computation dobara na ho, seedha cached result return ho jaaye. Recursive functions (jaise Fibonacci) ya repeated expensive API/DB calls optimize karne mein useful hai.
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_computation(n):
    return sum(i*i for i in range(n))
```

### Q89. Monkey patching kya hota hai?
Monkey patching matlab runtime par kisi existing class ya module ka behavior modify karna without touching its original source code — jaise kisi third-party library ke method ko override karna testing ke liye. Powerful tool hai but risky bhi, kyunki debugging mushkil ho sakti hai agar overused kiya jaaye — mostly testing/mocking mein use hota hai.

### Q90. Weak references (`weakref`) kya hote hain aur inka use case kya hai?
Weak reference kisi object ko reference karta hai lekin uska reference count nahi badhata, jisse agar object ke saare "strong" references khatam ho jaayein to GC use clean kar sakta hai even though weak reference abhi exist karti hai. Iska use caching mechanisms mein hota hai jahan hum object ko cache mein rakhna chahte hain lekin usse memory leak ka reason nahi banna chahte.

### Q91. `copy`, deepcopy, aur immutability memory ke context mein kaise related hain?
Immutable objects (str, int, tuple) safe hote hain shallow copy ya direct reference sharing ke liye kyunki wo change hi nahi ho sakte, isliye Python unhe often as-is reference karta hai memory bachane ke liye (jaise string interning). Mutable objects ke saath copy karte waqt dhyan rakhna padta hai ki shallow copy se accidental shared-state bugs na aaye — isliye deep copy ki zarurat samajhna important hai nested mutable structures ke saath.

## 9. Python 3 Specific Features, Common Gotchas, Best Practices

### Q92. Python 2 se Python 3 mein kya major changes aaye?
`print` statement se `print()` function bana, integer division `/` ab float return karta hai (`//` explicit integer division ke liye), strings by default Unicode hain (Python 2 mein `bytes` default tha), aur `range()` ab generator jaisa lazy object hai instead of list. Python 2 January 2020 se officially end-of-life ho chuka hai.

### Q93. F-strings kya hain aur ye `.format()` se better kaise hain?
F-strings (`f"{variable}"`, Python 3.6+) string ke andar hi expressions embed karne dete hain, jo `.format()` ya `%` formatting se zyada readable aur fast hote hain (compile time par optimize hote hain). Debugging ke liye Python 3.8+ mein `f"{value=}"` syntax bhi useful hai jo variable name aur value dono print kar deta hai.
```python
name, age = "Khushi", 25
print(f"{name} is {age} years old")
print(f"{age=}")   # age=25
```

### Q94. Walrus operator (`:=`) kya hai?
Python 3.8 mein introduce hua assignment expression operator hai jo ek expression ke andar hi value assign aur use dono kar deta hai, jisse code concise hota hai — especially while loops aur comprehensions mein useful hai.
```python
while (line := input("Enter: ")) != "exit":
    print(line)
```

### Q95. Common Python gotchas kaunse hain jo interview mein pooche jaate hain?
Mutable default arguments (already discussed), late binding closures in loops (loop variable ka reference lambda mein capture hota hai, value nahi — sabhi lambdas last value use karte hain agar variable capture kiya), integer overflow ki chinta nahi (Python integers arbitrary precision hain), aur floating point precision issues (`0.1 + 0.2 != 0.3` exactly, due to binary floating point representation).
```python
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])   # [2, 2, 2] not [0, 1, 2]
```

### Q96. Python best practices jo production code mein follow karni chahiye?
PEP 8 style guide follow karo (naming conventions, indentation), type hints use karo readability ke liye, meaningful exception handling karo (specific exceptions, proper logging), virtual environments aur pinned dependencies use karo, DRY principle follow karo, aur code ko testable rakhne ke liye functions/classes ko single-responsibility rakho. AI tools (Claude, ChatGPT) se generated code bhi review zaroor karo before merging — blindly trust mat karo.

## 10. Practical / Scenario-Based Questions (Project Experience)

### Q97. RIoAI project mein Python ka use kaise kiya, especially FastAPI ke saath?
RIoAI ek quick-commerce pharmacy delivery app hai jaha maine FastAPI se REST APIs banayi — order management, delivery workflows, aur EvitalRx/Firebase integrations ke liye. FastAPI choose kiya kyunki uski async support high-concurrency order requests handle karne mein help karti hai, aur Pydantic models se request/response validation automatically ho jaati hai bina manual checks likhe. Heavy/slow operations (jaise notification sending, external pharmacy API calls) ko main request-response cycle se bahar rakha taaki API response time fast rahe.

### Q98. Background tasks Python mein kaise schedule karte ho, jaisa RIoAI mein Celery/Redis se kiya?
RIoAI mein Celery ko Redis broker ke saath use kiya background/async tasks ke liye — jaise order confirmation notifications, third-party pharmacy (EvitalRx) API calls, aur scheduled reminders. FastAPI request handler turant task ko Celery queue mein bhej deta hai (`task.delay()`) aur user ko immediate response return kar deta hai, jabki actual heavy work background worker process asynchronously complete karta hai. Isse API response time fast rehta hai aur agar external service slow ho to bhi user experience affect nahi hoti — retries aur failure handling bhi Celery ke through configure kiya.

### Q99. Face detection (MediaPipe) ko Python script se integrate karte waqt kya challenges aaye Live Attendance Monitoring System mein?
Sabse bada challenge tha real-time video frames process karna without lag — MediaPipe se face detection har frame par chalane mein CPU load zyada tha, isliye frame skipping/sampling strategy use ki (har frame ke bajaye kuch frames baad process karna). Doosra challenge tha lighting conditions aur multiple faces ek saath detect karna — confidence threshold tune karna padha false positives kam karne ke liye. Python CV script ko Node.js backend ke saath integrate karna bhi challenge tha kyunki dono alag runtime hain, isliye detection results ko structured format (JSON) mein backend ko bhejna aur attendance records SQL database mein sync karna properly design karna padha, especially duplicate/multiple detections avoid karne ke liye.

### Q100. Task Management System mein API key authentication aur Twilio SMS OTP kaise implement kiya Python mein?
API key authentication ke liye FastAPI ka dependency injection system use kiya — ek dependency function banayi jo request header se API key nikaalti hai aur database/config ke against validate karti hai, agar invalid hai to `HTTPException(401)` raise karti hai; ye dependency protected routes par attach kar di. OTP flow ke liye ek random OTP generate karke Twilio ke Python SDK se user ke mobile number par SMS bhejta hoon, OTP ko short expiry ke saath (Redis ya DB mein timestamp ke saath) store karta hoon, aur verify endpoint par match + expiry check karta hoon before marking user verified — expired ya wrong OTP ke liye proper error messages return kiye jaate hain taaki frontend user ko clear feedback de sake.
