import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Award,
  BookOpen,
  Heart,
  Globe,
  TrendingUp,
  Star,
  ArrowRight,
  Search,
  Filter,
  UserPlus,
  Bookmark,
  ThumbsUp,
  Share2,
  Bell
} from "lucide-react";

const Community = () => {
  const { toast } = useToast();

  const handleJoinCommunity = () => {
    toast({
      title: "Welcome to Grantly Community!",
      description: "You've successfully joined our scholarship community. Start connecting with fellow scholars!",
    });
  };

  const handleBookSession = (mentorName: string) => {
    toast({
      title: "Session Booking",
      description: `Booking a session with ${mentorName}. You'll receive a confirmation email shortly.`,
    });
  };

  const handleJoinEvent = (eventTitle: string) => {
    toast({
      title: "Event Registration",
      description: `You've registered for "${eventTitle}". Calendar invite sent to your email.`,
    });
  };

  const handleFollowUser = (userName: string) => {
    toast({
      title: "Following User",
      description: `You're now following ${userName}. You'll see their updates in your feed.`,
    });
  };

  const communityStats = [
    { icon: Users, number: "25,000+", label: "Active Scholars", color: "text-blue-600" },
    { icon: Award, number: "4,200+", label: "Success Stories", color: "text-green-600" },
    { icon: MessageCircle, number: "180,000+", label: "Discussions", color: "text-purple-600" },
    { icon: Globe, number: "95+", label: "Countries", color: "text-orange-600" }
  ];

  const successStories = [
    {
      name: "Aisha Patel",
      scholarship: "Gates Cambridge Scholarship",
      amount: "$75,000",
      university: "Cambridge University",
      country: "India",
      field: "Computer Science",
      image: "/placeholder-aisha.jpg",
      quote: "The Grantly community was my support system. The mentorship and peer feedback on my essays made all the difference.",
      likes: 234,
      verified: true
    },
    {
      name: "Carlos Rodriguez", 
      scholarship: "Fulbright Program",
      amount: "$45,000",
      university: "MIT",
      country: "Mexico",
      field: "Engineering",
      image: "/placeholder-carlos.jpg",
      quote: "Through Grantly's community events, I connected with alumni who guided me through the entire application process.",
      likes: 189,
      verified: true
    },
    {
      name: "Fatima Al-Zahra",
      scholarship: "Rhodes Scholarship",
      amount: "Full Coverage",
      university: "Oxford University",
      country: "Morocco",
      field: "International Relations",
      image: "/placeholder-fatima.jpg",
      quote: "The mock interview sessions with community mentors prepared me perfectly for the actual Rhodes interview.",
      likes: 312,
      verified: true
    }
  ];

  const topMentors = [
    {
      name: "Dr. Elena Vasquez",
      title: "Former Rhodes Scholar",
      expertise: ["STEM Scholarships", "Research Proposals"],
      university: "Harvard PhD",
      sessions: 280,
      rating: 4.9,
      responseTime: "2 hours",
      specialties: "Gates Cambridge, NSF, Fulbright",
      image: "/placeholder-elena.jpg",
      verified: true,
      nextAvailable: "Tomorrow 2:00 PM"
    },
    {
      name: "Prof. Michael Chen",
      title: "Fulbright Alumni & Professor",
      expertise: ["Essay Writing", "Interview Prep"],
      university: "Stanford Professor",
      sessions: 350,
      rating: 4.8,
      responseTime: "1 hour",
      specialties: "Fulbright, Marshall, Churchill",
      image: "/placeholder-michael.jpg",
      verified: true,
      nextAvailable: "Today 6:00 PM"
    },
    {
      name: "Sarah Kim",
      title: "Gates Scholar Alumni",
      expertise: ["Personal Statements", "Leadership Essays"],
      university: "Cambridge Graduate",
      sessions: 190,
      rating: 5.0,
      responseTime: "30 minutes",
      specialties: "Gates Cambridge, Commonwealth",
      image: "/placeholder-sarah.jpg",
      verified: true,
      nextAvailable: "Tomorrow 10:00 AM"
    }
  ];

  const upcomingEvents = [
    {
      title: "Scholarship Essay Masterclass",
      date: "January 28, 2025",
      time: "2:00 PM EST",
      type: "Workshop",
      attendees: 127,
      maxAttendees: 150,
      instructor: "Dr. Elena Vasquez",
      level: "Intermediate",
      topics: ["Personal Statements", "Research Proposals", "Leadership Essays"],
      price: "Free"
    },
    {
      title: "International Student Success Panel",
      date: "February 2, 2025",
      time: "1:00 PM EST",
      type: "Webinar",
      attendees: 234,
      maxAttendees: 300,
      instructor: "Multiple Alumni",
      level: "All Levels",
      topics: ["Cultural Adaptation", "Academic Excellence", "Networking"],
      price: "Free"
    },
    {
      title: "STEM Scholarship Strategies",
      date: "February 5, 2025",
      time: "3:00 PM EST",
      type: "Workshop",
      attendees: 89,
      maxAttendees: 100,
      instructor: "Prof. Michael Chen",
      level: "Advanced",
      topics: ["Research Experience", "Technical Writing", "Innovation"],
      price: "Premium"
    }
  ];

  const communityUpdates = [
    {
      user: "Maria Santos",
      action: "won the Chevening Scholarship",
      amount: "$50,000",
      university: "London School of Economics",
      timeAgo: "2 hours ago",
      likes: 45,
      comments: 12,
      avatar: "/placeholder-maria.jpg"
    },
    {
      user: "Ahmed Hassan",
      action: "got accepted to Oxford Rhodes",
      amount: "Full funding",
      university: "Oxford University",
      timeAgo: "5 hours ago", 
      likes: 89,
      comments: 23,
      avatar: "/placeholder-ahmed.jpg"
    },
    {
      user: "Dr. Jennifer Liu",
      action: "shared new workshop",
      content: "Interview Preparation Bootcamp",
      timeAgo: "1 day ago",
      likes: 156,
      comments: 34,
      avatar: "/placeholder-jennifer.jpg"
    }
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
              Grantly Scholar Community
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-fade-in">
              Connect with 25,000+ successful scholars, expert mentors, and inspiring alumni who support each other's journey to academic excellence.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 h-5 w-5" />
              <Input 
                placeholder="Search scholars, mentors, discussions..."
                className="pl-12 py-6 text-lg bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/70 rounded-full"
              />
              <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white/20 border-white/20 text-primary-foreground hover:bg-white/30 hover-scale"
                onClick={handleJoinCommunity}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Join Community
              </Button>
              <Button size="lg" variant="secondary" className="hover-scale">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in hover-scale">
                  <div className="bg-primary/10 rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                    <stat.icon className={`h-8 w-8 md:h-10 md:w-10 ${stat.color}`} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Community Feed */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Live Community Updates
              </h2>
              <p className="text-lg text-muted-foreground">
                Celebrate wins and stay connected with community achievements
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {communityUpdates.map((update, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 hover:scale-[1.01] animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="text-lg bg-primary/10">
                          {update.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-card-foreground">{update.user}</span>
                          <span className="text-muted-foreground">{update.action}</span>
                          {update.amount && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              {update.amount}
                            </Badge>
                          )}
                        </div>
                        {update.university && (
                          <p className="text-muted-foreground mb-3">{update.university}</p>
                        )}
                        {update.content && (
                          <p className="text-card-foreground mb-3">{update.content}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{update.timeAgo}</span>
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="hover-scale">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {update.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="hover-scale">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {update.comments}
                            </Button>
                            <Button variant="ghost" size="sm" className="hover-scale">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Community Success Stories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real students who achieved their dreams with community support
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300 hover:-translate-y-2 animate-fade-in">
                  <CardHeader className="text-center pb-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/20">
                        <AvatarFallback className="text-xl bg-gradient-primary text-primary-foreground">
                          {story.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {story.verified && (
                        <Badge className="absolute top-0 right-1/3 bg-green-100 text-green-800 border-green-200">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-card-foreground">
                      {story.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      <Badge variant="default">{story.scholarship}</Badge>
                      <Badge variant="outline">{story.country}</Badge>
                      <Badge variant="secondary">{story.field}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-primary mb-1">{story.amount}</p>
                      <p className="text-sm text-muted-foreground">{story.university}</p>
                    </div>
                    <blockquote className="text-muted-foreground italic mb-4 leading-relaxed">
                      "{story.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-scale"
                        onClick={() => handleFollowUser(story.name)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </Button>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {story.likes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Mentors */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Connect with Expert Mentors
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get personalized guidance from scholars who've been where you want to go
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {topMentors.map((mentor, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-fade-in">
                  <CardHeader className="text-center">
                    <div className="relative">
                      <Avatar className="w-28 h-28 mx-auto mb-4 ring-4 ring-primary/20">
                        <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {mentor.verified && (
                        <Badge className="absolute top-0 right-1/4 bg-blue-100 text-blue-800 border-blue-200">
                          <Star className="h-3 w-3 mr-1" />
                          Expert
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-card-foreground mb-2">
                      {mentor.name}
                    </CardTitle>
                    <p className="text-muted-foreground mb-3">{mentor.title}</p>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold">{mentor.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{mentor.sessions} sessions</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-card-foreground mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-card-foreground mb-1">Specialties:</p>
                      <p className="text-sm text-muted-foreground">{mentor.specialties}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response time:</span>
                      <span className="font-medium text-green-600">{mentor.responseTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next available:</span>
                      <span className="font-medium text-primary">{mentor.nextAvailable}</span>
                    </div>
                    
                    <Button 
                      className="w-full hover-scale"
                      onClick={() => handleBookSession(mentor.name)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Upcoming Community Events
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join live workshops, webinars, and networking events with experts
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-soft transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={event.type === "Workshop" ? "default" : "secondary"}>
                        {event.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.price === "Free" ? "outline" : "default"}>
                          {event.price}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-card-foreground mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div>
                        {event.time}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      Instructor: <span className="font-medium text-card-foreground">{event.instructor}</span>
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-card-foreground mb-2">Topics covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {event.topics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees} registered
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full hover-scale"
                      onClick={() => handleJoinEvent(event.title)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Join Event
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Join Our Thriving Community?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Connect with successful scholars, get expert mentorship, and accelerate your scholarship journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover-scale"
                onClick={handleJoinCommunity}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Join the Community
              </Button>
              <Button size="lg" variant="secondary" className="hover-scale">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Networking
              </Button>
            </div>
          </div>
        </section>
      </main>
      <ChatBot />
    </div>
  );
};

export default Community;