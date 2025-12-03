import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardStats {
  saved: number;
  inProgress: number;
  accepted: number;
  rejected: number;
  successRate: number;
}

export interface TrackedScholarship {
  id: string;
  scholarship_id: string;
  title: string;
  deadline: string | null;
  amount: number | null;
  status: string;
  matchScore: number;
  notes: string | null;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  matchScore: number;
}

// Simple AI matching algorithm
export const calculateMatchScore = (
  userProfile: { field_of_study?: string | null; location?: string | null; education_level?: string | null } | null,
  scholarship: { category?: string | null; location?: string | null; description?: string | null }
): number => {
  if (!userProfile) return Math.floor(Math.random() * 20) + 70; // Default 70-90 if no profile

  let score = 50; // Base score

  // Interest/Category match (40%)
  if (userProfile.field_of_study && scholarship.category) {
    const fieldLower = userProfile.field_of_study.toLowerCase();
    const categoryLower = scholarship.category.toLowerCase();
    if (fieldLower.includes(categoryLower) || categoryLower.includes(fieldLower)) {
      score += 40;
    } else {
      score += 20; // Partial match
    }
  } else {
    score += 25; // No data, assume moderate match
  }

  // Location match (20%)
  if (userProfile.location && scholarship.location) {
    const userLocation = userProfile.location.toLowerCase();
    const scholarshipLocation = scholarship.location.toLowerCase();
    if (userLocation === scholarshipLocation || scholarshipLocation.includes(userLocation)) {
      score += 20;
    } else {
      score += 10;
    }
  } else {
    score += 10;
  }

  // Eligibility/Education level match (40% - simplified)
  if (scholarship.description) {
    const desc = scholarship.description.toLowerCase();
    const level = userProfile.education_level?.toLowerCase() || '';
    
    if (
      (level.includes('bachelor') && (desc.includes('undergraduate') || desc.includes('bachelor'))) ||
      (level.includes('master') && (desc.includes('graduate') || desc.includes('master') || desc.includes('postgraduate'))) ||
      (level.includes('phd') && (desc.includes('doctoral') || desc.includes('phd') || desc.includes('research')))
    ) {
      score += 20;
    } else {
      score += 10;
    }
  } else {
    score += 15;
  }

  return Math.min(Math.max(score, 0), 100);
};

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user) return { saved: 0, inProgress: 0, accepted: 0, rejected: 0, successRate: 0 };

      // Get saved scholarships count
      const { count: savedCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get applications by status
      const { data: applications } = await supabase
        .from('user_applications')
        .select('status')
        .eq('user_id', user.id);

      const inProgress = applications?.filter(a => 
        a.status === 'Applied' || a.status === 'in_progress' || a.status === 'In Progress'
      ).length || 0;
      
      const accepted = applications?.filter(a => 
        a.status === 'accepted' || a.status === 'Accepted'
      ).length || 0;
      
      const rejected = applications?.filter(a => 
        a.status === 'rejected' || a.status === 'Rejected'
      ).length || 0;

      const totalDecided = accepted + rejected;
      const successRate = totalDecided > 0 ? Math.round((accepted / totalDecided) * 100) : 0;

      return {
        saved: savedCount || 0,
        inProgress,
        accepted,
        rejected,
        successRate
      };
    },
    enabled: !!user
  });
};

export const useTrackedScholarships = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tracked-scholarships', user?.id],
    queryFn: async (): Promise<TrackedScholarship[]> => {
      if (!user) return [];

      // Get user profile for matching
      const { data: profile } = await supabase
        .from('profiles')
        .select('field_of_study, location, education_level')
        .eq('id', user.id)
        .single();

      // Get applications with scholarship details
      const { data: applications } = await supabase
        .from('user_applications')
        .select(`
          id,
          scholarship_id,
          status,
          notes,
          scholarships (
            title,
            deadline,
            amount,
            category,
            location,
            description
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      if (!applications) return [];

      return applications.map(app => {
        const scholarship = app.scholarships as unknown as {
          title: string;
          deadline: string | null;
          amount: number | null;
          category: string | null;
          location: string | null;
          description: string | null;
        };

        return {
          id: app.id,
          scholarship_id: app.scholarship_id,
          title: scholarship?.title || 'Unknown Scholarship',
          deadline: scholarship?.deadline,
          amount: scholarship?.amount,
          status: app.status || 'Applied',
          matchScore: calculateMatchScore(profile, scholarship || {}),
          notes: app.notes
        };
      });
    },
    enabled: !!user
  });
};

export const useAIRecommendations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-recommendations', user?.id],
    queryFn: async (): Promise<AIRecommendation[]> => {
      if (!user) return [];

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('field_of_study, location, education_level')
        .eq('id', user.id)
        .single();

      // Get user's saved/applied scholarship IDs to exclude
      const { data: favorites } = await supabase
        .from('user_favorites')
        .select('scholarship_id')
        .eq('user_id', user.id);

      const { data: applications } = await supabase
        .from('user_applications')
        .select('scholarship_id')
        .eq('user_id', user.id);

      const excludeIds = [
        ...(favorites?.map(f => f.scholarship_id) || []),
        ...(applications?.map(a => a.scholarship_id) || [])
      ];

      // Get scholarships not already saved/applied
      let query = supabase
        .from('scholarships')
        .select('id, title, description, location, category')
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: scholarships } = await query;

      if (!scholarships) return [];

      // Filter out already saved/applied and calculate match scores
      const filtered = scholarships
        .filter(s => !excludeIds.includes(s.id))
        .map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          location: s.location,
          matchScore: calculateMatchScore(profile, s)
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      return filtered;
    },
    enabled: !!user
  });
};

export const useSaveScholarship = () => {
  const { user } = useAuth();

  const saveScholarship = async (scholarshipId: string) => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        scholarship_id: scholarshipId
      });

    if (error) throw error;
  };

  return { saveScholarship };
};
