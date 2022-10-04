import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OwnedNftOutput {
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
  collectionId: string;

  @Expose()
  @ApiProperty()
  collectionName: string;

  @Expose()
  @ApiProperty()
  collectionStatus: string;

  @Expose()
  @ApiProperty()
  artist: string;

  @Expose()
  @ApiProperty()
  level: number;
}
