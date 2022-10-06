import { ApiProperty } from '@nestjs/swagger';

export class MintNftByMnemonicRequest {
  @ApiProperty()
  nftIds: number[];

  @ApiProperty()
  contractAddress: string;
}
