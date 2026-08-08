# Node.js Interview Questions & Answers (Hinglish)

Ye file Node.js aur uske ecosystem (Express.js, REST APIs, microservices, async programming, SQL integration) ke top 100 interview questions cover karti hai — specially un topics ke around jo real projects jaise **Live Attendance Monitoring System** (Computer Vision powered, real-time tracking) mein use hote hain.

## Node.js Basics

### Q1. Node.js kya hai?
Node.js ek open-source, cross-platform JavaScript runtime environment hai jo Chrome ke V8 engine par built hai. Isse hum JavaScript ko browser ke bahar, server-side par run kar sakte hain. Ye event-driven aur non-blocking I/O model use karta hai, jisse ye lightweight aur efficient banta hai — especially data-intensive real-time applications ke liye.

### Q2. Node.js single-threaded hai to concurrent requests kaise handle karta hai?
Node.js ka main thread single-threaded hota hai jo event loop run karta hai, lekin heavy/blocking operations (file I/O, network calls, DB queries) ko ye background mein libuv ki help se handle karta hai jisme ek thread pool hota hai. Jab async operation complete hota hai, uska callback event loop mein queue ho jata hai aur main thread pick karke execute karta hai. Isi wajah se Node.js thousands of concurrent connections handle kar leta hai bina multiple threads spawn kiye.

### Q3. Node.js ka event-driven architecture kya hota hai?
Event-driven architecture ka matlab hai ki application ka flow events (jaise request aana, file read complete hona, timer expire hona) ke basis par decide hota hai, na ki sequential code execution se. Node.js mein har async operation complete hone par ek event emit hota hai, aur uske corresponding listener/callback trigger hota hai. Ye pattern EventEmitter class ke through implement hota hai jo Node ke bahut se core modules (http, streams) ke andar bhi use hoti hai.

### Q4. V8 engine kya role play karta hai Node.js mein?
V8 Google ka open-source JavaScript engine hai jo JavaScript code ko directly machine code mein compile karta hai (JIT compilation) instead of interpreting line by line, jisse execution fast hota hai. Node.js is V8 engine ko embed karta hai aur uske upar apne C++ bindings (libuv) add karta hai jo file system, networking, aur other OS-level operations ke liye APIs provide karte hain.

### Q5. Non-blocking I/O ka matlab kya hai?
Non-blocking I/O ka matlab hai ki jab koi I/O operation (jaise file read, DB query, network request) chal raha ho, tab Node.js us operation ka result wait nahi karta — turant next line execute karne chala jata hai. Operation complete hone par ek callback/promise resolve hota hai jisme result handle hota hai. Isse CPU idle nahi baithta aur multiple requests parallel-ly progress kar sakti hain.

```javascript
// Blocking vs Non-blocking example
const fs = require('fs');

// Non-blocking (async)
fs.readFile('data.txt', 'utf8', (err, data) => {
  console.log(data); // ye baad me print hoga
});
console.log('Ye pehle print hoga'); // ye pehle chalega
```

### Q6. Node.js kis type ki applications ke liye best suited hai?
Node.js real-time applications (chat apps, live dashboards), streaming applications, REST APIs, microservices, aur I/O-heavy applications ke liye best hai — jaise humare Live Attendance System mein real-time camera feed data process karke employee tracking karna. Lekin heavy CPU-bound tasks (jaise complex image processing) ke liye Node.js akela ideal nahi hota, isliye hum aise tasks Python scripts ya worker threads mein offload karte hain.

### Q7. Node.js CPU-intensive tasks ke liye achha kyun nahi hai?
Kyunki Node.js single-threaded event loop model use karta hai, agar koi synchronous CPU-heavy operation (jaise large loop, heavy computation) chal raha ho to wo poore event loop ko block kar deta hai, jisse baaki saari incoming requests wait karti reh jaati hain. Isliye heavy computation (jaise face detection, image processing) ke liye hum separate services (Python CV scripts) ya Worker Threads / child processes use karte hain.

### Q8. Node.js mein global object kya hota hai?
Browser mein jaise `window` object hota hai, Node.js mein `global` object hota hai jo global scope provide karta hai. Isme `process`, `console`, `setTimeout`, `require`, `__dirname`, `__filename` jaise built-in objects/functions available hote hain jo har module mein directly accessible hote hain bina explicitly import kiye.

### Q9. `process` object kya karta hai?
`process` ek global object hai jo current Node.js process ke baare mein information aur control provide karta hai — jaise environment variables (`process.env`), command line arguments (`process.argv`), process exit karna (`process.exit()`), aur events jaise `uncaughtException` listen karna. Production apps mein isko environment-specific config (DB credentials, ports) read karne ke liye heavily use karte hain.

### Q10. Node.js aur traditional multi-threaded servers (jaise Java/PHP) mein kya difference hai?
Traditional multi-threaded servers har request ke liye naya thread spawn karte hain jisse memory overhead zyada hota hai aur thread management complex ho jata hai. Node.js single-threaded event loop ke through hi bahut saari concurrent requests handle karta hai without spawning threads per request, jisse memory footprint kam rehta hai aur I/O-bound workloads ke liye ye zyada scalable hota hai.

### Q11. LTS (Long Term Support) version kya hota hai aur production mein kyun use karte hain?
LTS Node.js ka wo version hota hai jise Node.js foundation long time (typically 30 months) tak security patches aur bug fixes ke saath maintain karti hai. Production applications mein hum hamesha LTS version use karte hain kyunki wo stable hota hai aur breaking changes ka risk kam hota hai, jabki "Current" release mein latest features hote hain but stability guarantee kam hoti hai.

### Q12. `package.json` mein `"engines"` field ka kya use hai?
`"engines"` field specify karta hai ki project kis Node.js/npm version ke saath compatible hai. Ye enforce nahi hota by default lekin CI/CD pipelines aur deployment platforms (jaise Docker builds) isko check karke ensure karte hain ki sahi runtime version use ho, jisse "works on my machine" type issues avoid hote hain.

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

## Event Loop, Callbacks, Promises, Async/Await

### Q13. Event loop kya hai aur ye kaise kaam karta hai?
Event loop Node.js ka core mechanism hai jo asynchronous callbacks ko manage karta hai. Ye continuously check karta hai ki call stack empty hai ya nahi, aur agar empty hai to callback queue se next callback utha kar execute karta hai. Ye different phases mein kaam karta hai — timers, pending callbacks, poll, check, aur close callbacks — har phase apne specific type ke callbacks process karta hai.

### Q14. Event loop ke phases kaunse hain?
Main phases hain: **Timers** (setTimeout/setInterval callbacks), **Pending callbacks** (kuch system operations ke deferred callbacks), **Poll** (naye I/O events fetch karna aur unke callbacks execute karna), **Check** (setImmediate callbacks), aur **Close callbacks** (jaise socket.on('close')). Har cycle ko "tick" kehte hain.

