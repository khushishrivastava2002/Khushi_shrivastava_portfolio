# MongoDB Interview Questions & Answers (Hinglish)

Ye file MongoDB ke top 100 interview questions cover karti hai — basics se lekar aggregation framework, replication, sharding, transactions aur PyMongo/Motor + FastAPI integration tak. Answers Hinglish mein hain, technical terms English mein rakhe gaye hain, jisse RIoAI jaise real project (quick-commerce pharmacy delivery app, backend analytics modules) ke context mein directly use ho sake.

## 1. MongoDB Basics (NoSQL vs SQL, Document Model, BSON/JSON)

### Q1. MongoDB kya hai aur ye SQL databases se kaise different hai?
MongoDB ek NoSQL, document-oriented database hai jo data ko JSON jaise flexible documents (BSON format) mein store karta hai, tables aur rigid schema ke bajaye. SQL databases mein fixed schema hota hai, rows/columns hote hain, aur relationships foreign keys se maintain hote hain. MongoDB mein schema flexible hota hai — har document ke fields alag ho sakte hain, aur related data ko embed karke joins ki zaroorat kam ki ja sakti hai. Ye horizontal scaling (sharding) ke liye bhi natively design kiya gaya hai.

### Q2. NoSQL databases kitne types ke hote hain?
Mainly 4 types: Document stores (MongoDB, CouchDB), Key-Value stores (Redis, DynamoDB), Column-family stores (Cassandra, HBase), aur Graph databases (Neo4j). MongoDB document store category mein aata hai — data JSON-like documents mein store hota hai jisme nested structures (arrays, sub-documents) allowed hain. Har type ek specific use-case ke liye optimized hota hai — jaise Redis fast caching ke liye, Neo4j relationship-heavy data ke liye.

### Q3. BSON kya hota hai aur JSON se kaise different hai?
BSON (Binary JSON) MongoDB ka internal binary-encoded storage format hai jisme documents store hote hain. JSON text-based hota hai jabki BSON binary hota hai, jo parsing ko fast banata hai aur additional data types support karta hai jaise Date, ObjectId, Binary data, Int32/Int64, Decimal128 — jo plain JSON mein nahi hote. BSON documents ka size bhi track karta hai jisse traversal efficient hoti hai.

### Q4. Collection aur Table mein kya difference hai?
Table (SQL) ek rigid, predefined schema follow karta hai jisme har row ke same columns hote hain. Collection (MongoDB) documents ka group hota hai jisme har document apni structure rakh sakta hai — schema flexible hota hai. Ek collection mein ek document mein `address` field ho sakta hai aur dusre mein na ho, koi error nahi aayega jab tak validation rules set na ho.

### Q5. Document aur Row mein kya difference hai?
Row (SQL) fixed columns ke against values ka simple set hota hai. Document (MongoDB) ek JSON-like structure hota hai jisme nested objects aur arrays ho sakte hain — matlab ek document apne andar related data embed kar sakta hai (jaise order document mein customer address embed karna), jo row-based systems mein possible nahi hota bina separate table/join ke.

### Q6. MongoDB ki key features kya hain?
Schema flexibility, horizontal scalability via sharding, high availability via replica sets, rich query language, powerful aggregation framework, indexing support (including geospatial aur text indexes), native support for JSON-like documents, aur ACID transactions (multi-document, v4.0+ se). Ye large-scale, high-write-throughput applications ke liye suited hai.

### Q7. MongoDB kab use karna chahiye aur kab nahi?
Use karo jab: data structure evolve hoti rehti ho, high write throughput chahiye, horizontal scaling zaroori ho, ya data naturally hierarchical/nested ho (jaise product catalog, user profiles). Avoid karo jab: complex multi-table joins aur strict relational integrity chahiye ho, ya heavy financial transactions with strict ACID across many tables ho — waha traditional RDBMS (Postgres/MySQL) better fit hote hain.

### Q8. `_id` field ka role kya hai MongoDB mein?
Har document mein `_id` ek unique identifier hota hai jo primary key ki tarah kaam karta hai. Agar explicitly provide nahi kiya jaye to MongoDB automatically ek `ObjectId` generate kar deta hai. Ye field automatically indexed hota hai (unique index), taaki fast lookups ho sakein.

### Q9. ObjectId kaise structure hota hai?
ObjectId 12-byte hexadecimal value hota hai jisme: 4 bytes timestamp (seconds since epoch), 5 bytes random value (machine + process unique), aur 3 bytes incrementing counter hote hain. Isse ObjectId roughly time-ordered aur globally unique hota hai bina central coordination ke.

```javascript
// Example ObjectId
ObjectId("64f1a2b3c4d5e6f7a8b9c0d1")
```

### Q10. MongoDB kis language mein likha gaya hai aur kaunsi query language use karta hai?
MongoDB C++ mein likha gaya hai. Ye apni khud ki query language use karta hai jo JSON-like syntax follow karti hai (MongoDB Query Language - MQL), jisme queries JavaScript objects ki tarah likhi jaati hain — SQL ke text-based syntax se different.

### Q11. Namespace kya hota hai MongoDB mein?
Namespace database name aur collection name ka combination hota hai, format: `database.collection` (jaise `riaoi_db.orders`). Har namespace ke apne indexes aur storage stats hote hain. Internally MongoDB isse data organize aur locate karne ke liye use karta hai.

### Q12. MongoDB Atlas kya hai?
MongoDB Atlas ek fully-managed, cloud-hosted version of MongoDB hai jo AWS, Azure aur GCP par available hai. Ye automated backups, scaling, monitoring, security patches aur multi-region replication out-of-the-box provide karta hai, jisse teams ko infrastructure manage karne ki zaroorat nahi padti — sirf application logic pe focus kar sakte hain.

## 2. CRUD Operations

### Q13. `insertOne` aur `insertMany` mein kya difference hai?
`insertOne` ek single document collection mein insert karta hai aur uska `_id` return karta hai. `insertMany` documents ka array ek saath insert karta hai — bulk insert ke liye zyada efficient hai kyunki single network round-trip mein multiple documents chale jaate hain.

