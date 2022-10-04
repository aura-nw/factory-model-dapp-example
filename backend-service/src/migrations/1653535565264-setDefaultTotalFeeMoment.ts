import { MigrationInterface, QueryRunner } from 'typeorm';

export class setDefaultTotalFeeMoment1653535565264
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE Moment
            ALTER TotalFee SET DEFAULT 0;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
