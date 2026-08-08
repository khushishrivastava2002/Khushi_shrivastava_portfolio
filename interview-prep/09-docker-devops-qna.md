# Docker, Git & Microservices Interview Questions & Answers (Hinglish)

Yeh file Khushi Shrivastava ke resume aur projects (RIoAI - Quick Commerce Pharmacy Delivery App, Viscus Infotech - Live Attendance System) ke basis par banayi gayi hai. Isme Docker, Git, Microservices, Celery/Redis, Linux, Postman aur CI/CD ke top 100 interview questions aur unke practical answers Hinglish mein diye gaye hain.

---

## 1. Docker Basics

### Q1. Docker image aur Docker container mein kya difference hai?
Docker image ek read-only template hoti hai jisme application ka code, dependencies, aur runtime environment define hota hai. Container image ka running instance hota hai — jab hum image ko run karte hain, tab ek container create hota hai jo actually memory aur CPU use karta hai. Ek image se multiple containers spin up kar sakte hain.

```bash
docker images        # saari images list karega
docker ps -a         # saare containers (running + stopped) list karega
```

### Q2. Dockerfile kya hota hai aur usme kya likha jata hai?
Dockerfile ek text file hoti hai jisme step-by-step instructions likhi jaati hain ki image kaise build karni hai — base image kaunsi use karni hai, dependencies install karni hain, code copy karna hai, aur container start hone par kaunsa command run hoga.

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Q3. docker-compose kya hai aur yeh kyun use karte hain?
docker-compose ek tool hai jisse multiple containers (jaise app service, database, redis, celery worker) ko ek single YAML file mein define karke saath mein manage kiya jaa sakta hai. Ek command (`docker-compose up`) se poora multi-service environment start ho jaata hai, jo local development aur testing ke liye bahut helpful hai.

```bash
docker-compose up -d
docker-compose down
```

### Q4. Docker volumes kya hote hain aur inki zarurat kyun padti hai?
Container by default ephemeral hote hain — container delete hone par uska data bhi chala jaata hai. Volumes ek mechanism hai jisse data ko container ke lifecycle se independent, host machine (ya named volume) mein persist kiya jaata hai. Database data, uploaded files, ya logs ke liye volumes use karte hain.

```bash
docker run -v mydata:/var/lib/mysql mysql
```

### Q5. Docker network kya hote hain? Bridge, host aur none network mein difference batao.
Docker network containers ke beech communication allow karta hai. Bridge network default hota hai jisme containers ek isolated private network mein aakar internal DNS se ek dusre se baat karte hain (container name se). Host network container ko host machine ke network stack ka directly use karne deta hai (no isolation). None network matlab container ko koi network access nahi milta.

### Q6. Docker-compose mein services ek dusre se kaise communicate karte hain?
docker-compose automatically ek default bridge network create karta hai, aur har service ko uske service name se hi resolve kiya jaa sakta hai — jaise agar redis service ka naam `redis` hai to app container `redis:6379` se connect kar sakta hai, IP hardcode karne ki zarurat nahi.

```yaml
services:
  web:
    build: .
    depends_on:
      - redis
  redis:
    image: redis:7
```

### Q7. Docker image layers kaise kaam karte hain?
Har Dockerfile instruction (FROM, RUN, COPY) ek naya layer create karta hai, jo cache ho jaata hai. Agar koi layer change nahi hua to Docker usse rebuild nahi karta, cached layer reuse karta hai — isse build fast hota hai. Isliye Dockerfile mein instructions ko is order mein rakhna chahiye ki jo kam change hota hai (jaise dependencies) wo pehle aaye aur jo zyada change hota hai (jaise application code) wo baad mein.

### Q8. .dockerignore file ka kya purpose hai?
.dockerignore file un files/folders ko specify karti hai jo build context se exclude karni hain (jaise `.git`, `node_modules`, `__pycache__`, `.env`). Isse build context ka size chhota hota hai, build fast hota hai, aur sensitive files accidentally image mein copy nahi hoti.

```
.git
__pycache__
*.pyc
.env
```

### Q9. CMD aur ENTRYPOINT mein kya difference hai?
CMD default command/arguments deta hai jo container run karte waqt override kiya jaa sakta hai. ENTRYPOINT ek fixed executable define karta hai jo hamesha run hoga, aur CMD sirf uske default arguments provide karta hai. Dono ko saath use karke ek flexible aur fixed structure banaya jaa sakta hai.

```dockerfile
ENTRYPOINT ["python"]
CMD ["manage.py", "runserver"]
```

### Q10. Docker image kaise build aur push karte hain?
Pehle Dockerfile se image build karte hain, phir usse tag karke registry (Docker Hub, ECR, etc.) par push karte hain.

```bash
docker build -t myapp:latest .
docker tag myapp:latest myrepo/myapp:latest
docker push myrepo/myapp:latest
```

