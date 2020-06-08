import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1591650292242 implements MigrationInterface {
    name = 'initial1591650292242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `languages` (`id` int NOT NULL AUTO_INCREMENT, `code` varchar(8) NOT NULL, UNIQUE INDEX `IDX_7397752718d1c9eb873722ec9b` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `couriers` (`id` int NOT NULL AUTO_INCREMENT, `status` enum ('pending', 'deleted', 'active', 'blocked', 'rejected') NOT NULL DEFAULT 'pending', `phoneNumber` varchar(20) NOT NULL, `firstName` varchar(50) NOT NULL, `lastName` varchar(50) NOT NULL, `email` varchar(50) NOT NULL, `passwordHash` varchar(50) NOT NULL, `passwordSalt` varchar(50) NOT NULL, `imageURL` varchar(255) NULL, `description` varchar(255) NULL, `rating` decimal(2,1) NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `languageId` int NULL, UNIQUE INDEX `IDX_dbb79407286509e8c44ea60d9d` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `currencies` (`id` int NOT NULL AUTO_INCREMENT, `code` varchar(3) NOT NULL, UNIQUE INDEX `IDX_9f8d0972aeeb5a2277e40332d2` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `customers` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `email` varchar(50) NOT NULL, `passwordHash` varchar(50) NOT NULL, `passwordSalt` varchar(50) NOT NULL, `imageURL` varchar(255) NULL, `description` varchar(255) NULL, `status` enum ('active', 'blocked', 'deleted') NOT NULL DEFAULT 'active', `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `languageId` int NULL, UNIQUE INDEX `IDX_8536b8b85c06969f84f0c098b0` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `storeTypes` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, UNIQUE INDEX `IDX_6598fa6befc7f7eb898a8adbd4` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `stores` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `slug` varchar(50) NOT NULL, `description` varchar(4096) NULL, `status` enum ('pending', 'active', 'blocked', 'deleted', 'rejected') NOT NULL DEFAULT 'pending', `storeTypeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `storeAddresss` (`id` int NOT NULL AUTO_INCREMENT, `latitude` decimal(10,8) NOT NULL, `longitude` decimal(11,8) NOT NULL, `address` varchar(100) NOT NULL, `postalCode` varchar(10) NOT NULL, `rating` decimal(2,1) NULL, `status` enum ('active', 'deleted') NOT NULL DEFAULT 'active', `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `storeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `products` (`id` int NOT NULL AUTO_INCREMENT, `externalID` varchar(50) NULL, `imageURL` varchar(255) NULL, `price` decimal(9,2) NOT NULL, `status` enum ('active', 'deleted') NOT NULL DEFAULT 'active', `storeAddressId` int NULL, `currencyId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `orderItems` (`id` int NOT NULL AUTO_INCREMENT, `price` decimal(9,2) NOT NULL, `quantity` int NOT NULL, `productId` int NULL, `orderId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `orders` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(255) NULL, `isPaid` tinyint(1) NOT NULL DEFAULT 0, `price` decimal(9,2) NOT NULL, `status` enum ('scheduled', 'active', 'delivered', 'cancelled') NOT NULL DEFAULT 'scheduled', `scheduledDate` timestamp NOT NULL, `deliveredAt` timestamp NULL, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `currencyId` int NULL, `storeAddressId` int NULL, `customerId` int NULL, `courierId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `orderAddresses` (`id` int NOT NULL AUTO_INCREMENT, `latitude` decimal(10,8) NOT NULL, `longitude` decimal(11,8) NOT NULL, `address` varchar(100) NOT NULL, `instructions` varchar(100) NULL, `details` varchar(100) NULL, `contactPerson` varchar(50) NULL, `contactPhone` varchar(20) NULL, `orderId` int NULL, UNIQUE INDEX `REL_b927cd64f3bf6bdeeb04895c0a` (`orderId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `productTranslations` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(50) NOT NULL, `description` varchar(255) NULL, `productId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `couriers` ADD CONSTRAINT `FK_dedec4ae829a98722971e5d723f` FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `customers` ADD CONSTRAINT `FK_a12c3edd078539a806b43d6221a` FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `stores` ADD CONSTRAINT `FK_982eebf6e10f4dbb008a2185153` FOREIGN KEY (`storeTypeId`) REFERENCES `storeTypes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `storeAddresss` ADD CONSTRAINT `FK_34515c9677b260ce76d218627a1` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_22ed93f367951d7712a14223eba` FOREIGN KEY (`storeAddressId`) REFERENCES `storeAddresss`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `products` ADD CONSTRAINT `FK_11c482ccb03f44355d4e6e8c0d3` FOREIGN KEY (`currencyId`) REFERENCES `currencies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orderItems` ADD CONSTRAINT `FK_51d8fc35a95624166faeca65e86` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orderItems` ADD CONSTRAINT `FK_391c9e5d5af8d7d7ce4b96db80e` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `FK_a38a28c3960e17ab3d1d4e92779` FOREIGN KEY (`currencyId`) REFERENCES `currencies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `FK_682eea97d72009d2b8bc4985c41` FOREIGN KEY (`storeAddressId`) REFERENCES `storeAddresss`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `FK_e5de51ca888d8b1f5ac25799dd1` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orders` ADD CONSTRAINT `FK_76eaffec5e36a04bbf3bf549146` FOREIGN KEY (`courierId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `orderAddresses` ADD CONSTRAINT `FK_b927cd64f3bf6bdeeb04895c0a3` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `productTranslations` ADD CONSTRAINT `FK_a162eec7c7f9a6f1edfe675018f` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `productTranslations` DROP FOREIGN KEY `FK_a162eec7c7f9a6f1edfe675018f`");
        await queryRunner.query("ALTER TABLE `orderAddresses` DROP FOREIGN KEY `FK_b927cd64f3bf6bdeeb04895c0a3`");
        await queryRunner.query("ALTER TABLE `orders` DROP FOREIGN KEY `FK_76eaffec5e36a04bbf3bf549146`");
        await queryRunner.query("ALTER TABLE `orders` DROP FOREIGN KEY `FK_e5de51ca888d8b1f5ac25799dd1`");
        await queryRunner.query("ALTER TABLE `orders` DROP FOREIGN KEY `FK_682eea97d72009d2b8bc4985c41`");
        await queryRunner.query("ALTER TABLE `orders` DROP FOREIGN KEY `FK_a38a28c3960e17ab3d1d4e92779`");
        await queryRunner.query("ALTER TABLE `orderItems` DROP FOREIGN KEY `FK_391c9e5d5af8d7d7ce4b96db80e`");
        await queryRunner.query("ALTER TABLE `orderItems` DROP FOREIGN KEY `FK_51d8fc35a95624166faeca65e86`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_11c482ccb03f44355d4e6e8c0d3`");
        await queryRunner.query("ALTER TABLE `products` DROP FOREIGN KEY `FK_22ed93f367951d7712a14223eba`");
        await queryRunner.query("ALTER TABLE `storeAddresss` DROP FOREIGN KEY `FK_34515c9677b260ce76d218627a1`");
        await queryRunner.query("ALTER TABLE `stores` DROP FOREIGN KEY `FK_982eebf6e10f4dbb008a2185153`");
        await queryRunner.query("ALTER TABLE `customers` DROP FOREIGN KEY `FK_a12c3edd078539a806b43d6221a`");
        await queryRunner.query("ALTER TABLE `couriers` DROP FOREIGN KEY `FK_dedec4ae829a98722971e5d723f`");
        await queryRunner.query("DROP TABLE `productTranslations`");
        await queryRunner.query("DROP INDEX `REL_b927cd64f3bf6bdeeb04895c0a` ON `orderAddresses`");
        await queryRunner.query("DROP TABLE `orderAddresses`");
        await queryRunner.query("DROP TABLE `orders`");
        await queryRunner.query("DROP TABLE `orderItems`");
        await queryRunner.query("DROP TABLE `products`");
        await queryRunner.query("DROP TABLE `storeAddresss`");
        await queryRunner.query("DROP TABLE `stores`");
        await queryRunner.query("DROP INDEX `IDX_6598fa6befc7f7eb898a8adbd4` ON `storeTypes`");
        await queryRunner.query("DROP TABLE `storeTypes`");
        await queryRunner.query("DROP INDEX `IDX_8536b8b85c06969f84f0c098b0` ON `customers`");
        await queryRunner.query("DROP TABLE `customers`");
        await queryRunner.query("DROP INDEX `IDX_9f8d0972aeeb5a2277e40332d2` ON `currencies`");
        await queryRunner.query("DROP TABLE `currencies`");
        await queryRunner.query("DROP INDEX `IDX_dbb79407286509e8c44ea60d9d` ON `couriers`");
        await queryRunner.query("DROP TABLE `couriers`");
        await queryRunner.query("DROP INDEX `IDX_7397752718d1c9eb873722ec9b` ON `languages`");
        await queryRunner.query("DROP TABLE `languages`");
    }

}
