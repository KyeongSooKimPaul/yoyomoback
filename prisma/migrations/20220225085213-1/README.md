# Migration `20220225085213-1`

This migration has been generated at 2/25/2022, 5:52:13 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Privacypolicy" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"contents" text   ,
"userId" integer   ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Refundpolicy" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"contents" text   ,
"userId" integer   ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Termsanduse" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"contents" text   ,
"userId" integer   ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Privacypolicy" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Refundpolicy" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Termsanduse" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220225080134-1..20220225085213-1
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
@@ -59,12 +59,19 @@
 Deliverymangeitems  Deliverymangeitems[]
  Filtering  Filtering[]
  Productupdate  Productupdate[]
  Addmenual  Addmenual[]
+ Privacypolicy  Privacypolicy[]
+  Refundpolicy  Refundpolicy[]
+   Termsanduse  Termsanduse[]
+
+
+
+
 }
 model LikedTweet {
   id      Int      @id @default(autoincrement())
@@ -443,9 +450,39 @@
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
+model Privacypolicy {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+  contents String?
+
+  userId    Int?    
+  User      User?    @relation(fields: [userId], references: [id])
+}
+
+model Refundpolicy {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+
+  contents String?
+
+  userId    Int?    
+  User      User?    @relation(fields: [userId], references: [id])
+}
+
+model Termsanduse {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+
+  contents String?
+
+  userId    Int?    
+  User      User?    @relation(fields: [userId], references: [id])
+}
+
+
 model Demandpoint {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   confirmAt String? @default("")
```