```javascript
db.orders.insertOne({ item: "Paracetamol", qty: 2, status: "pending" });
db.orders.insertMany([
  { item: "Cough Syrup", qty: 1 },
  { item: "Bandage", qty: 5 }
]);
```

### Q14. `find()` aur `findOne()` mein kya difference hai?
`find()` ek cursor return karta hai jisme saare matching documents hote hain (lazy iteration ke saath). `findOne()` sirf first matching document return karta hai (ya `null` agar koi match na ho), directly document object ke roop mein, cursor nahi.

```javascript
db.orders.find({ status: "pending" });     // cursor
db.orders.findOne({ status: "pending" });  // single doc
```

### Q15. Query operators kya hote hain? Kuch common examples do.
Query operators special `$`-prefixed keys hote hain jo comparison, logical ya element-level conditions specify karte hain. Common ones: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$and`, `$or`, `$exists`, `$regex`.

```javascript
db.orders.find({ qty: { $gt: 10, $lte: 50 } });
db.orders.find({ status: { $in: ["pending", "processing"] } });
```

### Q16. `updateOne`, `updateMany` aur `replaceOne` mein kya farak hai?
`updateOne` first matching document ko partially update karta hai (specified fields hi change hote hain). `updateMany` saare matching documents ko update karta hai. `replaceOne` puri document ko naye document se replace kar deta hai, sirf `_id` preserve rehta hai.

```javascript
db.orders.updateOne({ _id: id }, { $set: { status: "shipped" } });
db.orders.updateMany({ status: "pending" }, { $set: { status: "cancelled" } });
```

### Q17. `$set`, `$unset`, `$inc`, `$push` operators kya karte hain?
`$set` field ki value update/add karta hai. `$unset` field ko document se remove karta hai. `$inc` numeric field ki value ko increment/decrement karta hai. `$push` array field mein ek element add karta hai. Ye update operators partial modification ke liye use hote hain, poora document rewrite kiye bina.

```javascript
db.products.updateOne(
  { sku: "P100" },
  { $inc: { stock: -1 }, $push: { orderHistory: orderId } }
);
```

### Q18. `deleteOne` aur `deleteMany` mein kya difference hai?
`deleteOne` filter se match hone wala pehla document delete karta hai. `deleteMany` filter se match hone wale saare documents ek saath delete karta hai. Dono ka return value ek object hota hai jisme `deletedCount` hota hai.

```javascript
db.orders.deleteMany({ status: "cancelled" });
```

### Q19. Upsert kya hota hai?
Upsert (`update` ya `insert`) ek update operation ka option hota hai — agar filter se koi document match nahi hota, to ek naya document create ho jaata hai (filter + update fields ke basis pe). Ye useful hai jab aapko "update if exists, else insert" logic chahiye ho, jaise inventory count maintain karte waqt.

```javascript
db.stock.updateOne(
  { sku: "P100" },
  { $set: { name: "Paracetamol" }, $inc: { qty: 10 } },
  { upsert: true }
);
```

### Q20. Projection kya hoti hai `find()` queries mein?
Projection specify karti hai ki query result mein kaunse fields return karne hain. `1` include karta hai, `0` exclude karta hai (dono ko mix nahi kar sakte, `_id` ko chhodkar). Ye response size kam karke performance improve karta hai jab poore document ki zaroorat nahi hoti.

```javascript
db.orders.find({ status: "pending" }, { item: 1, qty: 1, _id: 0 });
```

### Q21. Cursor methods kya hote hain — `sort`, `limit`, `skip` kaise use karte hain?
Query ke baad cursor par chaining ke through result set control kiya ja sakta hai: `sort()` order set karta hai, `limit()` results ki count restrict karta hai, `skip()` initial N documents skip karta hai (pagination ke liye).

```javascript
db.orders.find({ status: "pending" })
  .sort({ createdAt: -1 })
  .skip(10)
  .limit(10);
