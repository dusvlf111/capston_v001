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
    Functions: {
      submit_report: {
        Args: {
          location_name: string;
          location_lat: number;
          location_lng: number;
          activity_type: string;
          start_time: string;
          end_time: string;
          participants: number;
          contact_name: string;
          contact_phone: string;
          emergency_contact: string;
          notes: string | null;
        };
        Returns: Json;
      };
    };
    Enums: never;
    CompositeTypes: never;
  };
};
