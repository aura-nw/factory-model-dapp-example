import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTransactionIndexTxHash1651132565255 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE UNIQUE INDEX TxHash ON Transaction (TxHash ASC);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
