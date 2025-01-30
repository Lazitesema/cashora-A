export interface User {
  name: any;
  id: string; // Assuming ID is a string
  username: string; 
  email: string;
  password?: string; // Assuming password is a string and might be optional in some cases
  balance: number; // Assuming balance is a number (e.g., decimal)
  approved: boolean; // Whether the user is approved or not
}
