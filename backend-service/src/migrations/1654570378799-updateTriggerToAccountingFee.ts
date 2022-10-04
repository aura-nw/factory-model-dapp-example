import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateTriggerToAccountingFee1654570378799
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP PROCEDURE IF EXISTS insertCreativeLog;');

    await queryRunner.query(`
        create procedure insertCreativeLog (
            IN txHash varchar(255),
            IN fee float,
            IN createdAt timestamp(6))
            begin
                SELECT SLEEP(4) INTO @sleep;
                select count(*) into @amountNft from NFT where CreateTxHash = txHash;
        
                if @amountNft > 0 then
                    set @type = 'MINT_NFT';
                    select momentId into @momentId from NFT where CreateTxHash = txHash limit 1;
                    insert into CreativeLog values (createdAt, txHash, @momentId, @amountNft, @type, fee) ON DUPLICATE KEY UPDATE createdAt = createdAt;
                else
                    set @type = 'DEPLOY_CONTRACT';
                    select id into @momentId from Moment where Moment.TxHash = txHash;
                    insert into CreativeLog values (createdAt, txHash, @momentId, null, @type, fee) ON DUPLICATE KEY UPDATE createdAt = createdAt;
                end if;
            end;`);

    await queryRunner.query('drop trigger if exists insertCreativeLogAfterTx;');
    await queryRunner.query(`
        CREATE TRIGGER insertCreativeLogAfterTx
        AFTER INSERT
        ON Transaction FOR EACH ROW
        BEGIN
            call insertCreativeLog(NEW.TxHash, NEW.Fee, NEW.CreatedAt);
        end;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
