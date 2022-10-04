import { ApiProperty } from '@nestjs/swagger';

export class MintNftRequest {
  @ApiProperty()
  nftIds: number[];

  @ApiProperty()
  operatorAddress: string;

  @ApiProperty()
  contractAddress: string;
}
