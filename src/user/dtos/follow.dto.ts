import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  userId: string;
}