### Q15. Call stack kya hota hai?
Call stack ek data structure (LIFO — last in first out) hai jo JavaScript engine track karne ke liye use karta hai ki abhi kaun sa function execute ho raha hai. Jab function call hota hai, wo stack par push hota hai, aur return hone par pop ho jata hai. Agar call stack lambe time tak busy rahe (blocking code) to event loop aage nahi badh pata.

### Q16. Callback function kya hota hai aur "callback hell" kya hota hai?
Callback function ek aisa function hai jo dusre function ko argument ke roop mein pass kiya jata hai aur baad mein invoke hota hai (usually async operation complete hone par). "Callback hell" tab hota hai jab multiple nested callbacks ek dusre ke andar likhe jaate hain, jisse code deeply indented aur hard to read/maintain ho jata hai — isse "pyramid of doom" bhi kehte hain. Iska solution Promises aur async/await hai.

```javascript
// Callback hell example
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      console.log(details); // deeply nested
    });
  });
});
```

### Q17. Promise kya hota hai?
Promise ek object hai jo kisi asynchronous operation ke eventual completion (ya failure) ko represent karta hai. Ye teen states mein hota hai: **pending** (initial), **fulfilled** (operation successful), aur **rejected** (operation fail). Promises `.then()`, `.catch()`, aur `.finally()` methods ke through chain kiye ja sakte hain, jisse callback hell avoid hota hai.

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Data mil gaya'), 1000);
  });
}
fetchData().then(data => console.log(data)).catch(err => console.error(err));
```

### Q18. `async/await` kya hai aur ye Promises se kaise related hai?
`async/await` Promises ke upar syntactic sugar hai jo asynchronous code ko synchronous jaisa dikhne/likhne mein help karta hai. `async` keyword se declare kiya function hamesha ek Promise return karta hai, aur `await` keyword usi function ke andar Promise resolve hone ka wait karta hai bina event loop ko block kiye. Isse code readable aur maintain karna easy ho jata hai, especially multiple async steps chain karte time.

```javascript
async function getUserData(id) {
  try {
    const user = await getUser(id);
    const orders = await getOrders(user.id);
    return orders;
  } catch (err) {
    console.error('Error:', err.message);
  }
}
```

### Q19. `Promise.all()`, `Promise.race()`, `Promise.allSettled()` aur `Promise.any()` mein kya difference hai?
`Promise.all()` sabhi promises ke resolve hone ka wait karta hai aur agar koi ek bhi reject ho jaye to turant reject ho jata hai. `Promise.race()` jo bhi promise sabse pehle settle (resolve ya reject) ho, uska result return karta hai. `Promise.allSettled()` sabhi promises complete hone ka wait karta hai chahe wo resolve ho ya reject, aur har ek ka status return karta hai. `Promise.any()` pehla successful (fulfilled) promise return karta hai, agar sab reject ho jayein tabhi ye reject hota hai.

### Q20. Microtask queue aur macrotask queue mein kya difference hai?
Microtask queue mein Promise callbacks (`.then`, `.catch`, `.finally`) aur `process.nextTick()` jaate hain, jabki macrotask queue mein `setTimeout`, `setInterval`, aur I/O callbacks jaate hain. Event loop har macrotask ke baad poori microtask queue empty karta hai before moving to next macrotask ya rendering — isliye microtasks hamesha macrotasks se pehle execute hote hain.

### Q21. `setTimeout(fn, 0)` aur `setImmediate(fn)` mein kya difference hai?
`setTimeout(fn, 0)` timer phase mein execute hota hai aur minimum delay ke baad callback queue mein jaata hai, jabki `setImmediate()` check phase mein current poll phase complete hone ke turant baad execute hota hai. Main I/O cycle ke andar `setImmediate` hamesha `setTimeout` se pehle chalta hai, lekin main module ke top-level context mein dono ka order guarantee nahi hota (system dependent).

### Q22. `process.nextTick()` kya karta hai?
`process.nextTick()` ek callback ko current operation complete hone ke turant baad, but event loop ke agle phase mein jaane se pehle, execute karne ke liye schedule karta hai. Ye microtask queue se bhi pehle process hota hai. Isse hum kisi function ke andar callback ko "defer" kar sakte hain taaki wo synchronously nahi, balki current execution complete hone ke baad chale — but excessive use se event loop starve ho sakta hai.

### Q23. Async/await mein error handling kaise karte hain?
Async/await ke saath error handling `try...catch` block se karte hain, jo rejected promises ko catch karta hai jaise normal thrown exceptions ko karta hai. Multiple await calls ke liye ek hi try block use kar sakte hain, ya har call ko individually wrap karke specific error handling bhi kar sakte hain.

```javascript
async function processAttendance(imageData) {
  try {
    const faceScore = await detectFace(imageData);
    return faceScore;
  } catch (error) {
    console.error('Face detection failed:', error.message);
    throw error;
  }
}
```

### Q24. Unhandled Promise rejection kya hota hai aur ise kaise handle karte hain?
Unhandled Promise rejection tab hota hai jab koi Promise reject hoti hai lekin uske liye koi `.catch()` handler ya try-catch nahi hota. Node.js is case mein warning deta hai aur newer versions mein process crash bhi ho sakta hai. Isse handle karne ke liye har async operation par proper `.catch()` ya try-catch lagana chahiye, aur globally `process.on('unhandledRejection', handler)` bhi listen kar sakte hain safety net ke liye.

### Q25. Event loop block hone se kya problem hoti hai aur kaise avoid karein?
Agar event loop block ho jaye (jaise koi heavy synchronous loop ya large JSON.parse chal raha ho), to us duration mein Node.js koi bhi naya request process nahi kar pata, sabhi incoming connections wait karti hain — jisse latency aur timeouts badh jaate hain. Isse avoid karne ke liye heavy computation ko chunks mein break karna, `setImmediate` se yield karna, ya Worker Threads/child processes mein offload karna chahiye.

### Q26. Worker Threads kya hote hain aur kab use karte hain?
Worker Threads Node.js ka built-in module (`worker_threads`) hai jo actual multi-threading enable karta hai — har worker apna khud ka V8 instance aur event loop rakhta hai, jisse CPU-intensive tasks (jaise image processing, encryption, data transformation) main thread ko block kiye bina parallel mein execute ho sakte hain. Ye specially useful hai jab hume kuch heavy computation Node.js ke andar hi karni ho without spawning a separate process.

### Q27. `async` function ke andar `await` na lagayein to kya hoga?
Agar async function ke andar hum koi Promise return karne wale call ko `await` nahi karte, to us call ka result turant available nahi hoga — code aage badh jayega bina result ka wait kiye, aur wo Promise background mein resolve/reject hoti rahegi. Isse race conditions ya "undefined" values milne jaisi bugs aa sakti hain, especially jab sequential operations (jaise DB write ke baad read) ki dependency ho.

## Modules, npm, package.json

### Q28. CommonJS aur ES Modules mein kya difference hai?
CommonJS Node.js ka default module system hai jo `require()` aur `module.exports` use karta hai, aur ye synchronously modules load karta hai. ES Modules (ESM) JavaScript ka standard module system hai jo `import`/`export` syntax use karta hai aur asynchronously modules resolve karta hai, static analysis allow karta hai (tree-shaking possible). Node.js dono support karta hai — ESM use karne ke liye `.mjs` extension ya `package.json` mein `"type": "module"` set karna padta hai.

```javascript
// CommonJS
const express = require('express');
module.exports = router;

