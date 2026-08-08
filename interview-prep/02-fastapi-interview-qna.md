# FastAPI Interview Questions & Answers (Hinglish)

Ye file FastAPI framework aur uske pure ecosystem (Pydantic, async, Celery, Redis, Docker, REST API design, auth) par based 100 interview questions aur unke practical answers cover karti hai — Khushi ke real experience (RIoAI quick-commerce pharmacy app, Task Management System) ke context ke saath.

## 1. FastAPI Basics

### Q1. FastAPI kya hai aur ye kyun popular hai?
FastAPI ek modern, high-performance Python web framework hai jo REST APIs banane ke liye use hota hai. Ye Starlette (ASGI toolkit) aur Pydantic (data validation) par built hai. Iski popularity ki wajah hai automatic request validation, automatic interactive API docs (Swagger/ReDoc), native async support, aur type hints ka use jo development fast aur less error-prone banata hai. Maine RIoAI project mein isko backend framework ke roop mein use kiya kyunki quick commerce app mein speed aur reliability dono chahiye thi.

### Q2. FastAPI, Flask se kaise different hai?
Flask ek WSGI-based synchronous micro-framework hai jisme validation, docs generation jaise features manually add karne padte hain (extensions ke through). FastAPI ASGI-based hai, native async support deta hai, aur Pydantic ke through automatic data validation + serialization + OpenAPI docs generation built-in hai. Performance ke liye bhi FastAPI generally fast hota hai kyunki ye async I/O efficiently handle karta hai. Flask simplicity ke liye acha hai chhote apps ke liye, but FastAPI production-grade APIs ke liye better fit hai.

### Q3. FastAPI, Django/Django REST Framework se kaise different hai?
Django ek full-stack "batteries-included" framework hai jisme ORM, admin panel, templating sab built-in hota hai — ye monolithic apps ke liye best hai. FastAPI sirf API-building par focused hai, lightweight hai, aur async-first hai. Django REST Framework (DRF) synchronous hai by default, jabki FastAPI async ko naturally support karta hai jo high I/O bound workloads (jaise third-party API calls) ke liye better perform karta hai — jaise humare RIoAI mein EvitalRx aur Firebase calls.

### Q4. ASGI vs WSGI mein kya difference hai?
WSGI (Web Server Gateway Interface) synchronous hai — ek time par ek request handle karta hai per worker, blocking calls ke sath thread ruk jata hai. ASGI (Asynchronous Server Gateway Interface) async support deta hai, matlab ek single worker multiple requests ko concurrently handle kar sakta hai jab tak wo I/O wait kar rahe hain (DB calls, external API calls). FastAPI ASGI ke upar chalta hai (Uvicorn/Hypercorn ke through), isliye high concurrency workloads mein better throughput deta hai.

### Q5. FastAPI itna fast kyun hai — performance ke peeche kya reason hai?
Do main reasons hain: (1) Starlette ka async foundation jo non-blocking I/O allow karta hai, aur (2) Pydantic ki validation jo compiled Rust core (pydantic-core, v2 mein) use karti hai jo bahut fast hai. Isके alawa FastAPI routing bhi efficient hai aur unnecessary overhead nahi daalta. Benchmark mein ye Node.js/Go frameworks ke comparable perform karta hai jab properly async use kiya jaye.

### Q6. FastAPI mein request lifecycle kaise kaam karta hai?
Request client se ASGI server (Uvicorn) tak aata hai, phir FastAPI router request ko matching path operation function tak route karta hai. Path/query params, request body Pydantic models se validate hote hain, dependencies (Depends) resolve hoti hain, phir handler function execute hota hai. Response phir Pydantic response model se serialize hokar client ko JSON ke roop mein wapas jaata hai. Beech mein middleware bhi request/response ko intercept kar sakta hai.

### Q7. FastAPI mein "path operation" kya hota hai?
Path operation ek function hota hai jo kisi specific HTTP method (GET, POST, PUT, DELETE, etc.) aur URL path ke combination ko handle karta hai. Decorator ke through define hota hai:
```python
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```
Ye decorator FastAPI ko batata hai ki is path aur method ke liye kaunsa function call karna hai.

### Q8. FastAPI mein automatic API documentation kaise generate hota hai?
FastAPI OpenAPI specification follow karta hai aur type hints + Pydantic models se automatically schema generate karta hai. `/docs` par Swagger UI milta hai (interactive testing ke liye) aur `/redoc` par ReDoc based documentation milta hai. Ye developer ko manually docs likhne ki zaroorat khatam kar deta hai — code hi documentation ka source of truth ban jaata hai.

### Q9. FastAPI production mein kaise deploy karte hain — Uvicorn ya Gunicorn?
Production mein generally Gunicorn ko process manager ke roop mein use karte hain jo multiple Uvicorn worker processes ko manage karta hai:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```
Isse multiple CPU cores utilize ho paate hain. Maine RIoAI mein Docker ke andar Uvicorn workers configure kiye the, aur load balancing/scaling Docker orchestration se manage hota tha.

### Q10. FastAPI mein versioning (API versioning) kaise handle karte hain?
Common approach hai URL prefix use karna, jaise `/api/v1/` aur `/api/v2/`, alag-alag `APIRouter` instances ke through:
```python
from fastapi import APIRouter
v1_router = APIRouter(prefix="/api/v1")
app.include_router(v1_router)
```
Isse backward compatibility maintain hoti hai jab naye clients (jaise Picker App, Delivery App) alag version use kar rahe hon aur purane clients affect na hon.

## 2. Pydantic Models, Request/Response Validation, Type Hints

### Q11. Pydantic kya hai aur FastAPI isko kyun use karta hai?
Pydantic ek data validation library hai jo Python type hints ka use karke runtime par data validate aur parse karti hai. FastAPI isko use karta hai kyunki ye automatically incoming JSON ko Python objects mein convert karta hai, invalid data par clear error deta hai, aur same model se response serialization bhi ho jaati hai. Isse manual validation code likhne ki zaroorat nahi padti.

### Q12. Pydantic BaseModel kaise define karte hain?
```python
from pydantic import BaseModel

