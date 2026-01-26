import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import CreatePostForm from "@/components/community/CreatePostForm";
import CommunityFeed from "@/components/community/CommunityFeed";
import { 
  MessageCircle, 
  UserPlus,
  Heart,
  Sparkles
} from "lucide-react";

const Community = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main>
        {/* Hero Section - Simplified */}
        <section className="py-16 md:py-24 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Building together</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Grantly Scholar Community
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 animate-fade-in">
              Connect with fellow scholars, share your journey, and support each other on the path to academic excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user && (
                <Button 
                  size="lg" 
                  className="bg-white/20 border-white/20 text-primary-foreground hover:bg-white/30 hover-scale"
                  onClick={() => window.location.href = "/"}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
              )}
              <Button 
                size="lg" 
                variant="secondary" 
                className="hover-scale"
                onClick={() => document.getElementById('community-feed')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>
        </section>

        {/* Community Feed Section */}
        <section id="community-feed" className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Community Feed
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Share your scholarship journey, ask questions, and celebrate wins with fellow scholars
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Create Post Form */}
              <CreatePostForm />
              
              {/* Posts Feed */}
              <CommunityFeed />
            </div>
          </div>
        </section>

        {/* Community Values Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div className="p-6 rounded-2xl bg-muted/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Support Each Other</h3>
                  <p className="text-sm text-muted-foreground">
                    Share advice, encouragement, and celebrate each other's wins
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl bg-muted/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Share Knowledge</h3>
                  <p className="text-sm text-muted-foreground">
                    Exchange tips on applications, essays, and interviews
                  </p>
                </div>
                
                <div className="p-6 rounded-2xl bg-muted/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Grow Together</h3>
                  <p className="text-sm text-muted-foreground">
                    Build connections that last beyond scholarship applications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <ChatBot />
    </div>
  );
};

export default Community;
