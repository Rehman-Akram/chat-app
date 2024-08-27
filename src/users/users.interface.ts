import { UserStatus } from 'src/users/enums/status.enum';

export interface CreateUser {
  firstName: string;
  email: string;
  password?: string;
  status?: UserStatus;
  phoneNumber?: string;
  lastName?: string;
}
