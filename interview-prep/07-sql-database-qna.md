# SQL & Database Interview Questions & Answers (Hinglish)

Ye file SQL/MySQL/PostgreSQL ke top 100 interview questions cover karti hai — basics se lekar schema design aur real project scenarios tak (Shamaim Lifestyle, Viscus Infotech, Doctor Management System, Live Attendance System jaise experience ko dhyan mein rakhte hue).

## 1. SQL Basics (DDL, DML, DCL, TCL)

### Q1. SQL commands ki main categories kya hain?
SQL commands ko 4 main categories mein baanta jaata hai:
- **DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP`, `TRUNCATE` — schema/structure define karne ke liye.
- **DML (Data Manipulation Language)**: `INSERT`, `UPDATE`, `DELETE` — data manipulate karne ke liye.
- **DQL (Data Query Language)**: `SELECT` — data retrieve karne ke liye.
- **DCL (Data Control Language)**: `GRANT`, `REVOKE` — permissions control karne ke liye.
- **TCL (Transaction Control Language)**: `COMMIT`, `ROLLBACK`, `SAVEPOINT` — transactions manage karne ke liye.

### Q2. DELETE, TRUNCATE aur DROP mein kya difference hai?
- `DELETE` — DML command, row-by-row rows remove karta hai, `WHERE` clause use ho sakta hai, rollback possible hai (transaction ke andar), aur triggers fire hote hain.
- `TRUNCATE` — DDL command, poori table ka data ek saath remove karta hai (fast, minimal logging), `WHERE` clause allowed nahi, auto-increment reset ho jaata hai.
- `DROP` — poori table (structure + data) hi delete kar deta hai.

```sql
DELETE FROM employees WHERE department = 'HR';
TRUNCATE TABLE employees;
DROP TABLE employees;
```

### Q3. PRIMARY KEY constraint kya karta hai aur usse kaise define karte hain?
Primary key ek column (ya columns ka set) hoti hai jo har row ko uniquely identify karti hai. Ye `NULL` allow nahi karti aur uniqueness enforce karti hai — automatically ek unique index bhi create ho jaata hai.

```sql
CREATE TABLE employees (
  emp_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);
```

### Q4. INSERT statement ke different forms kya hain?
Single row insert, multiple rows insert, aur `SELECT` ke through ek table se doosri table mein insert karna:

```sql
INSERT INTO employees (name, dept) VALUES ('Khushi', 'Engineering');
INSERT INTO employees (name, dept) VALUES ('A','X'), ('B','Y');
INSERT INTO employees_archive SELECT * FROM employees WHERE dept = 'X';
```

### Q5. UPDATE statement mein WHERE clause miss karne se kya hota hai?
Agar `UPDATE` statement mein `WHERE` clause nahi diya to poori table ke saare rows update ho jaayenge — ye ek common aur dangerous mistake hai production mein. Isiliye hamesha pehle `SELECT` ke saath same condition test karo, phir `UPDATE` run karo, aur transactions ke andar chalao taaki zaroorat padne par rollback ho sake.

### Q6. GRANT aur REVOKE kis liye use hote hain?
Ye DCL commands hain jo database users/roles ko permissions dene ya hatane ke liye use hote hain — jaise `SELECT`, `INSERT`, `UPDATE`, `DELETE` access kisi specific table par.

```sql
GRANT SELECT, INSERT ON employees TO app_user;
REVOKE INSERT ON employees FROM app_user;
```

### Q7. COMMIT, ROLLBACK aur SAVEPOINT kya karte hain?
- `COMMIT` — transaction ke changes ko permanently save karta hai.
- `ROLLBACK` — transaction ke changes undo kar deta hai (agar commit nahi hua to).
- `SAVEPOINT` — transaction ke beech ek checkpoint set karta hai, taaki poore transaction ko rollback kiye bina partial rollback ho sake.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT sp1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
ROLLBACK TO sp1;
COMMIT;
```

### Q8. WHERE aur HAVING mein kya difference hai?
`WHERE` clause rows ko filter karta hai grouping se pehle (row-level filtering), jabki `HAVING` clause groups ko filter karta hai `GROUP BY` ke baad (aggregate results par condition). `HAVING` mein aggregate functions (`COUNT`, `SUM` etc.) use kar sakte hain, `WHERE` mein nahi.

### Q9. DISTINCT keyword ka use kya hai?
`DISTINCT` duplicate rows ko result set se remove kar deta hai, sirf unique values return karta hai.

```sql
SELECT DISTINCT department FROM employees;
```

### Q10. ALTER TABLE se hum kya-kya changes kar sakte hain?
`ALTER TABLE` se hum column add/drop/modify kar sakte hain, constraints add/remove kar sakte hain, aur table rename kar sakte hain — sab bina data lose kiye (kuch cases mein locking/downtime consideration ke saath).

```sql
ALTER TABLE employees ADD COLUMN email VARCHAR(150);
ALTER TABLE employees ALTER COLUMN email SET NOT NULL;
ALTER TABLE employees DROP COLUMN email;
```

## 2. Joins

### Q11. INNER JOIN kya hai?
`INNER JOIN` sirf wahi rows return karta hai jinke liye dono tables mein matching values ho. Agar match nahi milta to woh row result mein nahi aati.

```sql
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
```

### Q12. LEFT JOIN (LEFT OUTER JOIN) kya karta hai?
Left table ke saare rows return karta hai, aur right table se matching rows attach karta hai — agar match nahi milta to right table ke columns `NULL` aa jaate hain. Ye tab useful hota hai jab hume "left side ka har record chahiye, chahe related data ho ya na ho" jaisa case handle karna ho.

```sql
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
```

### Q13. RIGHT JOIN aur LEFT JOIN mein kya difference hai?
`RIGHT JOIN` right table ke saare rows return karta hai aur left table se matching rows attach karta hai (no match = `NULL`) — basically `LEFT JOIN` ka opposite. Practically, `RIGHT JOIN` ko table order swap karke `LEFT JOIN` se replace kiya ja sakta hai, isiliye zyada teams sirf `LEFT JOIN` use karti hain readability ke liye.