### Q11. Bind mounts aur named volumes mein kya difference hai?
Bind mount host machine ke ek specific path ko container ke andar mount karta hai (development mein live code reload ke liye useful). Named volume Docker khud manage karta hai (usually `/var/lib/docker/volumes/` ke andar), jo production data persistence ke liye zyada reliable aur portable hai.

### Q12. Environment variables container mein kaise pass karte hain?
`-e` flag ya `env_file`/`environment` key (docker-compose mein) se environment variables pass kiye jaate hain — jaise DB credentials, secret keys, ya broker URLs, jinhe hardcode nahi karna chahiye.

```bash
docker run -e DEBUG=False -e DATABASE_URL=postgres://... myapp
```

### Q13. Container restart policies kya hote hain?
Restart policy define karti hai ki container crash ya reboot hone par kya karna hai. Options: `no` (default), `on-failure`, `always`, `unless-stopped`. Production mein critical services ke liye `unless-stopped` ya `always` common choice hai.

```yaml
services:
  worker:
    restart: unless-stopped
```

### Q14. Docker ke health checks kya hote hain aur kyun useful hain?
HEALTHCHECK instruction se Docker periodically ek command run karke check karta hai ki container "healthy" hai ya nahi (jaise API endpoint hit karke). Isse orchestration tools (load balancer, Kubernetes, docker-compose) ko pata chalta hai ki traffic kis container ko bhejna safe hai.

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:8000/health || exit 1
```

### Q15. Docker containerization se development aur deployment consistency kaise milti hai?
"Works on my machine" problem solve hoti hai kyunki image ke andar hi saari dependencies, OS libraries, aur configuration fixed hoti hain. Chahe local machine ho, staging ho ya production server, container environment exactly same rehta hai — isse RIoAI project mein bhi maine services (jaise Picker, Delivery, Promoter apps) ko consistent environment dene ke liye containerize kiya tha.

---

## 2. Docker Commands & Workflows

### Q16. Image ko build karne ka basic command kya hai?
```bash
docker build -t myapp:1.0 .
```
`.` build context specify karta hai (current directory), aur `-t` tag deta hai image ko.

### Q17. Container ko run karne ke common flags kaunse hain?
```bash
docker run -d -p 8000:8000 --name myapp_container myapp:1.0
```
`-d` detached mode, `-p` port mapping (host:container), `--name` container ko naam dena.

### Q18. Running container ke andar interactively kaise ghus sakte hain?
```bash
docker exec -it myapp_container /bin/bash
```
`-it` interactive terminal deta hai, jisse container ke andar commands directly run kar sakte hain debugging ke liye.

### Q19. Container ke logs kaise dekhte hain?
```bash
docker logs -f myapp_container
```
`-f` flag se logs real-time (follow mode) mein stream hote hain, jo debugging ke waqt bahut useful hota hai.

### Q20. Multi-stage build kya hota hai aur kyun use karte hain?
Multi-stage build mein Dockerfile ke multiple `FROM` stages hote hain — pehle stage mein build/compile karte hain (heavy tools ke saath), aur final stage mein sirf zaruri output copy karte hain. Isse final image ka size bahut chhota ho jaata hai kyunki build tools final image mein include nahi hote.

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Q21. Docker image ka size kaise optimize karte hain?
- Slim ya alpine base images use karo (jaise `python:3.11-slim`)
- Multi-stage builds use karo
- `.dockerignore` set karo taaki unwanted files na aaye
- RUN commands ko chain karo taaki extra layers na bane
- Unnecessary packages/cache clean karo same RUN step mein

```dockerfile
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*
```

### Q22. Stopped/unused containers, images aur volumes kaise clean karte hain?
```bash
docker container prune
docker image prune -a
docker volume prune
docker system prune -a --volumes
```
Yeh commands disk space free karne ke liye use hote hain, especially jab local machine par bahut saare test builds ho chuke hon.

### Q23. Ek running container se dusri machine par image kaise migrate karte hain?
Image ko registry par push karke dusri machine par pull kiya jaa sakta hai, ya `docker save`/`docker load` se tar file ke through offline transfer bhi kiya jaa sakta hai.

```bash
docker save myapp:1.0 -o myapp.tar
docker load -i myapp.tar
```

### Q24. docker-compose mein specific service ko rebuild kaise karte hain?
```bash
docker-compose build web
docker-compose up -d --no-deps --build web
```
Isse sirf `web` service rebuild hoti hai, baaki services untouched rehti hain — jo dev workflow mein time bachata hai.

### Q25. Production mein Docker image ko debug kaise karte hain jab container crash ho jaaye?
Sabse pehle `docker logs <container>` se error dekhte hain. Agar container start hi nahi ho raha to `docker run -it --entrypoint /bin/sh image_name` se manually andar ghuskar check kar sakte hain. `docker inspect` se container ki configuration aur exit code bhi dekh sakte hain.

```bash
docker inspect myapp_container --format='{{.State.ExitCode}}'
```

---

## 3. Git & GitHub

### Q26. Git aur GitHub mein kya difference hai?
Git ek distributed version control system hai jo local machine par code history track karta hai. GitHub ek cloud-based platform hai jo Git repositories ko host karta hai aur collaboration features (pull requests, issues, actions) deta hai.

### Q27. git init, git clone aur git remote add mein kya difference hai?
`git init` current folder ko naya Git repo banata hai. `git clone` ek existing remote repo ko poori history ke saath local machine par copy karta hai. `git remote add` ek existing local repo ko kisi remote URL se link karta hai.

```bash
git init
git clone https://github.com/user/repo.git
git remote add origin https://github.com/user/repo.git
```

### Q28. git add, git commit aur git push mein kya difference hai?
`git add` changes ko staging area mein le jaata hai. `git commit` staged changes ka ek snapshot local repo history mein save karta hai. `git push` local commits ko remote repository par bhejta hai.

```bash
git add .
git commit -m "fix: order status bug"
git push origin feature-branch
```

### Q29. Branch kya hota hai aur branching strategy kyun zaruri hai?
Branch code ki ek independent line hoti hai jisme changes main code ko affect kiye bina kiye jaa sakte hain. Team environment mein branching strategy (jaise Git Flow ya trunk-based) zaruri hai taaki multiple developers parallel kaam kar sakein bina ek dusre ke code ko break kiye.

### Q30. Git Flow aur trunk-based development mein kya difference hai?
Git Flow mein alag-alag long-lived branches hote hain (main, develop, feature, release, hotfix) jo structured release cycles ke liye achha hai. Trunk-based development mein sab short-lived feature branches directly `main`/`trunk` mein frequently merge hote hain, jo CI/CD aur fast iteration ke liye better hai.

### Q31. Merge aur rebase mein kya difference hai?
Merge do branches ki history ko combine karta hai aur ek naya "merge commit" banata hai, jisse original history preserve rehti hai. Rebase current branch ke commits ko target branch ke top par "replay" karta hai, jisse ek linear/clean history milti hai, lekin shared branches par rebase karna risky ho sakta hai.

```bash
git merge feature-branch
git rebase main
```

### Q32. Merge conflict kya hota hai aur usse kaise resolve karte hain?
Jab do branches ne same file ki same line mein alag-alag changes kiye hon, tab Git automatically merge nahi kar paata aur conflict marker (`<<<<<<<`, `=======`, `>>>>>>>`) daal deta hai. Hum manually file open karke correct code rakhte hain, markers hatate hain, phir `git add` karke commit karte hain.

```bash
git status              # conflicting files dekho
# file edit karo aur markers hatao
git add resolved_file.py
git commit
```

### Q33. Pull request (PR) kya hota hai aur team workflow mein iska role kya hai?
PR ek request hoti hai apne feature branch ke changes ko main/target branch mein merge karne ke liye. Isse code review, discussion aur automated CI checks (tests, linting) ho paate hain merge se pehle, jisse code quality maintain rehti hai.

### Q34. git stash kya karta hai aur kab use karte hain?
`git stash` uncommitted changes ko temporarily save kar deta hai aur working directory ko clean kar deta hai, bina commit kiye. Useful hota hai jab urgently branch switch karna ho (jaise hotfix ke liye) bina current incomplete kaam ko commit kiye.

```bash
git stash
git checkout main
# hotfix karo
git checkout feature-branch
git stash pop
```

### Q35. git reset aur git revert mein kya difference hai?
`git reset` commit history ko piche le jaata hai (soft/mixed/hard modes ke saath) — local history change hoti hai, isliye pushed/shared commits par risky hai. `git revert` ek naya commit banata hai jo purane commit ke changes ko undo karta hai, history safe rehti hai — shared branches ke liye safer option.

```bash
git revert <commit-hash>
git reset --hard HEAD~1
```

### Q36. git cherry-pick kya hota hai?
Cherry-pick se hum ek specific commit ko ek branch se dusri branch mein apply kar sakte hain, bina poori branch merge kiye. Useful hai jab sirf ek bug fix ko dusri release branch mein bhi laana ho.

```bash
git cherry-pick <commit-hash>
```

### Q37. .gitignore file kyun zaruri hai?
.gitignore un files/folders ko specify karti hai jinhe Git track nahi karega — jaise `.env`, `node_modules`, `__pycache__`, build artifacts. Isse sensitive data leak hone se bachta hai aur repo clean rehta hai.

### Q38. Team mein Git workflow kaise follow karti ho (real experience)?
Main feature-based branching follow karti hoon — `main` branch se naya feature branch banati hoon (`feature/task-name`), changes commit karke push karti hoon, phir GitHub par PR create karti hoon peer review ke liye. Review approve hone aur CI checks pass hone ke baad hi branch ko `main`/`develop` mein merge karti hoon.

### Q39. Force push (`git push --force`) kab aur kyun use/avoid karte hain?
Force push remote history ko overwrite kar deta hai, jo shared branch par dangerous hai kyunki dusre developers ke commits lose ho sakte hain. Isse sirf apni personal feature branch par use karna chahiye (jaise rebase ke baad), aur team branches (main/develop) par kabhi bhi force push nahi karna chahiye — agar zaruri ho to `--force-with-lease` safer option hai.

### Q40. Git tags ka use kya hai?
Tags specific commits ko mark karte hain, generally release versions ke liye (jaise `v1.0.0`). Yeh branches ki tarah move nahi hote, ek fixed point rehte hain — deployment tracking aur rollback ke liye useful.

```bash
git tag -a v1.0.0 -m "release version 1.0.0"
git push origin v1.0.0
```

---

## 4. Microservices Architecture

### Q41. Monolith aur Microservices architecture mein kya difference hai?
Monolith mein poora application ek single codebase/deployment unit ke roop mein hota hai, jahan saare modules tightly coupled hote hain. Microservices mein application chhote, independent services mein tod diya jaata hai, jinhe alag-alag develop, deploy aur scale kiya jaa sakta hai — jaise Live Attendance System mein Node.js aur Python services alag responsibilities handle karte hain.

### Q42. Microservices ke fayde aur nuksan kya hain?
Fayde: independent deployment, technology flexibility (har service apni tech stack use kar sakti hai), better fault isolation, aur team-wise ownership. Nuksan: distributed system ki complexity badhti hai — network latency, data consistency issues, debugging harder hoti hai, aur infrastructure/DevOps overhead badhta hai.

### Q43. Services ke beech communication kaise hoti hai microservices mein?
Do main patterns hain: synchronous communication (REST APIs ya gRPC ke through direct HTTP calls) aur asynchronous communication (message queues jaise Redis/RabbitMQ/Kafka ke through events publish karke). Attendance system jaisi project mein main dono use karti hoon — real-time data ke liye REST calls aur background processing ke liye queue-based communication.

### Q44. API Gateway kya hota hai aur iska role kya hai?
API Gateway ek single entry point hota hai jahan se saare client requests aati hain aur phir appropriate microservice ko route hoti hain. Yeh authentication, rate limiting, request routing, aur response aggregation jaisi cross-cutting concerns ko centralize karta hai, taaki har service ko yeh alag se implement na karna pade.

### Q45. Service discovery kya hai aur yeh microservices mein kyun zaruri hai?
Jab services dynamically scale ho rahi hon ya restart ho rahi hon, unka IP/address change ho sakta hai. Service discovery mechanism (jaise Consul, Eureka, ya DNS-based discovery in Kubernetes) automatically track karta hai ki kaunsi service kahan running hai, taaki dusri services unhe hardcoded address ke bina locate kar sakein.

### Q46. Microservices mein data consistency kaise maintain karte hain jab har service ka apna database ho?
Cross-service transactions ke liye distributed transaction patterns use hote hain jaise Saga pattern — jisme ek sequence of local transactions hoti hain, aur agar koi step fail ho to compensating actions (rollback events) trigger hote hain. Eventual consistency accept ki jaati hai zyadatar cases mein, strict ACID transactions ki jagah.

### Q47. Saga pattern kya hota hai?
Saga pattern distributed transactions ko manage karne ka tarika hai jisme ek business process ko multiple local transactions mein todte hain, har ek apni service ke andar. Agar beech mein koi step fail ho jaaye, to pehle wale steps ke liye compensating transactions (undo actions) trigger hoti hain taaki overall data consistent rahe.

### Q48. Synchronous aur asynchronous communication mein kab kya use karna chahiye?
Synchronous (REST/gRPC) jab immediate response chahiye ho, jaise user login validate karna. Asynchronous (message queue/event-driven) jab task ko background mein process karna ho ya multiple services ko notify karna ho bina unhe block kiye — jaise order place hone par notification bhejna, ya attendance record process karna.

### Q49. Microservices mein fault tolerance kaise handle karte hain?
Patterns jaise Circuit Breaker (agar ek service baar-baar fail ho rahi ho to usse temporarily call karna band kar dena), retries with exponential backoff, timeouts, aur fallback responses use kiye jaate hain taaki ek service ka failure poore system ko down na kar de.

### Q50. Circuit breaker pattern kya hota hai?
Circuit breaker ek safety mechanism hai jo monitor karta hai ki kisi downstream service ki calls kitni baar fail ho rahi hain. Agar failure threshold cross ho jaaye, to circuit "open" ho jaata hai aur further calls ko turant fail kar deta hai (bina actual call kiye) kuch time ke liye, taaki failing service ko recover hone ka time mile aur cascading failure na ho.

### Q51. Microservices mein logging aur monitoring kyun challenging hoti hai?
Ek single request multiple services se guzarta hai, isliye logs bhi alag-alag services mein scattered hote hain. Isko solve karne ke liye centralized logging (jaise ELK stack) aur distributed tracing (jaise correlation IDs / trace IDs) use karte hain, taaki ek request ka poora flow trace kiya jaa sake.

### Q52. Microservices ke liye database design ka approach kya hota hai — shared DB ya database-per-service?
Best practice database-per-service hai, jisme har microservice apna independent database maintain karti hai. Isse services loosely coupled rehti hain aur ek service ka schema change dusri services ko break nahi karta. Shared database anti-pattern maana jaata hai kyunki isse services tightly coupled ho jaati hain.

### Q53. Microservices architecture design karte waqt services ko kaise split karte hain?
Services ko business capability ke around split karte hain (jaise Domain-Driven Design ke bounded contexts), na ki technical layers ke around. Jaise attendance system mein alag services ho sakti hain — user/employee management, attendance tracking, notification, aur reporting — har ek apni responsibility ke saath.

### Q54. Microservices mein versioning aur backward compatibility kaise handle karte hain?
API versioning (jaise `/api/v1/`, `/api/v2/`) use karke purane clients ko break kiye bina naya functionality add karte hain. Backward-compatible changes karna prefer karte hain (naye optional fields add karna, existing fields ko na hatana) jab tak sabhi consumers migrate na ho jaayein.

### Q55. Microservices mein deployment kaise manage karte hain — sab saath deploy karte ho ya independently?
Microservices ka core fayda hi yeh hai ki har service independently deploy ho sakti hai. CI/CD pipeline har service ke liye alag configure hoti hai, taaki ek service ka update dusri services ko redeploy kiye bina production mein jaa sake — isse deployment risk aur downtime kam hota hai.

---

## 5. Celery & Redis

### Q56. Celery kya hai aur iska use case kya hota hai?
Celery ek distributed task queue hai jo Python applications mein time-consuming ya background tasks ko main request-response cycle se alag, asynchronously execute karne deta hai — jaise email bhejna, notification trigger karna, ya heavy computation. Isse user ko turant response mil jaata hai aur heavy kaam background mein hota hai.

### Q57. Background tasks ki zarurat kyun padti hai?
Agar koi operation slow hai (jaise notification bhejna, report generate karna, ya third-party API call) aur usse synchronously request ke andar hi run karenge, to user ko response milne mein delay hoga aur server thread block rahega. Background tasks se yeh kaam queue mein daal ke turant response return kar dete hain, aur actual processing baad mein hoti hai.

### Q58. Celery worker kya hota hai?
Celery worker ek process hai jo queue se tasks pick karke actually execute karta hai. Multiple workers parallel mein run ho sakte hain taaki tasks concurrently process ho, aur load ke hisaab se worker count scale kiya jaa sakta hai.

```bash
celery -A myproject worker --loglevel=info
```

### Q59. Redis ka Celery ke saath kya role hota hai?
Redis Celery ke liye message broker ke roop mein kaam karta hai — jab bhi ek task trigger hota hai, usse Redis queue mein daal diya jaata hai, aur Celery workers waha se task pick karke process karte hain. Redis ko result backend ke roop mein bhi use kiya jaa sakta hai taaki task ka status/result store ho sake.

### Q60. Message broker kya hota hai? RabbitMQ vs Redis as broker.
Message broker producer (jo task create karta hai) aur consumer (jo task process karta hai) ke beech messages queue karke deliver karta hai. RabbitMQ ek dedicated, feature-rich message broker hai (advanced routing, guaranteed delivery), jabki Redis lightweight aur fast hai, aur jab caching bhi saath mein chahiye ho to Redis convenient choice hoti hai.

### Q61. Redis sirf broker hai ya aur bhi kuch use hota hai?
Redis ek in-memory data store hai jo multiple purposes ke liye use hoti hai — Celery broker, caching layer (frequently accessed data jaldi serve karne ke liye), session storage, aur rate limiting counters ke liye bhi.

```python
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://localhost:6379/1',
    }
}
```

### Q62. Celery task kaise define aur call karte hain?
```python
# tasks.py
from celery import shared_task

