import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EnhancedProfile {
  gender: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  country_of_residence: string | null;
  education_level: string | null;
  field_of_study: string | null;
  gpa: number | null;
  institution_type: string | null;
  income_level: string | null;
  financial_need: boolean | null;
  location: string | null;
}

interface ScholarshipRequirements {
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
  eligible_genders: string[] | null;
  min_age: number | null;
  max_age: number | null;
  eligible_nationalities: string[] | null;
  eligible_countries: string[] | null;
  min_gpa: number | null;
  eligible_education_levels: string[] | null;
  eligible_fields: string[] | null;
  financial_need_required: boolean | null;
}

export interface MatchResult {
  scholarship: ScholarshipRequirements;
  matchScore: number;
  matchDetails: {
    category: string;
    score: number;
    maxScore: number;
    reason: string;
  }[];
  isEligible: boolean;
  ineligibilityReasons: string[];
}

export const calculateEnhancedMatchScore = (
  profile: EnhancedProfile | null,
  scholarship: ScholarshipRequirements
): MatchResult => {
  const matchDetails: MatchResult['matchDetails'] = [];
  const ineligibilityReasons: string[] = [];
  let isEligible = true;

  if (!profile) {
    return {
      scholarship,
      matchScore: 50,
      matchDetails: [{ category: 'Profile', score: 0, maxScore: 100, reason: 'Complete your profile for accurate matching' }],
      isEligible: true,
      ineligibilityReasons: [],
    };
  }

  // 1. Gender eligibility (Pass/Fail)
  if (scholarship.eligible_genders && scholarship.eligible_genders.length > 0 && profile.gender) {
    const genderMatch = scholarship.eligible_genders.some(
      g => g.toLowerCase() === profile.gender?.toLowerCase() || g.toLowerCase() === 'all'
    );
    if (!genderMatch) {
      isEligible = false;
      ineligibilityReasons.push(`Gender requirement: ${scholarship.eligible_genders.join(', ')}`);
    }
  }

  // 2. Age eligibility (Pass/Fail)
  if (profile.date_of_birth && (scholarship.min_age || scholarship.max_age)) {
    const age = calculateAge(profile.date_of_birth);
    if (scholarship.min_age && age < scholarship.min_age) {
      isEligible = false;
      ineligibilityReasons.push(`Minimum age: ${scholarship.min_age}`);
    }
    if (scholarship.max_age && age > scholarship.max_age) {
      isEligible = false;
      ineligibilityReasons.push(`Maximum age: ${scholarship.max_age}`);
    }
    matchDetails.push({
      category: 'Age',
      score: 10,
      maxScore: 10,
      reason: `Age ${age} within range`,
    });
  }

  // 3. Nationality match (25 points)
  let nationalityScore = 0;
  if (scholarship.eligible_nationalities && scholarship.eligible_nationalities.length > 0) {
    if (profile.nationality) {
      const match = scholarship.eligible_nationalities.some(
        n => n.toLowerCase() === profile.nationality?.toLowerCase() || n.toLowerCase() === 'all' || n.toLowerCase() === 'international'
      );
      if (match) {
        nationalityScore = 25;
      } else {
        isEligible = false;
        ineligibilityReasons.push(`Nationality requirement: ${scholarship.eligible_nationalities.join(', ')}`);
      }
    }
  } else {
    nationalityScore = 20; // Open to all
  }
  matchDetails.push({
    category: 'Nationality',
    score: nationalityScore,
    maxScore: 25,
    reason: nationalityScore > 0 ? 'Nationality matches' : 'Nationality not specified',
  });

  // 4. Country of residence (10 points)
  let countryScore = 5;
  if (scholarship.eligible_countries && scholarship.eligible_countries.length > 0 && profile.country_of_residence) {
    const match = scholarship.eligible_countries.some(
      c => c.toLowerCase() === profile.country_of_residence?.toLowerCase()
    );
    countryScore = match ? 10 : 0;
  } else if (scholarship.location && profile.country_of_residence) {
    const match = scholarship.location.toLowerCase().includes(profile.country_of_residence.toLowerCase());
    countryScore = match ? 10 : 5;
  }
  matchDetails.push({
    category: 'Location',
    score: countryScore,
    maxScore: 10,
    reason: countryScore >= 5 ? 'Location compatible' : 'Location may not match',
  });

  // 5. Education level match (20 points)
  let educationScore = 10;
  if (scholarship.eligible_education_levels && scholarship.eligible_education_levels.length > 0 && profile.education_level) {
    const match = scholarship.eligible_education_levels.some(
      e => e.toLowerCase().includes(profile.education_level?.toLowerCase() || '') ||
           profile.education_level?.toLowerCase().includes(e.toLowerCase())
    );
    educationScore = match ? 20 : 5;
  } else if (scholarship.description && profile.education_level) {
    const desc = scholarship.description.toLowerCase();
    const level = profile.education_level.toLowerCase();
    if (
      (level.includes('bachelor') && (desc.includes('undergraduate') || desc.includes('bachelor'))) ||
      (level.includes('master') && (desc.includes('graduate') || desc.includes('master') || desc.includes('postgraduate'))) ||
      (level.includes('phd') && (desc.includes('doctoral') || desc.includes('phd') || desc.includes('research'))) ||
      (level.includes('high school') && (desc.includes('high school') || desc.includes('secondary')))
    ) {
      educationScore = 18;
    }
  }
  matchDetails.push({
    category: 'Education Level',
    score: educationScore,
    maxScore: 20,
    reason: educationScore >= 15 ? 'Education level matches' : 'May match education requirements',
  });

  // 6. Field of study match (20 points)
  let fieldScore = 10;
  if (scholarship.eligible_fields && scholarship.eligible_fields.length > 0 && profile.field_of_study) {
    const match = scholarship.eligible_fields.some(
      f => f.toLowerCase().includes(profile.field_of_study?.toLowerCase() || '') ||
           profile.field_of_study?.toLowerCase().includes(f.toLowerCase())
    );
    fieldScore = match ? 20 : 5;
  } else if (scholarship.category && profile.field_of_study) {
    const categoryLower = scholarship.category.toLowerCase();
    const fieldLower = profile.field_of_study.toLowerCase();
    if (categoryLower.includes(fieldLower) || fieldLower.includes(categoryLower)) {
      fieldScore = 18;
    }
  }
  matchDetails.push({
    category: 'Field of Study',
    score: fieldScore,
    maxScore: 20,
    reason: fieldScore >= 15 ? 'Field of study matches' : 'May align with your field',
  });

  // 7. GPA requirement (10 points)
  let gpaScore = 5;
  if (scholarship.min_gpa && profile.gpa !== null) {
    if (profile.gpa >= scholarship.min_gpa) {
      gpaScore = 10;
    } else {
      gpaScore = 0;
      ineligibilityReasons.push(`Minimum GPA: ${scholarship.min_gpa}`);
    }
  }
  matchDetails.push({
    category: 'GPA',
    score: gpaScore,
    maxScore: 10,
    reason: gpaScore >= 5 ? 'GPA meets requirements' : 'GPA below minimum',
  });

  // 8. Financial need (5 points)
  let financialScore = 3;
  if (scholarship.financial_need_required) {
    if (profile.financial_need === true) {
      financialScore = 5;
    } else if (profile.financial_need === false) {
      financialScore = 0;
      ineligibilityReasons.push('Financial need required');
    }
  }
  matchDetails.push({
    category: 'Financial Need',
    score: financialScore,
    maxScore: 5,
    reason: financialScore > 0 ? 'Financial criteria met' : 'Financial need may be required',
  });

  const totalScore = matchDetails.reduce((sum, d) => sum + d.score, 0);
  const maxPossible = matchDetails.reduce((sum, d) => sum + d.maxScore, 0);
  const matchScore = Math.round((totalScore / maxPossible) * 100);

  return {
    scholarship,
    matchScore: isEligible ? matchScore : 0,
    matchDetails,
    isEligible,
    ineligibilityReasons,
  };
};

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const useEnhancedProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enhanced-profile', user?.id],
    queryFn: async (): Promise<EnhancedProfile | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          gender,
          date_of_birth,
          nationality,
          country_of_residence,
          education_level,
          field_of_study,
          gpa,
          institution_type,
          income_level,
          financial_need,
          location
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