class Task(BaseModel):
    title: str
    description: str | None = None
    is_completed: bool = False
```
Har field ka type declare karte hain; optional fields ko default value ya `Optional` type ke saath define karte hain. FastAPI is model ko request body ke schema ke roop mein use karta hai.

### Q13. Pydantic mein field validation kaise karte hain (custom validators)?
Pydantic v2 mein `field_validator` decorator use karte hain:
```python
from pydantic import BaseModel, field_validator

class User(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Invalid phone number")
        return v
```
Maine Task Management System mein OTP flow ke liye phone number validation isi tarah implement kiya tha.

### Q14. Pydantic v1 aur v2 mein kya major differences hain?
Pydantic v2 core mein Rust-based (pydantic-core) hai jo validation ko kaafi fast banata hai. Syntax bhi kuch change hua — `validator` decorator ab `field_validator` ban gaya, `Config` class ko `model_config` dict se replace kiya gaya, aur `.dict()` ab `.model_dump()` ho gaya. Performance improvement significant hai, especially large payloads ke liye.

### Q15. Request body validation FastAPI mein kaise hoti hai?
Jab hum path operation function mein Pydantic model ko parameter type ke roop mein declare karte hain, FastAPI automatically incoming JSON body ko parse aur validate karta hai:
```python
@app.post("/tasks")
async def create_task(task: Task):
    return task
```
Agar validation fail ho, FastAPI automatically 422 Unprocessable Entity response return karta hai with detailed error message.

### Q16. Response model kaise define karte hain aur ye kyun important hai?
`response_model` parameter path operation decorator mein specify karte hain:
```python
@app.get("/tasks/{id}", response_model=TaskOut)
async def get_task(id: int):
    ...
```
Ye ensure karta hai ki response data hamesha defined schema follow kare, sensitive fields (jaise password) automatically exclude ho jayein, aur OpenAPI docs mein response schema documented rahe.

### Q17. Type hints FastAPI mein itne important kyun hain?
Type hints sirf documentation ke liye nahi, balki FastAPI runtime par inhe use karke validation, serialization aur dependency injection karta hai. Jaise `item_id: int` likhne se FastAPI automatically string ko int mein convert/validate karega. Ye "type hints as source of truth" approach code ko safer aur self-documenting banata hai.

### Q18. Optional fields aur default values Pydantic mein kaise handle karte hain?
```python
from typing import Optional

class Task(BaseModel):
    title: str
    priority: Optional[str] = "medium"
    tags: list[str] = []
```
`Optional[str]` ya `str | None` (Python 3.10+) ke saath default value dena field ko optional banata hai. Mutable defaults (list, dict) ke liye Pydantic khud handle karta hai — har instance ki apni copy milti hai.

### Q19. Nested Pydantic models kaise use karte hain?
Ek model doosre model ko field type ke roop mein use kar sakta hai:
```python
class Address(BaseModel):
    city: str
    pincode: str

class DeliveryAgent(BaseModel):
    name: str
    address: Address
```
Isse complex nested JSON structures (jaise Picker/Delivery App mein order + address + agent details) ko cleanly validate kar sakte hain.

### Q20. Pydantic mein `Field()` function ka use kya hai?
`Field()` extra metadata aur constraints add karne ke liye use hota hai — jaise default value, description, min/max length, regex pattern:
```python
from pydantic import Field

class Medicine(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    quantity: int = Field(gt=0, description="Quantity must be positive")
```
Ye validation rules ko declarative tarike se express karta hai aur automatically OpenAPI docs mein bhi reflect hota hai.

### Q21. Pydantic model se dict/JSON conversion kaise karte hain?
`.model_dump()` (v2) ya `.dict()` (v1) se Python dict milta hai, aur `.model_dump_json()` se JSON string. Reverse mein `Model.model_validate(data)` ya `Model(**data)` se object bana sakte hain. Ye especially useful hai jab MongoDB documents ko Pydantic models se convert/from convert karna ho.

### Q22. Data class vs Pydantic model vs TypedDict — kab kaunsa use karein?
`dataclass` simple structured data ke liye acha hai bina validation ke, `TypedDict` sirf type-checking ke liye hai (runtime validation nahi karta), aur `Pydantic BaseModel` runtime validation, serialization aur parsing sabhi provide karta hai. API request/response ke liye Pydantic best choice hai kyunki humein untrusted external data ko validate karna hota hai.

## 3. Path/Query Params, Request Body, Dependency Injection

### Q23. Path parameters kaise define karte hain?
```python
@app.get("/orders/{order_id}")
async def get_order(order_id: int):
    return {"order_id": order_id}
```
Curly braces mein path parameter define hota hai aur function parameter ka type hint FastAPI ko automatic validation aur conversion karne mein help karta hai (yahan string se int conversion).

### Q24. Query parameters kaise define karte hain?
Jo function parameters path mein declare nahi kiye, wo automatically query parameters ban jaate hain:
```python
@app.get("/orders")
async def list_orders(status: str = "pending", limit: int = 10):
    ...
```
`/orders?status=delivered&limit=20` jaisa call inko populate karega. Default value dene se wo optional ban jaate hain.

### Q25. Path parameter aur Query parameter mein kya difference hai?
Path parameter URL path ka hi part hota hai aur generally resource identify karne ke liye use hota hai (jaise `/orders/{order_id}`) — ye mandatory hota hai. Query parameter URL ke `?key=value` part mein aata hai aur generally filtering, pagination, sorting jaise optional cases ke liye use hota hai.

### Q26. Request body kaise receive karte hain aur ye query params se kaise differentiate hota hai?
FastAPI automatically decide karta hai — agar parameter Pydantic model hai, use request body samjha jata hai; agar simple type (str, int, bool) hai aur path mein nahi hai, use query parameter samjha jata hai. Explicit banane ke liye `Body()`, `Query()`, `Path()` functions use kar sakte hain.

### Q27. Dependency Injection (`Depends`) FastAPI mein kaise kaam karta hai?
`Depends()` ek reusable function/class ko path operation mein inject karne ka mechanism hai. FastAPI dependency ko call karke result ko function parameter mein pass karta hai:
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/tasks")
async def read_tasks(db=Depends(get_db)):
    return db.query(Task).all()
```
Ye code reusability aur separation of concerns improve karta hai — same logic (DB session, auth check) multiple routes mein reuse ho jaata hai.

### Q28. Dependency injection use karne ke real-world benefits kya hain?
Isse authentication, DB connection, common validation logic ko centralize kar sakte hain, jisse code duplication kam hoti hai. Testing ke time dependencies ko easily override kar sakte hain (`app.dependency_overrides`), jisse unit testing bahut simplified ho jaati hai. Maine Task Management System mein API key authentication ko ek dependency ke roop mein implement kiya tha jo har protected route par reuse hota tha.

### Q29. Sub-dependencies (dependency ke andar dependency) kaise kaam karte hain?
Ek dependency function doosri dependency ko bhi `Depends()` ke through use kar sakti hai:
```python
def get_current_user(token: str = Depends(oauth2_scheme)):
    ...

def get_active_user(user=Depends(get_current_user)):
    if not user.is_active:
        raise HTTPException(400, "Inactive user")
    return user
```
FastAPI automatically dependency chain resolve karta hai, aur caching bhi karta hai (same dependency ek request ke andar dobara call nahi hoti by default).

### Q30. Class-based dependencies kya hote hain?
Function ki jagah callable class bhi dependency ban sakti hai, jisse configuration state maintain rakhna easy hota hai:
```python
class Pagination:
    def __init__(self, skip: int = 0, limit: int = 10):
        self.skip = skip
        self.limit = limit

@app.get("/items")
async def list_items(pagination: Pagination = Depends()):
    ...
```
Ye especially useful hota hai jab dependency ke multiple related parameters ho, jaise pagination.

### Q31. Path/Query parameter validation kaise add karte hain (constraints)?
`Path()` aur `Query()` functions se constraints define kar sakte hain:
```python
from fastapi import Query, Path

@app.get("/items/{item_id}")
async def read_item(
    item_id: int = Path(gt=0),
    q: str | None = Query(default=None, max_length=50)
):
    ...
```
Isse min/max value, string length, regex pattern jaise rules enforce ho jaate hain aur invalid input par automatically 422 error milta hai.

### Q32. FastAPI mein request body mein multiple objects kaise bhejte hain?
Multiple Pydantic model parameters ek saath declare karke:
```python
@app.post("/orders")
async def create_order(customer: Customer, item: Item):
    return {"customer": customer, "item": item}
```
FastAPI expect karega ki body JSON mein `customer` aur `item` keys ke andar respective data ho.

### Q33. `Depends` ka use authentication ke alawa kahan-kahan kar sakte hain?
Common use cases hain: database session provide karna, pagination parameters, rate-limiting checks, common query filters, logging/audit context, aur feature flag checks. Basically koi bhi reusable "pre-processing" logic jo multiple endpoints mein common ho, wahan Depends use kar sakte hain.

### Q34. FastAPI mein form data aur file upload kaise handle karte hain?
Form data ke liye `Form()` aur file ke liye `UploadFile`/`File()` use karte hain:
```python
from fastapi import File, UploadFile, Form

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), notes: str = Form(...)):
    contents = await file.read()
    ...
```
`UploadFile` async read support karta hai aur large files ko efficiently memory mein spool karta hai (disk par bhi spill kar sakta hai).

## 4. Async/Await, Background Tasks

### Q35. `async def` aur `def` route handlers mein FastAPI kya difference karta hai?
Agar route `async def` hai, FastAPI use directly event loop mein await karta hai. Agar route plain `def` hai, FastAPI use ek separate thread pool mein run karta hai taaki blocking code event loop ko block na kare. Isliye agar function ke andar blocking I/O (jaise sync DB driver) hai to `def` use karna safe hai, aur agar async-native library (jaise Motor, httpx async client) use kar rahe hain to `async def` use karna chahiye.

### Q36. Kab `async def` use karna chahiye aur kab regular `def`?
Agar function ke andar `await`-able operations hain (async DB calls, async HTTP calls) to `async def` use karo. Agar function CPU-bound hai ya sync libraries (jaise `requests`, sync SQLAlchemy) use kar raha hai to plain `def` better hai, kyunki FastAPI ise thread pool mein daal dega aur event loop free rahega.

### Q37. Agar `async def` route ke andar accidentally blocking call (jaise `time.sleep`) daal diya jaye to kya hoga?
Ye pura event loop ko block kar dega, matlab uss worker par chal rahi saari concurrent requests ruk jayengi jab tak blocking call complete na ho. Isliye `async def` ke andar hamesha `asyncio.sleep()` jaise non-blocking equivalents use karne chahiye, aur sync libraries ke liye `def` route ya `run_in_threadpool` use karna chahiye.

### Q38. `await` kya karta hai internally?
`await` current coroutine ko event loop ko wapas control de deta hai jab tak awaited operation complete nahi hoti (jaise I/O response aana). Isse event loop dusre pending tasks/requests ko process kar sakta hai. Jab operation complete hoti hai, coroutine wahi se resume hoti hai jahan se ruki thi.

### Q39. FastAPI ka `BackgroundTasks` kya hai aur ye Celery se kaise different hai?
`BackgroundTasks` FastAPI ka built-in feature hai jo response return hone ke turant baad, same process ke andar ek lightweight task run karta hai:
```python
from fastapi import BackgroundTasks

@app.post("/notify")
async def notify(background_tasks: BackgroundTasks):
    background_tasks.add_task(send_sms, "OTP sent")
    return {"status": "queued"}
```
Ye simple, short-running tasks (jaise ek email/SMS bhejna) ke liye acha hai. Celery zyada heavy-duty, distributed, retry-capable, scheduled task processing ke liye use hota hai jab tasks lambe chalen ya alag worker process mein chalne chahiye — jaisa maine RIoAI mein Celery + Redis se kiya.

### Q40. Async programming se performance kaise improve hota hai?
I/O-bound operations mein (DB call, external API call) jab ek request wait kar rahi hoti hai response ka, event loop dusri requests ko process kar sakta hai instead of idle rehne ke. Isse ek single process/worker zyada concurrent requests handle kar leta hai without needing zyada threads/processes, jo memory aur CPU dono efficient use karta hai.

### Q41. FastAPI mein multiple async operations ko parallelly kaise run karte hain?
`asyncio.gather()` use karte hain:
```python
import asyncio

async def fetch_all():
    result1, result2 = await asyncio.gather(
        call_evitalrx_api(),
        call_firebase_api()
    )
    return result1, result2
```
Isse dono independent async calls concurrently start ho jaate hain instead of sequentially wait karne ke, jo total response time significantly kam karta hai.

### Q42. Event loop kya hota hai?
Event loop asyncio ka core hai jo coroutines, callbacks, aur I/O events ko schedule aur execute karta hai. Ye single-threaded hota hai but multiple tasks ko cooperatively switch karta hai jab bhi koi task `await` par wait kar raha ho. Uvicorn is event loop ko manage karta hai FastAPI ke liye.

### Q43. Sync database driver ke saath async FastAPI route use karne mein kya problem ho sakti hai?
Agar sync driver (jaise PyMySQL sync mode) ko `async def` route ke andar directly call karein, to wo call blocking hogi aur event loop freeze ho jayega, jisse concurrency benefit khatam ho jaata hai. Solution ya to route ko `def` rakhna hai (thread pool mein chalega), ya async driver (jaise `asyncpg`, `Motor`) use karna hai, ya `run_in_threadpool` se wrap karna hai.

### Q44. RIoAI jaisa real-time high-concurrency app mein async design decisions kya important hain?
Third-party calls (EvitalRx, Firebase) ko async HTTP client (httpx.AsyncClient) se call karna chahiye taaki ek order process hone ke time doosre orders block na hon. Heavy/long-running tasks (jaise bulk notification bhejna, analytics processing) ko Celery mein offload karna chahiye instead of request cycle mein rakhne ke. Database bhi async driver (Motor for MongoDB) use karna chahiye taaki puri chain non-blocking rahe.

## 5. Authentication & Authorization

### Q45. API key authentication FastAPI mein kaise implement karte hain?
Ek dependency banate hain jo header se API key nikaal kar validate karti hai:
```python
from fastapi import Header, HTTPException, Depends

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

@app.get("/tasks", dependencies=[Depends(verify_api_key)])
async def get_tasks():
    ...
```
Maine Task Management System project mein isi pattern se API key authentication implement kiya tha taaki har request valid key ke saath aaye.

### Q46. OAuth2 FastAPI mein kaise implement hota hai?
FastAPI `OAuth2PasswordBearer` provide karta hai jo token-based auth ke liye standard flow implement karta hai:
```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    ...
```
Client `/token` endpoint par username/password bhejta hai, backend JWT access token return karta hai jo subsequent requests mein `Authorization: Bearer <token>` header mein bheja jaata hai.

### Q47. JWT (JSON Web Token) kya hota hai aur ye FastAPI mein kaise use hota hai?
JWT ek self-contained token hai jisme header, payload (claims jaise user_id, expiry) aur signature hoti hai. Ye stateless authentication allow karta hai — server ko session store maintain karne ki zaroorat nahi padti. `python-jose` ya `PyJWT` library se token generate/verify karte hain:
```python
from jose import jwt

token = jwt.encode({"sub": user_id, "exp": expiry}, SECRET_KEY, algorithm="HS256")
```
Har request mein token verify karke user identity confirm ki jaati hai.

### Q48. Password hashing FastAPI apps mein kaise karte hain?
`passlib` (with bcrypt) ya `pwdlib` library use karte hain, plain text password kabhi store nahi karte:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash(plain_password)
is_valid = pwd_context.verify(plain_password, hashed)
```
Login ke time verify() se compare karte hain, actual password kabhi decode nahi karte.

### Q49. Role-based authorization (RBAC) kaise implement karte hain?
User model mein role field rakhte hain, aur ek dependency banate hain jo current user ka role check karti hai:
```python
def require_role(role: str):
    def checker(user=Depends(get_current_user)):
        if user.role != role:
            raise HTTPException(403, "Not authorized")
        return user
    return checker

@app.delete("/orders/{id}", dependencies=[Depends(require_role("admin"))])
async def delete_order(id: int):
    ...
```
Ye pattern maine Picker/Delivery/Promoter apps jaise multiple user-type systems mein use hone wale approach jaisa hi hai — har role ki alag permissions.

### Q50. FastAPI mein security schemes (`fastapi.security`) module kya provide karta hai?
Ye module standard authentication mechanisms ready-made deta hai — `OAuth2PasswordBearer`, `APIKeyHeader`, `HTTPBasic`, `HTTPBearer` — jo automatically OpenAPI docs mein bhi reflect hote hain (Swagger UI mein "Authorize" button aata hai). Isse consistent aur documented security implementation ho paata hai.

### Q51. Refresh token pattern kya hai aur ye kyun use karte hain?
Access token generally short-lived hota hai (jaise 15-30 min) security ke liye, aur refresh token long-lived hota hai jo naya access token generate karne ke kaam aata hai bina user ko dobara login karwaye. Refresh token securely (httpOnly cookie ya secure storage) store hota hai aur ek separate endpoint (`/refresh-token`) se naya access token milta hai.

### Q52. Twilio SMS OTP verification flow FastAPI mein kaise design karte hain?
Pehle user registration/login request par ek OTP generate karke Twilio API se SMS bhejte hain, OTP ko temporarily Redis/DB mein expiry time ke saath store karte hain. User jab OTP submit karta hai, backend stored OTP se match karta hai aur match hone par session/token issue karta hai:
```python
otp = generate_otp()
redis_client.setex(f"otp:{phone}", 300, otp)
twilio_client.messages.create(body=f"Your OTP is {otp}", to=phone, from_=TWILIO_NUMBER)
```
Maine Task Management System mein exactly isi pattern se Twilio OTP verification implement kiya tha.

### Q53. CSRF aur XSS attacks se FastAPI APIs ko kaise protect karte hain?
CSRF generally cookie-based session auth mein risk hota hai — token-based (JWT in header) auth use karne se ye risk kam ho jaata hai. XSS se bachne ke liye output ko properly escape/sanitize karte hain aur `Content-Security-Policy` headers set karte hain. Sensitive cookies ko `HttpOnly`, `Secure`, aur `SameSite` flags ke saath set karna chahiye.

### Q54. Rate limiting FastAPI mein kaise implement karte hain?
`slowapi` library (jo Flask-Limiter se inspired hai) ya custom middleware use karke IP/user-based rate limits laga sakte hain:
```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.get("/otp/send")
@limiter.limit("5/minute")
async def send_otp(request: Request):
    ...
```
Ye especially important hai OTP send/verify jaise endpoints ke liye taaki brute-force ya spam attacks se bacha ja sake.

## 6. Middleware, CORS, Exception Handling

### Q55. Middleware FastAPI mein kya hota hai aur kaise define karte hain?
Middleware ek function/class hai jo har request ko route handler tak pahunchne se pehle, aur response client ko jaane se pehle intercept karta hai. Common uses hain logging, timing, auth checks:
```python
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = str(time.time() - start)
    return response
```

### Q56. CORS kya hai aur FastAPI mein kaise enable karte hain?
CORS (Cross-Origin Resource Sharing) browser ko allow karta hai ki wo ek origin (domain) se dusre origin ke API ko call kar sake. FastAPI mein `CORSMiddleware` use karte hain:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Multiple client apps (jaise Picker App, Delivery App, Promoter App) alag domains/subdomains se backend call karte hain to CORS properly configure karna zaroori hota hai.

### Q57. FastAPI mein custom exception handling kaise karte hain?
`@app.exception_handler()` decorator use karke custom exceptions ko specific response format mein convert kar sakte hain:
```python
class OrderNotFoundError(Exception):
    pass

@app.exception_handler(OrderNotFoundError)
async def order_not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"error": "Order not found"})
```
Isse business-specific errors ko consistent, client-friendly response format mein return kar sakte hain.

### Q58. `HTTPException` kya hota hai aur ise kab use karte hain?
`HTTPException` FastAPI ka built-in exception hai jo directly HTTP status code aur detail message ke saath error response bhej deta hai:
```python
from fastapi import HTTPException