@shared_task
def send_notification(user_id, message):
    # notification bhejne ka logic
    return f"Notification sent to {user_id}"

# call karna
send_notification.delay(user_id=5, message="Order confirmed")
```
`.delay()` task ko asynchronously queue mein bhej deta hai; main application flow block nahi hota.

### Q63. Celery mein task retries kaise handle karte hain agar task fail ho jaaye?
`retry` parameter ya `autoretry_for` set karke Celery ko batate hain ki kis exception par kitni baar aur kis interval par retry kare.

```python
@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_order(self, order_id):
    try:
        # processing logic
        pass
    except Exception as exc:
        raise self.retry(exc=exc)
```

### Q64. Periodic/scheduled tasks Celery mein kaise set karte hain?
Celery Beat scheduler use karte hain jo predefined intervals par tasks automatically trigger karta hai — jaise har raat ek report generate karna, ya har 5 minute mein pending orders check karna.

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'check-pending-orders': {
        'task': 'app.tasks.check_pending_orders',
        'schedule': crontab(minute='*/5'),
    },
}
```

### Q65. Celery task queues (multiple queues) kyun use karte hain?
Different priorities ya types ke tasks ko alag-alag queues mein route karte hain — jaise high-priority notifications ek queue mein, aur heavy reports dusri queue mein. Isse important tasks kam-priority tasks ke peeche stuck nahi rehte, aur workers ko specific queues assign karke resource allocation control kar sakte hain.