```

### Q22. Bulk write operations kya hoti hain?
`bulkWrite()` multiple write operations (insert, update, delete) ko ek single batch mein server ko bhejta hai, jisse network round-trips kam hote hain aur performance improve hoti hai. Ordered aur unordered dono modes support karta hai — ordered mein pehli error par ruk jaata hai, unordered mein saare operations try karta hai.

```javascript
db.orders.bulkWrite([
  { insertOne: { document: { item: "Syrup" } } },
  { updateOne: { filter: { item: "Bandage" }, update: { $set: { qty: 20 } } } }
]);
```

### Q23. `findOneAndUpdate` kis liye use hota hai?
Ye ek atomic operation hai jo document ko find aur update dono karta hai ek hi call mein, aur updated (ya optionally original) document return karta hai. Ye race conditions avoid karne ke liye useful hai — jaise inventory decrement karte waqt "check-then-act" pattern se bachne ke liye.

```javascript
db.stock.findOneAndUpdate(
  { sku: "P100", qty: { $gte: 1 } },
  { $inc: { qty: -1 } },
  { returnDocument: "after" }
);
```

### Q24. Regex queries kaise likhte hain MongoDB mein?
`$regex` operator ya native regex literal use karke pattern-based string matching kar sakte hain, case-insensitive ke liye `$options: "i"` diya jaata hai. Note: bina anchor/index ke regex queries slow ho sakti hain kyunki collection scan ho sakta hai — prefix-anchored regex indexes use kar sakta hai.

```javascript
db.customers.find({ name: { $regex: "^khushi", $options: "i" } });
```

## 3. Schema Design in MongoDB

### Q25. Embedding vs Referencing — kab kaunsa use karna chahiye?
Embedding tab use karo jab related data ko saath hi query kiya jaata ho aur "one-to-few" relationship ho (jaise order ke saath shipping address) — ye read performance improve karta hai kyunki join ki zaroorat nahi. Referencing tab use karo jab data bada ho, frequently independently update hota ho, ya "one-to-many/very-many" relationship ho (jaise ek pharmacy ke thousands of orders) — isse document size bounded rehta hai aur duplication avoid hoti hai.

### Q26. Denormalization strategy MongoDB mein kyun aur kaise apply karte hain?
MongoDB mein joins expensive hote hain (`$lookup` heavy operation hai), isliye read-heavy systems mein commonly accessed data ko embed/duplicate kar dete hain taaki single query se sab mil jaaye. Trade-off ye hai ki write ke time multiple jagah update karni padti hai — is trade-off ko application ke read:write ratio dekh kar decide karte hain. RIoAI jaise quick-commerce app mein order documents ke andar product name/price snapshot embed karna common practice hai taaki historical order data change na ho agar product price baad mein change ho jaaye.

### Q27. Schema flexibility ka fayda aur nuksan kya hai?
Fayda: rapid development, evolving requirements ko easily accommodate kar sakte ho bina migration ke, different document types same collection mein rakh sakte ho. Nuksan: agar discipline na rakhi jaaye to data inconsistent ho sakta hai (kuch documents mein field ho, kuch mein na ho), application-level validation ki zimmedari badh jaati hai, aur unexpected missing fields se bugs aa sakte hain.

### Q28. Schema Validation kaise implement karte hain MongoDB mein?
`$jsonSchema` validator collection creation ya `collMod` command ke through define kiya ja sakta hai, jisse required fields, data types, aur value constraints enforce ho sakein — flexible schema hote hue bhi basic data integrity maintain rehti hai.

```javascript
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["item", "qty", "status"],
      properties: {
        qty: { bsonType: "int", minimum: 1 },
        status: { enum: ["pending", "shipped", "delivered", "cancelled"] }
      }
    }
  }
});
```

### Q29. One-to-Many relationships MongoDB mein kaise model karte hain?
Teen approaches: (1) Embedding — agar "many" side chhota aur bounded ho (jaise product ke saath 5 reviews), (2) Child Referencing — parent document mein children ke `_id`s ka array rakho (jaise customer document mein order IDs), (3) Parent Referencing — har child document mein parent ka `_id` rakho (jaise har order mein customerId) — ye best hota hai jab "many" side unbounded/large ho, jo quick-commerce orders ke case mein sabse common approach hai.

### Q30. Document growth problem (unbounded arrays) kya hoti hai aur kaise handle karte hain?
Agar ek array field continuously grow karta rahe (jaise ek popular product ke saare reviews ek document mein), to document size bad sakta hai aur MongoDB ki 16MB per-document limit hit ho sakti hai, plus write performance degrade hoti hai (document reallocate hota hai). Solution: unbounded data ko separate collection mein reference ke through rakho, ya "bucket pattern" use karo jisme time-based buckets mein data group kiya jaata hai (time-series data ke liye common).

### Q31. MongoDB mein document size limit kya hai?
Har BSON document ki maximum size 16MB hoti hai. Agar isse zyada data store karna ho (jaise large files, images), to GridFS use kiya jaata hai jo file ko chunks mein split karke store karta hai.

### Q32. Polymorphic Pattern kya hota hai schema design mein?
Ye pattern tab use hota hai jab ek collection mein similar lekin structurally different documents store karne hon (jaise different product categories — medicine, medical device, supplement — jinke alag-alag attributes hain). Sab documents ek common set of fields share karte hain (jaise `type`, `name`, `price`) plus type-specific fields, jisse ek hi collection/query se sab handle ho jaata hai without needing separate tables per type — MongoDB ki schema flexibility ka classic use case.

### Q33. Schema design karte waqt kaun se factors consider karne chahiye?
Query patterns (kya read hoga aur kaise), read:write ratio, data growth rate, data relationships ki cardinality, atomicity requirements (single document updates atomic hote hain), aur document size limits. "Design for your queries, not your data" — MongoDB schema design ka golden rule hai, RDBMS normalization se ulta.

### Q34. Extended Reference Pattern kya hai?
Ye ek hybrid approach hai jisme related document ke sirf frequently-needed fields ko duplicate/embed kiya jaata hai (poora document reference karne ke bajaye), taaki common queries ke liye join avoid ho sake lekin document size bhi bounded rahe. Jaise order document mein customer ka poora profile embed karne ke bajaye sirf `customerName` aur `customerId` rakhna.

## 4. Indexing in MongoDB

### Q35. Index kya hota hai aur ye kyun zaroori hai?
Index ek special data structure (B-tree based) hota hai jo query performance improve karta hai by avoiding full collection scan. Bina index ke MongoDB ko `COLLSCAN` karna padta hai — matlab har document check karna padta hai — jo large collections mein bahut slow hota hai. Index ke saath MongoDB directly relevant documents tak pahunch jaata hai.

### Q36. Single field index aur compound index mein kya difference hai?
Single field index ek hi field par based hota hai (jaise `{ status: 1 }`). Compound index multiple fields ko combine karta hai ek particular order mein (jaise `{ status: 1, createdAt: -1 }`) — ye queries ko support karta hai jo un fields ke prefix combination pe filter/sort karti hain. Field order compound index mein bahut matter karta hai (ESR rule: Equality, Sort, Range).

```javascript
db.orders.createIndex({ status: 1, createdAt: -1 });
```

### Q37. Text index kya hota hai aur kab use karte hain?
Text index string content par full-text search enable karta hai — words, stemming, aur relevance-based ranking support karta hai. Ye product descriptions ya medicine names par search feature build karne ke liye useful hai (jaise pharmacy app mein "paracetamol" search karne par similar spellings/synonyms match karna).

```javascript
db.products.createIndex({ name: "text", description: "text" });
db.products.find({ $text: { $search: "paracetamol" } });
```

### Q38. TTL Index kya hota hai?
TTL (Time To Live) index documents ko ek specified time ke baad automatically delete kar deta hai, based on a date field. Ye session data, OTPs, temporary carts, ya logs jaisi cheezon ke liye useful hai jinhe expire hone ke baad manually clean-up nahi karna padta.

```javascript
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