// ES Modules
import express from 'express';
export default router;
```

### Q29. `require()` internally kaise kaam karta hai?
Jab `require()` call hota hai, Node.js pehle module cache check karta hai ki wo module already load ho chuka hai ya nahi — agar haan to cached export return kar deta hai. Agar nahi to file ka path resolve karta hai (core module, node_modules, ya relative path), file content ko read karke wrap karta hai ek function wrapper mein (jisme `exports`, `require`, `module`, `__filename`, `__dirname` available hote hain), phir usse compile/execute karta hai aur result ko cache karke return karta hai.

### Q30. `module.exports` aur `exports` mein kya difference hai?
`exports` actually `module.exports` ka ek reference (alias) hota hai. Hum `exports.foo = bar` jaisa likh sakte hain properties add karne ke liye, lekin agar hum directly `exports = someNewObject` assign kar dein, to `module.exports` ke reference se link toot jata hai aur wo naya object export nahi hoga — isliye poora object replace karna ho to hamesha `module.exports = {...}` use karna chahiye.

### Q31. npm kya hai aur `dependencies` vs `devDependencies` mein kya difference hai?
npm (Node Package Manager) Node.js ke liye default package manager hai jo third-party libraries install, manage, aur publish karne ke liye use hota hai. `dependencies` wo packages hain jo application ko production mein run karne ke liye chahiye (jaise express, sequelize), jabki `devDependencies` sirf development/testing ke time chahiye hote hain (jaise nodemon, jest, eslint) aur production build mein install nahi hote (`npm install --production`).

### Q32. `package.json` aur `package-lock.json` mein kya difference hai?
`package.json` project ki metadata rakhta hai — dependencies, scripts, version, entry point — lekin dependency versions ranges (`^`, `~`) mein specify hoti hain. `package-lock.json` exact resolved version numbers aur poore dependency tree ko lock karta hai, jisse guarantee milta hai ki team ke sabhi members ya different environments mein bilkul same versions install hon, reproducible builds ke liye.

### Q33. Semantic versioning (semver) kya hota hai?
Semver format hota hai `MAJOR.MINOR.PATCH` (jaise 4.18.2). **MAJOR** version breaking changes indicate karta hai, **MINOR** new backward-compatible features, aur **PATCH** bug fixes. `^4.18.2` ka matlab minor/patch updates allowed hain but major nahi, jabki `~4.18.2` sirf patch updates allow karta hai.

### Q34. Environment variables ko Node.js app mein kaise manage karte hain?
Environment variables ko `process.env` ke through access karte hain (jaise `process.env.PORT`, `process.env.DB_HOST`). Local development mein commonly `dotenv` package use karte hain jo `.env` file se variables load karke `process.env` mein inject karta hai. Production mein ye variables actual deployment platform (Docker, cloud service) ke environment config se set kiye jaate hain, taaki secrets (DB passwords, API keys) code mein hardcode na hon.

```javascript
require('dotenv').config();
const dbPassword = process.env.DB_PASSWORD;
```

### Q35. `npx` kya hai aur ye `npm` se kaise different hai?
`npx` ek package executor hai jo bina globally install kiye kisi bhi npm package ko directly run karne deta hai (temporary download karke ya local node_modules se). Ye useful hai one-off commands ke liye (jaise `npx create-react-app`), jabki `npm` mainly packages install/manage karne ke liye use hota hai. `npx` global installations ki zarurat kam karta hai aur version conflicts avoid karta hai.

## Express.js

### Q36. Express.js kya hai aur ise kyun use karte hain?
Express.js Node.js ke liye ek minimal aur flexible web application framework hai jo HTTP servers banana, routing, middleware handling, aur request/response management ko simplify karta hai. Raw Node.js `http` module se compare karein to Express bahut sa boilerplate code kam kar deta hai aur ek clean, structured way deta hai APIs aur web apps build karne ke liye — isi wajah se maine attendance system ke backend mein Express use kiya scalable REST APIs banane ke liye.

```javascript
const express = require('express');
const app = express();
app.get('/api/attendance', (req, res) => {
  res.json({ status: 'present', time: new Date() });
});
app.listen(3000, () => console.log('Server running on port 3000'));
```

### Q37. Middleware kya hota hai Express mein?
Middleware ek function hota hai jise `req`, `res`, aur `next` parameters milte hain, aur ye request-response cycle ke beech mein execute hota hai — jaise logging, authentication, body parsing, ya error handling ke liye. Middleware ya to response bhej sakta hai, ya `next()` call karke control agle middleware/route handler ko pass kar sakta hai.

```javascript
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
app.use('/api', authMiddleware);
```

### Q38. Express mein routing kaise kaam karti hai?
Routing define karti hai ki application specific endpoints (URL + HTTP method combination) par kaise respond kare. Express mein `app.get()`, `app.post()`, `app.put()`, `app.delete()` jaise methods use karke routes define karte hain. Large applications mein routes ko `express.Router()` ke through modular files mein separate karte hain, jisse code organized aur maintainable rehta hai.

```javascript
// routes/attendance.js
const router = require('express').Router();
router.get('/', getAllAttendance);
router.post('/', markAttendance);
module.exports = router;

// app.js
app.use('/api/attendance', require('./routes/attendance'));
```

### Q39. Express mein error handling middleware kaise likhte hain?
Error handling middleware normal middleware se alag hota hai kyunki ismein 4 parameters hote hain: `(err, req, res, next)`. Ye hamesha sabhi routes ke baad define kiya jata hai. Jab kisi route/middleware mein error hota hai (ya `next(err)` call hota hai), Express automatically ise skip karke seedha error handling middleware par jump kar deta hai.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});
```

### Q40. Async route handlers mein errors kaise catch karte hain Express mein?
Express (v4 tak) automatically async function ke andar thrown errors ya rejected promises ko catch nahi karta, isliye unhandled rejection ho sakta hai. Isse solve karne ke liye ya to har route ko try-catch mein wrap karte hain, ya ek wrapper utility (jaise `express-async-handler`) use karte hain jo automatically errors ko `next()` ke through error middleware tak forward kar de. Express 5 mein ye issue natively handle ho gaya hai.

```javascript
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.get('/api/attendance/:id', asyncHandler(async (req, res) => {
  const record = await AttendanceModel.findById(req.params.id);
  res.json(record);
}));
```

