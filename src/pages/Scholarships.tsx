import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  BookmarkIcon, 
  MapPinIcon, 
  CalendarIcon, 
  DollarSignIcon,
  GraduationCapIcon 
} from "lucide-react";

const Scholarships = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchScholarships();
    fetchFavorites();
  }, [user]);

  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load scholarships",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_favorites')
      .select('scholarship_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(new Set(data.map(f => f.scholarship_id)));
    }
  };

  const toggleFavorite = async (scholarshipId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save scholarships",
        variant: "destructive",
      });
      return;
    }

    try {
      if (favorites.has(scholarshipId)) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('scholarship_id', scholarshipId);
        
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(scholarshipId);
          return newSet;
        });

        toast({
          title: "Removed from favorites",
        });
      } else {
        await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, scholarship_id: scholarshipId });
        
        setFavorites(prev => new Set([...prev, scholarshipId]));

        toast({
          title: "Added to favorites",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const applyToScholarship = async (scholarship: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_applications')
        .insert({
          user_id: user.id,
          scholarship_id: scholarship.id,
          status: 'Applied'
        });

      if (error) throw error;

      toast({
        title: "Application started",
        description: `You've applied to ${scholarship.title}`,
      });
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already applied",
          description: "You've already applied to this scholarship",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const filteredScholarships = scholarships.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const savedScholarships = filteredScholarships.filter(s => favorites.has(s.id));

  const ScholarshipCard = ({ scholarship }: { scholarship: any }) => {
    const isSaved = favorites.has(scholarship.id);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                {isSaved && (
                  <BookmarkIcon className="h-4 w-4 text-blue-500 fill-current" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {scholarship.description}
          </p>
          
          {scholarship.category && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                {scholarship.category}
              </Badge>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
            {scholarship.amount && (
              <div className="flex items-center space-x-1">
                <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
                <span>{scholarship.amount}</span>
              </div>
            )}
            {scholarship.deadline && (
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
              </div>
            )}
            {scholarship.location && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                <span>{scholarship.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button className="flex-1" onClick={() => applyToScholarship(scholarship)}>
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => toggleFavorite(scholarship.id)}
            >
              <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            {scholarship.link && (
              <Button 
                variant="outline"
                onClick={() => window.open(scholarship.link, '_blank')}
              >
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-8">
          <Skeleton className="h-20 w-full mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Scholarship Opportunities
          </h1>
          <p className="text-muted-foreground">
            Discover and apply to scholarships that match your profile
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships by name, field, or keyword..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Opportunities ({filteredScholarships.length})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedScholarships.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredScholarships.length > 0 ? (
              filteredScholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No scholarships found. Try adjusting your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 mt-6">
            {savedScholarships.length > 0 ? (
              savedScholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))
            ) : (
              <div className="text-center py-12">
                <BookmarkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No saved scholarships yet. Start bookmarking opportunities!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Scholarships;