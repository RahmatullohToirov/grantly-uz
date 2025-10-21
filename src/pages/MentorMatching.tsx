import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
  MapPin,
  Send
} from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  title: string | null;
  expertise: string[] | null;
  bio: string | null;
  avatar_url: string | null;
  contact_info: string | null;
  available: boolean;
}

const MentorMatching = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: "Error",
        description: "Failed to load mentors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request mentorship.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMentor) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          user_id: user.id,
          mentor_id: selectedMentor.id,
          message: requestMessage,
          status: 'Pending'
        });

      if (error) throw error;

      toast({
        title: "Request Sent!",
        description: `Your mentorship request to ${selectedMentor.name} has been submitted.`,
      });

      setSelectedMentor(null);
      setRequestMessage("");
    } catch (error) {
      console.error('Error submitting mentorship request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mentorCategories = [
    { name: "All Mentors", count: mentors.length, active: true },
    { name: "STEM", count: mentors.filter(m => m.expertise?.includes("STEM")).length },
    { name: "Arts & Humanities", count: mentors.filter(m => m.expertise?.includes("Arts")).length },
    { name: "Business", count: mentors.filter(m => m.expertise?.includes("Business")).length },
    { name: "Medicine", count: mentors.filter(m => m.expertise?.includes("Medicine")).length },
    { name: "Law", count: mentors.filter(m => m.expertise?.includes("Law")).length }
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
            <h2 className="text-2xl font-bold text-foreground">Available Mentors</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading mentors...</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No mentors available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="border-border hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          {mentor.avatar_url ? (
                            <AvatarImage src={mentor.avatar_url} alt={mentor.name} />
                          ) : (
                            <AvatarFallback className="text-lg">
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-card-foreground">
                              {mentor.name}
                            </h3>
                            {mentor.title && (
                              <p className="text-muted-foreground text-sm mb-2">
                                {mentor.title}
                              </p>
                            )}
                          </div>
                          <Badge>Available</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {mentor.bio && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {mentor.bio}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex-1" onClick={() => setSelectedMentor(mentor)}>
                            Request Mentorship
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Mentorship from {mentor.name}</DialogTitle>
                            <DialogDescription>
                              Send a message introducing yourself and explaining why you'd like to connect.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <Textarea
                              placeholder="Tell the mentor about yourself and your goals..."
                              value={requestMessage}
                              onChange={(e) => setRequestMessage(e.target.value)}
                              rows={5}
                            />
                            <Button 
                              className="w-full" 
                              onClick={handleRequestMentorship}
                              disabled={submitting || !requestMessage.trim()}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {submitting ? "Sending..." : "Send Request"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {mentor.contact_info && (
                        <Button variant="outline" size="icon">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
