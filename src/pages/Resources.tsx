import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search,
  Download,
  ExternalLink,
  CheckCircle,
  Circle
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  category: string | null;
  link: string | null;
  file_url: string | null;
  created_at: string;
}

interface Progress {
  id: string;
  resource_id: string;
  completed: boolean;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchResources();
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_resource_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const toggleComplete = async (resourceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress.",
        variant: "destructive",
      });
      return;
    }

    const existingProgress = progress.find(p => p.resource_id === resourceId);

    try {
      if (existingProgress) {
        const { error } = await supabase
          .from('user_resource_progress')
          .update({
            completed: !existingProgress.completed,
            completed_at: !existingProgress.completed ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_resource_progress')
          .insert({
            user_id: user.id,
            resource_id: resourceId,
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      toast({
        title: "Progress Updated",
        description: "Your progress has been saved!",
      });

      fetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive",
      });
    }
  };

  const isCompleted = (resourceId: string) => {
    return progress.some(p => p.resource_id === resourceId && p.completed);
  };

  const categories = ["All", ...new Set(resources.map(r => r.category).filter(Boolean))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconForType = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return Video;
      case 'document':
      case 'pdf':
        return FileText;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Access guides, templates, and tools to enhance your scholarship applications
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No resources found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = getIconForType(resource.type);
              const completed = isCompleted(resource.id);

              return (
                <Card key={resource.id} className="hover:shadow-card transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-10 w-10 text-primary" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleComplete(resource.id)}
                      >
                        {completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {resource.category && (
                      <Badge variant="outline" className="w-fit">
                        {resource.category}
                      </Badge>
                    )}
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {resource.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {resource.description}
                      </p>
                    )}
                    {resource.type && (
                      <Badge variant="secondary" className="mb-4">
                        {resource.type}
                      </Badge>
                    )}
                    <div className="flex gap-2">
                      {resource.link && (
                        <Button asChild className="flex-1">
                          <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </a>
                        </Button>
                      )}
                      {resource.file_url && (
                        <Button asChild variant="outline">
                          <a href={resource.file_url} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <ChatBot />
    </div>
  );
};

export default Resources;
