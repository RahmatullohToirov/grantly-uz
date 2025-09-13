import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  MessageCircle, 
  Video, 
  Calendar, 
  Search,
  Filter,
  Clock,
  Award,
  Users,
  CheckCircle,
  Heart,
  MapPin
} from "lucide-react";

const MentorMatching = () => {
  const mentorCategories = [
    { name: "All Mentors", count: 156, active: true },
    { name: "STEM", count: 45 },
    { name: "Arts & Humanities", count: 38 },
    { name: "Business", count: 32 },
    { name: "Medicine", count: 28 },
    { name: "Law", count: 13 }
  ];

  const featuredMentors = [
    {
      id: 1,
      name: "Dr. Sarah Kim",
      title: "Rhodes Scholar, Harvard PhD",
      expertise: ["STEM Scholarships", "Research Applications", "Graduate School"],
      university: "Harvard University",
      country: "United States",
      rating: 4.9,
      reviews: 127,
      sessions: 450,
      responseTime: "< 2 hours",
      languages: ["English", "Korean"],
      price: 75,
      about: "Former Rhodes Scholar with 8+ years helping students secure STEM scholarships. Specializing in research-based applications and graduate school prep.",
      availability: "Available this week",
      verified: true,
      topMentor: true
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      title: "Fulbright Scholar, MIT Professor",
      expertise: ["Engineering", "International Students", "PhD Applications"],
      university: "MIT",
      country: "United States",
      rating: 4.8,
      reviews: 203,
      sessions: 672,
      responseTime: "< 4 hours",
      languages: ["English", "Mandarin"],
      price: 90,
      about: "MIT professor and former Fulbright Scholar. Expert in helping international students navigate US scholarship applications.",
      availability: "Next available: Tomorrow",
      verified: true,
      topMentor: true
    },
    {
      id: 3,
      name: "Dr. Aisha Patel",
      title: "Gates Scholar, Oxford DPhil",
      expertise: ["Medical School", "Global Health", "Leadership"],
      university: "Oxford University",
      country: "United Kingdom",
      rating: 5.0,
      reviews: 89,
      sessions: 234,
      responseTime: "< 1 hour",
      languages: ["English", "Hindi", "Gujarati"],
      price: 80,
      about: "Former Gates Scholar passionate about supporting underrepresented students in medicine and global health.",
      availability: "Available this week",
      verified: true,
      topMentor: false
    },
    {
      id: 4,
      name: "Alexander Rodriguez",
      title: "Marshall Scholar, LSE Graduate",
      expertise: ["Business School", "Finance", "Entrepreneurship"],
      university: "London School of Economics",
      country: "United Kingdom",
      rating: 4.7,
      reviews: 156,
      sessions: 389,
      responseTime: "< 3 hours",
      languages: ["English", "Spanish"],
      price: 65,
      about: "Marshall Scholar and successful entrepreneur. Helping students build compelling business school applications.",
      availability: "Available this week",
      verified: true,
      topMentor: false
    }
  ];

  const matchingCriteria = [
    {
      icon: Award,
      title: "Academic Background",
      description: "Match with mentors who've walked your academic path"
    },
    {
      icon: Users,
      title: "Field of Study",
      description: "Connect with experts in your specific discipline"
    },
    {
      icon: MapPin,
      title: "Geographic Experience",
      description: "Find mentors familiar with your target regions"
    },
    {
      icon: Star,
      title: "Success Track Record",
      description: "Work with proven mentors with high success rates"
    }
  ];

  const sessionTypes = [
    {
      icon: Video,
      title: "Video Mentoring",
      duration: "30-60 min",
      description: "One-on-one video sessions for personalized guidance"
    },
    {
      icon: MessageCircle,
      title: "Message Exchange",
      duration: "Ongoing",
      description: "Continuous support through messaging platform"
    },
    {
      icon: Calendar,
      title: "Regular Check-ins",
      duration: "Weekly",
      description: "Scheduled regular sessions to track your progress"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Matching</h1>
          <p className="text-muted-foreground">
            Connect with successful scholars and experts who can guide your scholarship journey
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search mentors by expertise, university, or scholarship..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {mentorCategories.map((category, index) => (
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

        {/* How Matching Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How We Match You</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {matchingCriteria.map((criteria, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="p-6">
                  <criteria.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-card-foreground mb-2">
                    {criteria.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {criteria.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Mentors */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Mentors</h2>
            <Button variant="outline">View All Mentors</Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {featuredMentors.map((mentor) => (
              <Card key={mentor.id} className="border-border hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-lg">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {mentor.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {mentor.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {mentor.title}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{mentor.rating}</span>
                              <span className="text-muted-foreground text-sm">
                                ({mentor.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">${mentor.price}</div>
                          <div className="text-sm text-muted-foreground">per session</div>
                          {mentor.topMentor && (
                            <Badge className="mt-1">Top Mentor</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {mentor.about}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {mentor.responseTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {mentor.sessions} sessions
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mentor.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {mentor.availability}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      Book Session
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Session Types */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Mentoring Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {sessionTypes.map((type, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="p-6">
                  <type.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {type.title}
                  </h3>
                  <div className="text-sm text-muted-foreground mb-3">
                    {type.duration}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {type.description}
                  </p>
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

export default MentorMatching;