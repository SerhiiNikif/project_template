import { IsNotEmpty, IsOptional, Matches, MinLength, IsEmail } from "class-validator";

export class RegistrationDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phone: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  status?: string;
}
