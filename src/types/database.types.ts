export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          phone: string | null;
          emergency_contact: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          phone?: string | null;
          emergency_contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          phone?: string | null;
          emergency_contact?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      reports: {
        Row: {
          id: string;
          user_id: string;
          report_no: number;
          location_data: Json;
          status: string;
          safety_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          report_no?: number;
          location_data: Json;
          status?: string;
          safety_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          report_no?: number;
          location_data?: Json;
          status?: string;
          safety_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      safety_zones: {
        Row: {
          id: string;
          zone_name: string;
          zone_type: string;
          boundary: Json;
          restrictions: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone_name: string;
          zone_type: string;
          boundary: Json;
          restrictions?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone_name?: string;
          zone_type?: string;
          boundary?: Json;
          restrictions?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: never;
    Functions: never;
    Enums: never;
    CompositeTypes: never;
  };
};
