import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email is too long"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type SignUpErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

interface SignUpModalProps {
  children: React.ReactNode;
}

const SignUpModal = ({ children }: SignUpModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof SignUpErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: SignUpErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignUpErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: `${result.data.firstName} ${result.data.lastName}`,
            first_name: result.data.firstName,
            last_name: result.data.lastName,
          }
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error creating account",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user && !data.session) {
        // User created but needs email confirmation
        toast({
          title: "Check your email!",
          description: "We've sent you a confirmation link. Please check your inbox and spam folder.",
        });
        setOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
        setAgreeToTerms(false);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // User already exists (Supabase returns user with empty identities for existing accounts)
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
      } else if (data.session) {
        // Auto-confirmed (email confirmation disabled)
        toast({
          title: "Account created!",
          description: "Welcome to Grantly!",
        });
        setOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
        setAgreeToTerms(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create Your Account
          </DialogTitle>
          <p className="text-muted-foreground">Join thousands of students finding scholarships</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.lastName ? "border-destructive" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            <p className="text-xs text-muted-foreground">Min 8 characters with letters and numbers</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            size="lg" 
            disabled={!agreeToTerms || loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        
        {/*
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">
            or
          </span>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full" size="lg" onClick={handleGoogleSignUp}>
            Continue with Google
          </Button>
        </div>
        */}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button 
            onClick={() => {setOpen(false); setTimeout(() => (document.querySelector('[data-signin-trigger]') as HTMLElement)?.click(), 100);}}
            className="text-primary hover:underline font-medium"
          >
            Sign in here
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;