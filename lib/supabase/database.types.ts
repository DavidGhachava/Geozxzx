export type Database = {
  public: {
    Tables: {
      phrase_categories: {
        Row: {
          slug: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      phrases: {
        Row: {
          id: string;
          category_slug: string;
          georgian: string;
          transliteration: string;
          english: string;
          russian: string;
          audio_url: string | null;
          audio_slow_url: string | null;
          tags: string[];
          difficulty: number;
          speech_register: string;
          context_note: string | null;
          content_version: number;
          publication_status: string;
          published_at: string;
          is_free: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_slug: string;
          georgian: string;
          transliteration: string;
          english: string;
          russian: string;
          audio_url?: string | null;
          audio_slow_url?: string | null;
          tags?: string[];
          difficulty?: number;
          speech_register?: string;
          context_note?: string | null;
          content_version?: number;
          publication_status?: string;
          published_at?: string;
          is_free?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_slug?: string;
          georgian?: string;
          transliteration?: string;
          english?: string;
          russian?: string;
          audio_url?: string | null;
          audio_slow_url?: string | null;
          tags?: string[];
          difficulty?: number;
          speech_register?: string;
          context_note?: string | null;
          content_version?: number;
          publication_status?: string;
          published_at?: string;
          is_free?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          preferred_translation: string;
          interface_language: string;
          phone_number: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          preferred_translation?: string;
          interface_language?: string;
          phone_number?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          preferred_translation?: string;
          interface_language?: string;
          phone_number?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          user_id: string;
          plan: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          plan?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          plan?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_entitlements: {
        Row: {
          user_id: string;
          product: string;
          status: string;
          granted_at: string;
          expires_at: string | null;
          source_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product: string;
          status?: string;
          granted_at?: string;
          expires_at?: string | null;
          source_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          product?: string;
          status?: string;
          granted_at?: string;
          expires_at?: string | null;
          source_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_phrases: {
        Row: { user_id: string; phrase_id: string; created_at: string };
        Insert: { user_id: string; phrase_id: string; created_at?: string };
        Update: { user_id?: string; phrase_id?: string; created_at?: string };
        Relationships: [];
      };
      learning_progress: {
        Row: {
          user_id: string;
          phrase_id: string;
          times_practiced: number;
          correct_answers: number;
          mastery_level: number;
          last_practiced_at: string | null;
          next_review_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          phrase_id: string;
          times_practiced?: number;
          correct_answers?: number;
          mastery_level?: number;
          last_practiced_at?: string | null;
          next_review_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          phrase_id?: string;
          times_practiced?: number;
          correct_answers?: number;
          mastery_level?: number;
          last_practiced_at?: string | null;
          next_review_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_activity: {
        Row: {
          user_id: string;
          activity_date: string;
          phrases_practiced: number;
          lessons_completed: number;
          correct_answers: number;
          xp_earned: number;
          minutes_spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          activity_date: string;
          phrases_practiced?: number;
          lessons_completed?: number;
          correct_answers?: number;
          xp_earned?: number;
          minutes_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          activity_date?: string;
          phrases_practiced?: number;
          lessons_completed?: number;
          correct_answers?: number;
          xp_earned?: number;
          minutes_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      has_guided_learning_access: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      has_phrasebook_pro_access: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      record_learning_activity: {
        Args: {
          p_phrase_id: string;
          p_correct?: boolean;
          p_lesson_completed?: boolean;
          p_minutes?: number;
        };
        Returns: {
          current_streak: number;
          longest_streak: number;
          total_xp: number;
        }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type PhraseRow = Database['public']['Tables']['phrases']['Row'];
