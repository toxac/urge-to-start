// actions/avatar.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadAvatar(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return { success: false, error: 'Unauthorized user session.' };
    }

    // 2. Validate file input
    const file = formData.get('avatarFile') as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: 'No file selected for upload.' };
    }

    // Restrict file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 5MB limit.' };
    }

    // 3. Prepare storage file path conforming to RLS: {user_id}/{timestamp}-{filename}
    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // 4. Upload file to 'avatars' storage bucket
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadErr) {
      return { success: false, error: `Upload failed: ${uploadErr.message}` };
    }

    // 5. Retrieve Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 6. Update profile database record
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileErr) {
      return { success: false, error: `Database sync failed: ${profileErr.message}` };
    }

    revalidatePath('/setup');
    return { success: true, url: publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Server exception during image upload.' };
  }
}