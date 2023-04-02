import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class EditUserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ type: String })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  avatar?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  bio?: string;
}
