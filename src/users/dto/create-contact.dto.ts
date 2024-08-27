import { IsEmail } from 'class-validator';

export class CreateContactDto {
  @IsEmail()
  email: string;
}