if not order:
    raise HTTPException(status_code=404, detail="Order not found")
```
Ye standard error cases (404, 400, 401, 403) ke liye quick aur consistent way hai.

### Q59. Validation errors (422) FastAPI mein automatically kaise handle hote hain, aur inhe customize kaise karte hain?
Jab Pydantic validation fail hoti hai, FastAPI automatically `RequestValidationError` raise karke 422 status code ke saath detailed error return karta hai (kaunsa field, kya error). Custom format ke liye override kar sakte hain:
```python
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content={"errors": exc.errors()})
```

### Q60. Global exception handler kaise banate hain jo saari unhandled exceptions catch kare?
`Exception` class par handler register kar sakte hain taaki koi bhi unexpected error client ko generic aur safe response mein convert ho jaaye (aur internally logged rahe):
```python
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal server error"})
```
Ye production apps mein important hai taaki stack traces client ko leak na hon.

### Q61. Consistent error response structure design karne ke best practices kya hain?
Ek standard error schema define karna chahiye jisme `status_code`, `message`, aur optional `error_code`/`details` fields ho, taaki client apps (mobile/web) consistently error handle kar sakein. Har API mein same shape follow karna documentation aur client-side error handling dono simplify karta hai — RIoAI jaise multi-app ecosystem mein ye especially important hai.

### Q62. Middleware order matter karta hai kya, aur multiple middleware kaise chain hote hain?
Haan, order important hai — middleware LIFO (last-added, first-executed on request) order mein wrap hote hain. Jaise agar CORS middleware pehle add kiya hai aur logging baad mein, to request pehle logging se guzregi phir CORS se, aur response reverse order mein. Isliye critical middleware (jaise error-catching) ko strategically position karna zaroori hota hai.

## 7. Database Integration

### Q63. MongoDB ko FastAPI ke saath kaise integrate karte hain — Motor vs PyMongo?
PyMongo synchronous driver hai, jabki Motor async driver hai jo asyncio ke saath compatible hai. FastAPI ke async nature ka fayda uthane ke liye Motor better choice hai:
```python
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(MONGO_URI)
db = client.riodb

