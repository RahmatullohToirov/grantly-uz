import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageCircle, Award, Globe } from "lucide-react";

const CommunityStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["community-stats"],
    queryFn: async () => {
      // Get real counts from database
      const [postsResult, profilesResult, commentsResult] = await Promise.all([
        supabase.from("community_posts").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("community_comments").select("id", { count: "exact", head: true }),
      ]);

      return {
        scholars: profilesResult.count || 0,
        discussions: (postsResult.count || 0) + (commentsResult.count || 0),
        // These would come from actual data in production
        successStories: 42,
        countries: 35,
      };
    },
    staleTime: 60000, // Cache for 1 minute
  });

  const communityStats = [
    { 
      icon: Users, 
      number: stats ? `${stats.scholars.toLocaleString()}` : "...", 
      label: "Active Scholars", 
      color: "text-blue-600" 
    },
    { 
      icon: Award, 
      number: stats ? `${stats.successStories}` : "...", 
      label: "Success Stories", 
      color: "text-green-600" 
    },
    { 
      icon: MessageCircle, 
      number: stats ? `${stats.discussions}` : "...", 
      label: "Discussions", 
      color: "text-purple-600" 
    },
    { 
      icon: Globe, 
      number: stats ? `${stats.countries}+` : "...", 
      label: "Countries", 
      color: "text-orange-600" 
    }
  ];

  return (
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
  );
};

export default CommunityStats;
