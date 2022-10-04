import {MigrationInterface, QueryRunner} from "typeorm";

export class init1648439976064 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE Creator (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            Balance float NOT NULL,
            Address varchar(255) COLLATE utf8_unicode_ci,
            Pubkey varchar(255) COLLATE utf8_unicode_ci,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE User (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            Email varchar(255) COLLATE utf8_unicode_ci,
            Phone varchar(255) COLLATE utf8_unicode_ci,
            Name varchar(255) COLLATE utf8_unicode_ci,
            Address varchar(255) COLLATE utf8_unicode_ci,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE NFT (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            _Id varchar(255) COLLATE utf8_unicode_ci,
            MinterId int(11),
            CollectionId int(11),
            CreateTxHash varchar(255) COLLATE utf8_unicode_ci,
            WithDrawTxHash varchar(255) COLLATE utf8_unicode_ci,
            MomentId int(11),
            Status varchar(255) COLLATE utf8_unicode_ci,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE BuyPackHistory (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            UserId int(11),
            CollectionId int(11),
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE Transaction (
            TxHash varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            Height int(11) NOT NULL,
            Code int(11) NOT NULL,
            GasUsed int(11) NOT NULL,
            GasWanted int(11) NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE Collection (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            CreatorId int(11) NOT NULL,
            Name varchar(255) COLLATE utf8_unicode_ci,
            Artist varchar(255) COLLATE utf8_unicode_ci,
            Status varchar(255) COLLATE utf8_unicode_ci,
            OpenPackTime timestamp(6),
            PublicTime timestamp(6),
            ReleaseTime timestamp(6),
            CancelReleaseTime timestamp(6),
            NFTPerPack int(11),
            PackPrice float,
            PackAmount int(11),
            PackDescription varchar(255) COLLATE utf8_unicode_ci,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE Moment (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            Name varchar(255) NOT NULL COLLATE utf8_unicode_ci,
            CollectionId int(11),
            CreatorId int(11) NOT NULL,
            TxHash varchar(255) COLLATE utf8_unicode_ci,
            Description varchar(255) COLLATE utf8_unicode_ci,
            Level int(11) NOT NULL,
            ContractAddress varchar(255) COLLATE utf8_unicode_ci,
            DisplayURI varchar(255) COLLATE utf8_unicode_ci,
            IpfsURI varchar(255) COLLATE utf8_unicode_ci,
            NFTAmount int(11) NOT NULL,
            Status varchar(255) NOT NULL COLLATE utf8_unicode_ci,
            ErrorCode varchar(255) NOT NULL COLLATE utf8_unicode_ci,
            IncomeRatio float NOT NULL,
            IncomeAddress varchar(255) COLLATE utf8_unicode_ci,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

          CREATE TABLE CollectionAsset (
            CreatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            UpdatedAt timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            Id int(11) NOT NULL AUTO_INCREMENT,
            CollectionId int(11) NOT NULL,
            URI varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            Status varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            Type varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            PRIMARY KEY (Id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      
    }

}
