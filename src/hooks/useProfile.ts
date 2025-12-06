import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().nullable(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional().nullable(),
  education_level: z.string().max(100).optional().nullable(),
  field_of_study: z.string().max(100).optional().nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  education_level: string | null;
  field_of_study: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data as Profile | null;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: ProfileFormData) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Validate the data
      const validatedData = profileSchema.parse(profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: validatedData.full_name,
          bio: validatedData.bio || null,
          location: validatedData.location || null,
          education_level: validatedData.education_level || null,
          field_of_study: validatedData.field_of_study || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error('Failed to update profile');
      }
    },
  });
};
