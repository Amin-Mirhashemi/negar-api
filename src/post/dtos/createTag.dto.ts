import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  label: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ type: String })
  title: string;
}
