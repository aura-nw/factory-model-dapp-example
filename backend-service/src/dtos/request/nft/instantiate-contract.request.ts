import { ApiProperty } from '@nestjs/swagger';

export class InstantiateContractRequest {
  @ApiProperty()
  codeId: number;

  @ApiProperty()
  initMsg: string;

  @ApiProperty()
  label: string;

}
// export class InstantiateContractRequest {
//   @ApiProperty()
//   operatorAddress: string;

//   @ApiProperty()
//   tokenUri: string;

//   @ApiProperty()
//   numToken: number;

//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   symbol: string;
// }