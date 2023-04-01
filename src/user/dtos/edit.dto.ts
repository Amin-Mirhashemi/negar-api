import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class EditDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
