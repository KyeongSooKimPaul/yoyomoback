# Migration `20220510051012-1`

This migration has been generated at 5/10/2022, 2:10:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Paidproductlist" ALTER COLUMN "price" SET DATA TYPE text ,
ALTER COLUMN "discount" SET DATA TYPE text 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220510050621-1..20220510051012-1
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
@@ -575,10 +575,10 @@
    User      User?     @relation(fields: [userId], references: [id])
   userId    Int?
         title String?
         category String?
-        price Int?
-        discount Int?
+        price String?
+        discount String?
         images  String?
   wholeamount String?
     keepingamount String?
   shipping_amount String?
```


