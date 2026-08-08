# Django Interview Questions & Answers (Hinglish)

Yeh file Django aur Django REST Framework (DRF) ke top 100 interview questions cover karti hai, jo Khushi ke resume (Backend Developer Intern @ Shamaim Lifestyle, Real-time Chat Application project) ke experience se directly relevant hain. Sab answers Hinglish mein hain, practical aur interview-ready.

## 1. Django Basics

### Q1. Django kya hai aur ise kyu use karte hain?
Django ek high-level Python web framework hai jo rapid development aur clean, pragmatic design promote karta hai. Isme "batteries-included" philosophy hai — ORM, admin panel, authentication, form handling, security features sab built-in milte hain. Use isliye karte hain kyunki yeh development time kam karta hai, scalable hai, aur security (CSRF, XSS, SQL injection) ke against by default protect karta hai.

### Q2. MVT architecture kya hai? MVC se kaise different hai?
MVT ka matlab hai Model-View-Template. Model data aur business logic handle karta hai, Template presentation layer (HTML) hai, aur View request ko process karke Model se data leke Template ko render karta hai. Traditional MVC mein Controller request handle karta hai, lekin Django mein yeh kaam Django framework khud (URL dispatcher) karta hai, isliye View, MVC ke Controller jaisa behave karta hai.

### Q3. Django project aur Django app mein kya difference hai?
Project ek pura web application hota hai jisme settings, URLs, WSGI config hote hain — `django-admin startproject`. App ek reusable module hai jo ek specific functionality (jaise blog, chat, auth) provide karta hai — `python manage.py startapp`. Ek project mein multiple apps ho sakte hain, aur ek app multiple projects mein reuse ho sakti hai.

### Q4. Django settings.py file mein kya important cheezein hoti hain?
`INSTALLED_APPS` (registered apps), `MIDDLEWARE`, `DATABASES` (DB config), `TEMPLATES`, `STATIC_URL`/`MEDIA_URL`, `ALLOWED_HOSTS`, `SECRET_KEY`, aur `DEBUG` flag. Production mein `DEBUG=False` aur secrets environment variables se load karna best practice hai.

### Q5. `manage.py` ka use kya hai?
`manage.py` ek command-line utility hai jo project-specific administrative tasks ke liye use hota hai — jaise `runserver`, `migrate`, `makemigrations`, `createsuperuser`, `shell`, `test`. Yeh `django-admin` ka wrapper hai jo automatically `DJANGO_SETTINGS_MODULE` set kar deta hai.

### Q6. Django ka request-response cycle kaise kaam karta hai?
Client request bhejta hai, WSGI/ASGI server usko Django ko forward karta hai. Middleware chain request ko process karta hai, phir URL resolver (`urls.py`) matching view dhundta hai. View business logic execute karke Model se data fetch karta hai aur Template render karke ya JSON response bana ke response return karta hai. Response wapas middleware chain se hoke client tak jata hai.

### Q7. Django mein middleware kya hota hai?
Middleware ek hook/plugin system hai jo request aur response cycle ke beech mein process karta hai — global level pe. Har request middleware stack se guzarta hai (top to bottom) view tak pahunchne se pehle, aur response wapas jate waqt (bottom to top) guzarta hai. Example: `AuthenticationMiddleware`, `SessionMiddleware`, `CsrfViewMiddleware`.

### Q8. Django ka templating engine kaise kaam karta hai?
Django Template Language (DTL) HTML mein dynamic content inject karne deta hai using `{{ variable }}` aur `{% tag %}` syntax. Templates mein loops (`{% for %}`), conditionals (`{% if %}`), filters (`{{ value|filter }}`), aur template inheritance (`{% extends %}`, `{% block %}`) support hoti hai jo code reuse badhata hai.

### Q9. Django mein `settings.py` mein environment-specific configuration kaise manage karte hain?
Best practice hai `python-decouple` ya `django-environ` jaisi libraries use karna jo `.env` file se secrets aur config read karti hain. Alag settings files bhi bana sakte hain (`base.py`, `dev.py`, `prod.py`) jo common settings inherit karti hain. Isse sensitive data (DB password, secret key) code mein hardcode nahi hota.

### Q10. Django synchronous hai ya asynchronous?
Traditionally Django WSGI-based synchronous framework tha, lekin Django 3.1+ se ASGI support aur async views/middleware aa gaye hain. Async support real-time features (WebSockets via Django Channels) aur long-running I/O operations ke liye useful hai, jaise chat applications mein.

## 2. Models, ORM, Migrations, QuerySets, Relationships

