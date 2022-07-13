# Migration `20220329112948-1`

This migration has been generated at 3/29/2022, 8:29:48 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Product" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"userId" integer   ,
"productpageId" integer   ,
"title" text   NOT NULL ,
"description" text   NOT NULL ,
"type" text   NOT NULL ,
"brand" text   NOT NULL ,
"category" text   NOT NULL ,
"price" integer   NOT NULL ,
"newproduct" text   NOT NULL ,
"sale" text   NOT NULL ,
"stock" text   NOT NULL ,
"discount" integer   NOT NULL ,
"variants" text   NOT NULL ,
"images" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Productpage" (
"id" SERIAL,
"text" text   NOT NULL ,
PRIMARY KEY ("id")
)

ALTER TABLE "public"."Product" ADD FOREIGN KEY("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Product" ADD FOREIGN KEY("productpageId")REFERENCES "public"."Productpage"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20220225085213-1..20220329112948-1
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
@@ -62,16 +62,16 @@
  Addmenual  Addmenual[]
  Privacypolicy  Privacypolicy[]
   Refundpolicy  Refundpolicy[]
    Termsanduse  Termsanduse[]
+Product  Product[]
-
 }
 model LikedTweet {
   id      Int      @id @default(autoincrement())
@@ -526,4 +526,40 @@
   userId    Int?    
   User      User?    @relation(fields: [userId], references: [id])
 }
+
+//project
+
+model Product {
+  id        Int       @id @default(autoincrement())
+  createdAt DateTime  @default(now())
+   User      User?     @relation(fields: [userId], references: [id])
+  userId    Int?
+Productpage      Productpage?     @relation(fields: [productpageId], references: [id])
+  productpageId    Int?
+
+        title String
+        description String
+        type String
+        brand String
+        category String
+        price Int
+        newproduct String
+        sale String
+        stock String
+        discount Int
+        variants  String
+        images  String
+
+
+       
+       }
+       
+
+
+model Productpage {
+  id         Int          @id @default(autoincrement())
+  text String
+  Product  Product[]
+     
+}
```


