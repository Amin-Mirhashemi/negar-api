import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LikeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  entityId: string;
}
