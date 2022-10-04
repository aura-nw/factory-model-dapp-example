import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableCreativeLog1651027136505 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE CreativeLog (
            CreatedAt timestamp(6),
            TxHash varchar(255) COLLATE utf8_unicode_ci,
            MomentId int(11),
            NftAmount int(11),
            Type varchar(255),
            Fee float,
            PRIMARY KEY (TxHash)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
