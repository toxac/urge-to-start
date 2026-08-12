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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_logs: {
        Row: {
          context_type: string
          created_at: string
          generated_output: Json
          id: string
          mission_id: string | null
          quest_id: string | null
          resource_url: string | null
          task_id: string | null
          user_id: string
          user_input: string | null
        }
        Insert: {
          context_type: string
          created_at?: string
          generated_output?: Json
          id?: string
          mission_id?: string | null
          quest_id?: string | null
          resource_url?: string | null
          task_id?: string | null
          user_id: string
          user_input?: string | null
        }
        Update: {
          context_type?: string
          created_at?: string
          generated_output?: Json
          id?: string
          mission_id?: string | null
          quest_id?: string | null
          resource_url?: string | null
          task_id?: string | null
          user_id?: string
          user_input?: string | null
        }
        Relationships: []
      }
      dev_feedbacks: {
        Row: {
          created_at: string
          id: string
          status: string
          task_id: string
          text: string
          title: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          task_id: string
          text: string
          title: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          task_id?: string
          text?: string
          title?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      discounts: {
        Row: {
          applicable_currencies: string[]
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount_inr: number
          starts_at: string
          type: Database["public"]["Enums"]["discount_type"]
          updated_at: string
          uses_count: number
          value: number
        }
        Insert: {
          applicable_currencies?: string[]
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount_inr?: number
          starts_at?: string
          type: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          uses_count?: number
          value: number
        }
        Update: {
          applicable_currencies?: string[]
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount_inr?: number
          starts_at?: string
          type?: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          uses_count?: number
          value?: number
        }
        Relationships: []
      }
      email_queue: {
        Row: {
          created_at: string | null
          error: string | null
          id: number
          options: Json
          scheduled_for: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: number
          options: Json
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: number
          options?: Json
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          contact_email: string
          created_at: string
          currency: string
          description: string
          event_date: string
          format: Database["public"]["Enums"]["event_format"]
          id: string
          is_free_for_member: boolean
          is_public: boolean
          participants: Json
          price: number
          redeemable_points: number
          speakers: Json
          timezone: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
          venue_details: Json
          video_link: string | null
        }
        Insert: {
          contact_email: string
          created_at?: string
          currency?: string
          description: string
          event_date: string
          format: Database["public"]["Enums"]["event_format"]
          id?: string
          is_free_for_member?: boolean
          is_public?: boolean
          participants?: Json
          price?: number
          redeemable_points?: number
          speakers?: Json
          timezone?: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
          venue_details?: Json
          video_link?: string | null
        }
        Update: {
          contact_email?: string
          created_at?: string
          currency?: string
          description?: string
          event_date?: string
          format?: Database["public"]["Enums"]["event_format"]
          id?: string
          is_free_for_member?: boolean
          is_public?: boolean
          participants?: Json
          price?: number
          redeemable_points?: number
          speakers?: Json
          timezone?: string
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
          venue_details?: Json
          video_link?: string | null
        }
        Relationships: []
      }
      launches: {
        Row: {
          business_type: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          is_public: boolean
          launch_url: string
          launched_at: string | null
          location: string
          media_assets: string[]
          post_id: string | null
          pricing_hint: string
          project_id: string
          sector: string
          status: Database["public"]["Enums"]["launch_status"]
          tagline: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          upvotes_count: number
          user_id: string
        }
        Insert: {
          business_type: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          is_public?: boolean
          launch_url: string
          launched_at?: string | null
          location: string
          media_assets?: string[]
          post_id?: string | null
          pricing_hint?: string
          project_id: string
          sector: string
          status?: Database["public"]["Enums"]["launch_status"]
          tagline: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          upvotes_count?: number
          user_id: string
        }
        Update: {
          business_type?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          is_public?: boolean
          launch_url?: string
          launched_at?: string | null
          location?: string
          media_assets?: string[]
          post_id?: string | null
          pricing_hint?: string
          project_id?: string
          sector?: string
          status?: Database["public"]["Enums"]["launch_status"]
          tagline?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          upvotes_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_launches_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "launches_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "user_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          instagram_username: string | null
          internal_notes: string | null
          last_name: string | null
          linkedin_username: string | null
          opted_in_newsletter: boolean
          phone: string | null
          source: Database["public"]["Enums"]["lead_source"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          instagram_username?: string | null
          internal_notes?: string | null
          last_name?: string | null
          linkedin_username?: string | null
          opted_in_newsletter?: boolean
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          instagram_username?: string | null
          internal_notes?: string | null
          last_name?: string | null
          linkedin_username?: string | null
          opted_in_newsletter?: boolean
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          updated_at?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          badge_config: Json | null
          big_question: string | null
          content: string | null
          content_path: string
          context: Json
          created_at: string
          estimated_time_in_days: number
          id: string
          sequence: number
          success_message: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          badge_config?: Json | null
          big_question?: string | null
          content?: string | null
          content_path: string
          context?: Json
          created_at?: string
          estimated_time_in_days?: number
          id: string
          sequence: number
          success_message: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          badge_config?: Json | null
          big_question?: string | null
          content?: string | null
          content_path?: string
          context?: Json
          created_at?: string
          estimated_time_in_days?: number
          id?: string
          sequence?: number
          success_message?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string
          id: string
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      offerings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata_config: Json
          prices: Json
          slug: string
          title: string
          type: Database["public"]["Enums"]["offering_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata_config?: Json
          prices?: Json
          slug: string
          title: string
          type: Database["public"]["Enums"]["offering_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata_config?: Json
          prices?: Json
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["offering_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accumulated_xp: number
          address: string | null
          age_group: Database["public"]["Enums"]["user_age_group"] | null
          assessment: Json | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          commitment: Json | null
          country: string | null
          created_at: string
          currency: string | null
          fullname: string | null
          gender: string | null
          highest_education_level:
            | Database["public"]["Enums"]["education_level"]
            | null
          id: string
          integrations: Json | null
          mentor_profile: Json | null
          motivations: Json | null
          onboarding_step: string | null
          provider_metadata: Json | null
          roadblocks: Json | null
          roles: Database["public"]["Enums"]["user_role"][]
          skills: Json | null
          social_footprint: Json | null
          status: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          accumulated_xp?: number
          address?: string | null
          age_group?: Database["public"]["Enums"]["user_age_group"] | null
          assessment?: Json | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commitment?: Json | null
          country?: string | null
          created_at?: string
          currency?: string | null
          fullname?: string | null
          gender?: string | null
          highest_education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          id: string
          integrations?: Json | null
          mentor_profile?: Json | null
          motivations?: Json | null
          onboarding_step?: string | null
          provider_metadata?: Json | null
          roadblocks?: Json | null
          roles?: Database["public"]["Enums"]["user_role"][]
          skills?: Json | null
          social_footprint?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          accumulated_xp?: number
          address?: string | null
          age_group?: Database["public"]["Enums"]["user_age_group"] | null
          assessment?: Json | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commitment?: Json | null
          country?: string | null
          created_at?: string
          currency?: string | null
          fullname?: string | null
          gender?: string | null
          highest_education_level?:
            | Database["public"]["Enums"]["education_level"]
            | null
          id?: string
          integrations?: Json | null
          mentor_profile?: Json | null
          motivations?: Json | null
          onboarding_step?: string | null
          provider_metadata?: Json | null
          roadblocks?: Json | null
          roles?: Database["public"]["Enums"]["user_role"][]
          skills?: Json | null
          social_footprint?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          biz_name: string | null
          build_data: Json
          competitive_landscape: Json
          compliance_checklist: Json
          created_at: string
          current_mission: string
          discovery_metrics: Json
          financial_blueprint: Json
          five_word_hook: string | null
          id: string
          infrastructure_nodes: Json
          is_active: boolean
          launch_data: Json
          operations_data: Json
          review_data: Json
          solution_design: Json
          status: string
          tagline: string | null
          updated_at: string
          user_id: string
          validation_data: Json
          viability_check: Json
        }
        Insert: {
          biz_name?: string | null
          build_data?: Json
          competitive_landscape?: Json
          compliance_checklist?: Json
          created_at?: string
          current_mission?: string
          discovery_metrics?: Json
          financial_blueprint?: Json
          five_word_hook?: string | null
          id?: string
          infrastructure_nodes?: Json
          is_active?: boolean
          launch_data?: Json
          operations_data?: Json
          review_data?: Json
          solution_design?: Json
          status?: string
          tagline?: string | null
          updated_at?: string
          user_id?: string
          validation_data?: Json
          viability_check?: Json
        }
        Update: {
          biz_name?: string | null
          build_data?: Json
          competitive_landscape?: Json
          compliance_checklist?: Json
          created_at?: string
          current_mission?: string
          discovery_metrics?: Json
          financial_blueprint?: Json
          five_word_hook?: string | null
          id?: string
          infrastructure_nodes?: Json
          is_active?: boolean
          launch_data?: Json
          operations_data?: Json
          review_data?: Json
          solution_design?: Json
          status?: string
          tagline?: string | null
          updated_at?: string
          user_id?: string
          validation_data?: Json
          viability_check?: Json
        }
        Relationships: []
      }
      quests: {
        Row: {
          badge_config: Json | null
          content: string | null
          content_path: string
          context: Json | null
          created_at: string
          estimated_in_app_minutes: number
          estimated_off_app_minutes: number
          id: string
          mission_id: string
          notes: Json | null
          sequence: number
          success_message: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          badge_config?: Json | null
          content?: string | null
          content_path: string
          context?: Json | null
          created_at?: string
          estimated_in_app_minutes?: number
          estimated_off_app_minutes?: number
          id: string
          mission_id: string
          notes?: Json | null
          sequence: number
          success_message: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          badge_config?: Json | null
          content?: string | null
          content_path?: string
          context?: Json | null
          created_at?: string
          estimated_in_app_minutes?: number
          estimated_off_app_minutes?: number
          id?: string
          mission_id?: string
          notes?: Json | null
          sequence?: number
          success_message?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quests_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          ai_config: Json | null
          briefing_text: string
          challenges: Json | null
          checkback_delay_days: number | null
          component_key: string
          created_at: string
          dependencies: string[] | null
          estimated_minutes: number
          execution_environment: string | null
          execution_type: Database["public"]["Enums"]["execution_type"]
          grant_points: number
          id: string
          interval: number | null
          metadata: Json | null
          mission_id: string
          observation_context: Json | null
          quest_id: string
          recurring: boolean | null
          reflection_prompt: string | null
          resources: Json | null
          sequence: number
          target_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_config?: Json | null
          briefing_text: string
          challenges?: Json | null
          checkback_delay_days?: number | null
          component_key: string
          created_at?: string
          dependencies?: string[] | null
          estimated_minutes?: number
          execution_environment?: string | null
          execution_type: Database["public"]["Enums"]["execution_type"]
          grant_points?: number
          id: string
          interval?: number | null
          metadata?: Json | null
          mission_id: string
          observation_context?: Json | null
          quest_id: string
          recurring?: boolean | null
          reflection_prompt?: string | null
          resources?: Json | null
          sequence: number
          target_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_config?: Json | null
          briefing_text?: string
          challenges?: Json | null
          checkback_delay_days?: number | null
          component_key?: string
          created_at?: string
          dependencies?: string[] | null
          estimated_minutes?: number
          execution_environment?: string | null
          execution_type?: Database["public"]["Enums"]["execution_type"]
          grant_points?: number
          id?: string
          interval?: number | null
          metadata?: Json | null
          mission_id?: string
          observation_context?: Json | null
          quest_id?: string
          recurring?: boolean | null
          reflection_prompt?: string | null
          resources?: Json | null
          sequence?: number
          target_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount_paid: number
          created_at: string
          currency: string
          discount_id: string | null
          id: string
          offering_id: string
          provider: string
          provider_order_id: string
          provider_payment_id: string | null
          raw_webhook_payload: Json
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string
          currency?: string
          discount_id?: string | null
          id?: string
          offering_id: string
          provider: string
          provider_order_id: string
          provider_payment_id?: string | null
          raw_webhook_payload?: Json
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string
          currency?: string
          discount_id?: string | null
          id?: string
          offering_id?: string
          provider?: string
          provider_order_id?: string
          provider_payment_id?: string | null
          raw_webhook_payload?: Json
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_discount"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_offering"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accomplishments: {
        Row: {
          awarded_for: string
          badge_granted: string | null
          created_at: string
          description: string | null
          id: string
          points_granted: number
          related_reference_id: string | null
          related_table: string | null
          title: string
          user_id: string
        }
        Insert: {
          awarded_for: string
          badge_granted?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points_granted?: number
          related_reference_id?: string | null
          related_table?: string | null
          title: string
          user_id: string
        }
        Update: {
          awarded_for?: string
          badge_granted?: string | null
          created_at?: string
          description?: string | null
          id?: string
          points_granted?: number
          related_reference_id?: string | null
          related_table?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_accomplishments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["user_action_type"]
          checkback_delay_days: number
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          status: Database["public"]["Enums"]["user_action_status"]
          task_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["user_action_type"]
          checkback_delay_days?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["user_action_status"]
          task_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["user_action_type"]
          checkback_delay_days?: number
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["user_action_status"]
          task_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_actions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_contacts: {
        Row: {
          categories: Database["public"]["Enums"]["user_contact_category"][]
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          instagram_username: string | null
          job_title: string | null
          last_contacted_at: string | null
          last_name: string | null
          linkedin_url: string | null
          metadata: Json | null
          next_follow_up_at: string | null
          note: string | null
          notes: string[] | null
          opted_in_newsletter: boolean | null
          phone: string | null
          project_id: string | null
          source: Database["public"]["Enums"]["user_contact_source"]
          stage: Database["public"]["Enums"]["user_contact_stage"] | null
          status: Database["public"]["Enums"]["user_contact_status"]
          twitter_handle: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          categories?: Database["public"]["Enums"]["user_contact_category"][]
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          instagram_username?: string | null
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          metadata?: Json | null
          next_follow_up_at?: string | null
          note?: string | null
          notes?: string[] | null
          opted_in_newsletter?: boolean | null
          phone?: string | null
          project_id?: string | null
          source?: Database["public"]["Enums"]["user_contact_source"]
          stage?: Database["public"]["Enums"]["user_contact_stage"] | null
          status?: Database["public"]["Enums"]["user_contact_status"]
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          categories?: Database["public"]["Enums"]["user_contact_category"][]
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          instagram_username?: string | null
          job_title?: string | null
          last_contacted_at?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          metadata?: Json | null
          next_follow_up_at?: string | null
          note?: string | null
          notes?: string[] | null
          opted_in_newsletter?: boolean | null
          phone?: string | null
          project_id?: string | null
          source?: Database["public"]["Enums"]["user_contact_source"]
          stage?: Database["public"]["Enums"]["user_contact_stage"] | null
          status?: Database["public"]["Enums"]["user_contact_status"]
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_contacts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_observations: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          notes: string | null
          task_id: string | null
          updated_at: string | null
          user_id: string
          what: string
          when_context: string
          where_location: string
          who: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          task_id?: string | null
          updated_at?: string | null
          user_id: string
          what: string
          when_context: string
          where_location: string
          who: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          task_id?: string | null
          updated_at?: string | null
          user_id?: string
          what?: string
          when_context?: string
          where_location?: string
          who?: string
        }
        Relationships: []
      }
      user_opportunities: {
        Row: {
          capture_metadata: Json | null
          created_at: string | null
          description: string
          id: string
          pain_score_grade: number | null
          project_id: string | null
          scores: Json | null
          source_type: Database["public"]["Enums"]["opportunity_source_type"]
          status: Database["public"]["Enums"]["opportunity_status"]
          task_id: string | null
          title: string
          updated_at: string | null
          user_id: string
          validated_at: string | null
          validation_interviews: Json | null
        }
        Insert: {
          capture_metadata?: Json | null
          created_at?: string | null
          description: string
          id?: string
          pain_score_grade?: number | null
          project_id?: string | null
          scores?: Json | null
          source_type?: Database["public"]["Enums"]["opportunity_source_type"]
          status?: Database["public"]["Enums"]["opportunity_status"]
          task_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          validated_at?: string | null
          validation_interviews?: Json | null
        }
        Update: {
          capture_metadata?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          pain_score_grade?: number | null
          project_id?: string | null
          scores?: Json | null
          source_type?: Database["public"]["Enums"]["opportunity_source_type"]
          status?: Database["public"]["Enums"]["opportunity_status"]
          task_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          validated_at?: string | null
          validation_interviews?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_posts: {
        Row: {
          category: Database["public"]["Enums"]["post_category"]
          content: string
          created_at: string
          downvote_count: number
          feedback: Json
          flag_count: number
          id: string
          is_published: boolean
          project_id: string | null
          slug: string
          title: string
          updated_at: string
          upvote_count: number
          user_id: string
          xp_awarded: boolean
        }
        Insert: {
          category: Database["public"]["Enums"]["post_category"]
          content: string
          created_at?: string
          downvote_count?: number
          feedback?: Json
          flag_count?: number
          id?: string
          is_published?: boolean
          project_id?: string | null
          slug: string
          title: string
          updated_at?: string
          upvote_count?: number
          user_id?: string
          xp_awarded?: boolean
        }
        Update: {
          category?: Database["public"]["Enums"]["post_category"]
          content?: string
          created_at?: string
          downvote_count?: number
          feedback?: Json
          flag_count?: number
          id?: string
          is_published?: boolean
          project_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
          upvote_count?: number
          user_id?: string
          xp_awarded?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          item_type: Database["public"]["Enums"]["program_item_type"]
          mission_id: string | null
          project_id: string | null
          quest_id: string | null
          reflections: Json
          saved_payload: Json
          status: Database["public"]["Enums"]["progress_status"]
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          item_type: Database["public"]["Enums"]["program_item_type"]
          mission_id?: string | null
          project_id?: string | null
          quest_id?: string | null
          reflections?: Json
          saved_payload?: Json
          status?: Database["public"]["Enums"]["progress_status"]
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          item_type?: Database["public"]["Enums"]["program_item_type"]
          mission_id?: string | null
          project_id?: string | null
          quest_id?: string | null
          reflections?: Json
          saved_payload?: Json
          status?: Database["public"]["Enums"]["progress_status"]
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          biz_name: string | null
          build_data: Json | null
          competitive_landscape: Json | null
          compliance_checklist: Json | null
          created_at: string | null
          current_mission: string | null
          discovery_metrics: Json | null
          financial_blueprint: Json | null
          five_word_hook: string | null
          id: string
          infrastructure_nodes: Json | null
          is_active: boolean | null
          launch_data: Json | null
          operations_data: Json | null
          opportunity_id: string | null
          review_data: Json | null
          solution_design: Json | null
          status: string | null
          tagline: string | null
          updated_at: string | null
          user_id: string
          validation_data: Json | null
          viability_check: Json | null
        }
        Insert: {
          biz_name?: string | null
          build_data?: Json | null
          competitive_landscape?: Json | null
          compliance_checklist?: Json | null
          created_at?: string | null
          current_mission?: string | null
          discovery_metrics?: Json | null
          financial_blueprint?: Json | null
          five_word_hook?: string | null
          id?: string
          infrastructure_nodes?: Json | null
          is_active?: boolean | null
          launch_data?: Json | null
          operations_data?: Json | null
          opportunity_id?: string | null
          review_data?: Json | null
          solution_design?: Json | null
          status?: string | null
          tagline?: string | null
          updated_at?: string | null
          user_id: string
          validation_data?: Json | null
          viability_check?: Json | null
        }
        Update: {
          biz_name?: string | null
          build_data?: Json | null
          competitive_landscape?: Json | null
          compliance_checklist?: Json | null
          created_at?: string | null
          current_mission?: string | null
          discovery_metrics?: Json | null
          financial_blueprint?: Json | null
          five_word_hook?: string | null
          id?: string
          infrastructure_nodes?: Json | null
          is_active?: boolean | null
          launch_data?: Json | null
          operations_data?: Json | null
          opportunity_id?: string | null
          review_data?: Json | null
          solution_design?: Json | null
          status?: string | null
          tagline?: string | null
          updated_at?: string | null
          user_id?: string
          validation_data?: Json | null
          viability_check?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "user_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_questions: {
        Row: {
          admin_answer: string | null
          ai_answer: string | null
          created_at: string | null
          flagged_for_admin: boolean | null
          id: string
          item_id: string
          item_type: string
          question: string
          status: Database["public"]["Enums"]["question_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_answer?: string | null
          ai_answer?: string | null
          created_at?: string | null
          flagged_for_admin?: boolean | null
          id?: string
          item_id: string
          item_type: string
          question: string
          status?: Database["public"]["Enums"]["question_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_answer?: string | null
          ai_answer?: string | null
          created_at?: string | null
          flagged_for_admin?: boolean | null
          id?: string
          item_id?: string
          item_type?: string
          question?: string
          status?: Database["public"]["Enums"]["question_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_program_access: { Args: { p_user_id: string }; Returns: boolean }
    }
    Enums: {
      accomplishment_type:
        | "program_milestone"
        | "contribution"
        | "engagement"
        | "launch_tier"
      discount_type: "percentage" | "fixed_amount"
      education_level:
        | "high_school"
        | "undergraduate_degree"
        | "postgraduate_degree"
        | "self_taught"
      education_tier:
        | "high_school"
        | "undergraduate_degree"
        | "postgraduate_degree"
        | "self_taught"
      event_format: "virtual" | "irl"
      event_type:
        | "pitch"
        | "standup"
        | "mentor_session"
        | "launch"
        | "networking"
        | "program_based"
      execution_type:
        | "standard-form"
        | "simulator"
        | "off-task-action"
        | "observation-form"
        | "dashboard-view"
        | "log_counter"
        | "decision_gate"
      flag_reason:
        | "broken_link"
        | "misleading_offer"
        | "spam_or_abuse"
        | "expired_perk"
        | "failed_to_deliver"
      launch_status: "draft" | "live" | "archived"
      lead_source:
        | "manual_outbound"
        | "linkedin"
        | "instagram"
        | "website_form"
        | "referral"
        | "other"
      marketplace_listing_type: "peer_service" | "provider_perk"
      marketplace_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "rejected"
        | "expired"
      note_type: "requirement" | "warning" | "guide" | "nudge"
      offering_type:
        | "program"
        | "membership"
        | "merch"
        | "digital_asset"
        | "service"
      opportunity_source_type:
        | "personal_problems"
        | "skills"
        | "zone_of_influence"
        | "broader_search"
      opportunity_status:
        | "raw_seed"
        | "validated"
        | "committed"
        | "archived"
        | "scored"
      plan_status: "scheduled" | "completed" | "missed" | "cancelled"
      post_category:
        | "build_journal"
        | "marketing_win"
        | "traction_milestone"
        | "ask_for_help"
        | "resource_share"
        | "project_launch"
        | "introduction"
      program_item_type: "mission" | "quest" | "task"
      progress_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "repeat"
        | "blocked"
      question_status:
        | "pending"
        | "answered_by_ai"
        | "flagged_for_admin"
        | "resolved_by_admin"
      recommendation_type:
        | "blog"
        | "internal_link"
        | "youtube"
        | "podcast"
        | "book"
        | "challenge"
        | "download"
      recurrence_interval: "daily" | "weekly" | "monthly" | "quarterly"
      reference_type:
        | "insights"
        | "guide"
        | "tools"
        | "youtube"
        | "podcast"
        | "book"
        | "other"
      task_execution_type:
        | "form"
        | "simulator"
        | "log_counter"
        | "action"
        | "community"
        | "observation"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      user_action_status: "pending" | "in_progress" | "completed" | "dismissed"
      user_action_type: "program" | "general" | "system"
      user_age_group:
        | "under_18"
        | "18_24"
        | "25_34"
        | "35_44"
        | "45_54"
        | "55_plus"
      user_contact_category:
        | "squad"
        | "partner"
        | "tester"
        | "presales"
        | "customer"
      user_contact_source:
        | "personal_network"
        | "social_media"
        | "website_form"
        | "referral"
        | "outbound"
        | "customer_interview"
        | "partnership_outreach"
        | "urge_community"
        | "other"
      user_contact_stage:
        | "lead"
        | "engaged"
        | "pre_sale"
        | "customer"
        | "advocate"
        | "cold"
        | "nurturing"
      user_contact_status: "active" | "inactive" | "lost" | "unconfirmed"
      user_role:
        | "trial"
        | "member"
        | "mentor"
        | "superadmin"
        | "admin_marketing"
        | "admin_accounts"
        | "squad"
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
      accomplishment_type: [
        "program_milestone",
        "contribution",
        "engagement",
        "launch_tier",
      ],
      discount_type: ["percentage", "fixed_amount"],
      education_level: [
        "high_school",
        "undergraduate_degree",
        "postgraduate_degree",
        "self_taught",
      ],
      education_tier: [
        "high_school",
        "undergraduate_degree",
        "postgraduate_degree",
        "self_taught",
      ],
      event_format: ["virtual", "irl"],
      event_type: [
        "pitch",
        "standup",
        "mentor_session",
        "launch",
        "networking",
        "program_based",
      ],
      execution_type: [
        "standard-form",
        "simulator",
        "off-task-action",
        "observation-form",
        "dashboard-view",
        "log_counter",
        "decision_gate",
      ],
      flag_reason: [
        "broken_link",
        "misleading_offer",
        "spam_or_abuse",
        "expired_perk",
        "failed_to_deliver",
      ],
      launch_status: ["draft", "live", "archived"],
      lead_source: [
        "manual_outbound",
        "linkedin",
        "instagram",
        "website_form",
        "referral",
        "other",
      ],
      marketplace_listing_type: ["peer_service", "provider_perk"],
      marketplace_status: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "expired",
      ],
      note_type: ["requirement", "warning", "guide", "nudge"],
      offering_type: [
        "program",
        "membership",
        "merch",
        "digital_asset",
        "service",
      ],
      opportunity_source_type: [
        "personal_problems",
        "skills",
        "zone_of_influence",
        "broader_search",
      ],
      opportunity_status: [
        "raw_seed",
        "validated",
        "committed",
        "archived",
        "scored",
      ],
      plan_status: ["scheduled", "completed", "missed", "cancelled"],
      post_category: [
        "build_journal",
        "marketing_win",
        "traction_milestone",
        "ask_for_help",
        "resource_share",
        "project_launch",
        "introduction",
      ],
      program_item_type: ["mission", "quest", "task"],
      progress_status: [
        "not_started",
        "in_progress",
        "completed",
        "repeat",
        "blocked",
      ],
      question_status: [
        "pending",
        "answered_by_ai",
        "flagged_for_admin",
        "resolved_by_admin",
      ],
      recommendation_type: [
        "blog",
        "internal_link",
        "youtube",
        "podcast",
        "book",
        "challenge",
        "download",
      ],
      recurrence_interval: ["daily", "weekly", "monthly", "quarterly"],
      reference_type: [
        "insights",
        "guide",
        "tools",
        "youtube",
        "podcast",
        "book",
        "other",
      ],
      task_execution_type: [
        "form",
        "simulator",
        "log_counter",
        "action",
        "community",
        "observation",
      ],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      user_action_status: ["pending", "in_progress", "completed", "dismissed"],
      user_action_type: ["program", "general", "system"],
      user_age_group: [
        "under_18",
        "18_24",
        "25_34",
        "35_44",
        "45_54",
        "55_plus",
      ],
      user_contact_category: [
        "squad",
        "partner",
        "tester",
        "presales",
        "customer",
      ],
      user_contact_source: [
        "personal_network",
        "social_media",
        "website_form",
        "referral",
        "outbound",
        "customer_interview",
        "partnership_outreach",
        "urge_community",
        "other",
      ],
      user_contact_stage: [
        "lead",
        "engaged",
        "pre_sale",
        "customer",
        "advocate",
        "cold",
        "nurturing",
      ],
      user_contact_status: ["active", "inactive", "lost", "unconfirmed"],
      user_role: [
        "trial",
        "member",
        "mentor",
        "superadmin",
        "admin_marketing",
        "admin_accounts",
        "squad",
      ],
    },
  },
} as const
