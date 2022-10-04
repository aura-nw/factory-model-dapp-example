import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignKMSParam {
  @ApiProperty()
  @IsNotEmpty()
  creatorAddress: string;
}
export class SignKMSRequest {
  @ApiProperty()
  @IsNotEmpty()
  // msgHash: string;
  encodeMsg: string;
}