async def get_tasks():
    return await db.tasks.find().to_list(100)
```
RIoAI project mein maine MongoDB ka use data analytics modules ke liye kiya tha, jahan Motor se non-blocking queries chalti thi.

### Q64. SQLAlchemy FastAPI ke saath kaise integrate karte hain (sync aur async dono)?
Sync SQLAlchemy mein `Session` aur `sessionmaker` use karte hain, dependency ke through session provide karte hain. Async version (SQLAlchemy 2.0+) mein `AsyncSession` aur `asyncpg`/`aiomysql` driver use karte hain:
```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

engine = create_async_engine("postgresql+asyncpg://user:pass@host/db")

async def get_db():
    async with AsyncSession(engine) as session:
        yield session
```
`async def` routes ke saath consistency maintain karne ke liye async SQLAlchemy hi prefer karna chahiye.

### Q65. Connection pooling kya hai aur ye kyun important hai?
Connection pooling database connections ko reuse karta hai instead of har request par naya connection banane ke, jo expensive operation hota hai. SQLAlchemy mein `pool_size` aur `max_overflow` parameters se pool configure karte hain:
```python
engine = create_engine(DB_URL, pool_size=10, max_overflow=20)
```
Isse high traffic (jaise quick commerce peak hours) mein database load efficiently manage hota hai bina connection exhaustion ke.

### Q66. PostgreSQL vs MySQL — FastAPI project mein kaunsa kab choose karein?
PostgreSQL advanced features deta hai jaise JSONB support, better concurrency handling, aur complex queries mein strong performance — analytical workloads ke liye acha hai. MySQL simpler setups aur read-heavy workloads mein fast hota hai aur widely supported hai. Maine dono ke saath kaam kiya hai FastAPI ke through — choice project requirements (data complexity, existing infra) par depend karti hai.

### Q67. Redis ko FastAPI mein caching ke liye kaise use karte hain?
`redis-py` (async version `redis.asyncio`) se connect karke frequently accessed data cache karte hain:
```python
import redis.asyncio as redis

