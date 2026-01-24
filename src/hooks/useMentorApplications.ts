import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface MentorApplication {
  id: string;
  user_id: string;
  has_experience: boolean;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    education_level: string | null;
    field_of_study: string | null;
  };
}

export interface MentorApplicationInput {
  has_experience: boolean;
  motivation: string;
}

// Hook to fetch user's own mentor application
export const useMyMentorApplication = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-mentor-application', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as MentorApplication | null;
    },
    enabled: !!user,
  });
};

// Hook to submit mentor application
export const useSubmitMentorApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: MentorApplicationInput) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('mentor_applications')
        .insert({
          user_id: user.id,
          has_experience: input.has_experience,
          motivation: input.motivation,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-mentor-application'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    },
  });
};

// Admin hooks
export const useAdminMentorApplications = () => {
  return useQuery({
    queryKey: ['admin-mentor-applications'],
    queryFn: async () => {
      // First get applications
      const { data: applications, error: appError } = await supabase
        .from('mentor_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (appError) throw appError;
      if (!applications || applications.length === 0) return [];

      // Get all unique user IDs
      const userIds = [...new Set(applications.map(app => app.user_id))];
      
      // Fetch profiles for those users
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, education_level, field_of_study')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Map profiles to applications
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return applications.map(app => ({
        ...app,
        profile: profileMap.get(app.user_id) || null,
      })) as MentorApplication[];
    },
  });
};

export const useUpdateMentorApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const { data, error } = await supabase
        .from('mentor_applications')
        .update({ status, admin_notes })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-mentor-applications'] });
      toast.success('Application status updated');
    },
    onError: (error) => {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    },
  });
};

export const useDeleteMentorApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mentor_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-mentor-applications'] });
      toast.success('Application deleted');
    },
    onError: (error) => {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    },
  });
};
