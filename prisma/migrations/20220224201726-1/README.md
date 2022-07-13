# Migration `20220224201726-1`

This migration has been generated at 2/25/2022, 5:17:26 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Sellingprice" ADD COLUMN "mallname" text   DEFAULT E''
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220223074903..20220224201726-1
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
@@ -181,8 +181,9 @@
 model Sellingprice {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   price       String?  @default("")
+  mallname String?  @default("")
   userId    Int?     
   User      User?    @relation(fields: [userId], references: [id])
 }
```


