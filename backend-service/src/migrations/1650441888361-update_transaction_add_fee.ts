import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTransactionAddFee1650441888361 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE Transaction ADD Fee float AFTER GasWanted;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