### Q14. FULL OUTER JOIN kab use karte hain?
`FULL OUTER JOIN` dono tables ke saare rows return karta hai — jahan match milta hai wahan combine hota hai, jahan nahi milta wahan doosri side `NULL` aata hai. Useful hai jab hume dono sides ka complete data chahiye, jaise "kaunse employees ka department nahi hai" aur "kaunse departments mein employee nahi hai" dono ek saath dekhna ho. MySQL directly support nahi karta — `LEFT JOIN UNION RIGHT JOIN` se simulate karte hain.

```sql
SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.id;
```

### Q15. SELF JOIN kya hota hai aur kab use hota hai?
Self join ek table ko khud ke saath join karna hota hai, table ko do alag aliases dekar. Ye tab useful hota hai jab table ke andar hi hierarchical ya relational data ho, jaise employee-manager relationship.

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

### Q16. CROSS JOIN kya karta hai?
`CROSS JOIN` dono tables ka Cartesian product return karta hai — har row of table A ko har row of table B ke saath combine karta hai. Koi join condition nahi hoti. Agar table A mein 3 rows aur B mein 4 rows hain, to result 12 rows ka hoga. Rarely used directly, lekin combinations generate karne (jaise date x product matrix) ke liye useful hai.

```sql
SELECT s.size, c.color FROM sizes s CROSS JOIN colors c;
```

### Q17. Multiple tables ko ek saath join kaise karte hain?
Multiple `JOIN` clauses ko chain karke, har join ka apna `ON` condition dete hue:

```sql
SELECT a.emp_id, a.check_in, d.dept_name, l.location_name
FROM attendance a
JOIN employees e ON a.emp_id = e.emp_id
JOIN departments d ON e.dept_id = d.id
JOIN locations l ON d.location_id = l.id;
```

### Q18. JOIN aur subquery mein kab kya use karna better hai?
Generally `JOIN` performance mein better hota hai kyunki database engine query optimizer joins ko efficiently plan kar sakta hai (especially indexes ke saath), aur result set ek hi pass mein milta hai. Subqueries readable ho sakti hain jab hume sirf ek check karna ho (`EXISTS`, `IN`), lekin correlated subqueries row-by-row execute ho sakti hain jo slow ho jaati hain bade datasets par.

### Q19. NATURAL JOIN kya hota hai aur isse avoid kyun karte hain?
`NATURAL JOIN` automatically un columns par join karta hai jinke same naam dono tables mein hote hain, bina explicit `ON` condition ke. Isse avoid karte hain kyunki agar future mein koi naya same-name column add ho jaaye to join behavior silently change ho sakta hai — explicit `ON` clause zyada safe aur readable hota hai.

### Q20. Join karte waqt duplicate rows aane ka common reason kya hota hai?
Agar join condition one-to-many ya many-to-many relationship produce kar rahi hai (jaise ek employee ke multiple attendance records hain aur hum unhe department ke saath join kar rahe hain), to result mein rows duplicate/multiply ho jaate hain. Isse fix karne ke liye aggregate functions, `DISTINCT`, ya proper join keys (composite keys) use karte hain.

## 3. Constraints, Keys, Normalization

### Q21. Primary key aur unique key mein kya difference hai?
Primary key table mein sirf ek hi ho sakta hai, `NULL` allow nahi karta, aur row ki uniqueness enforce karta hai. Unique key multiple ho sakte hain ek table mein, aur ek `NULL` value allow karte hain (MySQL/Postgres mein). Dono ke peeche automatically unique index create hota hai.

### Q22. Foreign key kya hai aur referential integrity kaise maintain karta hai?
Foreign key ek column hoti hai jo doosri table ke primary key ko reference karti hai. Ye ensure karta hai ki child table mein woh hi value insert ho jo parent table mein already exist karti ho — isse orphan records (jaise employee jiska invalid department_id ho) nahi ban paate.

```sql
CREATE TABLE attendance (
  id INT PRIMARY KEY,
  emp_id INT,
  FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
);
```

### Q23. Composite key kya hota hai?
Composite key wo primary/unique key hoti hai jo do ya zyada columns ka combination hoti hai — jab akela ek column uniqueness guarantee nahi kar sakta. Attendance system mein `(emp_id, date)` ek acha composite key example hai kyunki ek employee ka ek din mein sirf ek attendance record hona chahiye.

```sql
CREATE TABLE attendance (
  emp_id INT,
  attendance_date DATE,
  status VARCHAR(20),
  PRIMARY KEY (emp_id, attendance_date)
);
```

### Q24. NOT NULL, CHECK aur DEFAULT constraints kya karte hain?
- `NOT NULL` — column mein `NULL` value insert hone se rokta hai.
- `CHECK` — column value ke liye ek condition enforce karta hai (jaise age > 0).
- `DEFAULT` — agar value provide nahi ki gayi to ek default value assign karta hai.

```sql
CREATE TABLE patients (
  age INT CHECK (age > 0),
  status VARCHAR(20) DEFAULT 'active',
  name VARCHAR(100) NOT NULL
);
```

### Q25. Normalization kya hai aur kyun zaroori hai?
Normalization ek process hai jisse database schema ko design karte hain taaki data redundancy kam ho aur data integrity better ho. Isme large tables ko chhoti related tables mein todte hain aur relationships foreign keys se maintain karte hain — isse update anomalies, insertion anomalies aur deletion anomalies avoid hoti hain.

### Q26. 1NF (First Normal Form) ka rule kya hai?
1NF ke according har column mein atomic (indivisible) values honi chahiye, aur har row unique honi chahiye. Matlab ek column mein comma-separated multiple values (jaise `phone: "9876543210,9123456789"`) store nahi karni chahiye — inhe alag rows ya alag table mein tod dena chahiye.

### Q27. 2NF (Second Normal Form) ka rule kya hai?
2NF ke liye table pehle 1NF mein honi chahiye, aur har non-key column poore primary key par fully functionally dependent honi chahiye — partial dependency nahi honi chahiye. Ye issue tab aata hai jab composite primary key ho aur koi column sirf uska ek part par depend karta ho.

### Q28. 3NF (Third Normal Form) ka rule kya hai?
3NF ke liye table 2NF mein honi chahiye, aur koi bhi transitive dependency nahi honi chahiye — matlab non-key columns sirf primary key par depend karein, kisi doosre non-key column par nahi. Jaise agar `employees` table mein `dept_id` aur `dept_name` dono hain, to `dept_name` transitively `dept_id` par depend karta hai — isse `departments` table mein alag nikal dena chahiye.