r = redis.Redis(host="localhost", port=6379)

async def get_medicine(id: str):
    cached = await r.get(f"medicine:{id}")
    if cached:
        return json.loads(cached)
    data = await fetch_from_db(id)
    await r.set(f"medicine:{id}", json.dumps(data), ex=300)
    return data
```
Ye database load kam karta hai aur response time significantly improve karta hai, especially quick commerce jaise apps mein jahan same items baar-baar query hote hain.

### Q68. Database transactions FastAPI mein kaise handle karte hain?
SQLAlchemy mein `session.begin()` ya explicit commit/rollback pattern use karte hain, taaki multiple related operations (jaise order create + inventory update) atomically succeed ya fail hon:
```python
async with session.begin():
    session.add(order)
    await update_inventory(session, item_id)
```
Agar beech mein exception aaye to rollback automatically ho jaata hai, jo data consistency ensure karta hai.

### Q69. N+1 query problem kya hota hai aur ise kaise avoid karte hain?
N+1 problem tab hota hai jab ek query se N records fetch karte hain, phir har record ke liye ek-ek related data fetch karne ke liye alag query chalti hai — total N+1 queries. SQLAlchemy mein `joinedload`/`selectinload` use karke eager loading se ise avoid karte hain. MongoDB mein aggregation pipeline (`$lookup`) se similar optimization karte hain.

### Q70. MongoDB schema design REST API ke liye kaise approach karte hain jab MongoDB schema-less hai?
Even though MongoDB flexible hai, hum Pydantic models ko schema definition ke roop mein use karte hain taaki application layer par consistency maintain rahe. Embedding vs referencing ka decision access patterns par depend karta hai — frequently-accessed-together data (jaise order + order items) embed karte hain, aur independently-growing data (jaise user aur unke saare orders) reference karte hain.

### Q71. Database migrations FastAPI + SQLAlchemy projects mein kaise manage karte hain?
`Alembic` library use karte hain jo SQLAlchemy ke saath integrate hoti hai, schema changes ko versioned migration files ke roop mein track karti hai:
```bash
alembic revision --autogenerate -m "add otp_verified column"
alembic upgrade head
```
Ye production deployments mein schema changes ko safely aur consistently apply karne mein help karta hai.

### Q72. Multiple databases (MongoDB, MySQL, PostgreSQL, Redis) ek hi FastAPI app mein kaise manage karte hain?
Har database ke liye alag connection module/client banate hain aur dependency injection ke through unhe respective routes mein provide karte hain. Jaise MongoDB analytics data ke liye, PostgreSQL/MySQL transactional data ke liye, aur Redis caching/session/OTP storage ke liye — har ek apni strength ke hisaab se use hota hai, aur clear separation of concerns rakhte hain configuration aur connection management mein.

## 8. Celery + Redis for Background/Async Task Processing

### Q73. Celery kya hai aur ise FastAPI ke saath kyun use karte hain?
Celery ek distributed task queue hai jo long-running ya resource-intensive tasks ko main request-response cycle se alag, separate worker processes mein async execute karta hai. FastAPI apna khud ka background processing solid nahi karta production scale ke liye, isliye Celery use karte hain jab tasks lambe chalein (jaise bulk notifications, report generation) ya retry/scheduling capability chahiye ho — jaisa maine RIoAI mein logistics scheduling ke liye use kiya.

### Q74. Celery mein Redis ka role kya hota hai (broker vs backend)?
Redis generally message broker ke roop mein use hota hai — ye task queue maintain karta hai jahan producer (FastAPI app) tasks bhejta hai aur Celery workers wahan se pick karte hain. Redis result backend ke roop mein bhi use ho sakta hai jahan task ka result/status store hota hai jo baad mein query kiya ja sake.

### Q75. Celery task kaise define aur trigger karte hain FastAPI se?
```python
# tasks.py
from celery import Celery

