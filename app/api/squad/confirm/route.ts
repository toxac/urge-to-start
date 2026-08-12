// app/api/squad/confirm/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET Handler for confirming squad contacts via magic link or URL query params
 * Example usage: GET /api/squad/confirm?token=<contact_id_or_token>
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id') || searchParams.get('token');

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: 'Missing contact ID or token' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update the squad contact status to confirmed
    const { data, error } = await supabase
      .from('user_contacts')
      .update({ status: 'active' })
      .eq('id', contactId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Contact not found or invalid token' },
        { status: 404 }
      );
    }

    // Redirect to a success page or return JSON confirmation
    return NextResponse.json({
      success: true,
      message: 'Squad contact confirmed successfully',
      data
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST Handler for confirming squad contacts via direct API invocation
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactId } = body;

    if (!contactId) {
      return NextResponse.json(
        { success: false, error: 'Missing contactId in request body' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_contacts')
      .update({ status: 'active' })
      .eq('id', contactId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to update squad contact' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to confirm squad contact' },
      { status: 500 }
    );
  }
}