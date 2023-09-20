export interface Permission {
  id: string;
  title: string;
  description: string;
  key: string;
  createdAt: Date;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