### Q39. Unique Index kya karta hai?
Unique index ensure karta hai ki indexed field(s) mein duplicate values na aa sakein across collection. Jaise `email` field par unique index lagane se do users same email se register nahi kar sakte — MongoDB insert/update reject kar dega duplicate key error ke saath.

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
```

### Q40. Index indexing ka performance par kya impact hota hai?
Reads fast ho jaate hain kyunki full scan avoid hota hai, lekin writes (insert/update/delete) thodi slow ho jaati hain kyunki har write ke saath index bhi update karna padta hai. Zyada indexes matlab zyada memory usage aur disk space bhi. Isliye sirf un fields par index banao jo frequently query/sort/filter hote hain — over-indexing bhi anti-pattern hai.

### Q41. `explain()` command ka kya use hai?
`explain()` query execution plan dikhata hai — kaunsa index use hua (ya `COLLSCAN` hua), kitne documents scan hue, kitna time laga. Ye query performance debug/optimize karne ke liye primary tool hai.

```javascript
db.orders.find({ status: "pending" }).explain("executionStats");
```

### Q42. Compound index mein field order kyun important hota hai?
Compound index ek prefix-based structure follow karta hai — index sirf tab efficiently use hoga jab query us index ke leftmost prefix fields ko match kare. Jaise `{a:1, b:1, c:1}` index queries `{a}`, `{a,b}`, `{a,b,c}` ke liye use ho sakta hai, lekin sirf `{b}` ya `{c}` filter ke liye nahi. ESR rule follow karte hain — pehle Equality fields, phir Sort fields, phir Range fields.

## 5. Aggregation Framework

### Q43. Aggregation framework kya hai aur ye query language se kaise different hai?
Aggregation framework ek pipeline-based data processing tool hai jisme documents multiple "stages" se guzarte hain (jaise assembly line), har stage input transform karke next stage ko deta hai. Simple `find()` queries filtering/projection tak limited hain, jabki aggregation grouping, joining, reshaping aur computing complex metrics kar sakta hai — jaise total sales per city, average delivery time, ya top-selling products.

### Q44. `$match` stage kya karta hai?
`$match` documents ko filter karta hai (jaise `find()` ki tarah), pipeline ke early stages mein use karna best practice hai taaki downstream stages ko kam documents process karne padein — ye index bhi use kar sakta hai agar pipeline ke first stage mein ho.

```javascript
db.orders.aggregate([
  { $match: { status: "delivered", createdAt: { $gte: ISODate("2026-01-01") } } }
]);
```

### Q45. `$group` stage ka use kya hai?
`$group` documents ko ek key ke basis par group karta hai aur har group par aggregation operators (`$sum`, `$avg`, `$max`, `$min`, `$push`, `$addToSet`) apply karta hai — SQL ke `GROUP BY` jaisa. `_id` field group karne wali expression define karta hai.

```javascript
db.orders.aggregate([
  { $group: { _id: "$city", totalOrders: { $sum: 1 }, totalRevenue: { $sum: "$amount" } } }
]);
```

### Q46. `$project` stage kya karta hai?
`$project` output documents ki shape control karta hai — kaunse fields include/exclude karne hain, naye computed fields banane hain, ya existing field ka naam change karna hai. Ye SQL ke `SELECT` jaisa hai.

```javascript
db.orders.aggregate([
  { $project: { item: 1, total: { $multiply: ["$qty", "$price"] }, _id: 0 } }
]);
```

### Q47. `$lookup` stage kya karta hai aur ye join jaisa kaise hai?
`$lookup` ek left outer join perform karta hai current collection aur ek dusri collection ke beech, matching field ke basis par. Result mein matched documents ek array field mein add ho jaate hain. Ye MongoDB ka closest equivalent hai SQL JOIN ka.

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "productDetails"
    }
  }
]);
```

