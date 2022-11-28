import { ApiProperty } from '@nestjs/swagger';

export class MintNftByMnemonicRequest {
  @ApiProperty({type:'integer',isArray:true})
  nftIds: number[];

  @ApiProperty()
  contractAddress: string;
}
