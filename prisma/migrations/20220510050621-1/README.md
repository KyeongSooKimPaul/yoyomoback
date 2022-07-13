# Migration `20220510050621-1`

This migration has been generated at 5/10/2022, 2:06:21 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Paidproductlist" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"userId" integer   ,
"title" text   ,
"category" text   ,
"price" integer   ,
"discount" integer   ,
"images" text   ,
"wholeamount" text   ,
"keepingamount" text   ,
"shipping_amount" text   ,
"updated_at" text   ,
"orderstatus" text   ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Paidproductlist" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220508130112-1..20220510050621-1
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
@@ -63,15 +63,15 @@
  Privacypolicy  Privacypolicy[]
   Refundpolicy  Refundpolicy[]
    Termsanduse  Termsanduse[]
 Product  Product[]
+Paidproductlist  Paidproductlist[]
-
 }
 model LikedTweet {
   id      Int      @id @default(autoincrement())
@@ -565,4 +565,29 @@
   paidstatus String?
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
+
+
+
+model Paidproductlist {
+  id        Int       @id @default(autoincrement())
+  createdAt DateTime  @default(now())
+   User      User?     @relation(fields: [userId], references: [id])
+  userId    Int?
+        title String?
+        category String?
+        price Int?
+        discount Int?
+        images  String?
+  wholeamount String?
+    keepingamount String?
+  shipping_amount String?
+  updated_at String?
+  orderstatus String?
+
+       
+       }
+
+
+
+
```