### Q29. BCNF (Boyce-Codd Normal Form) 3NF se kaise different hai?
BCNF, 3NF ka stricter version hai — ye edge cases handle karta hai jahan multiple overlapping candidate keys hote hain. BCNF ke liye har functional dependency `X -> Y` mein `X` ek super key hona chahiye. Real-world mein most 3NF tables already BCNF compliant hoti hain, lekin jab multiple candidate keys overlap karte hain tab difference matter karta hai.

### Q30. Denormalization kab karte hain?
Denormalization jaan-boojh kar redundancy add karna hota hai read performance improve karne ke liye — normalized schema mein bahut zyada joins lagte hain jo read-heavy, high-traffic systems mein slow ho sakte hain. Jaise attendance dashboard mein employee name aur department name ko attendance table mein hi duplicate rakh sakte hain taaki reporting queries fast ho, joins ki zaroorat kam ho.

### Q31. Schema design mein referential integrity ke saath ON DELETE/ON UPDATE options kya hain?
- `CASCADE` — parent delete/update hone par child rows bhi automatically delete/update ho jaati hain.
- `SET NULL` — child row ka foreign key column `NULL` ho jaata hai.
- `RESTRICT`/`NO ACTION` — agar child rows exist karti hain to parent delete/update block ho jaata hai.

```sql
FOREIGN KEY (dept_id) REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE;
```

### Q32. Ek real schema example do jisme normalization apply ki gayi ho.
Doctor Management System mein agar hum sab kuch ek hi table (`appointments`) mein rakhein — patient name, doctor name, doctor specialization, patient address — to bahut redundancy hogi. Isliye normalize karte hain: `patients`, `doctors`, `appointments` (jisme sirf `patient_id`, `doctor_id` foreign keys hon) — isse har entity ka data ek hi jagah update hota hai, aur data inconsistency ka risk kam ho jaata hai.

## 4. Indexing

### Q33. Index kya hota hai aur ye query performance kaise improve karta hai?
Index ek data structure hai (usually B-Tree) jo table ke columns par banaya jaata hai taaki database rows ko full table scan kiye bina fast locate kar sake — jaise book ka index page numbers dhoondhne mein help karta hai. Bina index ke database ko poori table scan karni padti hai (`O(n)`), index ke saath lookup much faster ho jaata hai (`O(log n)`).

```sql
CREATE INDEX idx_emp_dept ON employees(dept_id);
```

### Q34. Clustered aur non-clustered index mein kya difference hai?
- **Clustered Index**: Actual table data physically usi order mein store hota hai jaise index define hai. Ek table mein sirf ek clustered index ho sakta hai (usually primary key par).
- **Non-Clustered Index**: Ek separate structure hai jo actual data ka pointer/reference rakhta hai, actual row order change nahi karta. Ek table mein multiple non-clustered indexes ho sakte hain.

MySQL (InnoDB) mein primary key hamesha clustered index hota hai; PostgreSQL mein by default sab indexes non-clustered hote hain (`CLUSTER` command se manually cluster kiya ja sakta hai).

### Q35. Composite (multi-column) index kya hai aur column order kyun matter karta hai?
Composite index multiple columns par ek saath banaya jaata hai. Column order important hai kyunki index sirf tab efficiently use hota hai jab query left-most columns par filter kare (leftmost prefix rule).

```sql
CREATE INDEX idx_attendance ON attendance(emp_id, attendance_date);
-- Ye index emp_id filter ke liye use hoga, aur emp_id + date dono ke liye bhi,
-- lekin sirf attendance_date filter karne par use nahi hoga.
```

### Q36. Index kab use nahi karna chahiye / overhead kya hai?
Har index write operations (`INSERT`, `UPDATE`, `DELETE`) ko slow karta hai kyunki har write par index bhi update karna padta hai, aur extra disk space bhi consume hota hai. Isliye low-cardinality columns (jaise boolean `is_active`) ya bahut choti tables par index avoid karna chahiye — benefit se zyada overhead ho sakta hai.

### Q37. Unique index aur regular index mein kya farak hai?
Unique index ye enforce karta hai ki column (ya columns ka combination) mein koi duplicate value na ho, saath hi lookup speed bhi improve karta hai. Regular (non-unique) index sirf performance ke liye hota hai, duplicates allow karta hai.

```sql
CREATE UNIQUE INDEX idx_unique_email ON employees(email);
```

### Q38. Covering index kya hota hai?
Covering index wo index hai jisme query ke saare required columns already index mein maujood hote hain, isliye database ko actual table row fetch karne ki zaroorat nahi padti (index-only scan) — ye query ko aur fast bana deta hai.

```sql
CREATE INDEX idx_covering ON attendance(emp_id, attendance_date, status);
-- Query: SELECT status FROM attendance WHERE emp_id = 1 AND attendance_date = '2026-08-08';
```

### Q39. Full-text index kab use karte hain?
Full-text index tab use karte hain jab humein text columns (jaise description, comments) ke andar keyword search karni ho — `LIKE '%keyword%'` bahut slow hota hai large text par kyunki index use nahi hota, jabki full-text index specifically word-based searching ke liye optimized hota hai.

```sql
CREATE FULLTEXT INDEX idx_ft_desc ON products(description);
SELECT * FROM products WHERE MATCH(description) AGAINST('wireless mouse');
```

### Q40. Index ka use ho raha hai ya nahi ye kaise check karte hain?
`EXPLAIN` (MySQL) ya `EXPLAIN ANALYZE` (PostgreSQL) command se query execution plan dekh sakte hain — ye batata hai ki query index scan use kar rahi hai ya full table scan (`seq scan`/`ALL`).

```sql
EXPLAIN SELECT * FROM attendance WHERE emp_id = 101;
```

### Q41. Index maintenance ka overhead high-write systems mein kaise handle karte hain (attendance system context)?
High-throughput attendance logging jaisi systems mein bahut zyada `INSERT`s hoti hain, isliye sirf zaroori columns par hi index banate hain (jaise `emp_id`, `attendance_date` composite index), unnecessary indexes avoid karte hain, aur periodically unused indexes ko `EXPLAIN`/monitoring tools se identify karke remove karte hain taaki write throughput affect na ho.

### Q42. B-Tree index aur Hash index mein kya difference hai?
B-Tree index sorted data structure hai jo range queries (`<`, `>`, `BETWEEN`, `ORDER BY`) ke liye efficient hota hai aur most databases mein default index type hota hai. Hash index sirf exact equality (`=`) lookups ke liye optimized hota hai, range queries support nahi karta, lekin equality lookups mein thoda fast ho sakta hai.

