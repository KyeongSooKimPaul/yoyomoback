# Migration `20220225080134-1`

This migration has been generated at 2/25/2022, 5:01:34 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Addmenual" DROP COLUMN "addmenual",
ADD COLUMN "contents" text   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220225073449-1..20220225080134-1
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
@@ -437,13 +437,10 @@
 model Addmenual {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
+  contents String?
-  addmenual String?
-
-
-
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
```


