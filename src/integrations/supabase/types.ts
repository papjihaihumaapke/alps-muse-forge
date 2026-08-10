export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      homepage_banners: {
        Row: {
          cta_label: string | null
          image_url: string | null
          link_url: string | null
          slot: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          cta_label?: string | null
          image_url?: string | null
          link_url?: string | null
          slot: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          cta_label?: string | null
          image_url?: string | null
          link_url?: string | null
          slot?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      imported_customers: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          imported_at: string
          notes: string | null
          phone: string | null
          source: string | null
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id?: string
          imported_at?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          imported_at?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      journey_items: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_url: string | null
          kind: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          kind: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string | null
          kind?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      journey_posts: {
        Row: {
          content: string | null
          cover_image_url: string | null
          created_at: string
          event_date: string | null
          event_label: string | null
          event_year: number
          excerpt: string | null
          id: string
          images: Json
          kind: string
          links: Json
          published: boolean
          slug: string | null
          sort_order: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          event_date?: string | null
          event_label?: string | null
          event_year: number
          excerpt?: string | null
          id?: string
          images?: Json
          kind?: string
          links?: Json
          published?: boolean
          slug?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          event_date?: string | null
          event_label?: string | null
          event_year?: number
          excerpt?: string | null
          id?: string
          images?: Json
          kind?: string
          links?: Json
          published?: boolean
          slug?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          currency: string
          id: string
          name: string
          order_id: string
          product_slug: string | null
          qty: number
          size: string | null
          unit_price: number
        }
        Insert: {
          color?: string | null
          currency: string
          id?: string
          name: string
          order_id: string
          product_slug?: string | null
          qty?: number
          size?: string | null
          unit_price?: number
        }
        Update: {
          color?: string | null
          currency?: string
          id?: string
          name?: string
          order_id?: string
          product_slug?: string | null
          qty?: number
          size?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          country: string | null
          created_at: string
          currency: string
          discount: number
          email: string
          full_name: string
          id: string
          mobile: string | null
          order_number: string
          payment_status: string | null
          promo_code: string | null
          shipping: number
          status: string
          stripe_session_id: string | null
          subtotal: number
          tax: number
          total: number
          user_id: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string
          currency: string
          discount?: number
          email: string
          full_name: string
          id?: string
          mobile?: string | null
          order_number?: string
          payment_status?: string | null
          promo_code?: string | null
          shipping?: number
          status?: string
          stripe_session_id?: string | null
          subtotal?: number
          tax?: number
          total?: number
          user_id?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          discount?: number
          email?: string
          full_name?: string
          id?: string
          mobile?: string | null
          order_number?: string
          payment_status?: string | null
          promo_code?: string | null
          shipping?: number
          status?: string
          stripe_session_id?: string | null
          subtotal?: number
          tax?: number
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          active: boolean
          body: string | null
          created_at: string
          eyebrow: string | null
          heading: string | null
          id: string
          image_url: string | null
          links: Json
          page: string
          sort_order: number
          subheading: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          body?: string | null
          created_at?: string
          eyebrow?: string | null
          heading?: string | null
          id?: string
          image_url?: string | null
          links?: Json
          page?: string
          sort_order?: number
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string | null
          created_at?: string
          eyebrow?: string | null
          heading?: string | null
          id?: string
          image_url?: string | null
          links?: Json
          page?: string
          sort_order?: number
          subheading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      preorders: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          mobile: string | null
          notified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          mobile?: string | null
          notified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          mobile?: string | null
          notified?: boolean
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          parent_slug: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          parent_slug?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          parent_slug?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          care_instructions: string | null
          category: string
          color_swatches: Json
          colors: string[]
          composition: string | null
          created_at: string
          description: string | null
          design_features: string | null
          display_order: number
          external_url: string | null
          features: string[]
          gallery_urls: string[]
          hashtags: string[]
          hidden: boolean
          id: string
          image_url: string | null
          is_external: boolean
          name: string
          package_size: string | null
          package_weight: string | null
          price_cad: number
          price_hkd: number
          season: Database["public"]["Enums"]["product_season"]
          sizes: string[]
          slug: string
          stock: number
          stock_ca: number
          subcategory: string | null
          tags: string[]
          tech_info: string | null
          updated_at: string
        }
        Insert: {
          care_instructions?: string | null
          category: string
          color_swatches?: Json
          colors?: string[]
          composition?: string | null
          created_at?: string
          description?: string | null
          design_features?: string | null
          display_order?: number
          external_url?: string | null
          features?: string[]
          gallery_urls?: string[]
          hashtags?: string[]
          hidden?: boolean
          id?: string
          image_url?: string | null
          is_external?: boolean
          name: string
          package_size?: string | null
          package_weight?: string | null
          price_cad?: number
          price_hkd?: number
          season?: Database["public"]["Enums"]["product_season"]
          sizes?: string[]
          slug: string
          stock?: number
          stock_ca?: number
          subcategory?: string | null
          tags?: string[]
          tech_info?: string | null
          updated_at?: string
        }
        Update: {
          care_instructions?: string | null
          category?: string
          color_swatches?: Json
          colors?: string[]
          composition?: string | null
          created_at?: string
          description?: string | null
          design_features?: string | null
          display_order?: number
          external_url?: string | null
          features?: string[]
          gallery_urls?: string[]
          hashtags?: string[]
          hidden?: boolean
          id?: string
          image_url?: string | null
          is_external?: boolean
          name?: string
          package_size?: string | null
          package_weight?: string | null
          price_cad?: number
          price_hkd?: number
          season?: Database["public"]["Enums"]["product_season"]
          sizes?: string[]
          slug?: string
          stock?: number
          stock_ca?: number
          subcategory?: string | null
          tags?: string[]
          tech_info?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          mobile: string | null
          newsletter_opt_in: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          mobile?: string | null
          newsletter_opt_in?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          mobile?: string | null
          newsletter_opt_in?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          amount: number
          applicable_products: string[] | null
          code: string
          created_at: string
          currency: string | null
          discount_type: string
          expires_at: string | null
          id: string
          usage_limit: number | null
          used_count: number
        }
        Insert: {
          active?: boolean
          amount: number
          applicable_products?: string[] | null
          code: string
          created_at?: string
          currency?: string | null
          discount_type: string
          expires_at?: string | null
          id?: string
          usage_limit?: number | null
          used_count?: number
        }
        Update: {
          active?: boolean
          amount?: number
          applicable_products?: string[] | null
          code?: string
          created_at?: string
          currency?: string | null
          discount_type?: string
          expires_at?: string | null
          id?: string
          usage_limit?: number | null
          used_count?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_slug?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      product_season: "spring" | "summer" | "fall" | "winter" | "all-season"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      product_season: ["spring", "summer", "fall", "winter", "all-season"],
    },
  },
} as const
