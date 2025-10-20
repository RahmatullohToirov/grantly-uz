import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatBot from "@/components/ChatBot";
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
  DollarSignIcon
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [scholarshipStats, setScholarshipStats] = useState({
    saved: 0,
    inProgress: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setProfile(profileData);

      // Fetch applications with scholarship details
      const { data: appsData } = await supabase
        .from('user_applications')
        .select(`
          *,
          scholarships (
            title,
            deadline,
            amount
          )
        `)
        .eq('user_id', user?.id)
        .order('applied_at', { ascending: false })
        .limit(3);

      setApplications(appsData || []);

      // Calculate stats
      const { data: allApps } = await supabase
        .from('user_applications')
        .select('status')
        .eq('user_id', user?.id);

      const stats = {
        saved: 0,
        inProgress: 0,
        accepted: 0,
        rejected: 0
      };

      allApps?.forEach(app => {
        if (app.status === 'Applied') stats.inProgress++;
        else if (app.status === 'Accepted') stats.accepted++;
        else if (app.status === 'Rejected') stats.rejected++;
      });

      const { count: savedCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      stats.saved = savedCount || 0;
      setScholarshipStats(stats);

      // Fetch recent activities
      const { data: activitiesData } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setActivities(activitiesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied': return <ClockIcon className="h-4 w-4" />;
      case 'Interview': return <UsersIcon className="h-4 w-4" />;
      case 'Accepted': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const successRate = scholarshipStats.accepted + scholarshipStats.rejected > 0
    ? Math.round((scholarshipStats.accepted / (scholarshipStats.accepted + scholarshipStats.rejected)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Student'} 👋
          </h1>
          <p className="text-muted-foreground">
            Track your scholarship journey and discover new opportunities
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scholarshipStats.saved}</div>
              <p className="text-xs text-muted-foreground">
                Scholarships bookmarked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scholarshipStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Applications pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scholarshipStats.accepted}</div>
              <p className="text-xs text-muted-foreground">
                Successful applications
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                {successRate >= 50 ? 'Above average' : 'Keep going!'}
              </p>
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
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                          </div>
                          <div>
                            <h3 className="font-medium">{app.scholarships?.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              <span>Due: {new Date(app.scholarships?.deadline).toLocaleDateString()}</span>
                              <DollarSignIcon className="h-3 w-3 ml-2" />
                              <span>{app.scholarships?.amount}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No applications yet. Start browsing scholarships!</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button className="w-full" onClick={() => window.location.href = '/scholarships'}>
                    View All Applications
                  </Button>
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
                    <span>8/15 applications</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Personalized opportunities for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">Chevening Scholarship</h4>
                  <p className="text-xs text-muted-foreground">UK Government scholarship</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="secondary" className="text-xs">94% match</Badge>
                    <Button size="sm" variant="outline">Save</Button>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-sm">DAAD Scholarship</h4>
                  <p className="text-xs text-muted-foreground">Study in Germany</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="secondary" className="text-xs">91% match</Badge>
                    <Button size="sm" variant="outline">Save</Button>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-sm">
                  View All Recommendations
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Book Mentorship
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCapIcon className="mr-2 h-4 w-4" />
                  Take Assessment
                </Button>
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
                {activities.length > 0 ? (
                  activities.slice(0, 3).map((activity, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No recent activity
                  </div>
                )}
                <Button variant="ghost" className="w-full text-sm" onClick={() => window.location.href = '/community'}>
                  Join Community
                </Button>
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