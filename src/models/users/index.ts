export interface User {
  id: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  email: string;
  password: string;
  avatar_url: string;
  roles: string;
  permissions: string[];
}
