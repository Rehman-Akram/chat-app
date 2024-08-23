import { DEFAULT_ROLES } from '../../shared/constants/constants';

export const rolesSeedData = [
  {
    name: DEFAULT_ROLES.SUPER_ADMIN,
    description: 'Super Administrator',
  },
  {
    name: DEFAULT_ROLES.USER,
    description: 'Simple user role',
  },
  {
    name: DEFAULT_ROLES.ADMIN,
    description: 'Admin role',
  },
];
