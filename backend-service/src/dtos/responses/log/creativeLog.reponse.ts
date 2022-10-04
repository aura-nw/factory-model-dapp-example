import { ApiProperty } from '@nestjs/swagger';

export class CreativeLogDto {
  @ApiProperty({
    description: 'Id of moment',
    type: 'number',
    example: 1,
  })
  momentId: number;

  @ApiProperty({
    description: 'Name of moment',
    type: 'string',
    example: 'NFT 1',
  })
  momentName: string;

  @ApiProperty({
    description: 'Contract Address',
    type: 'string',
    example: 'aura1jy9dagaycutdcjf99tp9uhl5ev9lykegp2tph6r9vu6xg3td6krsnaw953',
  })
  contractAddress: string;

  @ApiProperty({
    description: 'Amount of NFT',
    type: 'number',
    example: 10,
  })
  nftAmount: number;

  @ApiProperty({
    description: 'Date created',
    type: 'Date',
    example: new Date('2022-04-15 08:14:05.304032'),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Total Fee',
    type: 'number',
    example: 90,
  })
  totalFee: number;
}
