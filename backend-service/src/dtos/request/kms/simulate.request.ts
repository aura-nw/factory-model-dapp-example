import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Simuate {
  @ApiProperty()
  @IsNotEmpty()
  token_id: string;

  @ApiProperty()
  @IsNotEmpty()
  contract_address: string;
}