### Q48. `$unwind` stage ka kya use hai?
`$unwind` ek array field ko deconstruct karta hai — array ke har element ke liye ek separate output document banata hai (baaki fields duplicate ho jaate hain). Ye typically `$lookup` ke baad use hota hai jab array ke each element ko individually process karna ho.

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", totalQty: { $sum: "$items.qty" } } }
]);
```

### Q49. `$sort`, `$limit`, `$skip` stages ka aggregation mein use kya hai?
`$sort` pipeline mein documents ko order karta hai, `$limit` result count restrict karta hai, `$skip` initial N documents skip karta hai — pagination ke liye. Best practice: `$sort` ke baad `$limit` lagao taaki memory efficient rahe, aur agar possible ho to `$sort` early stage mein ho taaki index use ho sake.

```javascript
db.orders.aggregate([
  { $sort: { amount: -1 } },
  { $limit: 10 }
]);
```

### Q50. Pipeline stages ka order kyun important hota hai performance ke liye?
Har stage apne input ko process karke agli stage ko deta hai, aur early filtering (`$match`) documents ki count reduce kar deti hai jisse baad ke expensive stages (jaise `$lookup`, `$group`) kam data par kaam karte hain. General rule: `$match` aur `$sort` ko jitna possible ho, pipeline ke start mein rakho — isse indexes bhi use ho sakte hain (sirf pipeline ke initial stages mein).

### Q51. `$facet` stage kya karta hai?
`$facet` ek hi pipeline run se multiple independent aggregation pipelines (sub-pipelines) parallelly execute karne deta hai same input documents par, aur results ko ek document mein alag-alag fields ke roop mein return karta hai. Ye useful hai jab ek hi query se multiple metrics (jaise total count + paginated results + category breakdown) ek saath chahiye ho.

```javascript
db.orders.aggregate([
  {
    $facet: {
      totalCount: [{ $count: "count" }],
      byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }]
    }
  }
]);
```

### Q52. `$addFields` aur `$project` mein kya difference hai?
`$addFields` existing document mein naye fields add karta hai (baaki saare original fields preserve rehte hain by default). `$project` explicitly define karta hai ki kaunse fields output mein rakhne hain — agar koi field mention nahi ki gayi (aur inclusion mode use ho raha hai) to wo drop ho jaati hai. `$addFields` tab use karo jab sirf kuch computed fields add karni hon bina baaki structure disturb kiye.

### Q53. `$bucket` aur `$bucketAuto` stages kya karte hain?
Ye stages documents ko specified ranges ("buckets") mein group karte hain based on ek expression value. `$bucket` mein boundaries manually define ki jaati hain, `$bucketAuto` MongoDB ko boundaries automatically distribute karne deta hai roughly equal groups mein. Analytics dashboards mein histogram-type data (jaise order value ranges: 0-100, 100-500, 500+) banane ke liye useful.

### Q54. Aggregation pipeline mein `$sum`, `$avg`, `$max`, `$min` operators ka use kaise karte hain?
Ye accumulator operators hain jo `$group` stage ke andar use hote hain per-group calculations ke liye. `$sum` total/count nikalta hai, `$avg` average, `$max`/`$min` extreme values. Business metrics generate karne ke liye ye core building blocks hain — jaise daily revenue, average order value, peak delivery time.

```javascript
db.orders.aggregate([
  {
    $group: {
      _id: "$date",
      avgOrderValue: { $avg: "$amount" },
      maxOrderValue: { $max: "$amount" }
    }
  }
]);
```

### Q55. Aggregation pipeline optimize karne ke liye kya best practices hain?
`$match` aur `$sort` ko early rakho (indexes use ho sakein), unnecessary fields ko `$project` se jaldi drop karo taaki data flow kam ho, `$lookup` sparingly use karo (expensive operation), `allowDiskUse: true` set karo agar large datasets ke saath 100MB memory limit exceed ho rahi ho, aur `explain()` se pipeline ka execution plan verify karo.

### Q56. `$out` aur `$merge` stages kya karte hain?
`$out` aggregation ke final result ko ek naye (ya existing) collection mein write kar deta hai (replace kar deta hai agar collection already exist karti ho). `$merge` zyada flexible hai — existing collection mein results ko merge/update/insert kar sakta hai based on specified conditions, without fully replacing collection. Precomputed analytics/reports store karne ke liye useful (jaise daily aggregated business metrics ek separate "reports" collection mein save karna).

```javascript
db.orders.aggregate([
  { $group: { _id: "$date", totalRevenue: { $sum: "$amount" } } },
  { $merge: { into: "daily_revenue_reports", whenMatched: "replace" } }
]);
```

### Q57. Aggregation pipeline mein `$count` stage kya karta hai aur `$group` se count karne mein kya difference hai?
`$count` stage pipeline mein aane wale total documents ki count ek single field mein return karta hai — simple aur direct. `$group` ke through count karna (`{ $group: { _id: null, count: { $sum: 1 } } }`) zyada flexible hota hai jab aapko multiple metrics ek saath chahiye ho ya group-wise counts nikalne hon. Simple total count ke liye `$count` cleaner syntax deta hai.

## 6. Replication, Sharding & High Availability

### Q58. Replication kya hoti hai MongoDB mein?
Replication ka matlab hai data ke multiple copies (replica set members) maintain karna alag-alag servers par, taaki high availability aur data redundancy mile. Agar primary server fail ho jaaye, to ek secondary automatically primary ban jaata hai (failover), jisse downtime minimize hota hai.

### Q59. Replica Set kya hota hai aur uske components kya hain?
Replica Set ek group hota hai MongoDB instances ka jo same data maintain karte hain. Isme ek Primary node hota hai (jo saari writes accept karta hai) aur multiple Secondary nodes hote hain (jo primary se data replicate karte hain oplog ke through, aur reads serve kar sakte hain). Optionally ek Arbiter bhi ho sakta hai jo sirf voting ke liye hota hai, data store nahi karta.

### Q60. Failover kaise hota hai replica set mein?
Agar primary node down ho jaata hai, remaining members ek election perform karte hain (Raft-like consensus protocol) aur ek secondary ko naya primary elect kar dete hain. Ye process automatic hota hai aur kuch seconds mein complete ho jaata hai, jisse application ko manual intervention nahi karni padti.

### Q61. Sharding kya hai aur ye kab zaroori hoti hai?
Sharding data ko multiple machines (shards) mein horizontally partition karne ka process hai, jab data ek single server ki capacity (storage/throughput) se bada ho jaaye. Har shard data ka ek subset store karta hai, aur collectively pura dataset represent karte hain. Ye tab zaroori hoti hai jab vertical scaling (bigger server) cost-ineffective ho jaaye ya read/write throughput ek single node handle na kar paaye.

### Q62. Shard Key kya hoti hai aur ye kaise choose karte hain?
Shard key wo field (ya fields) hoti hai jiske basis par MongoDB data ko shards mein distribute karta hai. Good shard key mein high cardinality (bahut saari unique values), even distribution, aur query patterns ke saath alignment hona chahiye — taaki "jumbo chunks" ya hotspots na banein. Jaise ek pharmacy app mein `customerId` ya `region+orderDate` combination shard key ho sakti hai, `status` field (sirf 4-5 values) nahi.

### Q63. Config servers aur mongos ka role kya hai sharded cluster mein?
Config servers cluster ka metadata store karte hain — kaunsa data kaunse shard mein hai. `mongos` ek query router hota hai jo application aur shards ke beech mein sit karta hai, incoming queries ko config server metadata dekh kar correct shard(s) par route karta hai. Application `mongos` se hi interact karta hai, shards se directly nahi.

### Q64. Read Preference kya hoti hai replica set mein?
Read Preference define karti hai ki read operations kis member (primary/secondary) se serve honge. Options: `primary` (default, strongly consistent), `primaryPreferred`, `secondary` (read scaling ke liye, thoda stale data ho sakta hai), `secondaryPreferred`, `nearest`. Analytics/reporting queries jo real-time consistency nahi maangte, unhe `secondary` read preference se route karke primary ka load kam kar sakte hain.

### Q65. High Availability MongoDB mein kaise achieve hoti hai?
Replica sets (automatic failover), sharding (load distribution), aur geographically distributed nodes ke through. Additionally, write concern aur read concern settings, health monitoring/alerting, aur regular backups (via Atlas ya `mongodump`) bhi overall availability aur disaster recovery strategy ka hissa hote hain.

## 7. Transactions & Consistency Models

### Q66. Multi-document transactions kya hain MongoDB mein?
MongoDB 4.0+ se multi-document ACID transactions support karta hai (replica sets ke liye), aur 4.2+ se sharded clusters ke liye bhi. Isse multiple documents/collections par operations ek atomic unit ki tarah execute ho sakte hain — ya to sab apply honge ya koi nahi (all-or-nothing), jaise wallet balance debit karna aur order create karna ek saath.

```python
with client.start_session() as session:
    with session.start_transaction():
        db.wallets.update_one({"_id": user_id}, {"$inc": {"balance": -amount}}, session=session)
        db.orders.insert_one({"user_id": user_id, "amount": amount}, session=session)
