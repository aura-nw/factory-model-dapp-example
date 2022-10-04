import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterBuyPackHistoryRenameToPack1650526985597
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE BuyPackHistory RENAME TO Pack;
        ALTER TABLE Pack ADD NftIds text NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
