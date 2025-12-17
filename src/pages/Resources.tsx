import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Calendar,
  User,
  ArrowRight,
  Award,
  Target,
  TrendingUp,
  Download,
  Clock,
  Star,
  Play,
  Bookmark,
  Share2,
  Filter,
  Headphones,
  PenTool,
  Calculator,
  Globe,
  Brain,
  Users,
  Bell,
  Scale,
  Sparkles,
  MessageSquare
} from "lucide-react";
import AIApplicationAdviser from "@/components/tools/AIApplicationAdviser";
import ScholarshipComparisonTool from "@/components/tools/ScholarshipComparisonTool";
import AIEssayBuilder from "@/components/tools/AIEssayBuilder";
import ApplicationTracker from "@/components/tools/ApplicationTracker";
import EssayAnalyzer from "@/components/tools/EssayAnalyzer";
import GPACalculator from "@/components/tools/GPACalculator";
import ScholarshipFinder from "@/components/tools/ScholarshipFinder";

const Resources = () => {
  const { toast } = useToast();
  const [openTool, setOpenTool] = useState<string | null>(null);

  const handleDownload = (resourceName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading "${resourceName}". Check your downloads folder.`,
    });
  };

  const handleBookmark = (resourceName: string) => {
    toast({
      title: "Bookmarked",
      description: `"${resourceName}" saved to your bookmarks.`,
    });
  };

  const handleStartCourse = (courseName: string) => {
    toast({
      title: "Course Started",
      description: `Welcome to "${courseName}"! Your progress will be tracked.`,
    });
  };

  const categories = [
    { name: "All Resources", count: 120, icon: Globe, active: true },
    { name: "Scholarship Guides", count: 35, icon: Award },
    { name: "Essay Templates", count: 28, icon: PenTool },
    { name: "Video Courses", count: 22, icon: Video },
    { name: "Interview Prep", count: 15, icon: Users },
    { name: "Financial Tools", count: 12, icon: Calculator },
    { name: "Study Skills", count: 8, icon: Brain }
  ];

  const featuredResources = [
    {
      title: "Complete Scholarship Application Guide",
      description: "Step-by-step guide covering every aspect of scholarship applications from research to submission",
      type: "PDF Guide",
      category: "Scholarship Guides", 
      pages: 85,
      downloadCount: 2340,
      rating: 4.9,
      level: "All Levels",
      author: "Dr. Sarah Chen",
      lastUpdated: "Jan 2025",
      featured: true,
      tags: ["Applications", "Strategy", "Timeline"]
    },
    {
      title: "Personal Statement Masterclass",
      description: "Learn to craft compelling personal statements that captivate scholarship committees",
      type: "Video Course",
      category: "Essay Writing",
      duration: "3.5 hours",
      downloadCount: 1850,
      rating: 4.8,
      level: "Intermediate",
      author: "Prof. Michael Rodriguez",
      lastUpdated: "Dec 2024",
      featured: true,
      tags: ["Personal Statement", "Writing", "Examples"]
    }
  ];

  const resourceLibrary = [
    {
      title: "Scholarship Essay Templates Collection",
      description: "50+ proven essay templates for different scholarship types with real examples",
      type: "Template Pack",
      category: "Essay Templates",
      icon: PenTool,
      downloadCount: 3200,
      rating: 4.9,
      size: "15 MB",
      format: "DOCX + PDF",
      level: "All Levels",
      tags: ["Templates", "Essays", "Examples"]
    },
    {
      title: "Interview Preparation Bootcamp",
      description: "Comprehensive interview prep with practice questions and expert feedback",
      type: "Video Series",
      category: "Interview Prep", 
      icon: Video,
      downloadCount: 1650,
      rating: 4.7,
      duration: "4.2 hours",
      format: "MP4",
      level: "Intermediate",
      tags: ["Interviews", "Practice", "Tips"]
    },
    {
      title: "Research Proposal Writing Guide",
      description: "Master the art of writing compelling research proposals for graduate scholarships",
      type: "Guide + Templates",
      category: "Academic Writing",
      icon: FileText,
      downloadCount: 980,
      rating: 4.8,
      size: "8 MB",
      format: "PDF + DOCX",
      level: "Advanced",
      tags: ["Research", "Proposals", "Graduate"]
    },
    {
      title: "Scholarship Budget Calculator",
      description: "Interactive tool to calculate scholarship needs and plan your financial strategy",
      type: "Excel Tool",
      category: "Financial Tools",
      icon: Calculator,
      downloadCount: 1200,
      rating: 4.6,
      size: "2 MB", 
      format: "XLSX",
      level: "All Levels",
      tags: ["Budget", "Financial", "Planning"]
    },
    {
      title: "Time Management for Students",
      description: "Proven techniques to balance studies, applications, and personal life effectively",
      type: "eBook",
      category: "Study Skills",
      icon: Clock,
      downloadCount: 2100,
      rating: 4.7,
      size: "5 MB",
      format: "PDF + EPUB",
      level: "All Levels",
      tags: ["Time Management", "Productivity", "Balance"]
    },
    {
      title: "International Student Success Podcast",
      description: "Weekly interviews with scholarship winners sharing their journey and tips",
      type: "Podcast Series",
      category: "Motivational",
      icon: Headphones,
      downloadCount: 890,
      rating: 4.9,
      episodes: "25 episodes",
      format: "MP3",
      level: "All Levels",
      tags: ["Success Stories", "Motivation", "Tips"]
    }
  ];

  const expertCourses = [
    {
      title: "Scholarship Strategy Masterclass",
      instructor: "Dr. Elena Vasquez",
      duration: "6 weeks",
      level: "Intermediate",
      rating: 4.9,
      students: 1250,
      price: "Free",
      thumbnail: "/course-scholarship.jpg",
      modules: 8,
      description: "Complete framework for identifying and winning scholarships"
    },
    {
      title: "Essay Writing Excellence",
      instructor: "Prof. James Wilson", 
      duration: "4 weeks",
      level: "All Levels",
      rating: 4.8,
      students: 980,
      price: "Premium",
      thumbnail: "/course-essay.jpg",
      modules: 6,
      description: "Transform your writing with proven techniques and templates"
    },
    {
      title: "Interview Confidence Builder",
      instructor: "Sarah Kim",
      duration: "3 weeks", 
      level: "Beginner",
      rating: 4.7,
      students: 750,
      price: "Free",
      thumbnail: "/course-interview.jpg",
      modules: 5,
      description: "Master scholarship interviews with practice and feedback"
    }
  ];

  const quickTools = [
    { name: "AI Application Adviser", description: "Chat with AI for guidance", icon: Sparkles, color: "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary", toolKey: "adviser" },
    { name: "Scholarship Comparison", description: "Compare scholarships side-by-side", icon: Scale, color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400", toolKey: "comparison" },
    { name: "AI Essay Builder", description: "Build compelling essays", icon: PenTool, color: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400", toolKey: "essay-builder" },
    { name: "Application Tracker", description: "Track deadlines and progress", icon: Calendar, color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400", toolKey: "tracker" },
    { name: "Essay Analyzer", description: "AI-powered essay feedback", icon: Brain, color: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400", toolKey: "essay-analyzer" },
    { name: "GPA Calculator", description: "Calculate and convert grades", icon: Calculator, color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400", toolKey: "gpa" },
    { name: "Scholarship Finder", description: "Personalized recommendations", icon: Search, color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400", toolKey: "finder" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Learning Resource Hub
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-fade-in">
              Access expert guides, interactive tools, video courses, and proven templates to maximize your scholarship success.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 h-5 w-5" />
              <Input 
                placeholder="Search guides, templates, courses, tools..."
                className="pl-12 py-6 text-lg bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/70 rounded-full"
              />
              <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white/20 border-white/20 text-primary-foreground hover:bg-white/30 hover-scale">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Library
              </Button>
              <Button size="lg" variant="secondary" className="hover-scale">
                <Video className="h-5 w-5 mr-2" />
                Watch Courses
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Tools */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Quick Access Tools
              </h2>
              <p className="text-lg text-muted-foreground">
                Essential tools to streamline your scholarship journey
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {quickTools.map((tool, index) => (
                <Card 
                  key={index} 
                  className="bg-card border-border hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                  onClick={() => setOpenTool(tool.toolKey)}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${tool.color} flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                      <tool.icon className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-1 md:mb-2 text-sm md:text-base">
                      {tool.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Banner */}
        <section className="py-8 bg-muted/20 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                More resources coming soon...
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  className="rounded-full hover-scale"
                  size="sm"
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Featured Resources
              </h2>
              <p className="text-lg text-muted-foreground">
                Our most popular and impactful guides to scholarship success
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {featuredResources.map((resource, index) => (
                <Card key={index} className="bg-card border-border overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 animate-fade-in">
                  <div className="aspect-video bg-gradient-primary relative">
                    <Badge className="absolute top-4 left-4 bg-white/20 text-white border-white/30">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge variant="secondary" className="mb-2">
                        {resource.category}
                      </Badge>
                      <p className="text-sm opacity-90">{resource.type}</p>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center text-white text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {resource.rating}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground line-clamp-2">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {resource.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {resource.downloadCount}
                        </span>
                      </div>
                      <Badge variant="outline">{resource.level}</Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 hover-scale"
                        onClick={() => handleDownload(resource.title)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleBookmark(resource.title)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Library */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Complete Resource Library
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive collection of tools, guides, and templates
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceLibrary.map((resource, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-soft transition-all duration-300 hover:scale-[1.02] animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <resource.icon className="h-10 w-10 text-primary" />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {resource.rating}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="mb-3">
                      {resource.category}
                    </Badge>
                    
                    <h3 className="text-lg font-semibold text-card-foreground mb-3 line-clamp-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{resource.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium">{resource.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <Badge variant="secondary" className="text-xs">{resource.level}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Downloads:</span>
                        <span className="font-medium text-green-600">{resource.downloadCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 hover-scale"
                        onClick={() => handleDownload(resource.title)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleBookmark(resource.title)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Courses */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Expert-Led Courses
              </h2>
              <p className="text-lg text-muted-foreground">
                Structured learning paths designed by scholarship experts
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {expertCourses.map((course, index) => (
                <Card key={index} className="bg-card border-border overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className={course.price === "Free" ? "bg-green-500" : "bg-purple-500"}>
                        {course.price}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90">{course.duration} • {course.modules} modules</p>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center text-white text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {course.level}
                    </Badge>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.description}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Instructor: <span className="font-medium text-card-foreground">{course.instructor}</span>
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{course.students} students</span>
                      <span>{course.duration}</span>
                    </div>
                    <Button 
                      className="w-full hover-scale"
                      onClick={() => handleStartCourse(course.title)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-6">
              Stay Updated with New Resources
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Get notified when we release new guides, tools, and courses to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button variant="secondary" size="lg" className="hover-scale">
                <Bell className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      <ChatBot />

      {/* Tool Dialogs */}
      <AIApplicationAdviser open={openTool === "adviser"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ScholarshipComparisonTool open={openTool === "comparison"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <AIEssayBuilder open={openTool === "essay-builder"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ApplicationTracker open={openTool === "tracker"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <EssayAnalyzer open={openTool === "essay-analyzer"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <GPACalculator open={openTool === "gpa"} onOpenChange={(open) => !open && setOpenTool(null)} />
      <ScholarshipFinder open={openTool === "finder"} onOpenChange={(open) => !open && setOpenTool(null)} />
    </div>
  );
};

export default Resources;