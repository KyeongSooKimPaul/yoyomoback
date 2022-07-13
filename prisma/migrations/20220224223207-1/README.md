# Migration `20220224223207-1`

This migration has been generated at 2/25/2022, 7:32:07 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Productupdate" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"prefix" text   ,
"postfix" text   ,
"userId" integer   ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Productupdate" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220224220459-1..20220224223207-1
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
@@ -57,8 +57,9 @@
 Demandpoint Demandpoint[]
 Ordermanageitems  Ordermanageitems[]
 Deliverymangeitems  Deliverymangeitems[]
  Filtering  Filtering[]
+ Productupdate  Productupdate[]
 }
@@ -412,8 +413,25 @@
   checkstatus String?
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
+
+
+
+model Productupdate {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+
+
+  prefix String?
+  postfix String?
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


