import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTransactionAddType1650878287974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE Transaction ADD COLUMN TypeUrl VARCHAR(255) COLLATE utf8_unicode_ci AFTER Denom;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
