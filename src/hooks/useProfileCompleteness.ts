import { useMemo } from 'react';
import { useProfile } from './useProfile';

export interface ProfileField {
  key: string;
  label: string;
  category: 'personal' | 'demographics' | 'academic' | 'financial';
  weight: number;
  completed: boolean;
}

export interface ProfileCompleteness {
  percentage: number;
  fields: ProfileField[];
  completedFields: number;
  totalFields: number;
  isComplete: boolean;
  missingRequired: string[];
  categoryProgress: {
    personal: number;
    demographics: number;
    academic: number;
    financial: number;
  };
}

const REQUIRED_FIELDS = ['full_name', 'nationality', 'education_level', 'field_of_study'];

export const useProfileCompleteness = (): ProfileCompleteness => {
  const { data: profile } = useProfile();

  return useMemo(() => {
    const fields: ProfileField[] = [
      // Personal (weight: 15)
      { key: 'full_name', label: 'Full Name', category: 'personal', weight: 5, completed: !!profile?.full_name },
      { key: 'bio', label: 'Bio', category: 'personal', weight: 3, completed: !!profile?.bio },
      { key: 'location', label: 'Location', category: 'personal', weight: 3, completed: !!profile?.location },
      { key: 'avatar_url', label: 'Profile Photo', category: 'personal', weight: 4, completed: !!profile?.avatar_url },
      
      // Demographics (weight: 25)
      { key: 'gender', label: 'Gender', category: 'demographics', weight: 5, completed: !!profile?.gender },
      { key: 'date_of_birth', label: 'Date of Birth', category: 'demographics', weight: 5, completed: !!profile?.date_of_birth },
      { key: 'nationality', label: 'Nationality', category: 'demographics', weight: 8, completed: !!profile?.nationality },
      { key: 'country_of_residence', label: 'Country of Residence', category: 'demographics', weight: 7, completed: !!profile?.country_of_residence },
      
      // Academic (weight: 40)
      { key: 'education_level', label: 'Education Level', category: 'academic', weight: 12, completed: !!profile?.education_level },
      { key: 'field_of_study', label: 'Field of Study', category: 'academic', weight: 12, completed: !!profile?.field_of_study },
      { key: 'gpa', label: 'GPA', category: 'academic', weight: 8, completed: profile?.gpa !== null && profile?.gpa !== undefined },
      { key: 'institution_type', label: 'Institution Type', category: 'academic', weight: 8, completed: !!profile?.institution_type },
      
      // Financial (weight: 20)
      { key: 'income_level', label: 'Income Level', category: 'financial', weight: 10, completed: !!profile?.income_level },
      { key: 'financial_need', label: 'Financial Need Status', category: 'financial', weight: 10, completed: profile?.financial_need !== null && profile?.financial_need !== undefined },
    ];

    const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
    const completedWeight = fields.filter(f => f.completed).reduce((sum, f) => sum + f.weight, 0);
    const percentage = Math.round((completedWeight / totalWeight) * 100);

    const completedFields = fields.filter(f => f.completed).length;
    const totalFields = fields.length;

    const missingRequired = REQUIRED_FIELDS.filter(key => {
      const field = fields.find(f => f.key === key);
      return field && !field.completed;
    }).map(key => fields.find(f => f.key === key)?.label || key);

    // Category progress
    const categoryProgress = {
      personal: calculateCategoryProgress(fields, 'personal'),
      demographics: calculateCategoryProgress(fields, 'demographics'),
      academic: calculateCategoryProgress(fields, 'academic'),
      financial: calculateCategoryProgress(fields, 'financial'),
    };

    return {
      percentage,
      fields,
      completedFields,
      totalFields,
      isComplete: percentage >= 80,
      missingRequired,
      categoryProgress,
    };
  }, [profile]);
};

function calculateCategoryProgress(fields: ProfileField[], category: ProfileField['category']): number {
  const categoryFields = fields.filter(f => f.category === category);
  const categoryWeight = categoryFields.reduce((sum, f) => sum + f.weight, 0);
  const completedWeight = categoryFields.filter(f => f.completed).reduce((sum, f) => sum + f.weight, 0);
  return categoryWeight > 0 ? Math.round((completedWeight / categoryWeight) * 100) : 0;
}
