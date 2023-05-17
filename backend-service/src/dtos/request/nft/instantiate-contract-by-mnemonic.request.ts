import { ApiProperty } from '@nestjs/swagger';

export class InstantiateContractByMnemonicRequest {
  @ApiProperty()
  tokenUri: string;

  @ApiProperty()
  numToken: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;
}