import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  deadline: string | null;
  location: string | null;
  category: string | null;
  link: string | null;
  requirements: string | null;
  source_name: string | null;
  source_url: string | null;
  created_at: string | null;
}

export interface ScholarshipInput {
  title: string;
  description?: string;
  amount?: number;
  deadline?: string;
  location?: string;
  category?: string;
  link?: string;
  requirements?: string;
  source_name?: string;
  source_url?: string;
}

export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data === true;
    },
    enabled: !!user?.id,
  });
};

export const useAdminScholarships = () => {
  return useQuery({
    queryKey: ['admin-scholarships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Scholarship[];
    },
  });
};

export const useCreateScholarship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (scholarship: ScholarshipInput) => {
      const { data, error } = await supabase
        .from('scholarships')
        .insert([scholarship])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
      toast.success('Scholarship created successfully');
    },
    onError: (error) => {
      console.error('Error creating scholarship:', error);
      toast.error('Failed to create scholarship');
    },
  });
};

export const useUpdateScholarship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...scholarship }: ScholarshipInput & { id: string }) => {
      const { data, error } = await supabase
        .from('scholarships')
        .update(scholarship)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
      toast.success('Scholarship updated successfully');
    },
    onError: (error) => {
      console.error('Error updating scholarship:', error);
      toast.error('Failed to update scholarship');
    },
  });
};

export const useDeleteScholarship = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
      toast.success('Scholarship deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting scholarship:', error);
      toast.error('Failed to delete scholarship');
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'moderator' | 'user' }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role assigned successfully');
    },
    onError: (error) => {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    },
  });
};

export const useRemoveRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error) => {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    },
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [scholarshipsRes, usersRes, applicationsRes] = await Promise.all([
        supabase.from('scholarships').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('user_applications').select('id', { count: 'exact' }),
      ]);
      
      return {
        totalScholarships: scholarshipsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalApplications: applicationsRes.count || 0,
      };
    },
  });
};
