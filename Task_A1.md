# Javascript video summary

## Beginning the Beginner's series [1 of 51]

Introduction of all creators of the Series, which covers the Basics of JS and can be watched in any order.

## What is JavaScript [2 of 51]

JS is a programming language build for interaction with elements on webpages, which is not connected to java and in demarcation compiled while running.
JS is the most used programming language in the world (2019) an everywhere so in clients, servers and native Application.

## Running JavaScript: browser or server [3 of 51]

**Client side JS**
JS can be easyly be included in an HTML file by using the script-tag with direct code or a reference to a JS-file.
Runned in an Browser it has access in a Document Object Model (DOM), which give us access to manipulate the HTML-Elements via JS.

**Server side JS**
To run JS on an Server for building web services, you need [Node.js](https://nodejs.com), which is no Browser and therefore you have no DOM, but instead you have packages.
[npm repo (packages for everything)](https://npmjs.com).

## Building your toolbox [4 of 51]

Tools you need for JS:

- **IDE:** [Visual Studio Code](https://code.visualstudio.com)
- **Extensions:**
  - ESLint
  - Prettier
  - JavaScript (ES6) code snippets
- **JS Runtime:** [Node.js](https://nodejs.com)
  - **Node.js CLI-Manager:**
    - [NVM (Windows)](https://github.com/coreybutler/nvm-windows)
    - [NVM (macOS, Linux, WSL)](https://github.com/nvm-sh/nvm)

## Demo: Building your toolbox [5 of 51]

Just a Tutorial.

## Creating your first application [6 of 51]

> Project: Folder with other folders, files and code in it.

First _Hello World_ script:

- basic:
  ```JS
  console.log('Hello, World');
  console.log("Hello, World");
  ```
  > **OUTPUT:** <br/> Hello, World <br/> Hello, World
- with variables:
  ```JS
  const place = "World";
  const greeting = "Hello";
  console.log("%s, %s", greeting, place);
  console.log(`${greeting}, ${place}`);
  ```
  > **OUTPUT:** <br/> Hello, World <br/> Hello, World

## Comments [7 of 51]

To explain Code <br/>
**BUT** code should better be selfdocumenting!

|  single line   |          multi line          |
| :------------: | :--------------------------: |
|  `// comment`  | `/*` <br/>`comment`<br/>`*/` |
| only that line |     all lines inbetween      |

> Shortcut: `Ctrl + /`

> '//TODO:' is a good way to mark your open todos, there are also some extencions

## Demo: Comments [8 of 51]

Just a demo for Comments.

## Declaring variables [9 of 51]

|              |       `var`        |         `let`          |        `const`         |
| :----------: | :----------------: | :--------------------: | :--------------------: |
|    scope     |      function      |       block { }        |       block { }        |
|  mutability  |         ✅         |           ✅           |           ❌           |
| availability | before declaration | only after declaration | only after declaration |
|    usage     |                    |        in loops        |       by default       |

## Demo: Declaring variables [10 of 51]

Just a demo for variables.

## Working with strings [11 of 51]

> String: Represents textual elements on the Web

### String Concatenation

Combining >=2 Strings (or other variables into a String) -> new String

Operator: `+`

    ❗ no spaces between Strings are added

## Demo: Declaring variables [12 of 51]

Just a demo for Strings.

## Using template literals to format strings [13 of 51]

> Template Literals: Long Text with placeholders ${ } for variables or expressions

|  concatenation Operator  |   Template Literals    |
| :----------------------: | :--------------------: |
|        ' ' OR " "        | on pair of backticks ` |
|    each line break /n    |      none needed       |
| must concatate variables |      placeholder       |

## Demo: Using template literals to format strings [14 of 51]

Just a Demo for template literals.

## Data types in JavaScript [15 of 51]

JS is weakly typed -> dynamic data types

**Checking Type Operators**
| `typeof` | `instanceof` |
| :----------------------: | :--------------------: |
| Returns a String of the data type primitive | Returns a Boolean of if the value matches the data type |

### ❗Equality Gotchas
```JS
let x = 0 ==  '';    // true, type coerced (both bool)

let x = 0 === '';   // false, type respected
```

## Data types in JavaScript [16 of 51]
Just a demo for data types.

## Math in JavaScript [17 of 51]
### Basic Operators
```JS
1+2 // 3
1-2 // 1
1*2 // 2
1/2 // 0.5
```
### Additional Operators
```JS
3 % 10  // 3
++3     // 4
--3     // 2
```

### Math Object
Set of advance mathematic operation consants and functions
```JS
Math.PI         // 3.121592653589793
Math.squrt(9)   // 3
```
## Demo: Math in JavaScript [18 of 51]
Just a demo for math operations.

## Converting strings to numbers [19 of 51]
There is a need to convert numbers into Strings `toString()` and vice versa `parseInt()`, `parseFloat()`.

❗ If the String which is getting parsed is not a numeric String unintended results happen.

## Demo: Converting strings to numbers [20 of 51]
Just a demo for converting.

## Handling errors with try/catch/finally [21 of 51]

**Exeption**

    Interruption in the intended execution of code 

**Error**

    Unintended interruption in the execution of code, typically throw an exeption
    Syntax errors occurs when incorrect syntax is used

**Throwing an Exeption**

    Message of the detected exeption, can be thrown by JS or by the developer with the keyword throw

### Handling errors
An uncaught exception are thrown, if the code has no guidance how to handle this interruption, then users see unhelpful obscure messages or nothing.

Therefore you should catch them with `try`, `catch` and `finally`.

```JS
try{
  criticalCode();
}
catch(ex){
  console.log("Got an error");
  logError(ex);
}
finally{
  console.log("This message will be always shown");
}
```
## Demo: Handling errors with try/catch/finally [22 of 51]
Just a demo for handling errors.

## Dates [23 of 51]
 There is a object to handle a date and time, which is actually stored as a number of miliseconds since 1. Jan. 1970.


```JS
const now = new Date();

const specificDate = new Date(YYYY, MM, DD, hh, mm, ss);
                                // ❗ Month starts with zero
```

**Setting Values**
```JS
now.setFullYear(2014);
now.setMonth(3);
mow.setDate(4);

now.setHours(4);
now.setMinutes(23);
now.setSeconds(17);
```
**Getting Values**
```JS
now.getFullYear();
now.getMonth();
mow.getDate();

now.getHours();
now.getMinutes();
now.getSeconds();
```
## Demo: Dates [24 of 51]
Just a demo for dates.

## Boolean logic with if statements [25 of 51]
Boolean standard operators: `<, <=, >, >=`

    ❗JS automatically converts data types in many instances!
      
      '42' == 42    //true        '42' != 42    //false  
      '42' === 42   //false       '42' !== 42   //true   

If statements: `if, if else, else`

**Shortcuts:**
```JS
// skipping {} in single line
if(condition) console.log('OK');
else if(condition) console.log('Error');
else console.log('Unknown status');

//Ternary (instant check)
const test = (condition) ? 'OK' : 'Error';
```

## Demo: Boolean logic with if statements [26 of 51]
Just a demo for boolean logic.

## Boolean logic with switch and other syntax [27 of 51]
### Implicit false values
- **String:**   empty
- **Objects:**  Null or undefined
- **Numbers:**  0

=> easy way to test if variable holds a value

### Strings
    ❗ Strings are case sensitive
        -> use upper/lowercase
        -> localCompare() 
### Combining comparisons
**AND**
      
    (x & y)
    (x && y)  (skips evaluation if answer is already known)

OR

    (x | y)
    (x || y)  (skips evaluation if answer is already known)

### Switch (case) statements
```JS
const status = 200;
switch (status){
  case 200:
    console.log('Ok');
    break;
  case 400:
  case 500:
    console.log('error');
    break;
  default: 
    console.log('unknown value');
    break;
}
```
## Demo: Boolean logic with switch and other syntax [28 of 51]
Just a demo for boolean logic and switch.

## Creating arrays [29 of 51]
**Array:** can contain many different values of different data types (List/Collection), while every value is connected to one index.

### Creating an Array
```JS
let arr1 =[];
let arr2 = Array(arrayLength);
```

## Demo: Creating arrays [30 of 51]
Just a demo for creating arrays.

## Populating arrays [31 of 51]
Creating an Array can be done easily by in one statement with the data, to add data later, the data must be assigned to an index, the same way data can be accessed. If there is already a value at this index, it will be overwritten.
```JS
let arr1 =  ["A", true, 2];
let arr1[1]= false;
console.log(arr1[1]); // false (arr1 = "A", false, 2)
```
## Demo: Populating arrays [32 of 51]
JJust a demo for populating arrays.

## Array methods [33 of 51]
```JS
// END
array.push(values);   // addes one ore more values | returns: new array.length
array.pop();          // removes value from end of arrray | returns: removed value

// FRONT
array.shift()         // removes value from front of arrray | returns: removed value
array.unshift(values) // addes one ore more values at the front | returns: new array.length

array.concat(array2)  // joins two arrays and creats a new
```
## Demo: Array methods [34 of 51]
Just a demo for loops.

## Loops [35 of 51]
To execute code multiple times.
```JS
const names =  ['Justin', 'Sarah', 'Christop'];

let index = 0;
while(index < names.length){
console.log(names [index]);
index ++;
}

for(let index =0; index < names.length; index++) {
console.log(names[index]);
}

for (let name of names){
  console.log(name);
}
```

## Demo: Loops [36 of 51]
Just a Demo for Loops.

## Functions [37 of 51]
A block of code that executes a routine task and can be use often.
A Function takes Inputs, executes the code with that input and returns an output. 
```JS
// Definition
function isCountingDown(var1,var2){
  if(var1 > var2)
    return true;
  return false;
}

// Invocation
isCountingDown(2,1); // true
```
## Demo: Functions [38 of 51]
Just a demo for functions.

## Arrow and anonymous functions [39 of 51]

### anonymous fuction
A function without a name.
```JS
const add = function(a,b) {
  return a + b;
};
```

### arrow functions
Shortform of the anonymous function.

❗Gets `this` from the context outside (could change). 
```JS
const add = (a,b) => a + b;

const subtract = (a,b) => {
  return a - b;
};
``` 

## Demo: Arrow and anonymous functions [40 of 51]
Just a demo for arrow and anonymous functions.

## JavaScript Object Notation (JSON) [41 of 51]
JSON is used to save and transfer data between the Server and the Client, therefore it is in text format/ human readable which is important for debuging. JSON consists of name-value pairs ("stringified" JS-Object properties) and a collection of object in one file for transfer (array).

### Object format
```JS
const bookObj= {
  title: "1984"
  author : "George Orwell",
  isAviable : false
};
```
### Convert to JSON
```JS
const bookJSON = JSON.stringify(bookObj);
consol.log(bookJSON);
```
### Convert to JS object
```JS
var book = JSON.parse(bookJSON);
console.log(book.title);
``` 

## Demo: JavaScript Object Notation (JSON) [42 of 51]
Just a Demo for JSON.

## Objects in JavaScript [43 of 51]
JS Objects have accociated properties and methods

example 1: see above (literal)

constructor
```JS 
const book = new Object();
book.title = "1984";
book.author = "George Orwell";,
book.isAviable = false;

 book.checkIn = function(){
  this.isAvailable =true;
 };
 book.checkOut: function(){
  this.isAvailable =false;
 };
```
    Keyword: this - maps to runtime context

## Demo: Objects in JavaScript [44 of 51]
Just a demo for Objects.

## Promises for long running operations [45 of 51]
If everything is programmed syncronisly, everything runs in one thread, which blocks everything if something takes long.

### Promises
Common development pattern - for asyncron comunication - are already built in in JS.

```JS
function promiseTimeout (ms){
  return new  Promise((resolve, reject)=>{
    setTimeout(resolve, ms);
  });
}

promiseTimeout (2000)
      .then(() => {
        console.log('done');
        retrun Promise.resolve(42);
      })
      .then((response)=>{
        console.log(response);
      });
      .catch(() => {
        console.log('cool error handlin');
      })
```

## Demo: Promises for long running operations [46 of 51]
Just a demo for promises.

## Async/await for managing promises [47 of 51]
Promises are cleaner but not pefect, async/await is standard in many languages and make the code look more synchronous.

```JS
function promiseTimeout (ms){
  return new  Promise((resolve, reject)=>{
    setTimeout(resolve, ms);
  });
}

async function simulateLongOperation(){
  await promiseTimeout(1000);
  return 42;
}

async function run(){
  const answer = await simulateLongOperation();
  console.log(answer);
}

run();
``` 
## Demo: Async/await for managing promises [48 of 51]
Just a Demo of Async/await.

## Package management [49 of 51]
A package is a reusable bundle of code and assets.  It enables you to set up a full JS-Server with just 10 lines of code.

**package.json**

every projects starting point and includes
  - metadata
  - dependencies
  - scripts

### creating a new project
1. `npm init` - creates a package.json file
2. `npm install <package_name>`  - download an add package to dependencies (`--save-dev` just for dev)

## Demo: Package management [50 of 51]
Just a demo of package management.

Package: `dotenv` to hash your secrets. (Don't push it to your repository).

## Next steps [51 of 51]
Just practise, and play around with writing some code.