### Q11. Django ORM kya hai?
ORM (Object Relational Mapping) ek layer hai jo Python classes (Models) ko database tables se map karta hai. Isse hum raw SQL likhe bina Python code se database operations (CRUD) perform kar sakte hain, aur yeh multiple databases (PostgreSQL, MySQL, SQLite) ke saath abstraction provide karta hai.

### Q12. Django Model kaise define karte hain?
```python
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
```
Har field database column ko represent karta hai, aur Django automatically primary key (`id`) add kar deta hai.

### Q13. Migrations kya hote hain aur kaise kaam karte hain?
Migrations Django ka version control system hai for database schema. `makemigrations` model changes se migration files generate karta hai, aur `migrate` un files ko actually database mein apply karta hai. Yeh team collaboration mein schema changes track karne mein help karta hai.

### Q14. `makemigrations` aur `migrate` mein kya difference hai?
`makemigrations` model changes ko detect karke migration files (Python code) generate karta hai jisme SQL operations describe hote hain, lekin database ko touch nahi karta. `migrate` un pending migrations ko actually database par execute karta hai aur schema update karta hai.

### Q15. ForeignKey relationship kya hoti hai? Example do.
ForeignKey ek-se-many (one-to-many) relationship define karti hai. Jaise ek User ke multiple Messages ho sakte hain:
```python
sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
```
`on_delete=models.CASCADE` ka matlab hai agar User delete hoga toh uske related Messages bhi delete ho jayenge.

### Q16. ManyToManyField kab use karte hain?
Jab do models ke beech many-to-many relationship ho, jaise ek Chat Room mein multiple Users ho sakte hain aur ek User multiple Rooms mein part le sakta hai:
```python
members = models.ManyToManyField(User, related_name='rooms')
```
Django internally ek junction/through table create karta hai isko manage karne ke liye.

### Q17. OneToOneField kya hai aur ForeignKey se kaise different hai?
OneToOneField ek strict one-to-one relationship enforce karti hai — jaise User aur UserProfile. ForeignKey mein ek record kai dusre records se link ho sakta hai, lekin OneToOneField mein har record sirf ek hi related record se link hota hai (unique constraint ke saath).
```python
user = models.OneToOneField(User, on_delete=models.CASCADE)
```

### Q18. QuerySet kya hai? Lazy evaluation ka matlab kya hai?
QuerySet ek collection hai database objects ka jo ORM query se return hota hai. Yeh "lazy" hota hai — matlab jab tak QuerySet ko actually evaluate nahi kiya jata (jaise iterate karna, `list()` call karna, ya print karna), tab tak database query execute nahi hoti. Isse chaining efficient hoti hai.

### Q19. `filter()` aur `exclude()` mein kya difference hai?
`filter()` un records ko return karta hai jo given condition ko satisfy karte hain, jabki `exclude()` un records ko return karta hai jo condition ko satisfy NAHI karte.
```python
Message.objects.filter(sender=user)
Message.objects.exclude(sender=user)
```

### Q20. `select_related()` aur `prefetch_related()` mein kya difference hai?
`select_related()` SQL JOIN use karke ForeignKey/OneToOne relationships ko ek hi query mein fetch karta hai — forward relations ke liye best. `prefetch_related()` separate queries chalata hai aur Python level pe join karta hai — ManyToMany aur reverse ForeignKey relations ke liye use hota hai. Dono N+1 query problem solve karte hain.

### Q21. `values()` aur `values_list()` kya karte hain?
`values()` QuerySet ko dictionaries ki list return karta hai, jabki `values_list()` tuples ki list return karta hai. Dono full model objects instantiate kiye bina specific fields fetch karte hain, jo memory-efficient hota hai jab pura object chahiye na ho.

### Q22. Django mein aggregation aur annotation kaise karte hain?
`aggregate()` pure QuerySet par ek summary value return karta hai (jaise `Count`, `Sum`, `Avg`), jabki `annotate()` har object ke saath ek computed value attach karta hai.
```python
from django.db.models import Count
User.objects.annotate(msg_count=Count('messages'))
```

### Q23. Model Meta class ka use kya hota hai?
`Meta` class model ke andar metadata define karti hai jaise `ordering` (default sort order), `db_table` (custom table name), `unique_together`, `verbose_name`, aur `indexes`. Yeh actual database fields nahi hote, balki model ke behavior ko configure karte hain.
```python
class Meta:
    ordering = ['-created_at']
```

### Q24. Custom model manager kya hota hai?
Manager wo interface hai jisse database query operations perform hote hain (`objects` default manager hai). Custom manager banake hum reusable query logic encapsulate kar sakte hain.
```python
class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)
```

