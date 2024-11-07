import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7, { message: 'must be at least 7 characters long' })
  @MaxLength(20, { message: 'must be at most 20 character long' })
  @IsStrongPassword()
  password: string;
}
