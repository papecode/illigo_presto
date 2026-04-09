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
      abonnements: {
        Row: {
          actif: boolean | null
          created_at: string | null
          formule: string
          id: number
          jour_livraison: string | null
          user_id: string
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          formule: string
          id?: number
          jour_livraison?: string | null
          user_id: string
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          formule?: string
          id?: number
          jour_livraison?: string | null
          user_id?: string
        }
        Relationships: []
      }
      avis: {
        Row: {
          commentaire: string | null
          created_at: string | null
          id: number
          note: number
          produit_id: number
          user_id: string
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          id?: number
          note: number
          produit_id: number
          user_id: string
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          id?: number
          note?: number
          produit_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avis_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          image_url: string | null
          nom: string
          ordre: number | null
          slug: string
        }
        Insert: {
          id?: number
          image_url?: string | null
          nom: string
          ordre?: number | null
          slug: string
        }
        Update: {
          id?: number
          image_url?: string | null
          nom?: string
          ordre?: number | null
          slug?: string
        }
        Relationships: []
      }
      commandes: {
        Row: {
          adresse_livraison: Json | null
          created_at: string | null
          creneau_livraison: string | null
          date_livraison: string | null
          frais_livraison: number | null
          id: string
          livreur_nom: string | null
          livreur_telephone: string | null
          mode_paiement: string | null
          montant_total: number | null
          statut: string | null
          user_id: string
        }
        Insert: {
          adresse_livraison?: Json | null
          created_at?: string | null
          creneau_livraison?: string | null
          date_livraison?: string | null
          frais_livraison?: number | null
          id?: string
          livreur_nom?: string | null
          livreur_telephone?: string | null
          mode_paiement?: string | null
          montant_total?: number | null
          statut?: string | null
          user_id: string
        }
        Update: {
          adresse_livraison?: Json | null
          created_at?: string | null
          creneau_livraison?: string | null
          date_livraison?: string | null
          frais_livraison?: number | null
          id?: string
          livreur_nom?: string | null
          livreur_telephone?: string | null
          mode_paiement?: string | null
          montant_total?: number | null
          statut?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lignes_commande: {
        Row: {
          commande_id: string
          id: number
          prix_unitaire: number
          produit_id: number
          quantite: number
          sous_total: number
        }
        Insert: {
          commande_id: string
          id?: number
          prix_unitaire: number
          produit_id: number
          quantite: number
          sous_total: number
        }
        Update: {
          commande_id?: string
          id?: number
          prix_unitaire?: number
          produit_id?: number
          quantite?: number
          sous_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "lignes_commande_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_commande_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      produits: {
        Row: {
          badge: string | null
          categorie_id: number | null
          created_at: string | null
          description: string | null
          disponible: boolean | null
          id: number
          image_url: string | null
          nom: string
          nom_wolof: string | null
          note_moyenne: number | null
          pecheur_nom: string | null
          prix_kg: number
          provenance: string | null
          slug: string
          stock_kg: number | null
          unite: string | null
        }
        Insert: {
          badge?: string | null
          categorie_id?: number | null
          created_at?: string | null
          description?: string | null
          disponible?: boolean | null
          id?: number
          image_url?: string | null
          nom: string
          nom_wolof?: string | null
          note_moyenne?: number | null
          pecheur_nom?: string | null
          prix_kg: number
          provenance?: string | null
          slug: string
          stock_kg?: number | null
          unite?: string | null
        }
        Update: {
          badge?: string | null
          categorie_id?: number | null
          created_at?: string | null
          description?: string | null
          disponible?: boolean | null
          id?: number
          image_url?: string | null
          nom?: string
          nom_wolof?: string | null
          note_moyenne?: number | null
          pecheur_nom?: string | null
          prix_kg?: number
          provenance?: string | null
          slug?: string
          stock_kg?: number | null
          unite?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          adresse: string | null
          created_at: string | null
          id: string
          nom: string | null
          prenom: string | null
          quartier: string | null
          telephone: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          id: string
          nom?: string | null
          prenom?: string | null
          quartier?: string | null
          telephone?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          quartier?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