```python
task_routes = {
    'app.tasks.send_urgent_alert': {'queue': 'high_priority'},
    'app.tasks.generate_report': {'queue': 'low_priority'},
}
```

### Q66. Celery task idempotent hona kyun zaruri hai?
Kabhi-kabhi network issue ya retry ki wajah se ek hi task multiple baar execute ho sakta hai. Agar task idempotent hai (yani multiple baar run hone par bhi result same/safe rehta hai, jaise "set status to delivered" vs "increment count by 1"), to duplicate processing se data corruption nahi hoga.

### Q67. RIoAI jaisi quick-commerce app mein Celery + Redis se background tasks kaise design karoge?
Order place hone ke baad turant response de dete hain user ko, aur background mein Celery tasks trigger karte hain — jaise Picker app ko notify karna, Delivery partner assign karna, Promoter/offer calculations, aur SMS/push notifications bhejna. Redis broker ke roop mein in tasks ko queue karta hai, aur multiple Celery workers parallel mein inhe process karte hain, jisse high order volume ke waqt bhi system responsive rehta hai.

---

## 6. Linux Basics

### Q68. File permissions Linux mein kaise kaam karte hain?
Har file/directory ke teen permission groups hote hain — owner, group, aur others — aur har group ke paas read (r), write (w), execute (x) permissions hoti hain. `chmod` se permissions change karte hain aur `chown` se ownership.