```

### Q67. Single-document operations pehle se atomic kyun hote hain?
MongoDB mein har single document ke andar ke saare fields (nested objects/arrays sahit) ek hi atomic unit ki tarah update hote hain — matlab agar ek document update ho raha hai to koi dusra reader partially-updated state kabhi nahi dekhega. Isliye jahan possible ho, embedding karke single-document atomicity se hi consistency achieve kar lete hain, without needing full transactions — ye performance ke liye bhi behtar hota hai.

### Q68. Read Concern kya hota hai?
Read Concern define karta hai ki read operation kis level ki consistency guarantee ke saath data dekhega. Levels: `local` (default, latest data lekin rollback ho sakta hai), `available`, `majority` (sirf wo data jo replica set ke majority members par committed hai — rollback-safe), `linearizable`, `snapshot` (transactions ke andar consistent snapshot).

### Q69. Write Concern kya hota hai?
Write Concern specify karta hai ki ek write operation ko "successful" declare karne se pehle kitne replica set members par acknowledge hona chahiye. `w: 1` sirf primary, `w: "majority"` majority members, `w: 0` no acknowledgment (fire and forget, fastest but risky). High-value data (jaise payment records) ke liye `w: "majority"` recommend kiya jaata hai — durability aur performance ke beech trade-off.

```python
db.orders.with_options(write_concern=WriteConcern(w="majority")).insert_one(order_doc)
```

### Q70. MongoDB eventual consistency model follow karta hai ya strong consistency?
Default configuration mein, agar reads primary se ho rahe hain, MongoDB strong consistency deta hai. Lekin agar reads secondary nodes se ho rahe hain (read preference `secondary`), to replication lag ki wajah se eventual consistency ho sakti hai — matlab secondary thodi der baad primary ke saath sync hota hai. Read/Write concern settings ke through required consistency level tune kiya ja sakta hai based on use case.

### Q71. Transactions ka performance overhead kya hota hai aur inhe kab avoid karna chahiye?
Transactions locks aur additional coordination overhead introduce karte hain, jisse throughput kam ho sakta hai high-concurrency, high-write-volume systems mein (jaise quick-commerce order processing). Best practice: schema design karte waqt embedding se single-document atomicity maximize karo, aur transactions sirf tab use karo jab genuinely multiple documents/collections ko atomically update karna zaroori ho (jaise payment + order state ek saath).

## 8. MongoDB with Python (PyMongo, Motor & FastAPI)

### Q72. PyMongo kya hai?
PyMongo MongoDB ka official synchronous Python driver hai jo Python applications ko MongoDB ke saath connect, query, aur manage karne deta hai. Ye `MongoClient` class provide karta hai connection establish karne ke liye, aur CRUD/aggregation operations ke liye Pythonic API deta hai.

```python
from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017/")
db = client["riaoi_db"]
orders = db["orders"]
```

### Q73. Motor kya hai aur FastAPI ke saath ye kyun preferred hai?
Motor MongoDB ka official asynchronous driver hai jo `asyncio` ke saath compatible hai. FastAPI ek async framework hai — agar PyMongo (sync driver) use kare to database calls event loop ko block kar denge, jisse concurrency benefit khatam ho jaata hai. Motor async/await syntax support karta hai, jisse database I/O non-blocking rehta hai aur FastAPI ki full concurrency ka fayda milta hai.

```python
from motor.motor_asyncio import AsyncIOMotorClient
client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["riaoi_db"]

async def get_order(order_id: str):
    return await db.orders.find_one({"_id": order_id})
```

### Q74. FastAPI mein MongoDB connection ko lifecycle events ke saath kaise manage karte hain?
FastAPI ke `lifespan` context manager (ya older `startup`/`shutdown` events) mein MongoClient/Motor client ko initialize aur close karte hain, taaki har request pe naya connection banane ke bajaye ek shared connection pool use ho — ye performance ke liye critical hai.

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(MONGO_URI)
    app.mongodb = app.mongodb_client["riaoi_db"]
    yield
    app.mongodb_client.close()

app = FastAPI(lifespan=lifespan)
```

### Q75. MongoDB documents ko Pydantic models ke saath FastAPI mein kaise map karte hain?
Pydantic model define karte hain jo document ke fields represent kare, aur `_id` (ObjectId) ko handle karne ke liye custom validator ya `str` alias use karte hain (kyunki Pydantic natively ObjectId nahi samajhta). Ye request/response validation aur automatic OpenAPI docs generate karne mein help karta hai.

```python
from pydantic import BaseModel, Field

class OrderModel(BaseModel):
    id: str = Field(alias="_id")
    item: str
    qty: int
    status: str

    class Config:
        populate_by_name = True
```

### Q76. Async aggregation pipeline Motor mein kaise run karte hain?
`aggregate()` call karne par Motor ek async cursor return karta hai, jise `async for` loop ya `to_list()` se iterate/materialize kiya ja sakta hai.

```python
async def get_daily_revenue():
    pipeline = [
        {"$match": {"status": "delivered"}},
        {"$group": {"_id": "$date", "revenue": {"$sum": "$amount"}}}
    ]
    cursor = db.orders.aggregate(pipeline)
    return await cursor.to_list(length=None)
```

### Q77. FastAPI mein MongoDB errors ko kaise handle karte hain (jaise DuplicateKeyError)?
PyMongo/Motor specific exceptions raise karte hain jaise `DuplicateKeyError`, `ConnectionFailure`, `OperationFailure`. FastAPI endpoint mein try/except block laga kar inhe catch karke appropriate HTTP status codes (jaise 409 Conflict duplicate key ke liye) ke saath `HTTPException` raise karte hain, taaki client ko meaningful error mile.

```python
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException

try:
    await db.users.insert_one(user_doc)
except DuplicateKeyError:
    raise HTTPException(status_code=409, detail="Email already exists")
```

