import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeColumnBalanceCreator1649906311642
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE Creator DROP COLUMN Balance;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
