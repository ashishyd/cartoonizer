import { UserSocial } from './userSocial';
export interface User {
  full_name: string;
  email: string;
  company_name?: string;
  mobile_number?: string;
  user_social?: UserSocial[];
}