## 5. Aggregate Functions, GROUP BY, HAVING, Subqueries, CTEs, Window Functions

### Q43. Common aggregate functions kaunse hain?
`COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()` — ye sab multiple rows ko ek single summary value mein combine karte hain.

```sql
SELECT COUNT(*), AVG(salary), MAX(salary) FROM employees;
```

### Q44. GROUP BY kaise kaam karta hai?
`GROUP BY` rows ko specified column(s) ke basis par groups mein divide karta hai, aur phir har group ke liye aggregate function apply hoti hai.

```sql
SELECT dept_id, COUNT(*) AS total_employees
FROM employees
GROUP BY dept_id;
```

### Q45. HAVING clause ka ek practical example do.
`HAVING` un groups ko filter karta hai jo aggregate condition satisfy karte hain — jaise sirf woh departments dikhane hain jinme 10 se zyada employees hain.

```sql
SELECT dept_id, COUNT(*) AS total
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 10;
```

### Q46. Correlated subquery kya hoti hai?
Correlated subquery wo subquery hai jo outer query ke row ke value par depend karti hai — isliye ye outer query ki har row ke liye ek baar execute hoti hai (unlike normal subquery jo ek hi baar chalti hai). Ye powerful hai but performance-heavy ho sakti hai bade datasets par.

```sql
SELECT e.name FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e.dept_id);
```

### Q47. CTE (Common Table Expression) kya hai aur ye subquery se kaise better hai?
CTE `WITH` clause se define kiya jaata hai — ek temporary named result set jo query readability improve karta hai, especially complex/nested queries mein. Ye subquery jaisa hi kaam karta hai lekin zyada readable, reusable (same query mein multiple baar reference) hota hai, aur recursive queries bhi support karta hai.

```sql
WITH dept_avg AS (
  SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id
)
SELECT e.name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d ON e.dept_id = d.dept_id
WHERE e.salary > d.avg_sal;
```

### Q48. Recursive CTE ka use case kya hai?
Recursive CTE hierarchical/tree-structured data traverse karne ke liye use hota hai — jaise employee-manager hierarchy mein kisi employee ke saare subordinates (direct + indirect) nikalna.

```sql
WITH RECURSIVE subordinates AS (
  SELECT emp_id, manager_id, name FROM employees WHERE emp_id = 1
  UNION ALL
  SELECT e.emp_id, e.manager_id, e.name
  FROM employees e
  JOIN subordinates s ON e.manager_id = s.emp_id
)
SELECT * FROM subordinates;
```

### Q49. Window functions kya hote hain aur GROUP BY se kaise different hain?
Window functions (`OVER()` clause ke saath) aggregate calculations karte hain lekin `GROUP BY` ki tarah rows ko collapse nahi karte — har row apni original form mein rehti hai, saath mein ek calculated column bhi milta hai. Isse hum "row-level detail + aggregate context" dono ek saath dekh sakte hain.

```sql
SELECT name, dept_id, salary,
       AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
FROM employees;
```

### Q50. ROW_NUMBER(), RANK() aur DENSE_RANK() mein kya difference hai?
- `ROW_NUMBER()` — har row ko ek unique sequential number deta hai, ties ke liye bhi different numbers.
- `RANK()` — ties ko same rank deta hai, lekin next rank mein gap chhod deta hai (jaise 1,2,2,4).
- `DENSE_RANK()` — ties ko same rank deta hai, lekin koi gap nahi chhodta (jaise 1,2,2,3).

```sql
SELECT name, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,
       RANK() OVER (ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk
FROM employees;
```

### Q51. Ek scenario do jaha ROW_NUMBER() ka use ho (duplicate remove karna).
Duplicate records identify aur delete karne ke liye `ROW_NUMBER()` bahut useful hota hai:

```sql
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY emp_id, attendance_date ORDER BY id) AS rn
  FROM attendance
)
DELETE FROM attendance WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
```

### Q52. LEAD() aur LAG() window functions kya karte hain?
`LAG()` current row se pehle wali row ki value return karta hai, aur `LEAD()` current row ke baad wali row ki value return karta hai — same partition/order ke andar. Ye time-series data mein (jaise "kal ke comparison mein aaj ka attendance status") useful hote hain.

```sql
SELECT emp_id, attendance_date, status,
       LAG(status) OVER (PARTITION BY emp_id ORDER BY attendance_date) AS prev_status
FROM attendance;
```

### Q53. EXISTS aur IN mein kya difference hai?
`EXISTS` subquery ke rows ki existence check karta hai (true/false), aur usually better performance deta hai jab subquery large result set return kar sakti hai kyunki match milte hi stop ho jaata hai. `IN` poori subquery ka result list banata hai aur phir compare karta hai — `NULL` values ke saath `IN` unexpected behavior de sakta hai.

```sql
SELECT name FROM employees e
WHERE EXISTS (SELECT 1 FROM attendance a WHERE a.emp_id = e.emp_id AND a.status = 'absent');
```

### Q54. GROUP BY ke saath multiple columns aur ROLLUP ka use kaise karte hain?
Multiple columns par group karke hierarchical summary nikal sakte hain, aur `ROLLUP` subtotal + grand total rows automatically add kar deta hai.

```sql
SELECT dept_id, attendance_date, COUNT(*) AS total
FROM attendance
GROUP BY ROLLUP(dept_id, attendance_date);
```

## 6. Transactions, ACID, Isolation Levels, Locking, Deadlocks

### Q55. ACID properties kya hain?
- **Atomicity** — transaction ke saare operations ya to poori tarah complete honge ya bilkul nahi (all or nothing).
- **Consistency** — transaction database ko ek valid state se doosre valid state mein le jaata hai, constraints violate nahi hote.
- **Isolation** — concurrent transactions ek doosre ko interfere nahi karte, jaise woh sequentially chal rahe hon.
- **Durability** — ek baar commit ho jaane ke baad, changes permanently save rehte hain (system crash ke baad bhi).

