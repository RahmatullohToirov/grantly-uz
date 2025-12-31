import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the token hash and type from URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
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

        // If we have a token_hash, verify it
        if (token_hash && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as 'signup' | 'recovery' | 'email',
          });

          if (verifyError) {
            setStatus('error');
            setMessage(verifyError.message);
            toast({
              title: 'Verification Failed',
              description: verifyError.message,
              variant: 'destructive',
            });
            setTimeout(() => navigate('/'), 3000);
            return;
          }

          // Success handling based on type
          if (type === 'signup' || type === 'email') {
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to dashboard...');
            toast({
              title: 'Email Verified!',
              description: 'Your account has been verified successfully.',
            });
            setTimeout(() => navigate('/dashboard'), 1500);
          } else if (type === 'recovery') {
            setStatus('success');
            setMessage('Verified! Redirecting to reset password...');
            setTimeout(() => navigate('/auth/reset-password'), 1000);
          }
          return;
        }

        // Check for existing session (e.g., from OAuth callback)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('Signed in successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1000);
          return;
        }

        // No token or session found
        setStatus('error');
        setMessage('Invalid or expired link. Please try again.');
        toast({
          title: 'Invalid Link',
          description: 'The link is invalid or has expired.',
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
