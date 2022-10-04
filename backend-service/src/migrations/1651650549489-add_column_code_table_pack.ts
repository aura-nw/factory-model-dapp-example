import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnCodeTablePack1651650549489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE Pack ADD COLUMN Code varchar(255) COLLATE utf8_bin AFTER CollectionId;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
