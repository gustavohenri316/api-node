export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar_url: string;
  roles?: Array<string>;
  permissions?: Array<string>;
}