### Q25. Django mein database transactions kaise handle karte hain?
`django.db.transaction` module use karke, especially `@transaction.atomic` decorator ya context manager se, hum ensure karte hain ki multiple DB operations ek atomic unit ki tarah execute ho — agar beech mein error aaye toh sab rollback ho jayega, data consistency maintain rehti hai.
```python
with transaction.atomic():
    order.save()
    payment.save()
```

## 3. Django REST Framework (DRF)

### Q26. Django REST Framework kya hai aur ise kyu use karte hain?
DRF ek toolkit hai Django ke upar RESTful APIs banane ke liye. Yeh serialization, authentication, permissions, viewsets, browsable API, aur pagination jaisi features out-of-the-box deta hai, jisse API development bahut fast aur standardized ho jata hai — jaisa maine Shamaim mein backend APIs banane ke liye use kiya tha.

### Q27. Serializer kya hota hai DRF mein?
Serializer complex data types (jaise model instances ya querysets) ko Python native datatypes mein convert karta hai jo phir JSON/XML mein render ho sakte hain, aur reverse process (deserialization) mein incoming JSON data ko validate karke Python objects/model instances mein convert karta hai.

### Q28. `Serializer` aur `ModelSerializer` mein kya difference hai?
`Serializer` class mein har field manually define karni padti hai, jabki `ModelSerializer` model ke fields automatically introspect karke serializer fields generate kar deta hai, plus default `create()` aur `update()` methods bhi provide karta hai — boilerplate kam ho jata hai.
```python
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'created_at']
```

### Q29. Serializer validation kaise kaam karti hai?
DRF field-level validation (`validate_<field_name>`), object-level validation (`validate` method), aur built-in validators (jaise `UniqueValidator`) support karta hai. Jab `serializer.is_valid()` call hota hai, sab validations run hoti hain aur errors `serializer.errors` mein collect hote hain.
```python
def validate_content(self, value):
    if not value.strip():
        raise serializers.ValidationError("Content empty nahi ho sakta")
    return value
```

### Q30. APIView, GenericAPIView aur ViewSet mein kya difference hai?
`APIView` sabse basic class hai jaha manually HTTP methods (`get`, `post`) handle karte hain. `GenericAPIView` common patterns (list, retrieve, create) ke liye mixins ke saath reusable behavior deti hai. `ViewSet` ek higher-level abstraction hai jo related views (list, create, retrieve, update, delete) ko ek single class mein group karta hai.

### Q31. `ModelViewSet` kya hai?
`ModelViewSet` DRF ka ek ready-made viewset hai jo automatically CRUD operations (list, create, retrieve, update, partial_update, destroy) provide karta hai bas `queryset` aur `serializer_class` define karke.
```python
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
```

### Q32. DRF mein Router kya karta hai?
Router automatically URL patterns generate karta hai ViewSets ke liye, manually har action ke liye URL define karne ki zarurat nahi padti.
```python
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register('messages', MessageViewSet)
```

### Q33. Generic views DRF mein kaunse hain?
`ListAPIView`, `CreateAPIView`, `RetrieveAPIView`, `UpdateAPIView`, `DestroyAPIView`, aur combined views jaise `ListCreateAPIView`, `RetrieveUpdateDestroyAPIView`. Yeh common CRUD patterns ke liye pre-built views hain jo minimal code likhne dete hain.

### Q34. DRF mein pagination kaise implement karte hain?
DRF built-in pagination classes deta hai — `PageNumberPagination`, `LimitOffsetPagination`, `CursorPagination`. Settings mein globally set kar sakte hain ya per-view override kar sakte hain.
```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}
```

### Q35. Nested serializers kya hote hain aur kab use karte hain?
Jab ek model ka related object bhi serialize karke response mein dikhana ho — jaise Message ke saath uske Sender ki full details. Serializer field mein dusra serializer nest kar dete hain (`SenderSerializer(read_only=True)`). Isse related data ek hi API call mein mil jata hai, extra requests nahi lagti.

### Q36. DRF mein custom permission class kaise banate hain?
`BasePermission` class extend karke `has_permission` aur `has_object_permission` methods override karte hain.
```python
class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user
```

### Q37. DRF mein throttling kya hai?
Throttling API request rate ko control karta hai taaki ek user/client zyada requests bhejke server overload na kare. `AnonRateThrottle`, `UserRateThrottle` built-in hain, aur custom throttle bhi bana sakte hain jaise `'user': '100/day'`.

