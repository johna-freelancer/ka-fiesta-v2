import { Address } from "./address";
import { UserInformation } from "./user-information";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: number;
  password: string;
  status: 'active' | 'inactive' | 'suspended';
  phone_number_verified: boolean;
  phone_number_code_verification?: string;
  email_verified: boolean;
  email_code_verification?: string;
  is_merchant: boolean;
  role: string; // 'Member' | 'Admin'
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  // Virtual property
  full_name: string;

  // Relationship
  user_information: UserInformation | null;
  addresses: Address[]
}