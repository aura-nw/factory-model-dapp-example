import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPackAddStatus1650528272307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Pack ADD Status varchar(255) COLLATE utf8_unicode_ci;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
