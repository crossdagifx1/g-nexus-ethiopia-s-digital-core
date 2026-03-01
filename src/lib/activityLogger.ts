import { supabase } from '@/integrations/supabase/client';

export const logActivity = async (
  action: string,
  targetType: string,
  targetId?: string,
  details?: Record<string, unknown>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    await supabase.from('activity_log').insert([{
      user_id: user.id,
      user_email: user.email || null,
      action,
      target_type: targetType,
      target_id: targetId || null,
      details: (details as any) || null,
    }]);
  } catch (error) {
    console.error('Activity log error:', error);
  }
};
