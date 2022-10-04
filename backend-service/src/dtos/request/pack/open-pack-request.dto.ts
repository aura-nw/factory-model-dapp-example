import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OpenPackRequest {
  @ApiProperty()
  @IsNotEmpty()
  packId: number;
}