```bash
chmod 755 script.sh
chown user:group file.txt
```

### Q69. Kuch commonly used Linux commands batao jo backend development mein daily use hote hain.
```bash
ls -la        # files list with details
cd /path      # directory change
pwd           # current directory print
grep "error" app.log     # pattern search
tail -f app.log          # live logs
find . -name "*.py"      # file search
df -h         # disk space
top / htop    # resource usage
```

### Q70. Process management Linux mein kaise karte hain?
`ps` aur `top`/`htop` se running processes dekhte hain, `kill`/`kill -9` se process terminate karte hain PID ke through, aur background mein process chalane ke liye `&` ya `nohup` use karte hain.

```bash
ps aux | grep gunicorn
kill -9 <PID>
nohup python manage.py runserver &
```

### Q71. Environment variables Linux mein kaise set aur access karte hain?
```bash
export DATABASE_URL="postgres://localhost/mydb"
echo $DATABASE_URL
```
`.bashrc`/`.env` files mein bhi persistent environment variables define kiye jaa sakte hain jo application startup par load hote hain.

### Q72. Port kisi process ne occupy kiya hai, yeh kaise check karte ho?
```bash
sudo lsof -i :8000
sudo netstat -tulnp | grep 8000
```
Isse pata chalta hai ki kaunsi process kis port par listen kar rahi hai, jo debugging "port already in use" errors ke liye useful hai.