celery_app = Celery("riodb", broker="redis://localhost:6379/0")

@celery_app.task
def send_delivery_notification(order_id: str):
    ...

# main.py
@app.post("/orders/{order_id}/dispatch")
async def dispatch_order(order_id: str):
    send_delivery_notification.delay(order_id)
    return {"status": "dispatched"}
```
`.delay()` ya `.apply_async()` se task queue mein bhej dete hain, response turant client ko chala jaata hai bina task complete hone ka wait kiye.

### Q76. Celery periodic/scheduled tasks kaise setup karte hain?
`celery beat` scheduler use karte hain jo defined intervals par tasks trigger karta hai:
```python
celery_app.conf.beat_schedule = {
    "check-pending-orders": {
        "task": "tasks.check_pending_orders",
        "schedule": 60.0,  # every 60 seconds
    },
}
```
Maine RIoAI mein isi tarah background task scheduling ki thi jaise periodically pending deliveries check karna ya stale orders ko flag karna.

### Q77. Celery task retries aur failure handling kaise implement karte hain?
Task decorator mein `max_retries`, `retry_backoff` set karte hain aur exception par manually retry call karte hain:
```python
@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def call_evitalrx_api(self, order_id):
    try:
        response = requests.post(EVITALRX_URL, json={...})
        response.raise_for_status()
    except requests.RequestException as exc:
        raise self.retry(exc=exc)