### Q56. Transaction kya hota hai aur usse kaise use karte hain?
Transaction operations ka ek group hota hai jo ek single logical unit ki tarah execute hota hai. `BEGIN`/`START TRANSACTION` se shuru hota hai, aur `COMMIT` (save) ya `ROLLBACK` (undo) se end hota hai.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
```

### Q57. Isolation levels kaunse hain aur inka order kya hai?
Standard SQL isolation levels (weakest se strongest):
1. **Read Uncommitted** — dusre transaction ka uncommitted data bhi dikh sakta hai (dirty read).
2. **Read Committed** — sirf committed data dikhta hai, but same transaction mein baar-baar read karne par different values aa sakti hain (non-repeatable read).
3. **Repeatable Read** — ek transaction ke andar same row baar-baar same value deta hai, but naye rows aa sakte hain (phantom read). MySQL ka default hai.
4. **Serializable** — sabse strict, transactions purely sequential jaise behave karte hain, koi anomaly nahi hoti, but concurrency/performance sabse kam hoti hai.

### Q58. Dirty read, non-repeatable read aur phantom read mein kya difference hai?
- **Dirty Read**: Ek transaction doosre uncommitted transaction ka data padh leta hai — agar woh rollback ho jaaye to invalid data use ho jaata hai.
- **Non-repeatable Read**: Same transaction mein same row do baar read karne par different value milti hai kyunki beech mein doosra transaction usse update+commit kar chuka.
- **Phantom Read**: Same query dobara run karne par naye rows dikhte hain kyunki beech mein doosra transaction naye rows insert kar chuka aur commit kar diya.

### Q59. Deadlock kya hota hai aur ye kaise hota hai?
Deadlock tab hota hai jab do (ya zyada) transactions ek doosre ke resources (locks) ke liye wait karte reh jaate hain — Transaction A, Row 1 lock karke Row 2 ka wait kar raha hai, aur Transaction B, Row 2 lock karke Row 1 ka wait kar raha hai. Dono infinite wait mein phas jaate hain.

### Q60. Deadlocks avoid karne ke best practices kya hain?
- Tables/rows ko hamesha ek consistent order mein access karo (jaise dono transactions mein pehle Row 1, phir Row 2).
- Transactions ko chhota aur fast rakho, unnecessary locks jaldi release karo.
- Retry logic implement karo application layer mein deadlock detection ke baad.
- Indexes properly use karo taaki unnecessary full table locks na lagein.

### Q61. Optimistic aur pessimistic locking mein kya difference hai?
**Pessimistic locking** row ko turant lock kar deta hai jab tak transaction complete nahi hoti (`SELECT ... FOR UPDATE`) — safe but concurrency kam hoti hai. **Optimistic locking** koi lock nahi lagata, balki ek version/timestamp column check karta hai update ke waqt — agar version mismatch ho to conflict detect karke retry karta hai. High-concurrency read-heavy systems mein optimistic locking better perform karti hai.

```sql
UPDATE accounts SET balance = 500, version = version + 1
WHERE id = 1 AND version = 3;
```

### Q62. SELECT ... FOR UPDATE ka use kya hai?
Ye statement selected rows par exclusive lock lagata hai taaki koi doosra transaction unhe modify ya lock na kar sake jab tak current transaction commit/rollback na ho jaaye — typically banking jaise systems mein balance update se pehle row lock karne ke liye use hota hai.

```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

### Q63. Nested transactions/savepoints ka practical use case kya hai?
Savepoints tab useful hain jab ek badi transaction mein multiple steps ho, aur agar koi ek step fail ho jaaye to sirf usi part ko rollback karna ho, poori transaction ko nahi. Jaise bulk attendance import mein, agar ek record invalid hai to sirf uska savepoint rollback karke baaki records commit kar sakte hain.

### Q64. High-throughput write systems (attendance logging) mein transactions ko efficient kaise rakhte hain?
Transactions ko chhota aur short-lived rakhte hain (jitna zaroori ho utna hi kaam ek transaction mein), batch inserts use karte hain instead of row-by-row commits, appropriate isolation level choose karte hain (usually `Read Committed` sufficient hota hai zyada strict requirement na ho to), aur unnecessary locking (jaise poori table lock) avoid karte hain taaki concurrent writes block na hon.

## 7. Query Optimization & Performance Tuning

### Q65. EXPLAIN plan padhna kaise seekhein?
`EXPLAIN` query ka execution plan dikhata hai — kaunsa join type use ho raha hai, kaunsa index use ho raha hai (ya nahi), kitni rows scan ho rahi hain estimated. Key cheezein dekhni hoti hain: `type`/`scan type` (index scan vs full/seq scan), `rows` (estimated rows scanned), aur `key` (kaunsa index actually use hua).

```sql
EXPLAIN ANALYZE
SELECT * FROM attendance WHERE emp_id = 101 AND attendance_date = '2026-08-08';
```

### Q66. N+1 query problem kya hai aur ise kaise avoid karte hain?
N+1 problem tab hota hai jab hum ek list fetch karte hain (1 query), aur phir har item ke liye ek alag query chalate hain related data ke liye (N queries) — total N+1 queries ban jaati hain jo bahut inefficient hai. Isse avoid karne ke liye `JOIN` use karte hain, ya batch/`IN` clause se ek hi query mein saara related data fetch karte hain, ya ORM mein eager loading (`JOIN FETCH`, `include`) use karte hain.

```sql
-- Bad: N+1 (loop mein har employee ke liye alag query)
-- Good: single query with JOIN
SELECT e.name, a.status FROM employees e
JOIN attendance a ON e.emp_id = a.emp_id
WHERE a.attendance_date = '2026-08-08';
```

### Q67. SELECT * avoid karne ki salah kyun di jaati hai?
`SELECT *` unnecessary columns bhi fetch karta hai jinki zaroorat nahi hoti, jisse network bandwidth, memory aur I/O waste hota hai. Ye covering index ka benefit bhi khatam kar deta hai (kyunki extra columns table se fetch karni padti hain), aur schema change hone par application break ho sakta hai. Hamesha specific columns explicitly select karni chahiye.

### Q68. Query optimization ke general techniques kya hain?
- Sirf zaroori columns select karo (`SELECT col1, col2` instead of `*`).
- Proper indexing (WHERE, JOIN, ORDER BY columns par).
- `LIMIT`/pagination use karo bade result sets ke liye.
- Subqueries ko joins mein convert karo jahan possible ho.
- Functions ko indexed columns par apply karne se bacho (jaise `WHERE YEAR(date) = 2026` index use nahi karta, `WHERE date >= '2026-01-01' AND date < '2027-01-01'` karta hai).
- Batch operations use karo bulk insert/update ke liye instead of row-by-row.

