import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1592547639469 implements MigrationInterface {
    name = 'initial1592547639469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "languages" ("id" SERIAL NOT NULL, "code" character varying(8) NOT NULL, CONSTRAINT "UQ_7397752718d1c9eb873722ec9b2" UNIQUE ("code"), CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "couriers_status_enum" AS ENUM('pending', 'deleted', 'active', 'blocked', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "couriers" ("id" SERIAL NOT NULL, "status" "couriers_status_enum" NOT NULL DEFAULT 'pending', "phoneNumber" character varying(20) NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "passwordHash" character varying(50) NOT NULL, "passwordSalt" character varying(50) NOT NULL, "imageURL" character varying(255), "description" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "languageId" integer, CONSTRAINT "UQ_dbb79407286509e8c44ea60d9d2" UNIQUE ("email"), CONSTRAINT "PK_141c3ed6f70beb9ddf4ab4a0e86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "customers_status_enum" AS ENUM('active', 'blocked', 'deleted')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "status" "customers_status_enum" NOT NULL DEFAULT 'active', "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "passwordHash" character varying(50) NOT NULL, "passwordSalt" character varying(50) NOT NULL, "imageURL" character varying(255), "description" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "languageId" integer, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "managers_status_enum" AS ENUM('active', 'deleted')`);
        await queryRunner.query(`CREATE TABLE "managers" ("id" SERIAL NOT NULL, "status" "managers_status_enum" NOT NULL DEFAULT 'active', "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "passwordHash" character varying(50) NOT NULL, "passwordSalt" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "UQ_8d5fd9a2217bf7b16bef11fdf83" UNIQUE ("email"), CONSTRAINT "PK_e70b8cc457276d9b4d82342a8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "storeLocations" ("id" SERIAL NOT NULL, "latitude" numeric(10,8) NOT NULL, "longitude" numeric(11,8) NOT NULL, "address" character varying(100) NOT NULL, "postalCode" character varying(10) NOT NULL, "storeId" integer, CONSTRAINT "REL_cb58fa0289f3fa7dfd52a0cc18" UNIQUE ("storeId"), CONSTRAINT "PK_3ffb2df7321a9d68ce3979eb27f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "stores_status_enum" AS ENUM('pending', 'active', 'blocked', 'deleted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "slug" character varying(50) NOT NULL, "description" character varying(4096), "status" "stores_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "ownerId" integer, CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "productTranslations" ("id" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "description" character varying(255), "productId" integer, "languageId" integer, CONSTRAINT "PK_68c66ad9806043ac79180d6a2e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "products_status_enum" AS ENUM('active', 'deleted')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "externalID" character varying(50) NOT NULL, "imageURL" character varying(255), "price" numeric(9,2) NOT NULL, "status" "products_status_enum" NOT NULL DEFAULT 'active', "storeId" integer, CONSTRAINT "UQ_c0e1fd57a2c86c1d3dadcf602f7" UNIQUE ("externalID"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderItems" ("id" SERIAL NOT NULL, "price" numeric(9,2) NOT NULL, "quantity" integer NOT NULL, "productId" integer, "orderId" integer, CONSTRAINT "PK_b1b864ba2b7d5762d34265cc8b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "orders_status_enum" AS ENUM('scheduled', 'active', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "status" "orders_status_enum" NOT NULL DEFAULT 'scheduled', "description" character varying(255), "scheduledDate" TIMESTAMP NOT NULL, "finishedAt" TIMESTAMP, "isPaid" boolean NOT NULL DEFAULT false, "totalPrice" numeric(9,2) NOT NULL, "deliveryPrice" numeric(9,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "courierId" integer, "storeLocationId" integer, "customerId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orderAddresses" ("id" SERIAL NOT NULL, "latitude" numeric(10,8) NOT NULL, "longitude" numeric(11,8) NOT NULL, "address" character varying(100) NOT NULL, "instructions" character varying(100), "details" character varying(100), "contactPerson" character varying(50), "contactPhone" character varying(20), "orderId" integer, CONSTRAINT "REL_b927cd64f3bf6bdeeb04895c0a" UNIQUE ("orderId"), CONSTRAINT "PK_5e3820d85bc6f20dda063574fe6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "couriers" ADD CONSTRAINT "FK_dedec4ae829a98722971e5d723f" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_a12c3edd078539a806b43d6221a" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "storeLocations" ADD CONSTRAINT "FK_cb58fa0289f3fa7dfd52a0cc187" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_a447ba082271c05997a61df26df" FOREIGN KEY ("ownerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productTranslations" ADD CONSTRAINT "FK_a162eec7c7f9a6f1edfe675018f" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "productTranslations" ADD CONSTRAINT "FK_8f6362d28b2eb615f069aa5c191" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_782da5e50e94b763eb63225d69d" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD CONSTRAINT "FK_51d8fc35a95624166faeca65e86" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orderItems" ADD CONSTRAINT "FK_391c9e5d5af8d7d7ce4b96db80e" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_757d699ef7b865116ff8e54515a" FOREIGN KEY ("storeLocationId") REFERENCES "storeLocations"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_76eaffec5e36a04bbf3bf549146" FOREIGN KEY ("courierId") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orderAddresses" ADD CONSTRAINT "FK_b927cd64f3bf6bdeeb04895c0a3" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderAddresses" DROP CONSTRAINT "FK_b927cd64f3bf6bdeeb04895c0a3"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_76eaffec5e36a04bbf3bf549146"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_757d699ef7b865116ff8e54515a"`);
        await queryRunner.query(`ALTER TABLE "orderItems" DROP CONSTRAINT "FK_391c9e5d5af8d7d7ce4b96db80e"`);
        await queryRunner.query(`ALTER TABLE "orderItems" DROP CONSTRAINT "FK_51d8fc35a95624166faeca65e86"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_782da5e50e94b763eb63225d69d"`);
        await queryRunner.query(`ALTER TABLE "productTranslations" DROP CONSTRAINT "FK_8f6362d28b2eb615f069aa5c191"`);
        await queryRunner.query(`ALTER TABLE "productTranslations" DROP CONSTRAINT "FK_a162eec7c7f9a6f1edfe675018f"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_a447ba082271c05997a61df26df"`);
        await queryRunner.query(`ALTER TABLE "storeLocations" DROP CONSTRAINT "FK_cb58fa0289f3fa7dfd52a0cc187"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_a12c3edd078539a806b43d6221a"`);
        await queryRunner.query(`ALTER TABLE "couriers" DROP CONSTRAINT "FK_dedec4ae829a98722971e5d723f"`);
        await queryRunner.query(`DROP TABLE "orderAddresses"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "orderItems"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "products_status_enum"`);
        await queryRunner.query(`DROP TABLE "productTranslations"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TYPE "stores_status_enum"`);
        await queryRunner.query(`DROP TABLE "storeLocations"`);
        await queryRunner.query(`DROP TABLE "managers"`);
        await queryRunner.query(`DROP TYPE "managers_status_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "customers_status_enum"`);
        await queryRunner.query(`DROP TABLE "couriers"`);
        await queryRunner.query(`DROP TYPE "couriers_status_enum"`);
        await queryRunner.query(`DROP TABLE "languages"`);
    }

}