### Q73. Cron jobs kya hote hain aur kaise schedule karte hain?
Cron jobs Linux ke built-in scheduler hote hain jo specific time/interval par commands automatically run karte hain — jaise daily backups ya cleanup scripts.

```bash
crontab -e
# har raat 2 baje backup script chalao
0 2 * * * /home/user/backup.sh
```

### Q74. Log files ko efficiently kaise monitor/debug karte ho?
`tail -f` se real-time logs dekhte hain, `grep` se specific error patterns filter karte hain, aur `less`/`awk` se bade log files ko efficiently navigate karte hain bina poori file load kiye.

```bash
tail -f /var/log/app.log | grep "ERROR"
```

### Q75. SSH ka use kya hota hai aur remote server access kaise karte hain?
SSH (Secure Shell) ek protocol hai jisse hum remote server ko securely, encrypted connection ke through access kar sakte hain — commands run karna, files transfer karna (scp/rsync), ya deployment karna.

```bash
ssh user@server_ip
scp local_file.txt user@server_ip:/path/to/destination
```

---

## 7. Postman & API Testing

### Q76. Postman kya hai aur ismein API testing kaise karte hain?
Postman ek GUI tool hai jisse hum API endpoints ko manually test kar sakte hain — request method (GET/POST/PUT/DELETE), headers, body aur parameters set karke response verify karte hain, bina frontend UI ke through jaaye.

### Q77. Postman mein environment variables ka use kyun karte hain?
Environment variables se hum same collection ko different environments (local, staging, production) mein use kar sakte hain sirf base URL/tokens switch karke, bina har request mein manually URL change kiye.

