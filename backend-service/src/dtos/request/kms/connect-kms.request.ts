import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConnectKMSParam {
  @ApiProperty()
  @IsNotEmpty()
  creatorAddress: string;
}