```
Ye especially important hai third-party API calls (EvitalRx, Firebase) ke liye jahan temporary network failures common hote hain.

### Q78. Celery mein task priority aur multiple queues kaise manage karte hain?
Alag queues define karke tasks ko route kar sakte hain based on priority/type:
```python
celery_app.conf.task_routes = {
    "tasks.send_otp": {"queue": "high_priority"},
    "tasks.generate_report": {"queue": "low_priority"},
}
```
Alag workers ko alag queues consume karne ke liye assign karte hain (`celery worker -Q high_priority`), taaki critical tasks (jaise OTP SMS) low-priority tasks (jaise analytics) ke peeche stuck na rahein.

### Q79. Celery worker scaling aur monitoring kaise karte hain?
Worker concurrency (`-c` flag) aur multiple worker instances se horizontal scaling karte hain. Monitoring ke liye `Flower` tool use karte hain jo real-time dashboard deta hai — task status, worker health, queue length. Docker environment mein har worker ko alag container ke roop mein bhi run kar sakte hain jisse independently scale ho sake.

### Q80. FastAPI's `BackgroundTasks` aur Celery mein kab kya choose karein — decision criteria?
`BackgroundTasks` tab use karo jab task chhota ho, fast execute ho, aur agar worker crash ho jaye to koi bada nuksaan na ho (jaise ek log likhna). Celery tab use karo jab task lamba ho, retry/scheduling chahiye ho, multiple workers/processes mein distribute karna ho, ya failure recovery critical ho — jaisa delivery notifications ya logistics API calls ke liye RIoAI mein zaroori tha.

## 9. Third-Party API Integration Best Practices

### Q81. Third-party APIs (jaise EvitalRx, Firebase) ko FastAPI mein integrate karte time kaunse best practices follow karte hain?
Ek dedicated service/client class banate hain jo third-party API calls ko encapsulate kare, taaki business logic se coupling kam ho. Async HTTP client (`httpx.AsyncClient`) use karte hain non-blocking calls ke liye, timeouts explicitly set karte hain, aur credentials/keys ko environment variables ya secrets manager mein rakhte hain, hardcode kabhi nahi karte.

### Q82. External API calls mein timeout aur retry strategy kaise design karte hain?
```python
import httpx

async def call_evitalrx(payload):
    async with httpx.AsyncClient(timeout=10.0) as client:
        for attempt in range(3):
            try:
                response = await client.post(EVITALRX_URL, json=payload)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError:
                if attempt == 2:
                    raise
                await asyncio.sleep(2 ** attempt)
```
Exponential backoff se retries karte hain taaki downstream service ko overwhelm na karein, aur ek reasonable max timeout set karte hain taaki request hang na ho.

### Q83. Third-party API failure ka poore system par cascading impact kaise avoid karte hain (circuit breaker pattern)?
Circuit breaker pattern implement karte hain (jaise `pybreaker` library se) jo repeated failures dekh kar temporarily calls ko block kar deta hai instead of har request ko fail hone dene ke. Isse ek slow/down third-party service pura system slow/hang nahi karta — fallback response ya cached data serve kar sakte hain jab tak service recover na ho jaaye.

### Q84. Firebase integration FastAPI mein kaise karte hain (jaise push notifications ke liye)?
Firebase Admin SDK use karte hain (`firebase-admin` package), initialize karke service account credentials ke saath, aur async wrapper banate hain kyunki SDK sync hai:
```python
from firebase_admin import messaging

def send_push_notification(token: str, title: str, body: str):
    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token,
    )
    messaging.send(message)
```
Since ye sync call hai, ise `run_in_threadpool` mein wrap karte hain ya Celery task ke andar call karte hain taaki event loop block na ho.

### Q85. Twilio SMS integration mein error handling kaise karte hain?
Twilio API call ko try-except mein wrap karte hain aur specific Twilio exceptions (jaise invalid number, insufficient balance) ko catch karke appropriate response/logging karte hain:
```python
from twilio.base.exceptions import TwilioRestException

try:
    client.messages.create(body=msg, to=phone, from_=TWILIO_NUMBER)
except TwilioRestException as e:
    logger.error(f"Twilio error: {e.msg}")
    raise HTTPException(status_code=502, detail="Failed to send OTP")
```
Ye important hai kyunki OTP na milna directly user experience ko affect karta hai.

### Q86. Multiple third-party integrations (logistics, payment, notification) ko manage karte time architecture kaise design karte hain?
Har integration ke liye separate module/service layer banate hain (jaise `services/evitalrx.py`, `services/firebase.py`, `services/twilio.py`) jisse business logic third-party specific details se decoupled rahe. Common patterns (retry, logging, error handling) ko shared utility/base class mein extract karte hain taaki consistency rahe aur naya integration add karna easy ho.

## 10. Docker, Deployment, Testing, API Docs

### Q87. FastAPI app ko Docker mein containerize kaise karte hain?
Ek `Dockerfile` banate hain jo base Python image use karke dependencies install kare aur Uvicorn/Gunicorn se app run kare:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
RIoAI project mein maine har service (Picker App backend, Delivery App backend, Promoter App backend) ko independently Docker containers mein package kiya tha.

### Q88. Docker Compose ka use FastAPI + multiple services (DB, Redis, Celery) ke saath kaise karte hain?
`docker-compose.yml` mein har service (app, mongodb, redis, celery worker) ko define karte hain jo ek saath orchestrate ho:
```yaml
services:
  web:
    build: .
    ports: ["8000:8000"]
    depends_on: [redis, mongodb]
  redis:
    image: redis:7
  celery_worker:
    build: .
    command: celery -A tasks worker --loglevel=info
    depends_on: [redis]
```
Ye local development aur staging environments mein pura stack ek command (`docker-compose up`) se run karne mein help karta hai.

### Q89. Docker multi-stage builds kya hote hain aur inka fayda kya hai?
Multi-stage builds mein hum ek stage mein dependencies build karte hain (jaise heavy build tools ke saath) aur final stage mein sirf zaroori runtime artifacts copy karte hain. Isse final image size significantly chhota ho jaata hai aur security surface bhi kam hota hai kyunki unnecessary build tools production image mein nahi hote.

### Q90. FastAPI apps ke liye testing kaise karte hain (`TestClient`, pytest)?
FastAPI `TestClient` (Starlette ke `httpx`-based client par built) provide karta hai jisse actual server run kiye bina endpoints test kar sakte hain:
```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_create_task():
    response = client.post("/tasks", json={"title": "Test task"})
    assert response.status_code == 201
    assert response.json()["title"] == "Test task"
