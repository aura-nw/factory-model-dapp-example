import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnTransaction1649992853283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Transaction ADD CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            ADD UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            ADD Id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
