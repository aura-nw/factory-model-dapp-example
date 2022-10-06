import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MintNftByMnemonicRequest {
  @ApiProperty()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  msg: JSON;
}
