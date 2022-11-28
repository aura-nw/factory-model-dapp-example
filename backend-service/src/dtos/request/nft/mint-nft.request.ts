import { ApiProperty } from '@nestjs/swagger';

export class MintNftRequest {
  @ApiProperty({type:'integer',isArray:true})
  nftIds: number[];

  @ApiProperty()
  operatorAddress: string;

  @ApiProperty()
  contractAddress: string;
}
