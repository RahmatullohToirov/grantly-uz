import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ExternalLink,
  Calendar,
  DollarSign,
  MapPin,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Clock,
  FileText,
  Target,
  Bookmark,
  Share2,
  Copy,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import PreApplyModal from './PreApplyModal';
// Extended Scholarship type for the modal
interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  deadline: string | null;
  location: string | null;
  category: string | null;
  link: string | null;
  requirements: string | null;
  source_name: string | null;
  source_url?: string | null;
  matchScore: number;
  isSaved: boolean;
  isApplied: boolean;
  eligible_genders?: string[] | null;
  eligible_nationalities?: string[] | null;
  eligible_countries?: string[] | null;
  eligible_education_levels?: string[] | null;
  eligible_fields?: string[] | null;
  min_gpa?: number | null;
  min_age?: number | null;
  max_age?: number | null;
  financial_need_required?: boolean | null;
}
import type { MatchResult } from '@/hooks/useEnhancedMatching';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  matchResult?: MatchResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (id: string, isSaved: boolean) => void;
  onAddToTracker?: (id: string) => void;
  isSaving?: boolean;
  isAddingToTracker?: boolean;
}

export const ScholarshipDetailModal = ({
  scholarship,
  matchResult,
  open,
  onOpenChange,
  onSave,
  onAddToTracker,
  isSaving,
  isAddingToTracker,
}: ScholarshipDetailModalProps) => {
  const [preApplyModalOpen, setPreApplyModalOpen] = useState(false);
  
  if (!scholarship) return null;

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Amount varies';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'No deadline specified';
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch {
      return date;
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

  const daysRemaining = getDaysRemaining(scholarship.deadline);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-muted-foreground';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 80) return 'from-blue-500 to-cyan-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const copyLink = () => {
    if (scholarship.link) {
      navigator.clipboard.writeText(scholarship.link);
      toast.success('Link copied to clipboard');
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scholarship.title,
          text: `Check out this scholarship: ${scholarship.title}`,
          url: scholarship.link || window.location.href,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <DialogHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  {scholarship.category || 'General'}
                </Badge>
                <DialogTitle className="text-xl md:text-2xl font-bold leading-tight">
                  {scholarship.title}
                </DialogTitle>
                {scholarship.source_name && (
                  <p className="text-muted-foreground mt-1">
                    by {scholarship.source_name}
                  </p>
                )}
              </div>
              
              {/* Match Score Circle */}
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="url(#scoreGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(scholarship.matchScore / 100) * 226} 226`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`${scholarship.matchScore >= 80 ? 'stop-green-500' : scholarship.matchScore >= 60 ? 'stop-yellow-500' : 'stop-gray-400'}`} stopColor={scholarship.matchScore >= 80 ? '#22c55e' : scholarship.matchScore >= 60 ? '#eab308' : '#9ca3af'} />
                        <stop offset="100%" className={`${scholarship.matchScore >= 80 ? 'stop-emerald-500' : scholarship.matchScore >= 60 ? 'stop-orange-500' : 'stop-gray-500'}`} stopColor={scholarship.matchScore >= 80 ? '#10b981' : scholarship.matchScore >= 60 ? '#f97316' : '#6b7280'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold ${getScoreColor(scholarship.matchScore)}`}>
                      {scholarship.matchScore}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-1">Match Score</p>
              </div>
            </div>
          </DialogHeader>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardContent className="p-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Award</p>
                  <p className="font-semibold text-sm">{formatAmount(scholarship.amount)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className={`bg-background/80 backdrop-blur-sm ${daysRemaining && daysRemaining <= 7 ? 'border-red-500/50' : ''}`}>
              <CardContent className="p-3 flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${daysRemaining && daysRemaining <= 7 ? 'text-red-600' : 'text-blue-600'}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="font-semibold text-sm">
                    {daysRemaining !== null ? (
                      daysRemaining <= 0 ? 'Expired' : `${daysRemaining} days left`
                    ) : 'Rolling'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardContent className="p-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-semibold text-sm">{scholarship.location || 'Global'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardContent className="p-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-semibold text-sm">{scholarship.category || 'General'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <ScrollArea className="flex-1">
          <Tabs defaultValue="overview" className="p-6 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {scholarship.description && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {scholarship.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Key Dates
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Application Deadline:</span>
                      <span className="font-medium">{formatDate(scholarship.deadline)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Source
                  </h4>
                  <div className="space-y-2 text-sm">
                    {scholarship.source_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider:</span>
                        <span className="font-medium">{scholarship.source_name}</span>
                      </div>
                    )}
                    {scholarship.source_url && (
                      <a 
                        href={scholarship.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Visit official website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 mt-4">
              {scholarship.requirements ? (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Application Requirements
                  </h4>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {scholarship.requirements}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No specific requirements listed.</p>
                  <p className="text-sm">Visit the official website for detailed requirements.</p>
                </div>
              )}

              {(scholarship.min_gpa || scholarship.min_age || scholarship.max_age) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Academic & Age Requirements</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {scholarship.min_gpa && (
                        <Card>
                          <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{scholarship.min_gpa}</p>
                            <p className="text-xs text-muted-foreground">Minimum GPA</p>
                          </CardContent>
                        </Card>
                      )}
                      {scholarship.min_age && (
                        <Card>
                          <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{scholarship.min_age}+</p>
                            <p className="text-xs text-muted-foreground">Minimum Age</p>
                          </CardContent>
                        </Card>
                      )}
                      {scholarship.max_age && (
                        <Card>
                          <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{scholarship.max_age}</p>
                            <p className="text-xs text-muted-foreground">Maximum Age</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="eligibility" className="space-y-4 mt-4">
              {matchResult ? (
                <>
                  <Card className={matchResult.isEligible ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20'}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {matchResult.isEligible ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-amber-600" />
                        )}
                        <div>
                          <p className="font-semibold">
                            {matchResult.isEligible ? "You're eligible!" : "You may not meet all criteria"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Based on your profile information
                          </p>
                        </div>
                      </div>
                      
                      {!matchResult.isEligible && matchResult.ineligibilityReasons.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {matchResult.ineligibilityReasons.map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                              <XCircle className="h-4 w-4" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Match Breakdown</h4>
                    {matchResult.matchDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{detail.category}</span>
                            <span className="text-muted-foreground">{detail.score}/{detail.maxScore}</span>
                          </div>
                          <Progress value={(detail.score / detail.maxScore) * 100} className="h-2" />
                        </div>
                        {detail.score > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Show eligibility criteria even without matchResult */}
                  {scholarship.eligible_genders && scholarship.eligible_genders.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Eligible Genders
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scholarship.eligible_genders.map((g, idx) => (
                          <Badge key={idx} variant="secondary">{g}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scholarship.eligible_nationalities && scholarship.eligible_nationalities.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Eligible Nationalities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scholarship.eligible_nationalities.map((n, idx) => (
                          <Badge key={idx} variant="secondary">{n}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scholarship.eligible_education_levels && scholarship.eligible_education_levels.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Education Levels
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scholarship.eligible_education_levels.map((e, idx) => (
                          <Badge key={idx} variant="secondary">{e}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scholarship.eligible_fields && scholarship.eligible_fields.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Fields of Study
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {scholarship.eligible_fields.map((f, idx) => (
                          <Badge key={idx} variant="secondary">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {scholarship.financial_need_required && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-800 dark:text-amber-200">
                        Financial need demonstration required
                      </span>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t p-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={share}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={copyLink}>
                <Copy className="h-4 w-4" />
              </Button>
              {onSave && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onSave(scholarship.id, scholarship.isSaved)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bookmark className={`h-4 w-4 ${scholarship.isSaved ? 'fill-current text-primary' : ''}`} />
                  )}
                </Button>
              )}
            </div>
            <div className="flex-1 flex gap-2 sm:justify-end">
              {onAddToTracker && !scholarship.isApplied && (
                <Button 
                  variant="outline"
                  onClick={() => onAddToTracker(scholarship.id)}
                  disabled={isAddingToTracker}
                >
                  {isAddingToTracker ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add to Tracker
                </Button>
              )}
              {scholarship.link ? (
                <Button 
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={() => setPreApplyModalOpen(true)}
                >
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button disabled className="flex-1 sm:flex-initial">
                  No Application Link
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      
      <PreApplyModal
        open={preApplyModalOpen}
        onOpenChange={setPreApplyModalOpen}
        scholarshipTitle={scholarship.title}
        scholarshipLink={scholarship.link}
        matchScore={scholarship.matchScore}
        strengths={matchResult?.matchDetails?.filter(d => d.score > 0).map(d => `Strong ${d.category.toLowerCase()} match`) || []}
        weaknesses={matchResult?.ineligibilityReasons || []}
      />
    </Dialog>
  );
};
