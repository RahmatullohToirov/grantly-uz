import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
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

  const scholarshipStats = {
    saved: 12,
    inProgress: 5,
    accepted: 2,
    rejected: 1
  };

  const recentOpportunities = [
    {
      id: 1,
      title: "Gates Cambridge Scholarship",
      deadline: "Dec 15, 2024",
      amount: "$50,000",
      status: "saved",
      fitScore: 95
    },
    {
      id: 2,
      title: "Fulbright Program",
      deadline: "Oct 12, 2024",
      amount: "$30,000",
      status: "in-progress",
      fitScore: 88
    },
    {
      id: 3,
      title: "Rhodes Scholarship",
      deadline: "Sep 30, 2024",
      amount: "Full funding",
      status: "accepted",
      fitScore: 92
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'saved': return <BookmarkIcon className="h-4 w-4" />;
      case 'in-progress': return <ClockIcon className="h-4 w-4" />;
      case 'accepted': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'Student'} 👋
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
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground">
                Above average
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
                  {recentOpportunities.map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(scholarship.status)}`}>
                          {getStatusIcon(scholarship.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">{scholarship.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <span>Due: {scholarship.deadline}</span>
                            <DollarSignIcon className="h-3 w-3 ml-2" />
                            <span>{scholarship.amount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {scholarship.fitScore}% match
                        </Badge>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full">View All Applications</Button>
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
                <div className="text-sm">
                  <p className="font-medium">Sarah M. got accepted!</p>
                  <p className="text-muted-foreground text-xs">Rhodes Scholarship 2024</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">New workshop available</p>
                  <p className="text-muted-foreground text-xs">Essay writing masterclass</p>
                </div>
                <Button variant="ghost" className="w-full text-sm">
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