### Q41. `app.use()` aur `app.get()`/`app.post()` mein kya difference hai?
`app.use()` middleware mount karne ke liye use hota hai jo kisi bhi HTTP method aur (agar path specify nahi kiya) sabhi paths ke liye trigger hota hai. `app.get()`, `app.post()` etc. specific HTTP method aur exact route ke liye handler define karte hain. `app.use()` ko route-matching bhi zyada flexible hoti hai (prefix matching), jabki `app.get/post` exact route match karte hain.

### Q42. Express mein request body parse karne ke liye kya use karte hain?
JSON body parse karne ke liye built-in `express.json()` middleware use karte hain, aur URL-encoded form data ke liye `express.urlencoded({ extended: true })`. Ye middlewares `req.body` ko populate karte hain parsed data ke saath. File uploads ke liye alag se `multer` jaisi library use karni padti hai kyunki express built-in multipart/form-data support nahi karta.

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### Q43. CORS kya hai aur Express mein kaise handle karte hain?
CORS (Cross-Origin Resource Sharing) ek browser security mechanism hai jo default mein different origin (domain/port) se aaye requests ko block karta hai. Express mein `cors` package use karke specific origins, methods, aur headers allow kar sakte hain, taaki frontend (jaise React dashboard jo attendance data fetch kar raha ho) alag origin se bhi backend APIs call kar sake.

```javascript
const cors = require('cors');
app.use(cors({ origin: 'https://attendance-dashboard.com' }));
```

### Q44. Express mein input validation kaise karte hain?
Input validation ke liye commonly `express-validator` ya `joi`/`zod` jaisi libraries use karte hain jo request body/params/query ko schema ke against validate karte hain aur descriptive error messages return karte hain. Ye ensure karta hai ki bad/malicious data (jaise invalid employee ID, missing image data) database tak pahunchne se pehle hi reject ho jaye.

```javascript
const { body, validationResult } = require('express-validator');
app.post('/api/attendance', [body('employeeId').isInt(), body('timestamp').isISO8601()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // process request
  });
```

### Q45. Express mein rate limiting kyun aur kaise implement karte hain?
Rate limiting ek IP/user se aane wali requests ki frequency limit karta hai taaki server abuse, brute-force attacks, ya accidental overload se bacha rahe. Express mein `express-rate-limit` package se easily implement kar sakte hain, jo specific time window mein maximum allowed requests define karta hai — jaise attendance API par har device se per minute limited requests allow karna taaki system spam se protect rahe.

```javascript
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 100 }));
```

### Q46. Express mein static files kaise serve karte hain?
Express ka built-in `express.static()` middleware use karke hum static assets (images, CSS, employee photos) directly serve kar sakte hain bina custom route likhe. Ye middleware specified directory ke andar files ko URL path ke through directly accessible bana deta hai.

```javascript
app.use('/images', express.static('public/employee-photos'));
```

### Q47. Express mein template engines ka use kab hota hai?
Template engines (jaise EJS, Pug, Handlebars) server-side par dynamic HTML generate karne ke liye use hote hain — jab hum server par hi HTML render karke bhejna chahte hain instead of pure JSON API. Modern SPA-based architectures (React/Angular frontend + Express REST API backend) mein inka use kam ho gaya hai, lekin admin dashboards ya server-rendered reports ke liye ye still useful hote hain.

## REST API Design

### Q48. REST API kya hoti hai aur uske core principles kya hain?
REST (Representational State Transfer) ek architectural style hai APIs design karne ke liye jo HTTP protocol ka use karti hai. Core principles hain: **statelessness** (server client ka koi session state store nahi karta, har request self-contained hoti hai), **client-server separation**, **uniform interface** (resources URIs se identify hote hain, standard HTTP methods use hote hain), **cacheability**, aur **layered system**.

### Q49. HTTP methods (GET, POST, PUT, PATCH, DELETE) ka correct use kya hai?
**GET** data fetch karne ke liye (safe, idempotent, no body), **POST** naya resource create karne ke liye (not idempotent), **PUT** poore resource ko replace/update karne ke liye (idempotent), **PATCH** resource ka partial update karne ke liye, aur **DELETE** resource remove karne ke liye (idempotent). Attendance system mein jaise `POST /attendance` naya attendance record create karega, `GET /attendance/:employeeId` specific employee ka record fetch karega.

### Q50. Idempotency kya hoti hai aur kaunse methods idempotent hote hain?
Idempotency ka matlab hai ki same request ko multiple baar bhejne se result same rahega jaisa ek baar bhejne se hota — server state additional times change nahi hogi. GET, PUT, DELETE, aur HEAD idempotent hote hain, jabki POST idempotent nahi hota (har call se naya resource create ho sakta hai). Ye important hai jab network retries ho rahi ho (jaise unreliable connection par attendance mark karna).

### Q51. Common HTTP status codes kya represent karte hain?
**2xx** success indicate karta hai (200 OK, 201 Created, 204 No Content). **3xx** redirection (301 Moved Permanently, 304 Not Modified). **4xx** client errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests). **5xx** server errors (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable). Correct status codes use karna API consumers ke liye debugging aur error handling easy banata hai.

### Q52. API versioning kyun zaroori hai aur kaise implement karte hain?
API versioning zaroori hai taaki existing clients ko break kiye bina naye features/changes introduce kar sakein. Common approaches hain: **URI versioning** (`/api/v1/attendance`), **header-based versioning** (`Accept: application/vnd.company.v2+json`), ya **query parameter versioning** (`?version=2`). URI versioning sabse common aur simple approach hai kyunki ye clearly visible aur cacheable hota hai.

### Q53. Pagination REST APIs mein kyun zaroori hai aur kaise implement karte hain?
Jab dataset bada ho (jaise saare employees ke months ke attendance records), to poora data ek saath return karna performance aur memory ke liye problematic hota hai. Pagination se hum data ko chunks mein bhejte hain. Common approaches hain **offset-based** (`?page=2&limit=20`) aur **cursor-based** (`?cursor=xyz&limit=20`) — cursor-based large, frequently changing datasets ke liye better perform karta hai kyunki ye consistent hota hai jab records insert/delete ho rahe hon.

```javascript
app.get('/api/attendance', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const records = await AttendanceModel.findAll({ limit: +limit, offset });
  res.json({ page: +page, limit: +limit, data: records });
});
```

### Q54. REST API mein authentication/authorization kaise implement karte hain?
Commonly **JWT (JSON Web Tokens)** use karte hain stateless authentication ke liye — login ke baad server ek signed token deta hai jo har subsequent request ke `Authorization` header mein bheja jata hai, aur middleware usse verify karta hai. Authorization ke liye role-based access control (RBAC) implement karte hain jisse decide hota hai ki kaunsa user kaunsi API access kar sakta hai (jaise sirf admin hi sab employees ka attendance dekh sake).

