# Migration `20220225073449-1`

This migration has been generated at 2/25/2022, 4:34:49 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Addmenual" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"addmenual" text   ,
"userId" integer   ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Addmenual" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220224223207-1..20220225073449-1
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
@@ -58,10 +58,13 @@
 Ordermanageitems  Ordermanageitems[]
 Deliverymangeitems  Deliverymangeitems[]
  Filtering  Filtering[]
  Productupdate  Productupdate[]
+ Addmenual  Addmenual[]
+
+
 }
 model LikedTweet {
   id      Int      @id @default(autoincrement())
@@ -430,8 +433,22 @@
   User      User?    @relation(fields: [userId], references: [id])
 }
+model Addmenual {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+
+
+  addmenual String?
+
+
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


