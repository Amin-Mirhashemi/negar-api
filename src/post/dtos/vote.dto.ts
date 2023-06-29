import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  postId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  tagId: string;
}
