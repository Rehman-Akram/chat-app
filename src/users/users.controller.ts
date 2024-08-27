import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './schemas/user.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('find-user-by-email')
  findUserByEmail(@Body() findUserDto: FindUserDto): Promise<User> {
    return this.usersService.findUserByEmail(findUserDto.email);
  }

  @Post('create-contact')
  createContact(
    @Body() createContactDto: CreateContactDto,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    return this.usersService.createContact({
      email: createContactDto.email,
      currentUser,
    });
  }
}