### Q38. DRF mein filtering aur searching kaise implement karte hain?
`django-filter` package integrate karke `DjangoFilterBackend` use karte hain field-based filtering ke liye, aur `SearchFilter` text search ke liye. `OrderingFilter` results ko sort karne ke liye use hota hai.
```python
filter_backends = [DjangoFilterBackend, filters.SearchFilter]
search_fields = ['content']
```

### Q39. DRF mein content negotiation kya hota hai?
Content negotiation ye decide karta hai ki response kis format mein return ho (JSON, XML, browsable HTML) based on request headers (`Accept`) ya URL suffix. DRF renderers (`JSONRenderer`, `BrowsableAPIRenderer`) is process ko handle karte hain.

### Q40. DRF mein `@api_view` decorator aur class-based views mein kab kya use karna chahiye?
`@api_view` function-based simple aur chhoti APIs ke liye achha hai jaha logic straightforward hai. Class-based views (APIView, generics, viewsets) reusability, DRY code aur complex CRUD logic ke liye better hain, especially bade projects mein jaha maintainability important hai.

## 4. Authentication & Authorization

### Q41. Django mein authentication aur authorization mein kya difference hai?
Authentication verify karta hai "aap kaun ho" — jaise login credentials check karna. Authorization decide karta hai "aap kya kar sakte ho" — jaise permissions aur access control (kya user delete kar sakta hai ya nahi).

### Q42. Session-based authentication kaise kaam karti hai Django mein?
Login ke baad Django server-side session create karta hai aur ek session ID cookie client ko bhejta hai. Har subsequent request mein cookie automatically bhejta hai jisse server user ko identify karta hai. Session data database ya cache mein store hota hai. Yeh maine Shamaim project mein secure session management ke liye use kiya tha.

### Q43. JWT authentication kya hai aur session-based se kaise different hai?
JWT (JSON Web Token) stateless authentication mechanism hai jisme server har request pe DB check nahi karta — token khud mein encrypted user info carry karta hai (signed with secret key). Session-based stateful hai (server side storage chahiye), JWT stateless hai — isliye scalable aur microservices/mobile apps ke liye better suited hai.

### Q44. DRF mein JWT authentication kaise setup karte hain?
`djangorestframework-simplejwt` package use karte hain.
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```
Login pe access aur refresh token milte hain, aur har request mein `Authorization: Bearer <token>` header bhejni hoti hai.

### Q45. Access token aur refresh token mein kya difference hai?
Access token short-lived hota hai aur actual API requests authenticate karne ke liye use hota hai. Refresh token longer-lived hota hai aur naya access token generate karne ke kaam aata hai jab purana expire ho jaye — bina user ko dobara login kiye.

### Q46. Django mein custom authentication backend kaise banate hain?
`django.contrib.auth.backends.BaseBackend` extend karke `authenticate()` aur `get_user()` methods implement karte hain — jaise email-based login ya third-party OAuth integrate karna.
```python
class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
```

### Q47. Django mein permissions kaise manage hote hain?
Django built-in permission system deta hai — model-level permissions (add, change, delete, view) automatically create hote hain. `@permission_required` decorator ya `PermissionRequiredMixin` use karke views protect karte hain. DRF mein `permission_classes` (`IsAuthenticated`, `IsAdminUser`, custom permissions) use hote hain.

### Q48. Password hashing Django mein kaise hoti hai?
Django passwords ko plain text mein kabhi store nahi karta — `PBKDF2` (default), `Argon2`, ya `bcrypt` jaise hashing algorithms use karta hai with salting. `set_password()` method hash karta hai aur `check_password()` verify karta hai.

### Q49. CSRF protection Django mein kaise kaam karta hai?
Django har form/POST request ke saath ek unique CSRF token generate karta hai jo session se linked hota hai. Server request receive karte waqt token verify karta hai — agar match nahi hua toh request reject ho jata hai. Yeh Cross-Site Request Forgery attacks se protect karta hai. `{% csrf_token %}` template tag se add hota hai.

### Q50. Secure session management ke liye best practices kya hain?
Session cookies ko `HttpOnly` aur `Secure` flag ke saath set karna (JavaScript access aur non-HTTPS access block karne ke liye), session timeout set karna, `SESSION_COOKIE_SAMESITE` configure karna CSRF/XSS attacks se bachne ke liye, aur login ke baad session ID regenerate karna (session fixation prevent karne ke liye).

## 5. Django Admin, Middleware, Signals

### Q51. Django admin panel kya hai?
Django admin ek auto-generated, customizable interface hai jisse developers/admins database records manage kar sakte hain bina custom UI banaye. Model ko `admin.py` mein register karte hi CRUD interface mil jata hai.
```python
admin.site.register(Message)
```

### Q52. `ModelAdmin` class customize kaise karte hain?
`ModelAdmin` class extend karke `list_display`, `search_fields`, `list_filter`, `readonly_fields` jaise attributes set karte hain admin interface ko customize karne ke liye.
```python
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'created_at')
    search_fields = ('content',)
