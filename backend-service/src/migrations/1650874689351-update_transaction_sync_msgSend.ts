import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTransactionSyncMsgSend1650874689351 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE Transaction ADD COLUMN RawLogs LONGTEXT COLLATE utf8_unicode_ci AFTER Fee;`);
        await queryRunner.query(`    
        ALTER TABLE Transaction ADD COLUMN FromAddress VARCHAR(255) COLLATE utf8_unicode_ci AFTER RawLogs;`);
        await queryRunner.query(`
        ALTER TABLE Transaction ADD COLUMN ToAddress VARCHAR(255) COLLATE utf8_unicode_ci AFTER FromAddress;`);
        await queryRunner.query(`
        ALTER TABLE Transaction ADD COLUMN Amount FLOAT(12) AFTER ToAddress;`);
        await queryRunner.query(`
        ALTER TABLE Transaction ADD COLUMN Denom VARCHAR(45) COLLATE utf8_unicode_ci AFTER Amount;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
