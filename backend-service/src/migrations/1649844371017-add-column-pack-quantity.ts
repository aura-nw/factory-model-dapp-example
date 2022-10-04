import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnPackQuantity1649844371017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Collection ADD PackQuantity int(11);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