### Q69. Pagination efficiently kaise implement karte hain bade datasets par?
Simple `LIMIT`/`OFFSET` bade offset values par slow ho jaata hai kyunki database ko skip ki gayi rows bhi scan karni padti hain. Better approach hai **keyset/cursor-based pagination** — last seen row ki id/timestamp ko condition mein use karna.

```sql
-- Slow for large offset:
SELECT * FROM attendance ORDER BY id LIMIT 20 OFFSET 100000;
-- Better (keyset pagination):
SELECT * FROM attendance WHERE id > 100000 ORDER BY id LIMIT 20;
```

### Q70. Query slow chal rahi hai — debugging ka approach kya hoga?
1. Pehle `EXPLAIN`/`EXPLAIN ANALYZE` se execution plan check karo — full table scan ho raha hai kya.
2. `WHERE`, `JOIN`, `ORDER BY` columns par indexes check karo.
3. Query mein functions/type-casting indexed columns par to nahi lag rahe.
4. Data volume aur table statistics check karo (`ANALYZE TABLE` stale ho sakti hai).
5. Joins ka order aur unnecessary joins/subqueries review karo.
6. Slow query log (MySQL) ya `pg_stat_statements` (PostgreSQL) se actual production slow queries identify karo.

### Q71. LIMIT/OFFSET aur cursor-based pagination mein kya trade-off hai?
`LIMIT`/`OFFSET` implement karna simple hai aur random page jump support karta hai (jaise directly page 5 pe jaana), lekin bade offsets par performance degrade hoti hai. Cursor-based pagination consistently fast rehta hai chahe kitna bhi data ho, lekin random page jump support nahi karta — sirf next/previous navigation ke liye suitable hai (infinite scroll jaisi UI ke liye ideal).

### Q72. Query caching kaise performance improve karti hai, aur cache invalidation ka challenge kya hai?
Frequently accessed, rarely changing data (jaise department list, employee master data) ko Redis jaisi in-memory cache mein rakhne se database par load kam hota hai aur response time drastically improve hota hai. Challenge ye hota hai ki jab underlying data update ho, tab cache ko bhi timely invalidate/update karna padta hai warna stale data serve ho jaata hai — isके liye TTL-based expiry ya event-based invalidation strategy use karte hain.

### Q73. Batch processing kyun better hai row-by-row operations se, high-throughput attendance system mein?
Row-by-row inserts/updates har baar network round-trip aur transaction overhead lete hain, jo bade volume mein bahut slow ho jaata hai. Batch inserts (`INSERT INTO ... VALUES (...), (...), (...)`) ek hi round-trip mein multiple rows insert karte hain, jisse throughput significantly improve hota hai — attendance logging jaisa high-write system mein ye critical optimization hai.

```sql
INSERT INTO attendance (emp_id, attendance_date, check_in)
VALUES (1, '2026-08-08', '09:01:00'), (2, '2026-08-08', '09:03:00'), (3, '2026-08-08', '09:05:00');
```

### Q74. Connection pooling query performance ko kaise affect karta hai microservices architecture mein?
Har naya database connection banana expensive hota hai (TCP handshake, authentication overhead). Connection pooling ek set of reusable connections maintain karta hai jinhe multiple requests share karte hain — isse latency kam hoti hai aur database par excessive connections ka load nahi padta, jo microservices architecture mein critical hai jaha multiple services ek hi database ko concurrently hit kar sakti hain.

## 8. Stored Procedures, Triggers, Views

### Q75. Stored procedure kya hai aur iske benefits kya hain?
Stored procedure ek precompiled set of SQL statements hai jo database mein store hota hai aur naam se call kiya ja sakta hai. Benefits: reduced network traffic (ek hi call mein multiple operations), reusability, aur business logic ko database layer mein centralize karna.

```sql
DELIMITER //
CREATE PROCEDURE MarkAttendance(IN p_emp_id INT, IN p_date DATE)
BEGIN
  INSERT INTO attendance (emp_id, attendance_date, status)
  VALUES (p_emp_id, p_date, 'present');
END //
DELIMITER ;

CALL MarkAttendance(101, '2026-08-08');
```

### Q76. Trigger kya hota hai aur kab use karte hain?
Trigger ek automatic action hai jo kisi specific event (`INSERT`, `UPDATE`, `DELETE`) hone par khud-ba-khud fire hota hai — bina explicitly call kiye. Use case: audit logging, automatic timestamp update, ya data validation.

```sql
CREATE TRIGGER trg_update_timestamp
BEFORE UPDATE ON employees
FOR EACH ROW
SET NEW.updated_at = NOW();
```

### Q77. View kya hoti hai aur ye actual table se kaise different hoti hai?
View ek virtual table hoti hai jo ek stored query ke basis par banti hai — usme actual data store nahi hota, har baar view query karne par underlying query execute hoti hai. Views complex joins/filters ko simplify karne, aur sensitive columns ko hide karke security enforce karne ke liye use hoti hain.

```sql
CREATE VIEW active_employees AS
SELECT emp_id, name, dept_id FROM employees WHERE status = 'active';

SELECT * FROM active_employees;
```

### Q78. Materialized view normal view se kaise different hai?
Normal view har query call par underlying query re-execute karta hai (real-time data, but slower for complex queries). Materialized view result ko physically store kar leta hai (jaise ek cached snapshot), isliye read fast hoti hai, lekin data ko periodically ya manually refresh karna padta hai — real-time nahi hota jab tak refresh na ho.

```sql
CREATE MATERIALIZED VIEW monthly_attendance_summary AS
SELECT emp_id, DATE_TRUNC('month', attendance_date) AS month, COUNT(*) AS present_days
FROM attendance WHERE status = 'present'
GROUP BY emp_id, DATE_TRUNC('month', attendance_date);
```

### Q79. Trigger use karne ke downsides kya ho sakte hain?
Triggers "hidden" logic create karte hain jo application code mein visible nahi hoti, isse debugging aur maintenance difficult ho jaata hai (developer ko pata hi nahi chalta ki data update hone par background mein aur kuch bhi ho raha hai). Ye performance bhi impact kar sakte hain especially agar triggers chained ho ya complex logic run karein har row par, aur bulk operations ko significantly slow kar sakte hain.