```
{{base_url}}/api/orders
```

### Q78. Postman collections kya hote hain?
Collection ek group hoti hai related API requests ki (jaise saare "Order Service" endpoints ek collection mein), jisse organize karna aur team ke saath share karna easy ho jaata hai. Collections ko export/import bhi kiya jaa sakta hai.

### Q79. Postman mein authentication (jaise JWT token) kaise handle karte ho?
Login API call karke response se token le lete hain, phir usse ek environment variable mein store karke baaki requests ke Authorization header mein `Bearer {{token}}` ke roop mein use karte hain. Postman ke "Tests" tab mein script likhkar token ko automatically capture bhi kar sakte hain.

```javascript
pm.environment.set("token", pm.response.json().access_token);
```

### Q80. Postman mein automated tests/assertions kaise likhte ho?
"Tests" tab mein JavaScript-based assertions likhte hain jo response status, body, aur headers verify karti hain — jisse manual checking ki jagah automatic validation ho jaati hai, aur Postman collections ko CI pipeline mein bhi run kar sakte hain (Newman CLI ke through).

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
pm.test("Response has order_id", function () {
    pm.expect(pm.response.json()).to.have.property("order_id");
});
```

---

## 8. CI/CD Basics & Deployment Strategies

### Q81. CI/CD kya hota hai?
CI (Continuous Integration) ka matlab hai ki developers regularly apna code merge karte hain aur automated tests/build run hote hain har change par, taaki bugs jaldi pakde jaayein. CD (Continuous Deployment/Delivery) ka matlab hai ki verified code automatically (ya ek click se) production/staging environment mein deploy ho jaata hai.

### Q82. CI/CD pipeline mein typically kaunse steps hote hain?
1. Code push/PR trigger
2. Dependencies install
3. Linting aur automated tests run
4. Docker image build
5. Image ko registry par push
6. Staging/production par deploy

```yaml
# example GitHub Actions step
- name: Build Docker Image
  run: docker build -t myapp:${{ github.sha }} .
- name: Run Tests
  run: docker run myapp:${{ github.sha }} pytest
