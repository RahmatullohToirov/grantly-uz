import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Video,
  Users,
  Star,
  Calendar,
  Award,
  TrendingUp,
  BookmarkPlus,
  Download,
  Filter,
  Search,
  Zap
} from "lucide-react";

const VideoLearning = () => {
  const { toast } = useToast();

  const handleStartCourse = (courseName: string) => {
    toast({
      title: "Course Started",
      description: `Welcome to "${courseName}"! Your progress will be tracked automatically.`,
    });
  };

  const handleWatchVideo = (videoTitle: string) => {
    toast({
      title: "Video Started", 
      description: `Now playing: "${videoTitle}". Progress will be saved.`,
    });
  };

  const handleJoinLive = (sessionTitle: string) => {
    toast({
      title: "Joining Live Session",
      description: `Connecting you to "${sessionTitle}". Check your email for the meeting link.`,
    });
  };

  const featuredCourses = [
    {
      id: 1,
      title: "Scholarship Application Mastery",
      instructor: "Dr. Elena Vasquez",
      duration: "6 weeks",
      level: "Intermediate",
      rating: 4.9,
      students: 3240,
      progress: 0,
      price: "Premium",
      thumbnail: "/course-mastery.jpg",
      description: "Complete guide to winning scholarships with proven strategies",
      modules: 12,
      totalVideos: 45,
      totalDuration: "8.5 hours",
      topics: ["Application Strategy", "Essay Writing", "Interview Prep"],
      lastUpdated: "January 2025"
    },
    {
      id: 2,
      title: "Personal Statement Excellence",
      instructor: "Prof. Michael Chen",
      duration: "4 weeks",
      level: "Beginner",
      rating: 4.8,
      students: 2100,
      progress: 65,
      price: "Free",
      thumbnail: "/course-essays.jpg", 
      description: "Master the art of compelling personal statements",
      modules: 8,
      totalVideos: 32,
      totalDuration: "5.2 hours",
      topics: ["Storytelling", "Structure", "Examples"],
      lastUpdated: "December 2024"
    },
    {
      id: 3,
      title: "Interview Confidence Builder",
      instructor: "Sarah Kim",
      duration: "3 weeks",
      level: "All Levels",
      rating: 4.7,
      students: 1850,
      progress: 30,
      price: "Free",
      thumbnail: "/course-interview.jpg",
      description: "Build confidence and excel in scholarship interviews",
      modules: 6,
      totalVideos: 28,
      totalDuration: "4.1 hours", 
      topics: ["Mock Interviews", "Body Language", "Q&A Prep"],
      lastUpdated: "January 2025"
    }
  ];

  const quickLessons = [
    {
      title: "5-Minute Essay Review Tips",
      duration: "5:24",
      category: "Writing",
      thumbnail: "/lesson-review.jpg",
      views: 15200,
      instructor: "Dr. Sarah Kim"
    },
    {
      title: "Common Application Mistakes",
      duration: "7:18", 
      category: "Strategy",
      thumbnail: "/lesson-mistakes.jpg",
      views: 12800,
      instructor: "Prof. James Wilson"
    },
    {
      title: "Budget Planning for Students",
      duration: "6:45",
      category: "Financial",
      thumbnail: "/lesson-budget.jpg", 
      views: 9300,
      instructor: "Financial Team"
    },
    {
      title: "Time Management Hacks",
      duration: "8:12",
      category: "Productivity",
      thumbnail: "/lesson-time.jpg",
      views: 18500,
      instructor: "Dr. Maria Lopez"
    }
  ];

  const learningPaths = [
    {
      name: "Complete Beginner",
      description: "Start your scholarship journey from scratch",
      courses: 4,
      duration: "12 weeks",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600"
    },
    {
      name: "Essay Writing Focus", 
      description: "Master personal statements and essays",
      courses: 3,
      duration: "8 weeks",
      icon: Award,
      color: "bg-purple-100 text-purple-600"
    },
    {
      name: "Interview Excellence",
      description: "Excel in scholarship interviews",
      courses: 2,
      duration: "4 weeks", 
      icon: Users,
      color: "bg-green-100 text-green-600"
    },
    {
      name: "Advanced Strategies",
      description: "Maximize your success rate",
      courses: 5,
      duration: "16 weeks",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const liveSession = {
    title: "Scholarship Interview Masterclass",
    instructor: "Dr. Elena Vasquez",
    startTime: "2:00 PM EST",
    duration: "90 minutes",
    attendees: 234,
    maxAttendees: 300,
    description: "Live practice session with real-time feedback from expert interviewers",
    topics: ["Common Questions", "Body Language", "Follow-up Strategies"]
  };

  const upcomingSession = {
    title: "Essay Writing Workshop",
    instructor: "Prof. Michael Chen", 
    date: "Tomorrow",
    time: "2:00 PM EST",
    duration: "2 hours",
    registered: 89,
    maxRegistered: 150,
    description: "Interactive session on crafting compelling personal statements"
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-primary rounded-3xl relative overflow-hidden mb-12">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="text-center relative z-10 px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-4 animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Coming soon...
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Learning Hub
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-fade-in">
              Master scholarship applications through expert-led video courses, live workshops, and interactive learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white/20 border-white/20 text-primary-foreground hover:bg-white/30 hover-scale">
                <Play className="h-5 w-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="secondary" className="hover-scale">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </Button>
            </div>
          </div>
        </section>

        {/* Learning Paths */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-muted-foreground">
              Structured learning journeys tailored to your experience level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${path.color} flex items-center justify-center mx-auto mb-4`}>
                    <path.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-card-foreground mb-2">
                    {path.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {path.description}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{path.courses} courses</span>
                    <span>{path.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Featured Courses
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive courses designed by scholarship experts
              </p>
            </div>
            <Button variant="outline" className="hover-scale">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="bg-card border-border overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 animate-fade-in">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={course.price === "Free" ? "bg-green-500" : "bg-purple-500"}>
                      {course.price}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {course.rating}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.description}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Instructor: <span className="font-medium text-card-foreground">{course.instructor}</span>
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{course.totalDuration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Modules:</span>
                      <span className="font-medium">{course.modules}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Videos:</span>
                      <span className="font-medium">{course.totalVideos}</span>
                    </div>
                  </div>

                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full hover-scale"
                    onClick={() => handleStartCourse(course.title)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {course.progress > 0 ? "Continue Course" : "Start Course"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Lessons */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Quick Lessons
            </h2>
            <p className="text-lg text-muted-foreground">
              Bite-sized videos for focused learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLessons.map((lesson, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-soft transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in">
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/50 text-white text-xs">
                      {lesson.duration}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {lesson.category}
                  </Badge>
                  <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{lesson.instructor}</span>
                    <span>{lesson.views.toLocaleString()} views</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3 hover-scale"
                    onClick={() => handleWatchVideo(lesson.title)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Watch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Sessions */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Live Learning Sessions
            </h2>
            <p className="text-lg text-muted-foreground">
              Interactive workshops and Q&A sessions with experts
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Live Now */}
            <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Live Now
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {liveSession.attendees}/{liveSession.maxAttendees}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {liveSession.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {liveSession.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div>Host: <span className="font-medium text-card-foreground">{liveSession.instructor}</span></div>
                  <div>Duration: <span className="font-medium">{liveSession.duration}</span></div>
                </div>
                <div className="flex flex-wrap gap-1 mb-6">
                  {liveSession.topics.map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Button 
                  className="w-full hover-scale bg-red-600 hover:bg-red-700"
                  onClick={() => handleJoinLive(liveSession.title)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Live Session
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="border-primary text-primary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {upcomingSession.date} {upcomingSession.time}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {upcomingSession.registered}/{upcomingSession.maxRegistered}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {upcomingSession.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {upcomingSession.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                  <div>Host: <span className="font-medium text-card-foreground">{upcomingSession.instructor}</span></div>
                  <div>Duration: <span className="font-medium">{upcomingSession.duration}</span></div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full hover-scale"
                  onClick={() => handleJoinLive(upcomingSession.title)}
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Register Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learning Stats */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Your Learning Journey
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">12</div>
                <div className="text-muted-foreground">Courses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">45</div>
                <div className="text-muted-foreground">Hours Learned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">8</div>
                <div className="text-muted-foreground">Certificates Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ChatBot />
    </div>
  );
};

export default VideoLearning;