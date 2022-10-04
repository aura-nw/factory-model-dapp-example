import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RedeemPackRequest {
  @ApiProperty()
  @IsNotEmpty()
  ecode: string;

  @ApiProperty()
  @IsNotEmpty()
  collectionId: number;
}
