import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  text: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  postId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  replyOn?: string;
}