### Q78. Connection pooling Motor/PyMongo mein kaise kaam karti hai?
`MongoClient`/`AsyncIOMotorClient` internally ek connection pool maintain karta hai (default `maxPoolSize=100`). Ek hi client instance ko application lifetime mein reuse karna chahiye (singleton pattern via lifespan events) — har request par naya client banana anti-pattern hai kyunki isse connections exhaust ho sakte hain aur latency badh jaati hai.

### Q79. Motor mein transactions kaise use karte hain?
Session start karke `async with await client.start_session() as session:` block ke andar `session.start_transaction()` use karte hain, aur har operation mein `session=session` pass karte hain, taaki wo operations ek atomic unit ban jaayein.

```python
async with await client.start_session() as session:
    async with session.start_transaction():
        await db.wallets.update_one({"_id": uid}, {"$inc": {"balance": -amt}}, session=session)
        await db.orders.insert_one(order_doc, session=session)
```

### Q80. PyMongo/Motor mein environment-specific configuration (URI, credentials) kaise manage karte hain?
Connection string (URI, username, password, replica set name) ko environment variables ya `.env` file ke through load karte hain (jaise `python-dotenv` + Pydantic `Settings` class), hardcode nahi karte — security aur different environments (dev/staging/prod) ke liye easy switch ke liye.

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongo_uri: str
    db_name: str

    class Config:
        env_file = ".env"