```

### Q53. Middleware ka execution order kaise hota hai?
`MIDDLEWARE` list mein order matter karta hai — request phase mein top-to-bottom execute hota hai, aur response phase mein bottom-to-top. Isliye security-related middleware jaise `SecurityMiddleware` usually top pe hoti hai.

### Q54. Custom middleware kaise banate hain?
Ek callable class banate hain jisme `__init__` aur `__call__` method ho.
```python
class LogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"Request: {request.path}")
        response = self.get_response(request)
        return response
```

### Q55. Django signals kya hote hain?
Signals ek mechanism hain jo decoupled applications ko notify karte hain jab koi event occur hota hai — jaise model save hone se pehle/baad mein. Common signals: `pre_save`, `post_save`, `pre_delete`, `post_delete`.
```python
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
```

### Q56. Signals kab use karne chahiye aur kab avoid karne chahiye?
Signals loosely-coupled side effects (jaise notification bhejna, related object create karna) ke liye achhe hain jab logic model ke direct control mein na ho. Lekin overuse se debugging mushkil ho jati hai kyunki flow implicit ho jata hai — critical business logic ke liye explicit method calls better hain.

### Q57. Django admin mein inline models kya hote hain?
Inline models (`TabularInline`, `StackedInline`) related models ko parent model ke admin page pe hi edit karne dete hain — jaise ek ChatRoom admin page pe uske Messages bhi inline edit ho sake.
```python
class MessageInline(admin.TabularInline):
    model = Message
```

### Q58. Django mein `AppConfig` aur `apps.py` ka use kya hai?
`apps.py` mein `AppConfig` class app ki metadata (name, default auto field) define karti hai aur `ready()` method mein signals register karne jaisa initialization code likha jata hai jo app load hote hi run hota hai.

## 6. URL Routing, Views (FBV vs CBV)

### Q59. Django mein URL routing kaise kaam karti hai?
`urls.py` mein `urlpatterns` list hoti hai jisme `path()` ya `re_path()` se URL patterns view functions/classes se map kiye jate hain. Django incoming request ka path in patterns se match karta hai top-to-bottom aur pehla match wali view call karta hai.
```python
urlpatterns = [
    path('messages/<int:pk>/', views.message_detail, name='message-detail'),
]
```

### Q60. Function-Based Views (FBV) aur Class-Based Views (CBV) mein kya difference hai?
FBV simple Python functions hote hain jo request lete hain aur response return karte hain — straightforward aur readable chhoti logic ke liye. CBV classes use karte hain jo inheritance aur mixins ke through code reuse aur organization better dete hain — especially CRUD operations ke liye.

### Q61. Django ke generic class-based views kaunse hain?
`ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView`, `TemplateView`, `FormView`. Yeh common patterns (list dikhana, detail dikhana, form handle karna) ke liye boilerplate kam karte hain.

### Q62. URL namespacing kyu use karte hain?
Jab multiple apps mein same-named URLs ho sakte hain, namespacing (`app_name` variable) unhe unique bana deta hai. `{% url 'chat:room-detail' %}` jaise reference se conflict avoid hota hai aur code maintainable rehta hai.

### Q63. `path()` aur `re_path()` mein kya difference hai?
`path()` simple string patterns aur converters (`<int:id>`, `<str:name>`) use karta hai jo readable aur fast hai. `re_path()` regular expressions support karta hai complex URL matching ke liye jaha `path()` ke converters insufficient hote hain.

### Q64. Django views mein `request.GET` aur `request.POST` mein kya difference hai?
`request.GET` URL query parameters access karne ke liye hota hai (jaise `?search=abc`), jabki `request.POST` form data access karta hai jo POST request body mein bheja gaya ho. Dono `QueryDict` objects hote hain.

### Q65. Django mein mixins ka use kya hai CBV ke saath?
Mixins reusable pieces of functionality hote hain jo multiple inheritance ke through views mein add kiye jate hain — jaise `LoginRequiredMixin` (authentication check) ya `PermissionRequiredMixin`. Isse cross-cutting concerns different views mein consistently apply hote hain.
```python
class MessageListView(LoginRequiredMixin, ListView):
    model = Message
