import {MigrationInterface, QueryRunner} from "typeorm";

export class fixProductTran1591652395410 implements MigrationInterface {
    name = 'fixProductTran1591652395410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `productTranslations` ADD `languageId` int NULL");
        await queryRunner.query("ALTER TABLE `productTranslations` ADD CONSTRAINT `FK_8f6362d28b2eb615f069aa5c191` FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `productTranslations` DROP FOREIGN KEY `FK_8f6362d28b2eb615f069aa5c191`");
        await queryRunner.query("ALTER TABLE `productTranslations` DROP COLUMN `languageId`");
    }

}
