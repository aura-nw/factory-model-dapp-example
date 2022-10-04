import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OwnedPackOutput {
  @Expose()
  @ApiProperty()
  packId: number;

  @Expose()
  @ApiProperty()
  collectionId: number;

  @Expose()
  @ApiProperty()
  collectionName: string;

  @Expose()
  @ApiProperty()
  artist: string;

  @Expose()
  @ApiProperty()
  collectionStatus: string;

  @Expose()
  @ApiProperty()
  openPackTime: Date;

  @Expose()
  @ApiProperty()
  collectionAvatar: string;
}
