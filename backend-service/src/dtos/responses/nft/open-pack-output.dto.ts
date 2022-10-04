import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OpenPackOutput {
  @Expose()
  @ApiProperty()
  nftId: number;

  @Expose()
  @ApiProperty()
  momentName: string;

  @Expose()
  @ApiProperty()
  displayUri: string;

  @Expose()
  @ApiProperty()
  level: number;
}
