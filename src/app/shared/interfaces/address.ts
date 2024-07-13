export interface Address {
  line_1: string;
  line_2: string | null;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}