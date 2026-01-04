import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const error = searchParams.get('error');
        const error_description = searchParams.get('error_description');

        // Handle error from Supabase
        if (error) {
          setStatus('error');
          setMessage(error_description || 'An error occurred during authentication.');
          toast({
            title: 'Authentication Error',
            description: error_description || error,
            variant: 'destructive',
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Check for existing session (e.g., from OAuth callback)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('Signed in successfully! Redirecting...');
          toast({
            title: 'Success!',
            description: 'You have been signed in.',
          });
          setTimeout(() => navigate('/dashboard'), 1000);
          return;
        }

        // No session found
        setStatus('error');
        setMessage('Session expired. Please sign in again.');
        toast({
          title: 'Session Expired',
          description: 'Please sign in again.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/'), 3000);
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred.');
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        )}
        {status === 'success' && (
          <div className="text-green-500 text-5xl">✓</div>
        )}
        {status === 'error' && (
          <div className="text-destructive text-5xl">✕</div>
        )}
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
