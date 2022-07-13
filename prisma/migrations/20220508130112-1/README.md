# Migration `20220508130112-1`

This migration has been generated at 5/8/2022, 10:01:12 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Ordermanageitems" ADD COLUMN "multiorder" text   ,
ADD COLUMN "paidstatus" text   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220508061755-1..20220508130112-1
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
@@ -557,10 +557,12 @@
   name String?
   wholeamount String?
     keepingamount String?
   shipping_amount String?
+  multiorder String?
   created_at String?
   updated_at String?
   item_price String?
+  paidstatus String?
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
```


