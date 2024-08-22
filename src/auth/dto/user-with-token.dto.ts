import { User } from '../../users/schemas/user.schema';

export class UserWithToken {
  user: User;
  accessToken: string;
}