```
`pytest` fixtures ke saath dependency overrides (jaise test DB) combine karte hain taaki tests isolated aur repeatable ho.

### Q91. Async endpoints ka testing kaise karte hain?
`httpx.AsyncClient` ke saath `pytest-asyncio` use karte hain:
```python
import pytest
from httpx import AsyncClient, ASGITransport

@pytest.mark.asyncio
async def test_async_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/tasks")
    assert response.status_code == 200
```
Ye real async behavior ko properly simulate karta hai, especially jab dependencies bhi async hon (jaise Motor).

### Q92. Database dependencies ko testing ke liye kaise mock/override karte hain?
FastAPI ka `app.dependency_overrides` dictionary use karte hain jisse production DB dependency ko test DB (ya in-memory/mock DB) se replace kar sakte hain:
```python
app.dependency_overrides[get_db] = get_test_db
```
Isse tests real database par depend nahi karte aur fast, isolated, aur repeatable rehte hain.

### Q93. Swagger UI (`/docs`) aur ReDoc (`/redoc`) mein kya difference hai?
Dono FastAPI ke automatically generated OpenAPI schema se banate hain, lekin Swagger UI interactive hai — directly browser se API calls test kar sakte hain ("Try it out" button). ReDoc zyada clean, read-only documentation view deta hai jo bade/complex APIs ke liye better readability deta hai. Production mein sensitive APIs ke liye inko disable ya restrict bhi kar sakte hain (`docs_url=None`).

### Q94. Production deployment mein FastAPI app ke liye health check endpoint kyun zaroori hota hai?
Health check endpoint (jaise `/health`) container orchestration tools (Docker, Kubernetes, load balancers) ko batata hai ki app running aur responsive hai ya nahi:
```python
@app.get("/health")
async def health_check():
    return {"status": "ok"}
```
Isse automated systems failed containers ko detect karke restart ya traffic reroute kar sakte hain, jo high-availability quick commerce apps ke liye critical hota hai.

## 11. Scenario/Project-Based Questions (RIoAI & Task Management System)

### Q95. RIoAI mein aapne Picker App, Delivery App, aur Promoter App ke backend systems ko kaise architect kiya — ek hi FastAPI app mein ya alag services mein?
Maine har app ke liye logically (aur kuch cases mein physically) separate backend modules/services design kiye, jinme shared core (auth, DB models, common utilities) ek common layer se aata tha lekin har app-specific business logic (Picker ke liye pickup workflow, Delivery ke liye route/status updates, Promoter ke liye order assignment) alag routers/services mein rehta tha. Isse independent scaling, deployment, aur ownership possible hui — jaise Delivery App ka traffic spike hone par sirf uske containers scale kar sakte the bina poore system ko affect kiye.

### Q96. 15-20 minute delivery guarantee ke liye backend performance kaise ensure karte the?
Critical path (order placement se dispatch tak) ko heavily optimize kiya — async I/O everywhere (FastAPI async routes, Motor for MongoDB, async httpx for EvitalRx/Firebase calls), Redis caching frequently accessed data (jaise medicine inventory, nearby delivery agents) ke liye, aur non-critical operations (notifications, analytics logging) ko Celery background tasks mein offload kiya taaki wo main request-response cycle ko slow na karein. Database indexing aur connection pooling bhi properly tune kiya tight latency budgets ke liye.

### Q97. EvitalRx jaisi third-party logistics API integration mein aapko kaunsi challenges face karni padi aur kaise solve kiya?
Main challenge thi API latency aur occasional failures ka handle karna without blocking order flow. Maine async calls with timeouts aur retry-with-backoff logic implement ki, aur critical failures ke liye Celery task queue mein retry offload kiya taaki order creation flow blocked na rahe. Failure cases mein graceful degradation design kiya — jaise agar real-time inventory check fail ho jaye to last-known cached data se proceed karna aur background mein reconcile karna.

### Q98. Task Management System mein Twilio SMS OTP verification flow end-to-end kaise design kiya tha?
User registration request aane par ek unique OTP generate hota tha jo Redis mein short expiry (jaise 5 min) ke saath store hota tha, phir Twilio API se SMS bheja jaata tha. User OTP submit karta to backend Redis se stored value match karta — match hone par user verified mark hokar account active hota, aur API key/token issue hota further authenticated requests ke liye. Rate limiting bhi laga tha OTP resend endpoint par taaki spam/abuse rok sakein.

### Q99. Background task scheduling design karte time (Celery + Redis) aapne kin failure scenarios ko handle kiya?
Task failure ke liye retry with exponential backoff set kiya (max retries ke baad task ko dead-letter queue ya alert-triggering state mein move kiya), worker crash ke case mein Celery ki acknowledgment-late feature use ki taaki incomplete task dobara pick ho sake, aur idempotency ensure ki (jaise same notification dobara na bheje) using unique task IDs/keys checks. Monitoring ke liye Flower dashboard aur logs use kiye taaki stuck/failed tasks jaldi identify ho sakein.

### Q100. RIoAI jaisa quick commerce system ko future mein aur scale karna ho (jaise 10x orders), to aap kya architectural changes suggest karoge?
Main areas hongi: (1) Database ko horizontally scale karna — MongoDB sharding aur read replicas add karna, (2) Celery workers ko queue-type ke hisaab se auto-scale karna (Kubernetes HPA jaisa mechanism), (3) API Gateway/load balancer ke through traffic ko multiple FastAPI instances mein distribute karna, (4) Redis caching layer ko cluster mode mein expand karna, aur (5) third-party API calls ke liye stronger circuit breakers aur fallback mechanisms add karna taaki ek downstream failure poore system ko affect na kare. AI tools (Claude/ChatGPT) ka use bhi rapid prototyping aur code review mein continue karungi taaki development velocity high rahe scale ke saath bhi.
