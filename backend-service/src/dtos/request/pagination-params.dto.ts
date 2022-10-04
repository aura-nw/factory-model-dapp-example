import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class PaginationQuery {
  @ApiPropertyOptional({
    description: 'Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  // @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize = 5;

  @ApiPropertyOptional({ description: 'Optional', type: Number })
  @IsNumber()
  @IsOptional()
  // @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageIndex = 0;

  @ApiPropertyOptional({ description: 'Optional', type: Date })
  @IsDate()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Optional', type: Date })
  @IsDate()
  @IsOptional()
  toDate?: string;
}