```

### Q83. CI/CD pipeline failures ko kaise debug karte ho?
Sabse pehle pipeline logs dekhte hain ki kaunsa step fail hua — dependency install, test, ya build. Phir usse locally reproduce karne ki koshish karte hain (same environment/Docker image mein), taaki root cause identify ho sake environment-specific issue hai ya code issue.

### Q84. Deployment strategies jaise blue-green aur rolling deployment kya hote hain?
Blue-green deployment mein do identical environments hote hain (blue = current live, green = new version); traffic ek switch se green par move kar diya jaata hai, jisse zero-downtime deployment aur instant rollback possible hota hai. Rolling deployment mein naya version gradually, instance-by-instance replace kiya jaata hai, jisse resources kam lagte hain lekin thoda samay lagta hai.

### Q85. Apne project mein deployment process kaise manage karti ho (applied-level experience)?
Maine Docker containerized services ke saath environment consistency ensure ki hai — same image local, staging aur production mein use hoti hai. docker-compose se multi-service setup (app, Redis, Celery worker) manage kiya, aur environment variables ke through configuration (DB URL, secrets) alag-alag environments ke liye switch kiya, taaki deployment reliable aur repeatable ho.

---

## 9. Scenario & Project-Based Questions

### Q86. RIoAI project mein services ko Docker se kyun containerize kiya?
RIoAI ek quick-commerce pharmacy delivery app hai jisme multiple services (jaise API backend, Celery workers, Redis) involved hain. Docker se maine har service ko containerize kiya taaki development, testing aur production environment consistent rahein — "works on my machine" jaisi problems avoid hui, aur naye developers bhi ek command (`docker-compose up`) se poora setup jaldi run kar paaye.

### Q87. RIoAI mein docker-compose ka setup kaisa tha?
Setup mein multiple services define kiye the — main Django/Flask API service, Redis (broker + cache), aur Celery worker/beat services alag containers mein. Sab ek `docker-compose.yml` file mein linked the, jisse local development mein poora stack ek command se up ho jaata tha aur services internally service-name ke through communicate karti thi.

### Q88. Celery aur Redis ka use RIoAI mein exactly kaha kiya?
Order placement ke baad jo tasks turant response ke bina hone chahiye the — jaise Picker app ko order notify karna, Delivery partner assignment, Promoter/offer notifications, aur third-party notification (SMS/push) — unhe Celery tasks ke roop mein background mein queue kiya. Redis in tasks ko broker ke roop mein queue karta tha aur workers unhe asynchronously process karte the, jisse checkout flow fast aur responsive raha.

### Q89. High order volume ke waqt system ko scale kaise kiya (jaise peak hours mein)?
Celery workers ki count horizontally scale ki — jitne zyada orders utne zyada worker processes spin up kiye taaki tasks parallel mein process ho. Different task types ke liye alag queues bhi banayi (jaise urgent delivery notifications ek high-priority queue mein), taaki critical tasks kabhi bhi bulk/low-priority tasks ke peeche stuck na ho.

### Q90. Agar Celery task baar-baar fail ho raha ho (jaise third-party notification API down ho), to kya approach loge?
Retry mechanism with exponential backoff set karti hoon (`max_retries`, `default_retry_delay`), taaki temporary failures automatically handle ho jaayein. Agar retries exhaust ho jaayein, to task ko failed queue/dead-letter mein log karti hoon aur alert trigger karti hoon, taaki manual intervention ho sake bina poore system ko affect kiye.

### Q91. Attendance system mein microservices architecture kaise design ki?
Live Attendance System mein main services ko responsibility ke basis par split kiya — ek service employee/user management handle karti hai, ek attendance marking/tracking (real-time), aur kuch Python-based services background processing/reporting ke liye. Node.js services real-time/API-heavy parts ke liye use hui aur Python services data processing/automation ke liye, dono ko REST APIs se integrate kiya.

### Q92. Node.js aur Python dono services ek saath use karne ka reason kya tha?
Node.js real-time, I/O-heavy operations (jaise live attendance updates, WebSocket-based notifications) ke liye better suited hai due to its event-driven, non-blocking nature. Python data processing, report generation, aur background automation (Celery ke saath) ke liye zyada convenient hai due to rich libraries. Dono services ko unki strength ke hisaab se use kiya, aur REST APIs ke through connect kiya.

### Q93. Attendance system mein real-time data consistency kaise maintain ki jab multiple services involved hon?
Har service ka apna responsibility clearly defined tha, isliye direct database sharing avoid ki. Jab attendance service mein naya record aata tha, to relevant events (jaise notification service ko) API calls ya queue ke through trigger kiye jaate the, aur eventual consistency accept ki — thoda delay ho sakta hai lekin data eventually sync ho jaata hai.

### Q94. Microservices ke beech communication failure (jaise ek service down ho jaaye) ko kaise handle karti ho?
Timeouts aur retries set karti hoon API calls ke liye, aur agar ek service repeatedly fail ho rahi ho to graceful degradation approach leti hoon — jaise agar notification service down hai to attendance marking ka core functionality phir bhi kaam kare, notification baad mein retry ho jaaye.

### Q95. Docker ke bina yeh services deploy karti to kya challenges aati?
Bina Docker ke har developer/server par manually Python/Node versions, system dependencies, aur environment configs match karni padti, jo error-prone aur time-consuming hota. Docker ke saath yeh sab image ke andar hi fixed hota hai, isliye deployment fast, predictable aur consistent ho jaata hai across environments.

### Q96. Agar tumhe ek naya microservice add karna ho existing system mein, to kya steps follow karogi?
Pehle uski clear responsibility/boundary define karungi (single responsibility), phir uska apna database/data-store decide karungi, API contract define karke existing services ke saath integration plan karungi, Dockerfile likhkar containerize karungi, aur CI/CD pipeline mein integrate karke independently deploy karne layak banaungi.

### Q97. Postman ka use apne daily development workflow mein kaise karti ho?
Backend API develop karne ke baad, frontend integration se pehle Postman mein request bana kar different scenarios (valid input, invalid input, edge cases, auth failures) manually test karti hoon. Isse pehle hi bugs pakad leti hoon aur ek shared collection team ke saath rakhti hoon taaki sab same endpoints consistently test kar sakein.

### Q98. Git mein ek production bug fix ka workflow kaise follow karogi (hotfix scenario)?
`main`/production branch se ek `hotfix/` branch banaungi, fix karke locally test karungi, PR create karke quick review lungi, phir merge karke turant deploy karungi. Saath hi usi fix ko `develop` branch mein bhi merge karungi taaki future releases mein bug dobara na aaye.

### Q99. Agar do teams same microservice par kaam kar rahi hon to conflicts/coordination kaise manage karogi?
Clear API contracts (documented via Postman/OpenAPI) maintain karungi taaki dono teams independently apne parts par kaam kar sakein bina break kiye. Git mein feature branches use karungi aur frequently `main`/`develop` se rebase/merge karungi taaki conflicts bade na ho jaayein, aur communication ke through pehle hi overlapping changes discuss kar lungi.

### Q100. Overall, tumhare experience ke hisaab se Docker, Celery/Redis aur Microservices ek saath kaise fit hote hain ek real-world project mein?
Microservices architecture system ko chhote, manageable pieces mein todta hai; Docker un pieces ko consistently package aur deploy karne ka tarika deta hai; aur Celery+Redis un services ke andar heavy/time-consuming kaam ko asynchronously, background mein efficiently process karne ka mechanism deta hai. Teeno saath milkar ek scalable, maintainable, aur responsive system banate hain — jaisa maine RIoAI aur Live Attendance System jaise projects mein implement kiya.
