import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TransferNftRequest {
  @ApiProperty()
  operatorAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty()
  contractAddress: string;

  @ApiProperty()
  nftId: number;

}
