import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnCloseTimeTableCollection1651045321916 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE Collection ADD COLUMN CloseTime timestamp(6) AFTER PublicTime;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
