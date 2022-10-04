import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTriggerToAccountingFee1653533823748
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
                    insert into CreativeLog values (createdAt, txHash, @momentId, @amountNft, @type, fee);
                else
                    set @type = 'DEPLOY_CONTRACT';
                    select id into @momentId from Moment where Moment.TxHash = txHash;
                    insert into CreativeLog values (createdAt, txHash, @momentId, null, @type, fee);
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

    await queryRunner.query('drop trigger if exists calculateMomentTotalFee;');
    await queryRunner.query(`
        CREATE TRIGGER calculateMomentTotalFee
        AFTER INSERT
        ON CreativeLog FOR EACH ROW
        BEGIN
            select Moment.TotalFee into @oldTotalFee from Moment where  Moment.id = NEW.MomentId;
            set @newTotalFee = @oldTotalFee + NEW.Fee;
            update Moment set Moment.TotalFee = @newTotalFee where Moment.id = NEW.MomentId;
        end;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
