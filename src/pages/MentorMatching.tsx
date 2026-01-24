import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageCircle, 
  Video, 
  Calendar, 
  Award,
  Users,
  MapPin,
  Star
} from "lucide-react";
import BecomeMentorForm from "@/components/mentor/BecomeMentorForm";

const MentorMatching = () => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Coming soon...
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Expert Connect</h1>
          <p className="text-muted-foreground">
            Connect with successful scholars and experts who can guide your scholarship journey
          </p>
        </div>

        {/* Become a Mentor Section */}
        <section className="mb-12">
          <BecomeMentorForm />
        </section>

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
