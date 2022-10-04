import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTableECode1651744118302 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE ECode (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            Code varchar(255) COLLATE utf8_bin,
            Status varchar(255) COLLATE utf8_unicode_ci,
            CollectionId int(11) NOT NULL,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
          
          CREATE TABLE Purchase (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            CodeId int(11) NOT NULL,
            PackId int(11) NOT NULL,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
          
          ALTER TABLE Pack DROP COLUMN Code;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