```

### Q66. `HttpResponse`, `JsonResponse`, aur `render()` mein kya difference hai?
`HttpResponse` raw content (text/HTML) return karta hai. `JsonResponse` Python dict ko JSON mein serialize karke correct content-type ke saath return karta hai — APIs ke liye useful. `render()` template ko context data ke saath render karke `HttpResponse` return karta hai.

## 7. Real-time Features — Django Channels, WebSockets

### Q67. Django Channels kya hai?
Django Channels ek library hai jo Django ko WebSockets, HTTP2, aur background tasks jaisi async protocols handle karne ki capability deti hai — traditional Django sirf HTTP request-response handle karta hai, Channels usko real-time, bidirectional communication ke layak banata hai.

### Q68. WebSocket kya hai aur HTTP se kaise different hai?
WebSocket ek full-duplex communication protocol hai jo ek single, persistent connection establish karta hai client aur server ke beech, jisse dono directions mein data real-time flow ho sakta hai. HTTP request-response based hai — har baar naya connection chahiye. Chat applications mein WebSocket use karne se instant message delivery possible hoti hai bina baar-baar polling kiye.

### Q69. Mere Chat Application project mein WebSocket kaise implement kiya gaya?
Django Channels use karke ek `ChatConsumer` class banayi jo WebSocket connections handle karti hai. Jab user chat room join karta hai, connection ek "channel group" mein add hoti hai. Jab bhi koi message bhejta hai, wo group ke sabhi connected clients ko broadcast hota hai real-time mein, without page refresh.

### Q70. Consumer kya hota hai Django Channels mein?
Consumer, Django ke View jaisa hi hai lekin WebSocket connections ke liye. `AsyncWebsocketConsumer` extend karke `connect()`, `receive()`, aur `disconnect()` methods define karte hain jo connection lifecycle handle karte hain.
```python
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = f"chat_{self.scope['url_route']['kwargs']['room_name']}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": data["message"]}
        )
