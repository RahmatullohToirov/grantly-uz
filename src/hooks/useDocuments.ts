import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

export const documentCategories = [
  { value: 'transcript', label: 'Transcript' },
  { value: 'essay', label: 'Essay' },
  { value: 'recommendation', label: 'Recommendation Letter' },
  { value: 'resume', label: 'Resume/CV' },
  { value: 'cover_letter', label: 'Cover Letter' },
  { value: 'other', label: 'Other' },
] as const;

export type DocumentCategory = typeof documentCategories[number]['value'];

export interface UserDocument {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  category: DocumentCategory;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const documentSchema = z.object({
  name: z.string().trim().min(1, 'Document name is required').max(255, 'Name too long'),
  category: z.enum(['transcript', 'essay', 'recommendation', 'resume', 'cover_letter', 'other']),
  description: z.string().max(500, 'Description too long').optional(),
});

export const useDocuments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserDocument[];
    },
    enabled: !!user,
  });
};

export const useUploadDocument = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      name,
      category,
      description,
    }: {
      file: File;
      name: string;
      category: DocumentCategory;
      description?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      // Validate input
      documentSchema.parse({ name, category, description });

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed. Please upload PDF, Word, JPEG, or PNG files.');
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
          category,
          description: description || null,
        })
        .select()
        .single();

      if (error) {
        // Clean up uploaded file if record creation fails
        await supabase.storage.from('documents').remove([fileName]);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded successfully');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to upload document');
      }
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: UserDocument) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete record
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', document.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    },
  });
};

export const useDownloadDocument = () => {
  return useMutation({
    mutationFn: async (document: UserDocument) => {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    },
  });
};
