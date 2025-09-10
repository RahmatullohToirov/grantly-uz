import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ArrowRight
} from "lucide-react";

const Community = () => {
  const communityStats = [
    { icon: Users, number: "15,000+", label: "Active Members" },
    { icon: Award, number: "2,500+", label: "Success Stories" },
    { icon: MessageCircle, number: "50,000+", label: "Messages Shared" },
    { icon: Globe, number: "80+", label: "Countries" }
  ];

  const successStories = [
    {
      name: "Maria Rodriguez",
      scholarship: "Gates Millennium Scholarship",
      amount: "$50,000",
      university: "Stanford University",
      country: "Mexico",
      image: "/placeholder-maria.jpg",
      quote: "Grantly's community helped me refine my essays and connect with mentors who believed in my dreams."
    },
    {
      name: "James Chen",
      scholarship: "Rhodes Scholarship",
      amount: "Full Coverage",
      university: "Oxford University", 
      country: "Singapore",
      image: "/placeholder-james.jpg",
      quote: "The support I received from fellow scholars was incredible. We all celebrated each other's wins!"
    },
    {
      name: "Fatima Al-Zahra",
      scholarship: "Fulbright Scholarship",
      amount: "$40,000",
      university: "MIT",
      country: "Morocco",
      image: "/placeholder-fatima.jpg",
      quote: "Finding mentors who understood my background made all the difference in my application journey."
    }
  ];

  const mentors = [
    {
      name: "Dr. Sarah Kim",
      title: "Former Rhodes Scholar",
      expertise: "STEM Scholarships",
      university: "Harvard PhD",
      sessions: 150,
      rating: 4.9,
      image: "/placeholder-mentor-1.jpg"
    },
    {
      name: "Prof. Michael Brown", 
      title: "Fulbright Alumni",
      expertise: "Arts & Humanities",
      university: "Yale Professor",
      sessions: 200,
      rating: 4.8,
      image: "/placeholder-mentor-2.jpg"
    },
    {
      name: "Alexandra Popov",
      title: "Gates Scholar Alumni",
      expertise: "International Students",
      university: "Cambridge Graduate",
      sessions: 120,
      rating: 5.0,
      image: "/placeholder-mentor-3.jpg"
    }
  ];

  const upcomingEvents = [
    {
      title: "Scholarship Essay Writing Workshop",
      date: "January 25, 2024",
      time: "2:00 PM EST",
      type: "Workshop",
      attendees: 45,
      maxAttendees: 50
    },
    {
      title: "International Student Success Stories",
      date: "January 28, 2024", 
      time: "1:00 PM EST",
      type: "Webinar",
      attendees: 120,
      maxAttendees: 200
    },
    {
      title: "STEM Scholarship Panel Discussion",
      date: "February 2, 2024",
      time: "3:00 PM EST", 
      type: "Panel",
      attendees: 80,
      maxAttendees: 100
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Grantly Scholar Community
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              Join a global network of successful scholars, experienced mentors, and inspiring alumni who support each other's journey to success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white/20 border-white/20 text-primary-foreground hover:bg-white/30">
                Join Community
              </Button>
              <Button size="lg" variant="secondary">
                Find a Mentor
              </Button>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Real students who found their dream scholarships with help from our community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300">
                  <CardHeader className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarFallback className="text-lg">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl text-card-foreground">
                      {story.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="default">{story.scholarship}</Badge>
                      <Badge variant="outline">{story.country}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <p className="text-lg font-semibold text-primary">{story.amount}</p>
                      <p className="text-sm text-muted-foreground">{story.university}</p>
                    </div>
                    <blockquote className="text-muted-foreground italic">
                      "{story.quote}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Mentors */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Mentors
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experienced scholars and professionals ready to guide your journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {mentors.map((mentor, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300">
                  <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarFallback className="text-xl">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl text-card-foreground">
                      {mentor.name}
                    </CardTitle>
                    <p className="text-muted-foreground">{mentor.title}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mentor.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({mentor.sessions} sessions)
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <Badge className="mb-2">{mentor.expertise}</Badge>
                      <p className="text-sm text-muted-foreground">{mentor.university}</p>
                    </div>
                    <Button className="w-full">
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Upcoming Events
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join live workshops, webinars, and networking events
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge>{event.type}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
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
                    <Button variant="outline" className="w-full">
                      Join Event
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Benefits */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Join Our Community?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Peer Support
                </h3>
                <p className="text-muted-foreground">
                  Connect with fellow students facing similar challenges and celebrate wins together.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Expert Guidance
                </h3>
                <p className="text-muted-foreground">
                  Learn from mentors who've successfully navigated the scholarship process.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Proven Results
                </h3>
                <p className="text-muted-foreground">
                  Access strategies and tips that have helped thousands secure funding.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Global Network
                </h3>
                <p className="text-muted-foreground">
                  Build international connections that last beyond your scholarship journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Start connecting with successful scholars and mentors who want to see you succeed.
            </p>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Join the Community
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;