```

### Q71. Channel layer kya hota hai aur kyu zaruri hai?
Channel layer ek communication system hai jo alag consumers/processes ke beech messages pass karne deta hai — jaise ek user ka message dusre connected users tak broadcast karna. Production mein Redis-based channel layer use karte hain (`channels_redis`) taaki multiple server instances ke beech bhi messages sync ho sakein.

### Q72. Routing kaise hoti hai Channels mein (`asgi.py`, `routing.py`)?
`asgi.py` protocol type router define karta hai jo HTTP aur WebSocket requests ko alag-alag handle karta hai. `routing.py` mein WebSocket URL patterns consumers se map kiye jate hain, jaise Django ke `urls.py` ki tarah.
```python
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
})
```

### Q73. Real-time chat mein message history efficiently store aur retrieve kaise ki?
Har message ko database mein Model (sender, room, content, timestamp) ke saath store kiya, indexed on `room_id` aur `created_at` fields taaki recent messages fast query ho sakein. Jab user chat room open karta hai, last N messages pagination ke saath load hote hain (lazy loading) taaki full history ek saath fetch na ho aur performance achhi rahe.

### Q74. WebSocket connections mein authentication kaise handle karte hain?
Django Channels mein `AuthMiddlewareStack` use karke session-based ya token-based authentication ko WebSocket scope mein pass karte hain. Consumer ke `connect()` method mein `self.scope["user"]` check karke verify karte hain ki user authenticated hai, agar nahi toh connection reject/close kar dete hain.

## 8. File Uploads/Sharing, Media Handling, Static Files

### Q75. Django mein file upload kaise handle karte hain?
Model mein `FileField` ya `ImageField` use karte hain, aur form/serializer mein `request.FILES` se uploaded file access karte hain. Settings mein `MEDIA_ROOT` aur `MEDIA_URL` configure karna zaruri hai taaki files properly store aur serve ho sakein.
```python
class SharedFile(models.Model):
    file = models.FileField(upload_to='shared_files/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
```

### Q76. `MEDIA_ROOT` aur `MEDIA_URL` mein kya difference hai?
`MEDIA_ROOT` server ke filesystem ka absolute path hai jaha uploaded files physically store hoti hain. `MEDIA_URL` wo URL prefix hai jisse browser un files ko access karta hai. Development mein Django serve karta hai, production mein Nginx/S3 jaisi service use hoti hai.

### Q77. `STATIC_URL`, `STATIC_ROOT`, aur `STATICFILES_DIRS` mein kya difference hai?
`STATIC_URL` static files (CSS, JS) access karne ka URL prefix hai. `STATICFILES_DIRS` development mein additional directories batata hai jaha static files search karni hain. `STATIC_ROOT` wo location hai jaha `collectstatic` command production deployment ke liye sab static files ek jagah collect karta hai.

### Q78. File sharing system mein secure file access kaise ensure kiya?
File download endpoints par authentication aur permission checks lagaye (sirf authorized users hi apni ya shared files access kar sakein), file paths ko user input se directly construct nahi kiya (path traversal attack se bachne ke liye), aur file type/size validation upload ke waqt hi ki.

### Q79. Large file uploads efficiently kaise handle karte hain Django mein?
Django `TemporaryFileUploadHandler` use karta hai jab file size ek threshold (`FILE_UPLOAD_MAX_MEMORY_SIZE`) se badi ho, jisse pura file memory mein load hone ke bajay disk pe temporarily store hoti hai. Bade files ke liye chunked upload, background processing (Celery), aur cloud storage (S3) use karna best practice hai.

### Q80. Production mein media files serve karne ka best practice kya hai?
Production mein Django khud media files serve nahi karta (performance ke liye) — instead cloud storage (AWS S3, Cloudinary) ya dedicated web server (Nginx) use karte hain jo static/media files efficiently serve karta hai, aur Django sirf application logic handle karta hai.

## 9. Database Schema Design, Optimization, Indexing, Query Optimization

### Q81. Django mein database schema design karte waqt kin cheezon ka dhyan rakhna chahiye?
Normalization (redundancy avoid karna), appropriate data types choose karna, relationships (ForeignKey, ManyToMany) sahi define karna, indexes lagana frequently queried fields par, aur future scalability ke liye fields flexible rakhna — yeh sab maine Shamaim project mein SQL schemas design karte waqt follow kiya.

### Q82. Database indexing kya hai aur Django mein kaise apply karte hain?
Index ek data structure hai jo database queries ko fast banata hai un columns par jinpe frequently search/filter/sort hota hai. Django mein `db_index=True` field mein set karte hain, ya `Meta.indexes` mein `models.Index` define karte hain.
```python
class Meta:
    indexes = [models.Index(fields=['room', 'created_at'])]
```

### Q83. N+1 query problem kya hai aur kaise solve karte hain?
N+1 problem tab hota hai jab ek query se N records fetch karke, har record ke liye related object fetch karne ek alag query chalti hai — total N+1 queries. Ise `select_related()` (JOIN based) aur `prefetch_related()` (separate optimized query) use karke solve karte hain.

### Q84. Django Debug Toolbar ka use kya hai?
Django Debug Toolbar ek development tool hai jo har request ke liye executed SQL queries, unka time, aur count dikhata hai. Isse slow queries aur N+1 problems identify karke optimize karna easy ho jata hai.

### Q85. `only()` aur `defer()` methods kya karte hain?
`only()` sirf specified fields fetch karta hai database se (baaki fields lazy-load hote hain agar access kiye jayein). `defer()` iska opposite hai — specified fields ko exclude karke baaki sab fetch karta hai. Dono large tables mein unnecessary columns fetch karne se bachate hain.

### Q86. Database connection pooling Django mein kaise manage hota hai?
Django by default har request ke liye naya connection open karta hai (ya `CONN_MAX_AGE` set karke persistent connections use karte hain). Production mein `pgbouncer` (PostgreSQL) ya similar pooling tools use karte hain taaki connection overhead kam ho aur performance improve ho, especially high-traffic applications mein.

### Q87. `bulk_create()` aur `bulk_update()` kyu use karte hain?
Yeh methods multiple objects ko ek hi database query mein create/update karte hain, individual `save()` calls ki jagah — isse database round-trips kam ho jate hain aur performance significantly improve hoti hai jab bulk data insert/update karna ho.
```python
Message.objects.bulk_create([Message(content="hi"), Message(content="hello")])
```

### Q88. Query optimization ke liye kaunse Django ORM best practices follow karne chahiye?
Sirf required fields fetch karo (`values()`, `only()`), N+1 avoid karne ke liye `select_related`/`prefetch_related` use karo, indexes lagao frequently filtered columns par, `count()` ke bajay `exists()` use karo existence check ke liye, aur bulk operations use karo loops mein individual saves ke bajay.

## 10. Testing, Deployment, Security Best Practices

### Q89. Django mein testing kaise karte hain?
Django `django.test.TestCase` provide karta hai jo har test ke liye transaction rollback karta hai (test isolation ke liye). `Client` object use karke views/APIs ko simulate karte hain aur assertions check karte hain.
```python
class MessageTestCase(TestCase):
    def test_message_creation(self):
        msg = Message.objects.create(content="Hello")
        self.assertEqual(msg.content, "Hello")
```

### Q90. DRF mein API tests kaise likhte hain?
`APITestCase` aur `APIClient` use karte hain jo HTTP methods (GET, POST) simulate karke response status code aur data validate karne dete hain.
```python
class MessageAPITest(APITestCase):
    def test_list_messages(self):
        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 200)