```javascript
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Q55. API response ka good/consistent structure kaisa hona chahiye?
Ek consistent response structure me typically success flag, data, aur error information hote hain, taaki client-side handling predictable rahe. Errors ke liye bhi ek standard shape follow karna chahiye (error code, message, details).

```javascript
// Success
{ "success": true, "data": { "employeeId": 101, "status": "present" } }

// Error
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Employee not found" } }
```

## Streams, Buffers, File System, Events

### Q56. Streams kya hote hain Node.js mein aur inke types kya hain?
Streams data ko chunks mein process karne ka mechanism hain, poora data memory mein load kiye bina — ye large files ya continuous data (jaise video feed) handle karne ke liye efficient hote hain. Types hain: **Readable** (data read karne ke liye, jaise file read stream), **Writable** (data write karne ke liye), **Duplex** (dono, jaise TCP socket), aur **Transform** (data ko read/write karte hue modify karna, jaise compression).

### Q57. Buffer kya hota hai Node.js mein?
Buffer ek fixed-size, raw binary data ko represent karne wala object hai jo Node.js mein tab use hota hai jab hum binary data (jaise image files, network packets, video frames) handle karte hain jo JavaScript ki string encoding se directly represent nahi ho sakta. Attendance system mein camera se aane wale image/video frames ko network ke through bhejte time buffers ke roop mein hi handle karte hain.

```javascript
const buffer = Buffer.from('Hello', 'utf8');
console.log(buffer); // <Buffer 48 65 6c 6c 6f>
```

### Q58. `fs` module kya hai aur sync vs async methods mein kya difference hai?
`fs` (file system) module Node.js ka core module hai jo files aur directories ke saath interact karne ke liye APIs deta hai — read, write, delete, rename etc. Async methods (`fs.readFile`) non-blocking hote hain aur callback/promise return karte hain, jabki sync methods (`fs.readFileSync`) event loop ko block karte hain jab tak operation complete na ho. Production code mein hamesha async versions use karne chahiye, especially servers mein, taaki concurrent requests handle karne ki capability affect na ho.

```javascript
const fs = require('fs/promises');
async function saveAttendanceLog(data) {
  await fs.writeFile('attendance-log.json', JSON.stringify(data));
}
```

### Q59. Stream piping kya hota hai?
Piping ek readable stream ka output directly ek writable stream mein bhejne ka mechanism hai (`.pipe()` method ke through), backpressure ko automatically handle karte hue — matlab agar writable stream slow hai to readable stream automatically apni speed control kar leta hai taaki memory overflow na ho. Ye large files copy karne, ya video/image streams ko processing pipeline se guzarne ke liye useful hai.

```javascript
const fs = require('fs');
fs.createReadStream('input-video.mp4').pipe(fs.createWriteStream('output-video.mp4'));
```

### Q60. EventEmitter class kya hai?
`EventEmitter` Node.js ka core class hai (`events` module) jo custom events emit aur listen karne ki capability deta hai. Bahut se Node.js core modules (http, streams, net) internally EventEmitter se inherit karte hain. Hum apne khud ke classes ko bhi EventEmitter se extend karke custom event-driven components bana sakte hain.

```javascript
const EventEmitter = require('events');
class AttendanceTracker extends EventEmitter {}
const tracker = new AttendanceTracker();
tracker.on('faceDetected', (employeeId) => console.log(`Employee ${employeeId} detected`));
tracker.emit('faceDetected', 101);
```

### Q61. `on()` vs `once()` mein kya difference hai EventEmitter mein?
`on()` se register kiya listener har baar us event emit hone par trigger hota hai, jabki `once()` se register kiya listener sirf ek baar trigger hoke automatically remove ho jata hai. `once()` useful hota hai jab hume ek specific action sirf ek baar hi handle karni ho, jaise ek connection establish hone ka pehla event.

### Q62. Backpressure kya hoti hai streams mein?
Backpressure tab hoti hai jab data producer (readable stream), consumer (writable stream) se faster data generate kar raha ho jitni speed se consumer usse process/write kar pa raha hai. Agar handle na kiya jaye to memory mein data buffer hoke overflow ho sakta hai. Node.js streams `.pipe()` ke through automatically backpressure handle karte hain — writable stream ke buffer full hone par readable stream ko pause kar diya jata hai jab tak buffer drain na ho.

### Q63. Large file upload/download efficiently kaise handle karte hain Node.js mein?
Large files ko poora memory mein load karne ke bajaye streams use karke chunk-by-chunk process karna chahiye — jaise `fs.createReadStream()` se file read karke response mein pipe karna, ya incoming upload ko directly disk/cloud storage stream mein likhna (jaise `multer` streaming storage engines ya S3 multipart upload). Isse memory usage constant rehta hai chahe file kitni bhi badi ho.

## Database Integration (SQL, ORMs, Connection Pooling)

### Q64. Node.js SQL databases (MySQL/PostgreSQL) se kaise connect hota hai?
Node.js mein driver libraries (jaise `mysql2` MySQL ke liye, `pg` PostgreSQL ke liye) use karke direct SQL queries run kar sakte hain, ya ORM/query builder (Sequelize, Knex, Prisma) use karke higher-level abstraction ke saath kaam kar sakte hain. Connection establish karne ke liye host, port, username, password, aur database name jaisa config diya jata hai, aur best practice hai connection pool use karna instead of single connection per request.

```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'attendance_system',
  connectionLimit: 10
});
```

### Q65. Connection pooling kya hai aur ye kyun important hai?
Connection pooling ek technique hai jisme database connections ka ek pool pehle se create karke reuse kiya jata hai instead of har query ke liye naya connection banana aur close karna, jo expensive operation hota hai. Isse latency kam hoti hai aur database par overload nahi hota, especially high-throughput scenarios mein jaise attendance system jahan continuously multiple employees ka data insert/read ho raha ho.

### Q66. ORM kya hota hai aur Sequelize kya hai?
ORM (Object-Relational Mapping) ek technique hai jisse hum database tables ko JavaScript objects/models ke roop mein represent karke, raw SQL likhe bina, JavaScript methods se CRUD operations perform kar sakte hain. Sequelize Node.js ke liye ek popular ORM hai jo MySQL, PostgreSQL, SQLite, MSSQL support karta hai aur models, associations, migrations, validations jaisi features deta hai.

```javascript
const { DataTypes } = require('sequelize');
const Attendance = sequelize.define('Attendance', {
  employeeId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('present', 'absent', 'late') },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  faceScore: DataTypes.FLOAT
});
```

### Q67. ORM (jaise Sequelize) vs Query Builder (jaise Knex) mein kya difference hai?
ORM full object mapping deta hai — models, relations, hooks, validations sab automatically manage hote hain, jisse development fast hota hai but complex/custom queries ke liye kabhi kabhi limiting ho sakta hai. Query Builder (jaise Knex) SQL ke closer hota hai — ye SQL queries ko chainable JavaScript syntax mein likhne deta hai, jisse zyada control milta hai but boilerplate thoda zyada likhna padta hai models/relations ke liye.

```javascript
// Knex example
knex('attendance').where('employeeId', 101).andWhere('timestamp', '>', startDate).select('*');
```

### Q68. SQL injection kya hota hai aur Node.js mein ise kaise prevent karte hain?
SQL injection ek security vulnerability hai jisme attacker user input ke through malicious SQL code inject karke database ko manipulate kar sakta hai, agar queries mein raw string concatenation use ho. Isse prevent karne ke liye hamesha **parameterized queries / prepared statements** use karne chahiye (jahan values placeholders ke through pass hoti hain), ya ORM/query builder use karna jo by default parameterization handle karta hai.

```javascript
// Vulnerable
const query = `SELECT * FROM employees WHERE id = ${req.params.id}`; // BAD

