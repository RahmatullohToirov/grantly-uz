import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

export interface ApplicationChecklist {
  id: string;
  user_id: string;
  scholarship_id: string;
  checklist_items: ChecklistItem[];
  created_at: string;
  updated_at: string;
}

const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'id'>[] = [
  { label: 'Transcript', completed: false },
  { label: 'Personal Statement / Essay', completed: false },
  { label: 'Letters of Recommendation', completed: false },
  { label: 'Resume / CV', completed: false },
  { label: 'Proof of Enrollment', completed: false },
  { label: 'Financial Documents', completed: false },
  { label: 'ID / Passport Copy', completed: false },
  { label: 'Application Form', completed: false },
];

export const useApplicationChecklist = (scholarshipId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['application-checklist', user?.id, scholarshipId],
    queryFn: async (): Promise<ApplicationChecklist | null> => {
      if (!user || !scholarshipId) return null;

      const { data, error } = await supabase
        .from('application_checklists')
        .select('*')
        .eq('user_id', user.id)
        .eq('scholarship_id', scholarshipId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          ...data,
          checklist_items: data.checklist_items as unknown as ChecklistItem[],
        };
      }
      
      return null;
    },
    enabled: !!user && !!scholarshipId,
  });
};

export const useCreateChecklist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ scholarshipId, customItems }: { scholarshipId: string; customItems?: Omit<ChecklistItem, 'id'>[] }) => {
      if (!user) throw new Error('Not authenticated');

      const items = (customItems || DEFAULT_CHECKLIST_ITEMS).map((item, index) => ({
        ...item,
        id: `item-${index}-${Date.now()}`,
      }));

      const { data, error } = await supabase
        .from('application_checklists')
        .insert({
          user_id: user.id,
          scholarship_id: scholarshipId,
          checklist_items: items,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { scholarshipId }) => {
      queryClient.invalidateQueries({ queryKey: ['application-checklist', user?.id, scholarshipId] });
      toast.success('Checklist created');
    },
    onError: () => {
      toast.error('Failed to create checklist');
    },
  });
};

export const useUpdateChecklistItem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      checklistId, 
      scholarshipId,
      itemId, 
      updates 
    }: { 
      checklistId: string; 
      scholarshipId: string;
      itemId: string; 
      updates: Partial<ChecklistItem>;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Get current checklist
      const { data: current, error: fetchError } = await supabase
        .from('application_checklists')
        .select('checklist_items')
        .eq('id', checklistId)
        .single();

      if (fetchError) throw fetchError;

      const items = (current.checklist_items as unknown as ChecklistItem[]).map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );

      const { data, error } = await supabase
        .from('application_checklists')
        .update({ checklist_items: items as unknown as Json })
        .eq('id', checklistId)
        .select()
        .single();

      if (error) throw error;
      return { data, scholarshipId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['application-checklist', user?.id, result.scholarshipId] });
    },
    onError: () => {
      toast.error('Failed to update checklist');
    },
  });
};

export const useAddChecklistItem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      checklistId, 
      scholarshipId,
      item 
    }: { 
      checklistId: string; 
      scholarshipId: string;
      item: Omit<ChecklistItem, 'id'>;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: current, error: fetchError } = await supabase
        .from('application_checklists')
        .select('checklist_items')
        .eq('id', checklistId)
        .single();

      if (fetchError) throw fetchError;

      const newItem: ChecklistItem = {
        ...item,
        id: `item-${Date.now()}`,
      };

      const items = [...(current.checklist_items as unknown as ChecklistItem[]), newItem];

      const { data, error } = await supabase
        .from('application_checklists')
        .update({ checklist_items: items as unknown as Json })
        .eq('id', checklistId)
        .select()
        .single();

      if (error) throw error;
      return { data, scholarshipId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['application-checklist', user?.id, result.scholarshipId] });
      toast.success('Item added');
    },
    onError: () => {
      toast.error('Failed to add item');
    },
  });
};

export const useDeleteChecklistItem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      checklistId, 
      scholarshipId,
      itemId 
    }: { 
      checklistId: string; 
      scholarshipId: string;
      itemId: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: current, error: fetchError } = await supabase
        .from('application_checklists')
        .select('checklist_items')
        .eq('id', checklistId)
        .single();

      if (fetchError) throw fetchError;

      const items = (current.checklist_items as unknown as ChecklistItem[]).filter(item => item.id !== itemId);

      const { data, error } = await supabase
        .from('application_checklists')
        .update({ checklist_items: items as unknown as Json })
        .eq('id', checklistId)
        .select()
        .single();

      if (error) throw error;
      return { data, scholarshipId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['application-checklist', user?.id, result.scholarshipId] });
      toast.success('Item removed');
    },
    onError: () => {
      toast.error('Failed to remove item');
    },
  });
};
