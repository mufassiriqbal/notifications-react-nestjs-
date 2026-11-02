import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\S+$/, { message: 'username must not contain spaces' })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
