import {MigrationInterface, QueryRunner} from "typeorm";

export class updateColumnDescriptionTableCollectionMoment1652776212623 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE Moment MODIFY Description VARCHAR(1000) COLLATE utf8_unicode_ci;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
