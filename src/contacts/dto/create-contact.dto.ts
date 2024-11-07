import { IsString, IsEmail, IsPhoneNumber, IsNumber } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  imageUri: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
