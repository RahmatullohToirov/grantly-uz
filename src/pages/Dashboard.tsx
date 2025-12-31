import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import ChatBot from "@/components/ChatBot";
import { 
  useDashboardStats, 
  useTrackedScholarships, 
  useAIRecommendations 
} from "@/hooks/useDashboardData";
import { useToggleSaveScholarship } from "@/hooks/useScholarships";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";
import { useProfile } from "@/hooks/useProfile";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";
import { DeadlineCalendar } from "@/components/DeadlineCalendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  BookmarkIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TrendingUpIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  GraduationCapIcon,
  DollarSignIcon,
  Loader2,
  Mail,
  X
} from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: trackedScholarships, isLoading: trackedLoading } = useTrackedScholarships();
  const { data: recommendations, isLoading: recommendationsLoading } = useAIRecommendations();
  const toggleSave = useToggleSaveScholarship();
  const completeness = useProfileCompleteness();
  const [sendingVerification, setSendingVerification] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const isEmailVerified = user?.email_confirmed_at !== null;

  // Get display name from profile or fallback to user metadata
  const displayName = profile?.full_name || 
    (user?.user_metadata?.first_name 
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() 
      : 'Student');

  const handleSendVerificationEmail = async () => {
    if (!user?.email) return;
    setSendingVerification(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      toast.success('Verification email sent! Check your inbox and spam folder.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('applied') || statusLower.includes('progress')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (statusLower.includes('accept')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (statusLower.includes('reject')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('applied') || statusLower.includes('progress')) return <ClockIcon className="h-4 w-4" />;
    if (statusLower.includes('accept')) return <CheckCircleIcon className="h-4 w-4" />;
    if (statusLower.includes('reject')) return <XCircleIcon className="h-4 w-4" />;
    return <BookmarkIcon className="h-4 w-4" />;
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    try {
      return format(new Date(deadline), 'MMM d, yyyy');
    } catch {
      return deadline;
    }
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Varies';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSaveRecommendation = (scholarshipId: string) => {
    toggleSave.mutate({ scholarshipId, isSaved: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Email Verification Banner */}
      {!isEmailVerified && !bannerDismissed && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Please verify your email address
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Verify your email to receive notifications and unlock all features
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                  onClick={handleSendVerificationEmail}
                  disabled={sendingVerification}
                >
                  {sendingVerification ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Resend Email'
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 p-1 h-auto"
                  onClick={() => setBannerDismissed(true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-muted-foreground">
            Track your scholarship journey and discover new opportunities
          </p>
        </div>

        {/* Profile Completion Banner */}
        {!completeness.isComplete && (
          <div className="mb-8">
            <ProfileCompletionBanner variant="full" />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.saved || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Scholarships bookmarked
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Applications pending
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.accepted || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Successful applications
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.successRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    {(stats?.successRate || 0) >= 50 ? 'Above average' : 'Keep applying!'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scholarship Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Tracker</CardTitle>
                <CardDescription>
                  Manage your applications and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trackedLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : trackedScholarships && trackedScholarships.length > 0 ? (
                  <div className="space-y-4">
                    {trackedScholarships.map((scholarship) => (
                      <div key={scholarship.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${getStatusColor(scholarship.status)}`}>
                            {getStatusIcon(scholarship.status)}
                          </div>
                          <div>
                            <h3 className="font-medium">{scholarship.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              <span>Due: {formatDeadline(scholarship.deadline)}</span>
                              <DollarSignIcon className="h-3 w-3 ml-2" />
                              <span>{formatAmount(scholarship.amount)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {scholarship.matchScore}% match
                          </Badge>
                          <Link to="/scholarships">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCapIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No applications yet</p>
                    <Link to="/scholarships">
                      <Button className="mt-4" variant="outline">
                        Browse Scholarships
                      </Button>
                    </Link>
                  </div>
                )}
                <div className="mt-4">
                  <Link to="/scholarships">
                    <Button className="w-full">View All Applications</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Application statistics and yearly goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Yearly Application Goal</span>
                    <span>{(stats?.inProgress || 0) + (stats?.accepted || 0) + (stats?.rejected || 0)}/15 applications</span>
                  </div>
                  <Progress 
                    value={Math.min(((stats?.inProgress || 0) + (stats?.accepted || 0) + (stats?.rejected || 0)) / 15 * 100, 100)} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>{completeness.percentage}%</span>
                  </div>
                  <Progress value={completeness.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deadline Calendar */}
            <DeadlineCalendar />
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Personalized opportunities for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : recommendations && recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {rec.description || rec.location || 'Scholarship opportunity'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="secondary" className="text-xs">{rec.matchScore}% match</Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSaveRecommendation(rec.id)}
                          disabled={toggleSave.isPending}
                        >
                          {toggleSave.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <p>Complete your profile to get personalized recommendations</p>
                    <Link to="/profile">
                      <Button variant="outline" size="sm" className="mt-2">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                )}
                <Link to="/scholarships">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Recommendations
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                </Link>
                <Link to="/mentor-matching">
                  <Button variant="outline" className="w-full justify-start">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Book Mentorship
                  </Button>
                </Link>
                <Link to="/scholarships">
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCapIcon className="mr-2 h-4 w-4" />
                    Browse Scholarships
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Latest updates from mentors and peers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Sarah M. got accepted!</p>
                  <p className="text-muted-foreground text-xs">Rhodes Scholarship 2024</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">New workshop available</p>
                  <p className="text-muted-foreground text-xs">Essay writing masterclass</p>
                </div>
                <Link to="/community">
                  <Button variant="ghost" className="w-full text-sm">
                    Join Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ChatBot />
    </div>
  );
};

export default Dashboard;
