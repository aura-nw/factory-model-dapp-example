import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignMsgRequest {
  @ApiProperty()
  @IsNotEmpty()
  contractAddress: string;
}