// Safe (parameterized)
const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
```

### Q69. Database transactions kya hoti hain aur Node.js mein kaise implement karte hain?
Transaction operations ka ek group hota hai jo atomically execute hota hai — ya to sab operations successfully complete honge, ya agar koi ek bhi fail ho to sab rollback ho jayenge, jisse data consistency maintain rehti hai. Jaise attendance record insert karne ke saath saath employee ka daily summary table update karna — dono ek hi transaction mein hone chahiye taaki partial update na ho.

```javascript
const t = await sequelize.transaction();
try {
  await Attendance.create({ employeeId: 101, status: 'present' }, { transaction: t });
  await DailySummary.increment('presentCount', { where: { date: today }, transaction: t });
  await t.commit();
} catch (err) {
  await t.rollback();
  throw err;
}
```

### Q70. Database migrations kya hoti hain aur inka use kya hai?
Migrations version-controlled scripts hote hain jo database schema changes (table create karna, column add/modify karna) ko track aur apply karne ke liye use hote hain. Ye ensure karte hain ki different environments (dev, staging, production) mein schema consistently evolve ho, aur team members ke beech schema changes easily share ho sakein bina manual SQL scripts chalaye.

```bash
npx sequelize-cli migration:generate --name add-face-score-to-attendance
npx sequelize-cli db:migrate
```

### Q71. High-throughput data ke liye SQL schema design mein kya considerations hote hain?
High-throughput scenarios (jaise continuously attendance records insert hona) ke liye important considerations hain: proper **indexing** frequently queried columns par (employeeId, timestamp), **partitioning** large tables ko date/employee ke basis par, avoiding unnecessary joins on hot paths, choosing appropriate data types (jaise TIMESTAMP vs DATETIME), aur batch inserts use karna instead of individual inserts jahan possible ho, taaki write throughput improve ho.

### Q72. N+1 query problem kya hota hai aur ise kaise solve karte hain?
N+1 query problem tab hota hai jab hum ek list fetch karte hain (1 query), aur phir har item ke liye related data fetch karne ke liye separate query chalate hain (N queries) — jisse total N+1 database calls ho jaate hain, performance kharab hoti hai. Solution hai **eager loading** (Sequelize mein `include` option) use karke related data ko ek hi query (JOIN) mein fetch karna.

```javascript
// N+1 problem avoid karne ke liye
const attendances = await Attendance.findAll({ include: [{ model: Employee }] });
```

### Q73. Read replicas aur database scaling ka concept kya hai?
Jaise application ka load badhta hai, ek hi database server par sab read/write operations perform karna bottleneck ban sakta hai. Read replicas primary database ka copy hote hain jo sirf read queries serve karte hain, jisse primary database sirf writes handle karta hai aur overall read throughput badh jata hai. Attendance system mein reports/analytics jaise read-heavy operations ko read replica par route kar sakte hain jabki actual attendance marking (write) primary DB par jaye.

## Microservices Architecture

### Q74. Microservices architecture kya hai aur monolith se kaise different hai?
Microservices architecture mein application ko chhote, independent services mein break kiya jata hai jahan har service apna specific business function handle karta hai (jaise attendance service, employee service, notification service) aur independently deploy/scale ho sakta hai. Monolith mein sara functionality ek hi codebase/deployment unit mein hota hai. Microservices flexibility aur independent scaling deta hai but distributed system complexity (network calls, data consistency) bhi add karta hai.

### Q75. Node.js microservices ke liye kyun suitable hai?
Node.js lightweight hai, fast startup time hota hai, aur JSON ke saath naturally kaam karta hai jo REST/messaging communication ke liye common format hai. Iska non-blocking I/O model microservices ke beech network calls (jo inherently I/O-bound hote hain) efficiently handle karta hai. Chhoti, focused services ke liye Node.js ka minimal footprint aur npm ecosystem development ko fast bhi banata hai.

### Q76. Microservices ke beech communication kaise hoti hai?
Do main patterns hain: **Synchronous** (REST APIs ya gRPC ke through direct HTTP calls, jahan caller response ka wait karta hai) aur **Asynchronous** (message queues/brokers jaise RabbitMQ, Kafka, Redis Pub/Sub ke through, jahan services events publish/subscribe karti hain bina directly ek dusre ko block kiye). Attendance system mein, jab face detection service naya attendance event generate kare, wo ek message queue par event publish kar sakti hai jise notification service aur analytics service dono consume karein.

### Q77. Message queues (jaise RabbitMQ/Kafka) microservices mein kyun use karte hain?
Message queues services ke beech **loose coupling** provide karti hain — producer service ko consumer ke available hone ka wait nahi karna padta, messages queue mein persist ho jaate hain jab tak consumer process na kare. Ye system ko more resilient banata hai (agar ek service down ho to messages queue mein wait karte hain), aur high-throughput scenarios mein load ko smooth karta hai (buffering), jaise bahut saari attendance events ek saath aane par.

```javascript
// Simple RabbitMQ producer example
const amqp = require('amqplib');
async function publishAttendanceEvent(event) {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue('attendance_events');
  channel.sendToQueue('attendance_events', Buffer.from(JSON.stringify(event)));
}
```

### Q78. Microservices mein data consistency kaise maintain karte hain (Saga pattern)?
Kyunki har microservice apna khud ka database rakhti hai, traditional ACID transactions multiple services ke across possible nahi hoti. **Saga pattern** iska solution hai — ek sequence of local transactions hoti hai har service mein, aur agar koi step fail ho to compensating transactions (undo actions) trigger hoti hain pichhle steps ko rollback karne ke liye, taaki eventual consistency maintain rahe.

### Q79. Microservices ko horizontally kaise scale karte hain?
Horizontal scaling ka matlab hai ek hi service ke multiple instances run karna (containers/pods) aur unke beech traffic ko **load balancer** ke through distribute karna. Node.js apps stateless design follow karke isse achieve karte hain (session data external store jaise Redis mein rakhna, not in-memory), taaki koi bhi instance kisi bhi request ko handle kar sake. Container orchestration tools (Kubernetes, Docker Swarm) is process ko automate karte hain based on load (auto-scaling).

### Q80. API Gateway kya hota hai microservices architecture mein?
API Gateway ek single entry point hota hai jo client requests ko receive karta hai aur unhe appropriate backend microservice ko route karta hai. Ye cross-cutting concerns jaise authentication, rate limiting, request logging, aur response aggregation (multiple services se data combine karna) ko centrally handle karta hai, taaki har individual microservice ko ye sab duplicate na karna pade.

### Q81. Service discovery kya hota hai microservices mein?
Jab multiple instances of services dynamically scale ho rahi hon (containers create/destroy ho rahe hon), unke IP addresses change hote rehte hain. Service discovery mechanism (jaise Consul, Eureka, ya Kubernetes ka built-in DNS-based discovery) services ko register karta hai aur runtime par ek dusre ko dynamically locate karne deta hai, bina hardcoded IP addresses use kiye.

## Real-Time Systems (Attendance / Computer Vision Integration)

### Q82. WebSockets kya hote hain aur ye HTTP se kaise different hain?
HTTP request-response based, stateless protocol hai jahan har baar client ko naya request bhejna padta hai data fetch karne ke liye. WebSocket ek persistent, full-duplex connection establish karta hai client aur server ke beech, jisse dono directions mein real-time data exchange ho sakta hai bina baar-baar naya connection banaye. Live Attendance System mein WebSockets se hum real-time dashboard update kar sakte hain jaise hi koi employee detect ho, bina dashboard ko manually refresh/poll kiye.

```javascript
const { Server } = require('socket.io');
const io = new Server(httpServer, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  console.log('Dashboard connected');
  socket.on('disconnect', () => console.log('Dashboard disconnected'));
});
// Jab naya attendance event aaye:
io.emit('attendanceUpdate', { employeeId: 101, status: 'present', time: new Date() });
```

### Q83. Node.js backend Python computer vision scripts ke saath kaise communicate karta hai?
Kai approaches possible hain: (1) Python script ko ek separate microservice ke roop mein run karna jo REST API ya gRPC expose kare, jisse Node.js HTTP calls kare; (2) Node.js se Python script ko `child_process` module se spawn karke stdin/stdout ke through data exchange karna; (3) Dono ke beech ek message queue (RabbitMQ/Redis) use karna jahan Node.js request publish kare aur Python worker consume karke result wapas publish kare. High-throughput real-time systems ke liye queue-based ya dedicated microservice approach zyada scalable hota hai.

```javascript
const { spawn } = require('child_process');
function runFaceDetection(imagePath) {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['face_detect.py', imagePath]);
    let result = '';
    py.stdout.on('data', (data) => (result += data.toString()));
    py.on('close', (code) => code === 0 ? resolve(JSON.parse(result)) : reject(new Error('Detection failed')));
  });
}
```

### Q84. Real-time employee tracking jaise system mein high volume events ko Node.js kaise handle karta hai?
High volume real-time events (jaise multiple cameras se continuously face detection results aana) ko handle karne ke liye hum events ko ek message queue mein buffer karte hain instead of directly synchronously process karne ki koshish karna, jisse sudden spikes se system overwhelm na ho. Node.js ka non-blocking I/O model in events ko efficiently ingest karta hai, aur actual heavy processing (DB writes, notifications) ko worker processes mein asynchronously distribute karte hain.

### Q85. Streaming video/image data ko Node.js backend mein efficiently kaise process karte hain?
Video/image frames ko poore load karne ke bajaye chunks/streams mein process karna chahiye. Node.js streams (Readable/Transform) use karke incoming camera feed data ko piece-by-piece consume kar sakte hain, aur processing ko downstream services (jaise Python CV pipeline) tak buffer/backpressure ke saath forward kar sakte hain, taaki memory usage control mein rahe chahe feed continuous ho.

### Q86. Face detection/liveness detection result ko Node.js backend mein integrate karte time kya challenges aate hain?
Kuch common challenges: (1) Python CV script ka processing time variable hota hai, isliye timeout aur retry logic implement karni padti hai; (2) large image/video payloads ko efficiently transfer karna (compression, streaming); (3) false positives/negatives handle karna — jaise agar face score threshold se neeche ho to attendance reject karna aur proper error/feedback dena; (4) concurrent requests se multiple employees ka data ek saath process karna without race conditions in database updates.

### Q87. Real-time systems mein scalability kaise ensure karte hain jab employee count aur camera feeds badh jayein?
Scalability ensure karne ke liye: (1) Stateless Node.js services banana jo horizontally scale ho sakein load balancer ke peeche; (2) Message queues (Kafka/RabbitMQ) use karna taaki incoming detection events buffer ho sakein aur consumers apni pace se process karein; (3) Database connection pooling aur read replicas use karna high query volume handle karne ke liye; (4) Caching (Redis) frequently accessed data (jaise employee profiles) ke liye taaki repeated DB hits kam ho; (5) Horizontal scaling of the CV processing service independently from the API layer.

### Q88. WebSocket connections ko scale karte time (multiple server instances ke saath) kya problem aati hai aur solution kya hai?
Jab multiple Node.js instances load balancer ke peeche chal rahe hon, ek instance par connected WebSocket client ko doosre instance se emit kiya gaya event directly nahi milta kyunki har instance apni khud ki in-memory socket list rakhta hai. Solution hai ek **adapter** (jaise `socket.io-redis` adapter) use karna jo Redis Pub/Sub ke through sabhi instances ke beech events broadcast kare, taaki koi bhi instance kisi bhi connected client tak event pahuncha sake.

### Q89. Polling vs WebSockets vs Server-Sent Events (SSE) — attendance dashboard ke liye kaunsa best hai aur kyun?
**Polling** simplest hai but inefficient — client baar baar server se poochta rehta hai naya data hai ya nahi, jisse unnecessary requests aur latency hoti hai. **SSE** server se client ko one-way real-time updates deta hai HTTP ke upar, simple hai jab sirf server-to-client push chahiye. **WebSockets** full-duplex real-time communication deta hai, best suited hai jab bidirectional communication chahiye ho (jaise dashboard se filter/commands bhejna aur real-time updates dono receive karna). Attendance dashboard ke liye jahan bas real-time updates dikhane hain, SSE bhi kaafi hai, lekin agar interactive features (jaise live commands, filters, multi-client sync) chahiye to WebSockets better choice hai.

## Performance, Security, Error Handling, Testing, Deployment

### Q90. Node.js application ki performance kaise optimize karte hain?
Key strategies: (1) Blocking/synchronous code avoid karna event loop mein; (2) Caching (Redis/in-memory) frequently accessed data ke liye; (3) Database queries optimize karna (indexing, avoiding N+1); (4) Compression (gzip) enable karna responses ke liye; (5) Clustering/PM2 use karke multiple CPU cores utilize karna; (6) Connection pooling database ke liye; (7) Load testing tools (jaise Artillery, k6) se bottlenecks identify karna before production.

```javascript
const cluster = require('cluster');
const os = require('os');
if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
} else {
  require('./app'); // actual express app
}
```

### Q91. Node.js applications mein common security best practices kya hain?
Important practices: helmet.js use karke secure HTTP headers set karna, input validation/sanitization (SQL injection, XSS avoid karne ke liye), rate limiting, HTTPS enforce karna, secrets ko environment variables mein rakhna (never hardcode), dependencies regularly audit karna (`npm audit`), JWT tokens ko properly expire/rotate karna, aur proper CORS configuration rakhna taaki sirf trusted origins hi API access kar sakein.

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Q92. Global error handling Node.js application mein kaise implement karte hain?
Express-level errors ke liye centralized error-handling middleware use karte hain. Application-level unexpected errors ke liye `process.on('uncaughtException')` aur `process.on('unhandledRejection')` listeners lagate hain jo error log karke gracefully process ko restart karte hain (jaise PM2 ya Kubernetes ke through), kyunki uncaught exception ke baad process ki state unreliable ho jaati hai — bas crash hone dena aur restart karna safer hota hai continue karne se.

```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // process manager (PM2/K8s) isse restart karega
});
```

### Q93. Node.js applications ka testing kaise karte hain (unit, integration)?
**Unit tests** individual functions/modules ko isolation mein test karte hain (jaise ek utility function ya controller logic), commonly Jest ya Mocha+Chai use karke, dependencies (DB, external APIs) ko mock karke. **Integration tests** multiple components ke saath (jaise actual API endpoint + test database) ko test karte hain, `supertest` jaisi library se HTTP requests simulate karke. Attendance system mein hum face-score validation logic ko unit test karenge, aur poore `/api/attendance` endpoint ko integration test karenge.

```javascript
const request = require('supertest');
const app = require('../app');
test('POST /api/attendance creates a record', async () => {
  const res = await request(app).post('/api/attendance').send({ employeeId: 101, status: 'present' });
  expect(res.statusCode).toBe(201);
});
```

### Q94. Node.js app ko production mein deploy karte time kya best practices follow karte hain?
Key points: environment-specific configs use karna (env variables), process manager (PM2) ya container orchestration (Kubernetes/Docker) use karna auto-restart aur scaling ke liye, health check endpoints expose karna (`/health`), proper logging (Winston/Pino) aur monitoring (Prometheus/Grafana, ya APM tools) setup karna, graceful shutdown implement karna (in-flight requests complete hone dena SIGTERM milne par), aur CI/CD pipeline se automated testing/deployment karna.

```javascript
process.on('SIGTERM', async () => {
  console.log('Graceful shutdown shuru...');
  await server.close();
  await dbPool.end();
  process.exit(0);
});
```

### Q95. Logging aur monitoring Node.js applications mein kyun important hai aur kaise implement karte hain?
Production systems mein console.log kaafi nahi hota — structured logging libraries (Winston, Pino) use karte hain jo log levels (info, warn, error), timestamps, aur structured JSON format provide karte hain jise centralized logging systems (ELK stack, Datadog) mein ingest kiya ja sake. Monitoring tools request latency, error rates, memory/CPU usage track karte hain, jisse attendance system jaisi critical application mein issues (jaise face detection service slow ho jana) proactively detect ho sakein before users affect hon.

## Scenario / Project-Based Questions

### Q96. Live Attendance Monitoring System mein Node.js backend ka exact role kya hai?
Node.js backend is system ka central orchestrator hai — ye REST APIs expose karta hai (attendance mark/fetch karna, employee management), incoming face detection results ko receive/validate/store karta hai, database (SQL) ke saath interact karke attendance records manage karta hai, aur WebSockets ke through connected dashboards ko real-time updates deta hai. Essentially, Node.js layer camera-side computer vision processing (jo Python mein hoti hai) aur end-user-facing application (dashboard, reports) ke beech ka bridge hai — business logic, authentication, aur data persistence sab yahin handle hoti hai.

### Q97. Python face detection script se Node.js backend kaise communicate karta hai, poora flow batao?
Camera feed se frames capture hote hain aur Python script (MediaPipe use karke) face detection aur liveness/face-score analysis karta hai. Result (employee identified hua ya nahi, face score, liveness status) ko Node.js backend tak bhejne ke kuch tareeke hain: (1) Python script REST API call kare Node.js server ko result ke saath; (2) Result ko ek message queue (jaise Redis/RabbitMQ) par publish kare jisse Node.js consumer subscribe karke consume kare; (3) `child_process` ke through direct spawn karke stdout se result read karna (simpler setups ke liye). Mere case mein main queue-based ya lightweight internal REST call approach prefer karti hoon taaki dono services independently scale ho sakein aur ek dusre ko directly block na karein.

### Q98. High-throughput attendance data ke liye aapne microservices architecture kaise design ki?
Maine system ko logically alag services mein split kiya: (1) **Face Detection Service** (Python, MediaPipe-based) jo camera feed process karke face score/liveness detect karta hai; (2) **Attendance Service** (Node.js) jo detection results ko validate karke database mein persist karta hai; (3) **Notification/Dashboard Service** jo WebSockets ke through real-time updates broadcast karta hai. In services ke beech communication ke liye message queue use kiya taaki agar ek service temporarily slow ho ya restart ho rahi ho, to events lost na hon aur baaki system affected na ho. Database schema ko bhi optimize kiya proper indexing aur batch inserts ke saath taaki continuous high-frequency writes efficiently handle ho sakein.

### Q99. Real-time employee tracking ke liye aapne scalability kaise handle ki?
Scalability ke liye maine stateless Node.js services design kiye jo horizontally scale ho sakein — koi bhi session/state data in-memory rakhne ke bajaye Redis jaisi shared store mein rakha, taaki multiple instances ke beech load balance ho sake. High-frequency attendance events ko directly synchronously process karne ke bajaye message queue mein buffer kiya, jisse sudden spikes (jaise ek saath bahut saare employees entry karte time) se system overwhelm na ho. Database side par connection pooling aur proper indexing use kiya, aur real-time dashboard updates ke liye WebSocket connections ko Redis adapter ke through multiple server instances mein sync kiya.

### Q100. Agar face detection score threshold se neeche ho ya liveness detection fail ho jaye, to Node.js backend ye scenario kaise handle karta hai?
Jab Python service se face score ya liveness result Node.js ko milta hai, backend pehle usse defined threshold ke against validate karta hai. Agar score threshold se neeche hai ya liveness check fail hui hai, to attendance record ko "present" mark karne ke bajaye backend usse reject kar deta hai aur ek appropriate error response (jaise `422 Unprocessable Entity` ya custom error code) return karta hai jisse frontend user ko retry ka prompt de sake (jaise "Face clearly dikhayein" ya "Dobara try karein"). Saath hi, failed attempts ko logging/monitoring ke liye record kiya jata hai taaki repeated failures (jaise koi spoofing try kar raha ho) ko flag kiya ja sake aur security team ko alert mil sake.
