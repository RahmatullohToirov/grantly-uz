import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Award, 
  Users,
  Star,
  ChevronRight
} from "lucide-react";

const VideoLearning = () => {
  const courseCategories = [
    { name: "All Courses", count: 24, active: true },
    { name: "Essay Writing", count: 8 },
    { name: "Interview Prep", count: 6 },
    { name: "Application Strategy", count: 5 },
    { name: "Personal Branding", count: 5 }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Scholarship Essay Mastery",
      instructor: "Dr. Sarah Martinez",
      duration: "3h 45m",
      lessons: 12,
      level: "Beginner",
      rating: 4.9,
      students: 2847,
      progress: 75,
      thumbnail: "/placeholder-course-1.jpg",
      price: "Free",
      description: "Master the art of writing compelling scholarship essays that stand out to selection committees."
    },
    {
      id: 2,
      title: "Interview Success Strategies",
      instructor: "Prof. Michael Chen",
      duration: "2h 30m", 
      lessons: 8,
      level: "Intermediate",
      rating: 4.8,
      students: 1523,
      progress: 0,
      thumbnail: "/placeholder-course-2.jpg",
      price: "Pro",
      description: "Ace your scholarship interviews with proven techniques and practice scenarios."
    },
    {
      id: 3,
      title: "Building Your Personal Brand",
      instructor: "Alexandra Rivera",
      duration: "4h 15m",
      lessons: 15,
      level: "Advanced",
      rating: 4.9,
      students: 987,
      progress: 30,
      thumbnail: "/placeholder-course-3.jpg",
      price: "Premium",
      description: "Create a compelling personal narrative that showcases your unique value proposition."
    }
  ];

  const popularLessons = [
    {
      title: "Writing Your Hook: The Perfect Opening",
      course: "Essay Mastery",
      duration: "18 min",
      views: 15420,
      completed: true
    },
    {
      title: "Telling Your Story Authentically",
      course: "Personal Branding",
      duration: "25 min",
      views: 12350,
      completed: false
    },
    {
      title: "Handling Difficult Interview Questions",
      course: "Interview Prep",
      duration: "22 min",
      views: 9876,
      completed: false
    },
    {
      title: "Research Before You Apply",
      course: "Application Strategy",
      duration: "16 min",
      views: 8765,
      completed: true
    }
  ];

  const learningPaths = [
    {
      title: "Complete Scholarship Success",
      courses: 6,
      duration: "12h",
      level: "All Levels",
      description: "End-to-end guidance from finding opportunities to winning scholarships"
    },
    {
      title: "Essay Writing Excellence",
      courses: 3,
      duration: "6h",
      level: "Beginner",
      description: "Master every type of scholarship essay with expert guidance"
    },
    {
      title: "Interview Mastery Track",
      courses: 4,
      duration: "8h",
      level: "Intermediate",
      description: "Build confidence and skills for any scholarship interview"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Video Learning Center</h1>
          <p className="text-muted-foreground">
            Master scholarship applications with expert-led courses and tutorials
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {courseCategories.map((category, index) => (
            <Button
              key={index}
              variant={category.active ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Learning Paths */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Learning Paths</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <Card key={index} className="border-border hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <Badge variant="outline">{path.level}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {path.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span>{path.courses} courses</span>
                    <span>{path.duration}</span>
                  </div>
                  <Button className="w-full">
                    Start Learning
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="border-border hover:shadow-card transition-all duration-300">
                <div className="aspect-video bg-muted relative rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={course.price === "Free" ? "secondary" : "default"}
                      className={course.price === "Free" ? "bg-green-500" : ""}
                    >
                      {course.price}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:scale-110 transition-transform cursor-pointer">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="outline" className="text-white border-white/50">
                      {course.level}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-muted-foreground">({course.students})</span>
                    </div>
                    <Badge variant="outline">{course.lessons} lessons</Badge>
                  </div>
                  <CardTitle className="text-xl text-card-foreground">
                    {course.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">by {course.instructor}</p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {course.description}
                  </p>
                  
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students.toLocaleString()}
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    {course.progress > 0 ? "Continue Learning" : "Start Course"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Lessons */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Popular Lessons</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularLessons.map((lesson, index) => (
              <Card key={index} className="border-border hover:shadow-soft transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {lesson.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Play className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lesson.course}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                        <span>{lesson.views.toLocaleString()} views</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <ChatBot />
    </div>
  );
};

export default VideoLearning;