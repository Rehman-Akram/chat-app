import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGEX } from '../../shared/constants/constants';
import { UserStatus } from 'src/users/enums/status.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @MaxLength(20, { message: 'Must be less than 20 characters' })
  @MinLength(8, { message: 'Must be greator than 8 characters' })
  @Matches(REGEX.PASSWORD, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one special character',
  })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lastName: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  phoneNumber: string;

  @IsEnum(UserStatus)
  @IsOptional()
  @ApiProperty({ required: false })
  status: UserStatus;
}
