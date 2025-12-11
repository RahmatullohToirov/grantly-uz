import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateMatchScore } from "./useDashboardData";
import { useToast } from "@/hooks/use-toast";

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
  matchScore: number;
  isSaved: boolean;
  isApplied: boolean;
  // Extended fields for matching
  eligible_genders?: string[] | null;
  min_age?: number | null;
  max_age?: number | null;
  eligible_nationalities?: string[] | null;
  eligible_countries?: string[] | null;
  min_gpa?: number | null;
  eligible_education_levels?: string[] | null;
  eligible_fields?: string[] | null;
  financial_need_required?: boolean | null;
}

export const useScholarships = (searchQuery?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['scholarships', user?.id, searchQuery],
    queryFn: async (): Promise<Scholarship[]> => {
      // Get user profile for matching
      let profile = null;
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('field_of_study, location, education_level')
          .eq('id', user.id)
          .single();
        profile = data;
      }

      // Get user's saved scholarships
      let savedIds: string[] = [];
      let appliedIds: string[] = [];
      
      if (user) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('scholarship_id')
          .eq('user_id', user.id);
        savedIds = favorites?.map(f => f.scholarship_id) || [];

        const { data: applications } = await supabase
          .from('user_applications')
          .select('scholarship_id')
          .eq('user_id', user.id);
        appliedIds = applications?.map(a => a.scholarship_id) || [];
      }

      // Build query
      let query = supabase
        .from('scholarships')
        .select('*')
        .order('deadline', { ascending: true });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`);
      }

      const { data: scholarships, error } = await query;

      if (error) throw error;

      return (scholarships || []).map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        amount: s.amount,
        deadline: s.deadline,
        location: s.location,
        category: s.category,
        link: s.link,
        requirements: s.requirements,
        source_name: s.source_name,
        matchScore: calculateMatchScore(profile, s),
        isSaved: savedIds.includes(s.id),
        isApplied: appliedIds.includes(s.id),
        eligible_genders: s.eligible_genders,
        min_age: s.min_age,
        max_age: s.max_age,
        eligible_nationalities: s.eligible_nationalities,
        eligible_countries: s.eligible_countries,
        min_gpa: s.min_gpa,
        eligible_education_levels: s.eligible_education_levels,
        eligible_fields: s.eligible_fields,
        financial_need_required: s.financial_need_required,
      }));
    }
  });
};

export const useSavedScholarships = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['saved-scholarships', user?.id],
    queryFn: async (): Promise<Scholarship[]> => {
      if (!user) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('field_of_study, location, education_level')
        .eq('id', user.id)
        .single();

      const { data: favorites, error } = await supabase
        .from('user_favorites')
        .select(`
          scholarship_id,
          scholarships (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return (favorites || []).map(f => {
        const s = f.scholarships as unknown as {
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
        };

        return {
          id: s.id,
          title: s.title,
          description: s.description,
          amount: s.amount,
          deadline: s.deadline,
          location: s.location,
          category: s.category,
          link: s.link,
          requirements: s.requirements,
          source_name: s.source_name,
          matchScore: calculateMatchScore(profile, s),
          isSaved: true,
          isApplied: false
        };
      });
    },
    enabled: !!user
  });
};

export const useToggleSaveScholarship = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ scholarshipId, isSaved }: { scholarshipId: string; isSaved: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      if (isSaved) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('scholarship_id', scholarshipId);
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            scholarship_id: scholarshipId
          });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isSaved }) => {
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['saved-scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations'] });
      
      toast({
        title: isSaved ? "Removed from saved" : "Saved!",
        description: isSaved ? "Scholarship removed from your saved list" : "Scholarship added to your saved list"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useAddApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ scholarshipId, status = 'Applied' }: { scholarshipId: string; status?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_applications')
        .insert({
          user_id: user.id,
          scholarship_id: scholarshipId,
          status
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['tracked-scholarships'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast({
        title: "Added to tracker!",
        description: "Scholarship added to your application tracker"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });
};
