export interface Permission {
  id: string;
  title: string;
  description: string;
  key: string;
  createdAt: Date;
  createdBy: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}
