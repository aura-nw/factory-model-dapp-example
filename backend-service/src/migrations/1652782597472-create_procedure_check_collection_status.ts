import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProcedureCheckCollectionStatus1652782597472
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(
        'DROP PROCEDURE IF EXISTS procedure_check_collection_status;',
    );  

    await queryRunner.query(`
        CREATE PROCEDURE procedure_check_collection_status()
        BEGIN
        DECLARE c_ID VARCHAR(50);
        DECLARE done INT DEFAULT FALSE;
    
        DECLARE cursor_tx CURSOR FOR
            (SELECT Id FROM Collection c WHERE c.Status = 'PUBLISHED' AND c.OpenPackTime < NOW());
    
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
        OPEN cursor_tx;
        read_tx_loop: LOOP
            FETCH cursor_tx INTO c_ID;
            IF done THEN
            LEAVE read_tx_loop;
            END IF;
				UPDATE Collection SET Status = "LOCK" where Id = c_ID;
        END LOOP;
        CLOSE cursor_tx;
        END;`);

        await queryRunner.query('DROP EVENT IF EXISTS event_check_collection_status;');
        await queryRunner.query(`
            CREATE EVENT event_check_collection_status
            ON SCHEDULE
            EVERY 5 MINUTE
            STARTS '2022-05-17 00:00:01'
            DO
            BEGIN
                CALL procedure_check_collection_status();
            END;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
