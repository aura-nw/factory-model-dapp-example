import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterMomentAddTotalFee1651026974690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Moment ADD COLUMN TotalFee float`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
