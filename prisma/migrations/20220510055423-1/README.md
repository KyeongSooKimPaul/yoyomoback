# Migration `20220510055423-1`

This migration has been generated at 5/10/2022, 2:54:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Ordermanageitems" ADD COLUMN "productid" integer   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220510051458-1..20220510055423-1
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
@@ -562,8 +562,9 @@
   created_at String?
   updated_at String?
   item_price String?
   paidstatus String?
+   productid Int?
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
```


