# Migration `20220224220459-1`

This migration has been generated at 2/25/2022, 7:04:59 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Filtering" ADD COLUMN "market" text   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220224211035-1..20220224220459-1
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
@@ -371,8 +371,9 @@
   createdAt DateTime @default(now())
   country String?
   contents String?
   userId    Int?     
+  market String?
   User      User?    @relation(fields: [userId], references: [id])
 }
```