### Q80. Stored procedure kab avoid karni chahiye modern microservices architecture mein?
Microservices architecture mein business logic ko application layer mein rakhna prefer kiya jaata hai kyunki stored procedures database-specific hoti hain (portability kam hoti hai), version control/testing mushkil hota hai application code ke comparison mein, aur ye scaling/deployment ko database se tightly couple kar deti hain. Simple, performance-critical bulk operations ke liye stored procedures still useful ho sakti hain, lekin core business logic application layer mein hi rakhna better practice hai.

## 9. MySQL vs PostgreSQL

### Q81. MySQL aur PostgreSQL mein core architectural difference kya hai?
MySQL ek relational database hai jo simplicity aur speed par focus karta hai, especially read-heavy web applications ke liye — different storage engines support karta hai (InnoDB default). PostgreSQL ek object-relational database hai jo standards-compliance, advanced data types, aur complex queries mein strong hota hai — extensibility aur strict data integrity ke liye jaana jaata hai.

### Q82. JSON/JSONB support ke maamle mein PostgreSQL kaise aage hai?
PostgreSQL ka `JSONB` type binary format mein JSON store karta hai, jisse indexing (`GIN` index) aur querying (`->`, `->>`, `@>` operators) bahut fast aur efficient hoti hai. MySQL bhi `JSON` type support karta hai lekin PostgreSQL ka JSONB indexing aur query capabilities generally zyada mature aur powerful mane jaate hain.

```sql
-- PostgreSQL
SELECT data->>'status' FROM logs WHERE data @> '{"type": "error"}';
```

### Q83. Concurrency handling mein MySQL (InnoDB) aur PostgreSQL kaise differ karte hain?
Dono MVCC (Multi-Version Concurrency Control) use karte hain concurrent reads/writes handle karne ke liye. PostgreSQL ka MVCC implementation generally complex concurrent workloads (heavy writes + reads together) mein zyada robust maana jaata hai, jabki MySQL InnoDB simple, high-throughput read-heavy workloads mein historically fast aur lightweight raha hai.

### Q84. Kaunsa database kab choose karna chahiye — MySQL ya PostgreSQL?
- **MySQL**: Simple CRUD-heavy web applications, jahan read performance priority ho, aur ecosystem/hosting support (WordPress, common web stacks) important ho.
- **PostgreSQL**: Complex queries, advanced data types (JSON, arrays, geospatial via PostGIS), strict data integrity requirements, aur analytics-heavy workloads ke liye better fit hai.

Real projects mein, agar existing team/infrastructure already MySQL par familiar hai aur requirements simple hain, to MySQL practical choice ho sakta hai; complex reporting/data integrity-heavy systems (jaise healthcare data) ke liye PostgreSQL zyada suited hota hai.

### Q85. Replication aur scaling ke options dono databases mein kaise compare hote hain?
Dono master-slave (primary-replica) replication support karte hain read scaling ke liye. MySQL ka replication setup historically simpler aur widely documented raha hai, jabki PostgreSQL logical replication aur streaming replication ke saath flexible options deta hai. Horizontal write-scaling ke liye dono ko external tools (sharding, Citus for Postgres, Vitess for MySQL) ki zaroorat padti hai bade scale par.

## 10. Schema Design for Real Systems

### Q86. High-throughput attendance logging system ke liye schema design karte waqt kya considerations rakhoge?
- Composite primary/unique key `(emp_id, attendance_date)` taaki duplicate entries na ho.
- Insert-heavy workload ke liye minimal indexes rakho (sirf query patterns ke basis par).
- Partitioning consider karo date range ke basis par (jaise monthly partitions) taaki old data query se fast rahe aur table size manageable rahe.
- Denormalize kuch fields (employee name, dept) agar reporting reads bahut frequent hain, taaki joins minimize ho.
- Batch inserts use karo real-time individual writes ke bajaye jahan possible ho.

```sql
CREATE TABLE attendance (
  emp_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(20),
  PRIMARY KEY (emp_id, attendance_date)
) PARTITION BY RANGE (YEAR(attendance_date));
```

### Q87. Healthcare data (Doctor Management System) ke schema mein privacy/security considerations kya hote hain?
- Sensitive fields (jaise medical history, diagnosis) ko encrypt karke store karna chahiye at rest.
- Access control (RBAC — role-based access) implement karna chahiye taaki sirf authorized roles (doctor, admin) hi specific patient data dekh sakein.
- Audit logging rakhni chahiye ki kisne kab kaunsa patient record access/modify kiya (compliance ke liye important, jaise HIPAA-type requirements).
- PII (personally identifiable information) ko separate table mein rakh kar access further restrict kar sakte hain.

### Q88. RBAC (Role-Based Access Control) ko database schema level par kaise implement karte hain?
Typically 3 tables banate hain: `users`, `roles`, aur `user_roles` (many-to-many mapping), aur permissions ko roles ke saath associate karte hain (`role_permissions`). Application layer queries execute karne se pehle check karta hai ki user ke role ke paas required permission hai ya nahi.

```sql
CREATE TABLE roles (id INT PRIMARY KEY, role_name VARCHAR(50));
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE user_roles (
  user_id INT REFERENCES users(id),
  role_id INT REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);
```

### Q89. Time-series jaisi data (attendance logs) ke liye partitioning kyun helpful hoti hai?
Attendance data time ke saath continuously grow karta hai. Agar table ko date range ke basis par partition kiya jaaye (jaise monthly/yearly partitions), to queries jo recent data maangti hain sirf relevant partitions scan karti hain, poori history nahi — isse query performance improve hoti hai, aur old partitions ko archive/drop karna bhi easy ho jaata hai bina poori table affect kiye.

### Q90. Microservices architecture mein database schema design karte waqt kya extra considerations aate hain?
Har microservice ideally apna database/schema own karta hai (database-per-service pattern) taaki services loosely coupled rahein. Cross-service data ki zaroorat hone par events/APIs se sync karte hain instead of direct cross-database joins. Shared attendance data schema design karte waqt hume ye bhi socna padta hai ki kaunsi service authoritative source hai (jaise employee service master data ka owner hai, attendance service sirf `emp_id` reference karti hai).