```

### Q81. Beanie ya ODM (Object Document Mapper) libraries ka MongoDB + FastAPI mein kya role hota hai?
Beanie jaisi libraries Motor ke upar ek ODM layer provide karti hain jo Pydantic models ko directly MongoDB documents ke saath map karti hain (jaise SQLAlchemy ORM SQL ke saath karta hai) — CRUD methods models par directly available ho jaate hain (`Order.find_one()`, `order.save()`), jisse boilerplate code kam hota hai aur validation built-in ho jaata hai.

## 9. Performance Optimization, Connection Pooling & Monitoring

### Q82. MongoDB query performance optimize karne ke liye common techniques kya hain?
Appropriate indexes create karna (query patterns ke basis par), `explain()` se query plans analyze karna, projections use karke unnecessary fields fetch na karna, pagination ke liye `limit`/`skip` (ya better, range-based cursor pagination) use karna, aggregation pipelines mein early filtering, aur schema design mein embedding se joins avoid karna.

### Q83. Connection Pooling kya hoti hai aur ye performance ke liye kyun important hai?
Connection pooling ka matlab hai ek pool of reusable database connections maintain karna, taaki har request par naya TCP connection establish na karna pade (jo expensive operation hai). MongoClient automatically ek pool manage karta hai; application ko sirf ek client instance create karke use reuse karna hota hai across requests, jisse latency aur resource usage kaafi kam ho jaata hai high-traffic systems mein.

### Q84. Slow queries ko kaise identify aur monitor karte hain MongoDB mein?
`db.setProfilingLevel(1, { slowms: 100 })` se profiler enable karke slow queries (100ms se zyada) `system.profile` collection mein log ki ja sakti hain. Production mein MongoDB Atlas ka Performance Advisor, real-time metrics, aur alerts use karte hain, ya tools jaise `mongostat`/`mongotop` command-line monitoring ke liye use hote hain.

### Q85. Caching layer (jaise Redis) MongoDB ke saath kyun use karte hain?
MongoDB durable, disk-based storage hai jisme har read database round-trip leta hai. Redis ek in-memory key-value store hai jo frequently-accessed, less-frequently-changing data (jaise product catalog, computed aggregation results, session data) ko cache karke read latency drastically kam kar deta hai, aur MongoDB par load bhi reduce karta hai — high-read quick-commerce systems mein ye combination common hota hai.

### Q86. Celery ke saath MongoDB ka typical use case kya hota hai backend systems mein?
Celery ek distributed task queue hai jo background/async jobs handle karta hai (jaise order confirmation notifications, scheduled analytics report generation, batch data aggregation jobs). Celery tasks MongoDB ko read/write karte hain heavy ya time-consuming operations (jaise nightly aggregation pipeline runs jo business metrics generate karte hain) ko main request-response cycle se offload karke, taaki API response time fast rahe.

### Q87. Covered Queries kya hoti hain aur ye performance kaise improve karti hain?
Covered query wo query hoti hai jisme saare requested fields (query filter aur projection dono) ek index se hi satisfy ho jaate hain, bina actual document ko disk se fetch kiye. Isse query bahut fast hoti hai kyunki index (jo typically memory mein hota hai) se hi response mil jaata hai. `explain()` output mein `totalDocsExamined: 0` covered query indicate karta hai.

## 10. Scenario / Project-Based Questions (RIoAI — Quick Commerce Pharmacy)

### Q88. RIoAI project mein MongoDB kyun choose kiya, SQL database ke bajaye?
RIoAI ek quick-commerce pharmacy delivery app hai jisme product catalog (medicines, categories, alag-alag attributes), high-frequency order writes, aur rapidly evolving data requirements (naye product types, promotional fields, changing business logic) hote hain. MongoDB ka flexible schema naye fields/features ko bina migration ke accommodate karta hai, aur horizontal scalability high order-volume ko easily handle karti hai. Backend analytics modules ke liye bhi MongoDB ka powerful aggregation framework directly business insights nikalne mein help karta hai bina separate data warehouse ke.

### Q89. Aapne MongoDB se business insights aur performance metrics kaise extract kiye RIoAI mein?
Order, inventory, aur delivery-related collections par aggregation pipelines likhi jaati thi jisme `$match` se relevant time-range/status filter karte the, `$group` se metrics (jaise total revenue per city, average delivery time, top-selling medicines, daily active order count) compute karte the, aur `$lookup` se product/customer details join karte the jab required ho. Results ko FastAPI endpoints ke through expose karte the ya `$merge`/`$out` se precomputed reports collection mein store karke dashboards ko fast serve karte the.

### Q90. High-write-volume quick-commerce system ke liye schema design kaise approach kiya?
Order-related documents mein frequently-together-accessed data (jaise order items, delivery address snapshot) embed kiya jaata tha taaki order fetch karne ke liye ek hi query kaafi ho. Lekin unbounded growing data (jaise customer ka poora order history) ko separate collection mein reference ke through rakha jaata tha, taaki individual order documents bounded aur fast-writable rahein. Indexes `customerId`, `status`, aur `createdAt` jaisi frequently-queried fields par diye gaye the.

### Q91. Kya aggregation pipeline mein koi performance issue face kiya, aur usko kaise solve kiya?
Common issue tha `$lookup` heavy pipelines ka slow hona jab large collections join ho rahi thi bina proper indexing ke. Solution: `foreignField` par index ensure kiya, `$match` stages ko pipeline ke start mein move kiya taaki join se pehle hi documents filter ho jaayein, aur jahan possible ho waha embedding (extended reference pattern) se `$lookup` ki zaroorat hi khatam ki. Frequently-run heavy aggregations ko `$merge` ke through precompute karke ek separate "reports" collection mein cache kiya, jisse real-time dashboard queries fast serve hoti thi.

### Q92. Real-time order status updates ke liye MongoDB ko kaise use kiya?
`findOneAndUpdate` jaisi atomic operations use ki jaati thi order status update karne ke liye (jaise "pending" se "out-for-delivery" transition), taaki concurrent updates se race conditions na ho. Status field par index hone ki wajah se "saare pending orders" jaisi queries fast rehti thi jo delivery dashboard ke liye use hoti thi.

### Q93. Inventory management ke liye MongoDB mein concurrency kaise handle ki (stock decrement race conditions)?
Stock decrement ke liye atomic `findOneAndUpdate` operation use karte the jisme filter mein condition thi `qty: { $gte: 1 }` aur update mein `$inc: { qty: -1 }` — isse ek hi atomic step mein check-and-decrement ho jaata tha, jisse do concurrent requests ek hi last unit ko double-sell nahi kar paate the. Higher-risk scenarios (jaise payment + stock deduction ek saath) mein multi-document transactions use kiye.

### Q94. FastAPI backend mein MongoDB integration ka high-level architecture kaisa tha?
Motor (async driver) use kiya FastAPI ke async endpoints ke saath, ek shared client instance app lifespan mein initialize kiya. Pydantic models request/response validation ke liye the. Analytics-heavy endpoints aggregation pipelines call karte the (kabhi-kabhi precomputed reports collection se, kabhi real-time), aur normal CRUD endpoints (orders, products, users) direct Motor calls use karte the.

### Q95. Redis ka role kya tha RIoAI mein MongoDB ke saath?
Redis frequently-accessed lekin slow-changing data ko cache karne ke liye use hota tha — jaise product catalog listings, category-wise product counts, ya computed aggregation results (jaise "today's top products") jo dashboard par baar-baar dikhaye jaate the. Isse MongoDB par repeated aggregation load kam hota tha aur response time improve hota tha end-user ke liye.

### Q96. Celery MongoDB ke saath RIoAI mein kaise integrate tha?
Celery scheduled/background tasks (jaise nightly business metrics aggregation, notification dispatch after order status change, ya batch reconciliation jobs) handle karta tha jo MongoDB collections ko read/write karte the. Isse heavy computation main API request-response cycle se offload ho jaati thi, jisse user-facing endpoints fast response de paate the.

### Q97. Agar order volume 10x badh jaaye, MongoDB schema/infrastructure mein kya changes karoge?
Sharding introduce karenge appropriate shard key (jaise `region` + `customerId` combination, high cardinality aur even distribution ensure karte hue) ke saath, taaki write load multiple shards mein distribute ho. Read-heavy analytics queries ko secondary replicas par route karenge (read preference). Precomputed aggregation reports ko zyada aggressively cache/schedule karenge, aur hot data (recent orders) ko cold/archived data (old orders) se separate collections mein split karenge taaki active working set chhota rahe.

### Q98. Delivery time ya SLA metrics jaise business insights nikalne ke liye kaunsi aggregation approach use ki?
Order documents mein `createdAt` aur `deliveredAt` timestamps store karte the. Aggregation pipeline mein `$project` se `$subtract` operator ka use karke delivery duration compute karte the, phir `$group` se city/zone-wise `$avg` aur `$max` delivery time nikalte the, taaki SLA breaches identify ho sakein aur operational bottlenecks (jaise kis zone mein delivery slow hai) highlight ho sakein.

```javascript
db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $project: {
      zone: 1,
      deliveryMinutes: { $divide: [{ $subtract: ["$deliveredAt", "$createdAt"] }, 60000] }
  } },
  { $group: { _id: "$zone", avgDeliveryTime: { $avg: "$deliveryMinutes" } } }
]);
```

### Q99. MongoDB choose karne ke baad, kya trade-offs face kiye aur unhe kaise mitigate kiya?
Multi-collection consistency (jaise order aur inventory ek saath consistent rehna) SQL ke joins/foreign-key constraints jitni straightforward nahi thi — isko multi-document transactions aur careful atomic operations (`findOneAndUpdate`) se mitigate kiya. Schema flexibility ka side-effect ye tha ki data inconsistency ka risk badh gaya tha — isko `$jsonSchema` validators aur application-level Pydantic validation se control kiya. `$lookup`-heavy analytics queries costly thi, unhe embedding aur precomputed reports se optimize kiya.

### Q100. Agar interviewer puche "MongoDB use karke tumne apna analytics module kaise design kiya" — ek end-to-end summary do.
Raw transactional data (orders, deliveries, inventory) MongoDB collections mein properly indexed schema ke saath store hota tha. Scheduled Celery jobs periodically aggregation pipelines run karte the (`$match` → `$group` → `$project` → optionally `$lookup`) jo business metrics (revenue, top products, delivery SLAs, city-wise performance) compute karte the, aur results ko `$merge` se ek dedicated "analytics/reports" collection mein store karte the. FastAPI endpoints (Motor driver ke saath, async) is precomputed data ko fast serve karte the dashboard ke liye, jabki Redis frequently-hit results ko further cache karta tha. Ye approach real-time dashboard responsiveness aur underlying MongoDB par computational load ke beech ek balance provide karta tha.
