export interface Role {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
