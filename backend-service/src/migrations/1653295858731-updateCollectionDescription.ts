import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateCollectionDescription1653295858731
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Collection MODIFY PackDescription VARCHAR(1000) COLLATE utf8_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
