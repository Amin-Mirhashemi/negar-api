import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
export class EditPostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ type: String })
  text?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  image?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ type: String })
  repostOn?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  publishTime?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  unpublishTime?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  onlyFollowers?: boolean;
}
