# Migration `20220508061755-1`

This migration has been generated at 5/8/2022, 3:17:55 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Ordermanageitems" DROP COLUMN "currency",
DROP COLUMN "paid_price",
ADD COLUMN "wholeamount" text   ,
ADD COLUMN "keepingamount" text   
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220329112948-1..20220508061755-1
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
@@ -494,24 +494,9 @@
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
-model Ordermanageitems {
-  id        Int      @id @default(autoincrement())
-  createdAt DateTime @default(now())
-  product_main_image String?
-  name String?
-   currency String?
-  shipping_amount String?
-   created_at String?
-  updated_at String?
-     paid_price String?
-  item_price String?
-  userId    Int?    
-  User      User?    @relation(fields: [userId], references: [id])
-}
-
 model Deliverymangeitems {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   product_main_image String?
@@ -536,9 +521,8 @@
    User      User?     @relation(fields: [userId], references: [id])
   userId    Int?
 Productpage      Productpage?     @relation(fields: [productpageId], references: [id])
   productpageId    Int?
-
         title String
         description String
         type String
         brand String
@@ -562,4 +546,21 @@
   text String
   Product  Product[]
 }
+
+
+
+model Ordermanageitems {
+  id        Int      @id @default(autoincrement())
+  createdAt DateTime @default(now())
+  product_main_image String?
+  name String?
+  wholeamount String?
+    keepingamount String?
+  shipping_amount String?
+  created_at String?
+  updated_at String?
+  item_price String?
+  userId    Int?    
+  User      User?    @relation(fields: [userId], references: [id])
+}
```


