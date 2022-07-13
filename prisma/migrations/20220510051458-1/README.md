# Migration `20220510051458-1`

This migration has been generated at 5/10/2022, 2:14:58 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Paidproductlist" ADD COLUMN "productid" integer   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220510051012-1..20220510051458-1
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
@@ -573,8 +573,9 @@
   id        Int       @id @default(autoincrement())
   createdAt DateTime  @default(now())
    User      User?     @relation(fields: [userId], references: [id])
   userId    Int?
+        productid Int?
         title String?
         category String?
         price String?
         discount String?
```