```

### Q91. Django application deploy karne ke steps kya hain (high level)?
`DEBUG=False` set karna, `ALLOWED_HOSTS` configure karna, `collectstatic` run karna, production database setup karna, Gunicorn/uWSGI jaise WSGI server ke saath Nginx reverse proxy configure karna, environment variables secure rakhna, aur HTTPS enable karna.

### Q92. CSRF attack kya hai aur Django ismein kaise protect karta hai?
CSRF (Cross-Site Request Forgery) attack mein attacker user ko unknowingly ek malicious request submit karwata hai kisi trusted site par. Django `CsrfViewMiddleware` aur `{% csrf_token %}` se ek unique token generate karta hai jo har form submission ke saath verify hota hai, jisse forged requests reject ho jate hain.

### Q93. SQL Injection kya hai aur Django ORM isse kaise bachata hai?
SQL Injection attack mein malicious SQL code user input ke through inject kiya jata hai. Django ORM automatically queries ko parameterize karta hai — user input ko directly SQL string mein concatenate nahi karta, isliye by default SQL injection se protected rehta hai (jab tak raw SQL mein manually string formatting na ki jaye).

### Q94. XSS (Cross-Site Scripting) se Django kaise bachata hai?
Django templates by default auto-escaping karte hain — matlab `{{ variable }}` output karte waqt HTML special characters (`<`, `>`, `&`) ko escape kar deta hai, jisse malicious script tags render nahi hote. `|safe` filter ya `mark_safe()` use karke hi escaping bypass hoti hai, jo carefully use karna chahiye.

### Q95. Production Django app ke liye security checklist kya hai?
`DEBUG=False`, strong `SECRET_KEY` (env variable mein), `ALLOWED_HOSTS` set karna, HTTPS enforce karna (`SECURE_SSL_REDIRECT`), secure cookies (`SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`), regular dependency updates, aur `python manage.py check --deploy` command run karke Django ke khud ke security warnings check karna.

## 11. Scenario/Project-Based Questions

### Q96. Aapne Shamaim Lifestyle mein backend infrastructure scratch se kaise banaya?
Maine Django REST Framework use karke project structure setup ki — apps ko logically separate kiya (users, products, orders etc.), SQL database schemas design kiye normalized approach ke saath, models aur migrations banaye, REST APIs ke liye serializers aur viewsets likhe, aur JWT-based authentication implement kiya taaki frontend team securely backend se communicate kar sake. Poora setup scratch se tha, isliye architecture decisions (folder structure, naming conventions, API versioning) maine khud liye.

### Q97. Aapne session management ko secure kaise banaya?
Maine `HttpOnly` aur `Secure` flags session cookies par set kiye taaki JavaScript se access na ho sake aur sirf HTTPS par transmit ho. Session expiry time appropriately set kiya, login ke baad session ID regenerate ki (session fixation prevent karne ke liye), aur `SESSION_COOKIE_SAMESITE` set karke CSRF risk kam kiya. JWT-based flows mein short-lived access tokens aur refresh token rotation bhi implement kiya.

### Q98. Real-time Chat Application mein file sharing feature kaise implement kiya?
File upload ke liye ek Model banaya jisme `FileField`, uploader reference, aur chat room reference tha. Upload ke waqt file type aur size validate kiya, files ko organized `upload_to` path structure mein store kiya, aur access control lagaya taaki sirf room ke members hi shared files download kar sakein. Frontend ko file metadata (name, size, uploader) API ke through provide kiya taaki UI mein preview ho sake.

### Q99. Aapke Chat App mein message history ko efficiently kaise store aur retrieve kiya?
Message model mein `room` (ForeignKey) aur `created_at` par index lagaya taaki chat history query fast ho. Pagination implement ki taaki ek baar mein saari history load na ho, sirf recent messages (jaise last 50) load ho aur user scroll karega toh older messages lazy-load ho. Yeh dono performance aur user experience ke liye zaruri tha.

### Q100. Aapne WebSocket integration ko REST APIs ke saath kaise combine kiya poore chat system mein?
REST APIs (DRF) ka use static/initial data ke liye kiya — jaise chat room list, message history, user profile fetch karna. WebSockets (Django Channels) ka use sirf real-time events ke liye kiya — jaise naya message aana, typing indicator, online/offline status. Is hybrid approach se system efficient raha kyunki har cheez ke liye WebSocket persistent connection ka load nahi liya, sirf jaha real-time zaruri tha wahi use kiya.
