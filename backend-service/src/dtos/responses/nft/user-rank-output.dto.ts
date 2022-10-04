import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UserRankOutput {
  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @IsNumber()
  @ApiProperty({type: Number})
  ownNftCount: number;

  @Expose()
  @ApiProperty({type: Number})
  momentId: number;

  @Expose()
  @ApiProperty()
  level: number;

  @Expose()
  @ApiProperty()
  userName: string;
}
