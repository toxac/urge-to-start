# Payments

Lets figure out payments before we implement it for onboarding step.

## Payments and Offerings

Payments are connected transactions table which in turn references

    - discounts

    - offering - this is where everything we sells is listed: program enrollement, network memebership, merch, events tickets etc. 



## Tables

Transactions

```ts
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
```

Offerings

```ts
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
```

Discounts

```ts
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
```

## Scenarios

### Onboarding

1. Free Trial: Payment in context to onboarding is purely linked to program enrollments. but, we have to consider Free user. what if we want to offer first mission available for free for registered user to try?
   
   1. Users can start signup either through enroll/start or try
   
   2. Payment page should be aware of what was the signup context

2. Program+network subscription: to begin with we are not offering network subscription by itself but it will be a offering in future. but for user who signup for program will get first year of network membership free. 
   
   1. We will have to create two entries in transactions one for program and other for network.
   
   2. We might have to have a table to manage network membership (start date, expiry date and other data). 
   
   3. we will also have to add roles in profile

### Other Payments

We will have to implement a stand alone page for rest of the payment 





What do you think of these? 
