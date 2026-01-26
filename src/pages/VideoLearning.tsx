import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, 
  BookOpen,
  Users,
  Calendar,
  Play,
  Mic
} from "lucide-react";
import BecomeMentorForm from "@/components/mentor/BecomeMentorForm";

const VideoLearning = () => {
  const upcomingFeatures = [
    {
      icon: Video,
      title: "Video Courses",
      description: "Expert-led courses on essay writing, interviews, and applications"
    },
    {
      icon: BookOpen,
      title: "Learning Paths",
      description: "Structured journeys tailored to your experience level"
    },
    {
      icon: Play,
      title: "Quick Lessons",
      description: "Bite-sized videos for focused, efficient learning"
    },
    {
      icon: Calendar,
      title: "Live Workshops",
      description: "Interactive sessions and Q&A with scholarship experts"
    }
  ];

  const values = [
    {
      icon: Users,
      title: "Learn from Winners",
      description: "Our courses are created by successful scholarship recipients and experts"
    },
    {
      icon: Mic,
      title: "Interactive Learning",
      description: "Engage with live workshops, practice sessions, and personalized feedback"
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Hub</h1>
          <p className="text-muted-foreground">
            Master scholarship applications through expert-led video courses and interactive learning experiences
          </p>
        </div>

        {/* Become a Mentor Section */}
        <section className="mb-12">
          <BecomeMentorForm />
        </section>

        {/* What's Coming */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">What We're Building</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="border-border text-center">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Approach</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
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