### Q91. Soft delete vs hard delete — schema design mein kaunsa approach better hai?
**Soft delete** mein hum row ko actually delete nahi karte, balki ek `is_deleted`/`deleted_at` flag/column set karte hain — data recovery aur audit trail ke liye useful hota hai, especially healthcare/financial data mein jaha history preserve karni zaroori hoti hai. **Hard delete** row ko permanently remove kar deta hai, storage save karta hai lekin recovery possible nahi. Sensitive systems (Doctor Management System) mein soft delete generally prefer kiya jaata hai compliance ke liye.

```sql
ALTER TABLE patients ADD COLUMN deleted_at TIMESTAMP NULL;
-- Delete: UPDATE patients SET deleted_at = NOW() WHERE id = 5;
-- Query active: SELECT * FROM patients WHERE deleted_at IS NULL;
```

### Q92. Audit trail (kis user ne kab kya change kiya) schema mein kaise implement karte hain?
Ek separate `audit_log` table banate hain jisme `table_name`, `record_id`, `action` (insert/update/delete), `changed_by`, `changed_at`, aur `old_value`/`new_value` (JSON format mein) store karte hain. Ye triggers ke through automatically populate ho sakta hai, ya application layer se explicitly log kiya ja sakta hai — healthcare aur financial systems mein compliance ke liye ye critical hota hai.

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(50),
  record_id INT,
  action VARCHAR(20),
  changed_by INT,
  changed_at TIMESTAMP DEFAULT NOW(),
  old_value JSONB,
  new_value JSONB
);
```

## 11. Scenario / Project-Based Questions (Resume-Specific)

### Q93. Live Attendance System ke liye aapne SQL schema high-throughput writes ke liye kaise design ki thi?
Maine composite key `(emp_id, attendance_date)` use kiya taaki duplicate check-ins ek query se hi prevent ho jaayein, minimal indexes rakhe (sirf frequently queried columns par) taaki insert speed affect na ho, aur batch insert approach use kiya jaha multiple check-ins ek saath process ho rahe the. Isके alawa, reporting queries ke liye alag read-optimized views/aggregated tables banayi taaki live logging table par heavy analytical queries ka load na aaye.

### Q94. Attendance system mein real-time check-in/check-out ke liye kaunsi concurrency issues aa sakti hain, aur unhe kaise handle kiya?
Agar ek hi employee ka check-in do baar simultaneously request ho (network retry ki wajah se), to duplicate rows ban sakti hain. Isko maine unique constraint `(emp_id, attendance_date)` se database level par hi prevent kiya — application logic ke bharose nahi rakha. Race conditions ke liye `INSERT ... ON DUPLICATE KEY UPDATE` (MySQL) ya `ON CONFLICT` (PostgreSQL) jaisi upsert patterns use ki taaki concurrent requests gracefully handle ho.

```sql
INSERT INTO attendance (emp_id, attendance_date, check_in)
VALUES (101, '2026-08-08', '09:00:00')
ON DUPLICATE KEY UPDATE check_in = VALUES(check_in);
```

### Q95. Doctor Management System mein patient data schema RBAC ke saath kaise design ki?
Maine `patients`, `doctors`, `appointments`, `medical_records` ko alag normalized tables mein rakha taaki data duplication na ho. RBAC ke liye `users`, `roles`, aur `user_roles` tables banayi — jaise doctor role ko sirf apne assigned patients ke medical records dekhne ki permission thi, admin role ko broader access tha. Sensitive fields (diagnosis, prescriptions) ko separate table mein rakha taaki access control granular level par apply ho sake, aur queries mein hamesha role-check application layer se enforce hota tha before executing.

### Q96. Shamaim Lifestyle mein SQL schema optimize karne ka approach kya tha?
Maine existing schema ko review kiya, redundant/unused columns aur indexes identify kiye, `EXPLAIN` plan se slow queries analyze ki, aur missing indexes add kiye frequently filtered/joined columns par. Isके saath data types ko bhi optimize kiya (jaise unnecessarily bade `VARCHAR`/`TEXT` columns ko appropriately size karna) taaki storage aur query performance dono improve ho. Normalization issues bhi fix kiye jaha data redundancy directly update anomalies create kar rahi thi.

### Q97. Viscus Infotech mein microservices architecture mein high-throughput attendance data ke liye schema kaise optimize kiya?
Maine ye ensure kiya ki attendance service apna dedicated schema/database rakhe (loose coupling), aur write-heavy attendance table ko minimal, purposeful indexes ke saath design kiya taaki insert throughput na girein. Read-heavy analytical/reporting queries ke liye alag aggregated/denormalized views banayi, taaki primary write path par load na aaye. Connection pooling aur batch processing bhi implement kiya taaki concurrent writes multiple service instances se efficiently handle ho sakein.

### Q98. Agar attendance table mein crores rows ho jaayein, to aap performance kaise maintain karogi?
Maine date-based partitioning implement karungi (monthly/yearly) taaki queries sirf relevant partition scan karein poori table ki jagah. Purane data ko archive table mein move karungi jo actively query nahi hoti. Composite indexes ko carefully design karungi query patterns ke basis par, aur agar reporting queries heavy hain to read replicas ya materialized views use karungi taaki primary write-path affect na ho.

### Q99. Ek scenario: attendance system mein ek employee ka record duplicate ban gaya hai — root cause aur fix kaise approach karogi?
Sabse pehle main check karungi ki table par unique constraint hai ya nahi `(emp_id, attendance_date)` par — agar nahi hai to yehi root cause ho sakta hai. Phir application logs check karungi ki concurrent/retry requests to nahi aa rahi thi jo race condition create kar rahi hon. Fix ke taur par database-level unique constraint add karungi, application mein idempotent upsert logic (`ON CONFLICT`/`ON DUPLICATE KEY`) implement karungi, aur existing duplicates ko ek cleanup script (window function `ROW_NUMBER()` se) se remove karungi.

### Q100. Doctor Management System aur Live Attendance System dono mein data integrity ensure karne ke liye common practices kya follow ki?
Dono projects mein maine foreign key constraints strictly enforce ki taaki orphan records na banein, appropriate `NOT NULL`/`CHECK` constraints lagayi critical fields par, transactions use ki jahan multiple related tables update ho rahi thi (taaki partial updates na ho), aur unique constraints add ki jahan business rules duplicate data allow nahi karte the (jaise ek din mein ek hi attendance record, ya ek patient ka unique registration ID). Isके saath regular data validation aur audit logging bhi maintain ki taaki data quality issues jaldi identify ho sakein.
