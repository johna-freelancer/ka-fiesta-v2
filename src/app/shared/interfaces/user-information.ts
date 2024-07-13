export interface UserInformation {
  id: number;
  user_id: number;
  primary_contact: string;
  secondary_contact?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}