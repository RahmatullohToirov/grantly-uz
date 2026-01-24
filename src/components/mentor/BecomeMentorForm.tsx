import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useMyMentorApplication, useSubmitMentorApplication } from '@/hooks/useMentorApplications';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2, CheckCircle, Clock, XCircle, Send } from 'lucide-react';

const BecomeMentorForm = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: existingApplication, isLoading: applicationLoading } = useMyMentorApplication();
  const submitApplication = useSubmitMentorApplication();

  const [hasExperience, setHasExperience] = useState<string>('no');
  const [motivation, setMotivation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivation.trim()) return;

    submitApplication.mutate({
      has_experience: hasExperience === 'yes',
      motivation: motivation.trim(),
    });
  };

  if (!user) {
    return (
      <Card className="border-border">
        <CardHeader className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Want to Become a Mentor?</CardTitle>
          <CardDescription>
            Share your knowledge and help students achieve their scholarship goals
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Please sign in to apply as a mentor.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (profileLoading || applicationLoading) {
    return (
      <Card className="border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Show status if already applied
  if (existingApplication) {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        text: 'Your application is under review',
      },
      approved: {
        icon: CheckCircle,
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        text: 'Congratulations! Your application has been approved',
      },
      rejected: {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        text: 'Your application was not approved at this time',
      },
    };

    const status = statusConfig[existingApplication.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <Card className="border-border">
        <CardHeader className="text-center">
          <div className={`${status.bg} rounded-full p-4 w-fit mx-auto mb-4`}>
            <StatusIcon className={`h-12 w-12 ${status.color}`} />
          </div>
          <CardTitle className="text-2xl">Mentor Application Status</CardTitle>
          <CardDescription>{status.text}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Badge 
              variant={
                existingApplication.status === 'approved' ? 'default' : 
                existingApplication.status === 'rejected' ? 'destructive' : 
                'secondary'
              }
              className="text-sm px-4 py-1"
            >
              {existingApplication.status.charAt(0).toUpperCase() + existingApplication.status.slice(1)}
            </Badge>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Submitted on</p>
            <p className="font-medium">
              {new Date(existingApplication.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {existingApplication.admin_notes && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Admin Notes</p>
              <p className="text-sm">{existingApplication.admin_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
        <CardTitle className="text-2xl">Want to Become a Mentor?</CardTitle>
        <CardDescription>
          Share your knowledge and help students achieve their scholarship goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-filled from profile */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile?.full_name || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">From your profile</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">From your account</p>
            </div>
          </div>

          {/* Question 1: Experience */}
          <div className="space-y-3">
            <Label>Do you have experience in mentoring?</Label>
            <RadioGroup
              value={hasExperience}
              onValueChange={setHasExperience}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="experience-yes" />
                <Label htmlFor="experience-yes" className="cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="experience-no" />
                <Label htmlFor="experience-no" className="cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2: Motivation */}
          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to mentor on our platform? *</Label>
            <Textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Share your motivation, experience, and what you can offer to students..."
              rows={5}
              required
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {motivation.length}/1000 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!motivation.trim() || submitApplication.isPending}
          >
            {submitApplication.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BecomeMentorForm;
