import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProcedure1663916990423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP EVENT IF EXISTS event_check_collection_status;',
    );
    await queryRunner.query(
      'DROP PROCEDURE IF EXISTS procedure_check_collection_status;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
