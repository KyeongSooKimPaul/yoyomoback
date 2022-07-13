# Migration `20220224211035-1`

This migration has been generated at 2/25/2022, 6:10:35 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Filtering" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"country" text   ,
"contents" text   ,
"userId" integer   ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Filtering" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220224201726-1..20220224211035-1
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource postgresql {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Tweet {
   id        Int          @id @default(autoincrement())
@@ -56,11 +56,10 @@
 Changepoint Changepoint[]
 Demandpoint Demandpoint[]
 Ordermanageitems  Ordermanageitems[]
 Deliverymangeitems  Deliverymangeitems[]
- 
+ Filtering  Filtering[]
-    
 }
 model LikedTweet {
@@ -366,8 +365,16 @@
   contents String?
   userId    Int?     
   User      User?    @relation(fields: [userId], references: [id])
 }
+model Filtering {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+  country String?
+  contents String?
+  userId    Int?     
+  User      User?    @relation(fields: [userId], references: [id])
+}
 model Stockhandling {
   id        Int      @id @default(autoincrement())
```


