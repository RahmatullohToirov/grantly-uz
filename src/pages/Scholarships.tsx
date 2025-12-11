import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScholarshipDetailModal } from "@/components/ScholarshipDetailModal";
import { useScholarships, useSavedScholarships, useToggleSaveScholarship, useAddApplication, type Scholarship } from "@/hooks/useScholarships";
import { useAIRecommendations } from "@/hooks/useDashboardData";
import { useEnhancedProfile, calculateEnhancedMatchScore, type MatchResult } from "@/hooks/useEnhancedMatching";
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
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react";

interface ExtendedScholarship extends Scholarship {
  isEligible?: boolean;
  ineligibilityReasons?: string[];
}

const ScholarshipCard = ({ 
  scholarship, 
  onToggleSave, 
  onAddToTracker, 
  onViewDetails,
  isSaving, 
  isAddingToTracker 
}: {
  scholarship: ExtendedScholarship;
  onToggleSave: (id: string, isSaved: boolean) => void;
  onAddToTracker: (id: string) => void;
  onViewDetails: (scholarship: ExtendedScholarship) => void;
  isSaving: boolean;
  isAddingToTracker: boolean;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    if (score >= 70) return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
    return "bg-muted text-muted-foreground";
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'Rolling';
    try {
      return format(new Date(deadline), 'MMM d, yyyy');
    } catch {
      return deadline;
    }
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    try {
      const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days;
    } catch {
      return null;
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

  const daysRemaining = getDaysRemaining(scholarship.deadline);
  const isUrgent = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
      {/* Urgency Banner */}
      {isUrgent && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1.5 text-white text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Only {daysRemaining} days left to apply!
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {scholarship.isSaved && (
                <BookmarkIcon className="h-4 w-4 text-primary fill-current flex-shrink-0" />
              )}
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {scholarship.title}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {scholarship.source_name || 'Scholarship Provider'}
            </CardDescription>
          </div>
          
          {/* Match Score Badge */}
          <div className="flex flex-col items-center">
            <Badge className={`${getScoreColor(scholarship.matchScore)} border-0 px-3 py-1 text-sm font-bold`}>
              {scholarship.matchScore}%
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">match</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {scholarship.description || 'No description available. Click to view details.'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {getTags(scholarship).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {!scholarship.isEligible && (
            <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200">
              May not qualify
            </Badge>
          )}
        </div>
        
        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
              <DollarSignIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Award</p>
              <p className="text-sm font-semibold">{formatAmount(scholarship.amount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isUrgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <CalendarIcon className={`h-3.5 w-3.5 ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className={`text-sm font-semibold ${isUrgent ? 'text-red-600 dark:text-red-400' : ''}`}>
                {formatDeadline(scholarship.deadline)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
              <MapPinIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-semibold">{scholarship.location || 'Global'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/30">
              <GraduationCapIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-semibold">{scholarship.category || 'General'}</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails(scholarship)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
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
          {!scholarship.isApplied ? (
            <Button 
              onClick={() => onAddToTracker(scholarship.id)}
              disabled={isAddingToTracker}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80"
            >
              {isAddingToTracker ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="mr-2 h-4 w-4" />}
              Track
            </Button>
          ) : (
            <Badge variant="outline" className="flex items-center px-3 py-2">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
              Tracked
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<ExtendedScholarship | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: scholarships, isLoading } = useScholarships(searchQuery);
  const { data: savedScholarships, isLoading: savedLoading } = useSavedScholarships();
  const { data: recommendations, isLoading: recommendationsLoading } = useAIRecommendations();
  const { data: enhancedProfile } = useEnhancedProfile();
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

  const handleViewDetails = (scholarship: ExtendedScholarship) => {
    setSelectedScholarship(scholarship);
    setDetailModalOpen(true);
  };

  // Calculate eligibility for all scholarships
  const scholarshipsWithEligibility = scholarships?.map(s => {
    const result = calculateEnhancedMatchScore(enhancedProfile || null, s as any);
    return {
      ...s,
      matchScore: result.matchScore,
      isEligible: result.isEligible,
      ineligibilityReasons: result.ineligibilityReasons,
    };
  }) || [];

  // Filter by eligibility if enabled
  const filteredScholarships = showEligibleOnly 
    ? scholarshipsWithEligibility.filter(s => s.isEligible)
    : scholarshipsWithEligibility;

  // Filter scholarships with upcoming deadlines (next 30 days)
  const upcomingDeadlines = filteredScholarships.filter(s => {
    if (!s.deadline) return false;
    try {
      const deadline = new Date(s.deadline);
      const thirtyDaysFromNow = addDays(new Date(), 30);
      return isAfter(deadline, new Date()) && !isAfter(deadline, thirtyDaysFromNow);
    } catch {
      return false;
    }
  });

  const eligibleCount = scholarshipsWithEligibility.filter(s => s.isEligible).length;

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
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="eligible-filter"
                  checked={showEligibleOnly}
                  onCheckedChange={setShowEligibleOnly}
                />
                <Label htmlFor="eligible-filter" className="text-sm whitespace-nowrap">
                  Eligible only ({eligibleCount})
                </Label>
              </div>
              <Button variant="outline" className="md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          
          {showEligibleOnly && !enhancedProfile && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-amber-800 dark:text-amber-200">
                Complete your profile to get accurate eligibility filtering.
              </span>
              <Link to="/profile">
                <Button variant="link" size="sm" className="text-amber-700 dark:text-amber-300 p-0 h-auto">
                  Update Profile
                </Button>
              </Link>
            </div>
          )}
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
            ) : filteredScholarships && filteredScholarships.length > 0 ? (
              <>
                {showEligibleOnly && (
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    Showing {filteredScholarships.length} scholarships you're eligible for
                  </div>
                )}
                {filteredScholarships.map((scholarship) => (
                  <div key={scholarship.id} className="relative">
                    {!scholarship.isEligible && !showEligibleOnly && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
                          May not be eligible
                        </Badge>
                      </div>
                    )}
                    <ScholarshipCard
                      scholarship={scholarship}
                      onToggleSave={handleToggleSave}
                      onAddToTracker={handleAddToTracker}
                      onViewDetails={handleViewDetails}
                      isSaving={toggleSave.isPending}
                      isAddingToTracker={addApplication.isPending}
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <GraduationCapIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try a different search term' : showEligibleOnly ? 'Try updating your profile or disable the eligibility filter' : 'Check back later for new opportunities'}
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
                  scholarship={scholarship as ExtendedScholarship}
                  onToggleSave={handleToggleSave}
                  onAddToTracker={handleAddToTracker}
                  onViewDetails={handleViewDetails}
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
                    onViewDetails={handleViewDetails}
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

      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onSave={handleToggleSave}
        onAddToTracker={handleAddToTracker}
        isSaving={toggleSave.isPending}
        isAddingToTracker={addApplication.isPending}
      />
    </div>
  );
};

export default Scholarships;
