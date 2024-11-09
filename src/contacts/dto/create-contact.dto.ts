import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsEmpty,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  imageUri: string;

  @IsNumber()
  @IsEmpty()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
