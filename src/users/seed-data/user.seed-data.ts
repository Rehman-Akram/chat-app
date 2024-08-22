import { DEFAULT_ROLES } from 'src/shared/constants/constants';
import { UserGender } from '../enums/gender.enum';
import { UserStatus } from '../enums/status.enum';
export const usersData = [
  {
    firstName: 'Rehman',
    lastName: 'Akram',
    status: UserStatus.ACTIVE,
    email: 'rehmanakram03@gmail.com',
    gender: UserGender.MALE,
    phoneNo: '+923454109364',
    password: 'Abcdef@123',
    emailVerified: true,
    phoneVerified: true,
    role: DEFAULT_ROLES.SUPER_ADMIN,
  },
];
