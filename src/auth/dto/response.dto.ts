import { User } from '../../users/schemas/user.schema';
import { OmitType } from '@nestjs/swagger';

export class SignUpResponseDto extends OmitType(User, ['password'] as const) {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
