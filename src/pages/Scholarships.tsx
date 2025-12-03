import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScholarships, useSavedScholarships, useToggleSaveScholarship, useAddApplication, type Scholarship } from "@/hooks/useScholarships";
import { useAIRecommendations } from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/AuthContext";
import { format, isAfter, addDays } from "date-fns";
import { 
  Search, 
  Filter, 
  BookmarkIcon, 
  MapPinIcon, 
  CalendarIcon, 
  DollarSignIcon,
  GraduationCapIcon,
  Loader2,
  ExternalLink
} from "lucide-react";

const ScholarshipCard = ({ scholarship, onToggleSave, onAddToTracker, isSaving, isAddingToTracker }: {
  scholarship: Scholarship;
  onToggleSave: (id: string, isSaved: boolean) => void;
  onAddToTracker: (id: string) => void;
  isSaving: boolean;
  isAddingToTracker: boolean;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (score >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-muted text-muted-foreground";
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    try {
      return format(new Date(deadline), 'MMM d, yyyy');
    } catch {
      return deadline;
    }
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Varies';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTags = (scholarship: Scholarship): string[] => {
    const tags: string[] = [];
    if (scholarship.category) tags.push(scholarship.category);
    if (scholarship.location) tags.push(scholarship.location);
    return tags.slice(0, 3);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg">{scholarship.title}</CardTitle>
              {scholarship.isSaved && (
                <BookmarkIcon className="h-4 w-4 text-primary fill-current" />
              )}
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              {scholarship.source_name || 'Scholarship Provider'}
            </CardDescription>
          </div>
          <Badge className={`${getScoreColor(scholarship.matchScore)} border-0`}>
            {scholarship.matchScore}% match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {scholarship.description || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {getTags(scholarship).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
            <span>{formatAmount(scholarship.amount)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
            <span>{formatDeadline(scholarship.deadline)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPinIcon className="h-3 w-3 text-muted-foreground" />
            <span>{scholarship.location || 'Various'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GraduationCapIcon className="h-3 w-3 text-muted-foreground" />
            <span>{scholarship.category || 'General'}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {scholarship.link ? (
            <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          ) : (
            <Button className="flex-1" disabled>
              No Link Available
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onToggleSave(scholarship.id, scholarship.isSaved)}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BookmarkIcon className={`h-4 w-4 ${scholarship.isSaved ? 'fill-current text-primary' : ''}`} />
            )}
          </Button>
          {!scholarship.isApplied && (
            <Button 
              variant="outline"
              onClick={() => onAddToTracker(scholarship.id)}
              disabled={isAddingToTracker}
            >
              {isAddingToTracker ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add to Tracker'}
            </Button>
          )}
          {scholarship.isApplied && (
            <Badge variant="outline" className="flex items-center px-3">
              In Tracker
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { data: scholarships, isLoading } = useScholarships(searchQuery);
  const { data: savedScholarships, isLoading: savedLoading } = useSavedScholarships();
  const { data: recommendations, isLoading: recommendationsLoading } = useAIRecommendations();
  const toggleSave = useToggleSaveScholarship();
  const addApplication = useAddApplication();

  const handleToggleSave = (scholarshipId: string, isSaved: boolean) => {
    if (!user) return;
    toggleSave.mutate({ scholarshipId, isSaved });
  };

  const handleAddToTracker = (scholarshipId: string) => {
    if (!user) return;
    addApplication.mutate({ scholarshipId });
  };

  // Filter scholarships with upcoming deadlines (next 30 days)
  const upcomingDeadlines = scholarships?.filter(s => {
    if (!s.deadline) return false;
    try {
      const deadline = new Date(s.deadline);
      const thirtyDaysFromNow = addDays(new Date(), 30);
      return isAfter(deadline, new Date()) && !isAfter(deadline, thirtyDaysFromNow);
    } catch {
      return false;
    }
  }) || [];

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
            <TabsTrigger value="all">All Opportunities</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedScholarships?.length || 0})</TabsTrigger>
            <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
            <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : scholarships && scholarships.length > 0 ? (
              scholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onToggleSave={handleToggleSave}
                  onAddToTracker={handleAddToTracker}
                  isSaving={toggleSave.isPending}
                  isAddingToTracker={addApplication.isPending}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <GraduationCapIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try a different search term' : 'Check back later for new opportunities'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 mt-6">
            {!user ? (
              <div className="text-center py-12">
                <BookmarkIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Sign in to save scholarships</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to bookmark scholarships for later
                </p>
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </div>
            ) : savedLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : savedScholarships && savedScholarships.length > 0 ? (
              savedScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onToggleSave={handleToggleSave}
                  onAddToTracker={handleAddToTracker}
                  isSaving={toggleSave.isPending}
                  isAddingToTracker={addApplication.isPending}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <BookmarkIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No saved scholarships</h3>
                <p className="text-muted-foreground">
                  Save scholarships to access them later
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4 mt-6">
            {!user ? (
              <div className="text-center py-12">
                <GraduationCapIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Sign in for AI recommendations</h3>
                <p className="text-muted-foreground mb-4">
                  Get personalized scholarship matches based on your profile
                </p>
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </div>
            ) : recommendationsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm mb-4">
                  Based on your profile, we recommend these scholarships for you:
                </p>
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription>{rec.location || 'Various locations'}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                          {rec.matchScore}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {rec.description || 'Great opportunity based on your profile'}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          onClick={() => handleToggleSave(rec.id, false)}
                          disabled={toggleSave.isPending}
                        >
                          {toggleSave.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BookmarkIcon className="h-4 w-4 mr-2" />}
                          Save
                        </Button>
                        <Button 
                          onClick={() => handleAddToTracker(rec.id)}
                          disabled={addApplication.isPending}
                        >
                          {addApplication.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Add to Tracker
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCapIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Complete your profile</h3>
                <p className="text-muted-foreground mb-4">
                  Add your interests and education details to get personalized recommendations
                </p>
                <Link to="/profile">
                  <Button>Update Profile</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : upcomingDeadlines.length > 0 ? (
              <>
                <p className="text-muted-foreground text-sm mb-4">
                  Scholarships with deadlines in the next 30 days:
                </p>
                {upcomingDeadlines.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleSave={handleToggleSave}
                    onAddToTracker={handleAddToTracker}
                    isSaving={toggleSave.isPending}
                    isAddingToTracker={addApplication.isPending}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No upcoming deadlines</h3>
                <p className="text-muted-foreground">
                  No scholarships with deadlines in the next 30 days
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Scholarships;
