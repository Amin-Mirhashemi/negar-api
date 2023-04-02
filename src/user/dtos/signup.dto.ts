import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'email format' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  password: string;

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
