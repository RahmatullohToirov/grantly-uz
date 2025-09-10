import { useState } from "react";
import { 
  Bell, 
  User, 
  Search, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Users, 
  FileText, 
  Video, 
  MessageCircle,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  GraduationCap,
  Globe,
  ChevronRight,
  Plus,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const [notifications] = useState(3);
  
  const scholarshipStats = [
    { label: "Saved", value: 12, color: "bg-blue-500" },
    { label: "Applied", value: 8, color: "bg-yellow-500" },
    { label: "In Review", value: 3, color: "bg-purple-500" },
    { label: "Accepted", value: 1, color: "bg-green-500" }
  ];

  const recentOpportunities = [
    {
      title: "Global Development Grant",
      deadline: "July 9",
      amount: "$50,000",
      type: "International",
      fit: 95,
      tags: ["Fully Funded", "Graduate"]
    },
    {
      title: "Women in STEM Scholarship",
      deadline: "August 15",
      amount: "$25,000",
      type: "National",
      fit: 88,
      tags: ["STEM", "Women"]
    },
    {
      title: "Climate Innovation Fellowship",
      deadline: "September 30",
      amount: "$75,000",
      type: "Global",
      fit: 92,
      tags: ["Environment", "Research"]
    }
  ];

  const applicationProgress = [
    {
      title: "Youth Leaders Program",
      status: "Interview",
      deadline: "June 15",
      progress: 75,
      stage: "interview"
    },
    {
      title: "Tech Innovators Grant",
      status: "Applied",
      deadline: "July 1",
      progress: 50,
      stage: "applied"
    },
    {
      title: "Global Scholarship",
      status: "Draft",
      deadline: "May 2",
      progress: 25,
      stage: "draft"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/d5d5abbb-a27e-4b06-8508-d663f6314de3.png" 
                alt="Grantly Logo" 
                className="h-12 w-auto"
              />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search scholarships, opportunities..."
                  className="pl-10 w-96"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Rahmatulloh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Rahmatulloh 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your progress this week
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {scholarshipStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Tracker */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Application Progress</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {applicationProgress.map((app, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-background/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{app.title}</h3>
                        <Badge variant="secondary">{app.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Deadline: {app.deadline}</span>
                        <span className="text-sm font-medium">{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Success Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Applications Sent</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Responses Received</span>
                      <span className="font-semibold">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                      <span className="font-semibold text-green-600">25%</span>
                    </div>
                    <Progress value={25} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-secondary" />
                    <span>Yearly Goal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-foreground">8/15</p>
                      <p className="text-sm text-muted-foreground">Applications this year</p>
                    </div>
                    <Progress value={53} className="h-3" />
                    <p className="text-xs text-muted-foreground text-center">
                      53% of your yearly goal completed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Shortcuts */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center space-y-2" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Upload Documents</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center space-y-2" variant="outline">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Book Mentorship</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center space-y-2" variant="outline">
                    <Video className="h-6 w-6" />
                    <span className="text-sm">Watch Tutorials</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Opportunities */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recommended for You</CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOpportunities.map((opp, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-background/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">{opp.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {opp.fit}% fit
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          <span>{opp.amount}</span>
                          <span>•</span>
                          <Globe className="h-3 w-3" />
                          <span>{opp.type}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Deadline: {opp.deadline}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {opp.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            Save
                          </Button>
                          <Button size="sm" className="flex-1">
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Section */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Grantly Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm">Scholar Community</h4>
                      <p className="text-xs text-muted-foreground">
                        Connect with mentors and alumni
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Recent Activity:</p>
                    <div className="space-y-2">
                      <div className="text-xs">
                        <span className="font-medium">Sarah J.</span> shared tips for scholarship essays
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Dr. Chen</span> is hosting a Q&A session tomorrow
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Join Community →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="bg-gradient-card shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span>Upcoming Deadlines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Youth Leaders Program</p>
                      <p className="text-xs text-muted-foreground">Jun 5 • 10 days left</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      2
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Global Development Grant</p>
                      <p className="text-xs text-muted-foreground">Jul 9 • 9 weeks left</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      9
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;