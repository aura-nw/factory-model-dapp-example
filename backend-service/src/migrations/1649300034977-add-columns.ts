import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSystemAddressCreator1649300034977
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Creator ADD SystemAddress varchar(255) COLLATE utf8_unicode_ci;
        ALTER TABLE NFT ADD OwnerId int(11)
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
