import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class EditCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  text: string;
}
