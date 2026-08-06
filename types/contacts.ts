// types/contacts.ts
import { Database } from './supabase';
import { z } from 'zod';

export type UserContactRow = Database['public']['Tables']['user_contacts']['Row'];
export type UserContactInsert = Database['public']['Tables']['user_contacts']['Insert'];

export const CreateSquadContactSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  note: z.string().optional(),
});

export const BulkSquadContactsSchema = z.object({
  contacts: z.array(CreateSquadContactSchema).min(1, 'Please add at least one contact'),
});