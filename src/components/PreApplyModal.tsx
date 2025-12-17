import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  PenTool,
  Brain,
  Calendar,
  Calculator,
  Search,
  Scale,
} from 'lucide-react';

interface PreApplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarshipTitle: string;
  scholarshipLink: string | null;
  matchScore: number;
  strengths?: string[];
  weaknesses?: string[];
}

export const PreApplyModal = ({
  open,
  onOpenChange,
  scholarshipTitle,
  scholarshipLink,
  matchScore,
  strengths = [],
  weaknesses = [],
}: PreApplyModalProps) => {
  // Default strengths/weaknesses based on match score if not provided
  const displayStrengths = strengths.length > 0 ? strengths : [
    matchScore >= 80 ? "Strong profile match" : "Good initial match",
    "You've shown interest by tracking this scholarship",
    "Your profile is active and up-to-date",
  ];

  const displayWeaknesses = weaknesses.length > 0 ? weaknesses : [
    "Consider reviewing the essay requirements carefully",
    "Prepare all required documents in advance",
    "Research the scholarship provider thoroughly",
  ];

  const quickTools = [
    { name: "AI Application Adviser", description: "Get personalized guidance", icon: Sparkles },
    { name: "AI Essay Builder", description: "Build compelling essays", icon: PenTool },
    { name: "Essay Analyzer", description: "Get AI-powered feedback", icon: Brain },
    { name: "Application Tracker", description: "Track your progress", icon: Calendar },
    { name: "GPA Calculator", description: "Calculate your grades", icon: Calculator },
    { name: "Scholarship Finder", description: "Find more matches", icon: Search },
    { name: "Scholarship Comparison", description: "Compare options", icon: Scale },
  ];

  const handleApplyNow = () => {
    if (scholarshipLink) {
      window.open(scholarshipLink, '_blank', 'noopener,noreferrer');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Before You Apply</DialogTitle>
          <DialogDescription>
            Review your profile match and prepare with our tools for{' '}
            <span className="font-medium text-foreground">{scholarshipTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Score */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                matchScore >= 80 ? 'text-green-600' : matchScore >= 60 ? 'text-yellow-600' : 'text-muted-foreground'
              }`}>
                {matchScore}%
              </div>
              <p className="text-sm text-muted-foreground">Your Match Score</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Strengths */}
            <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-300">Your Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {displayStrengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses / Areas to Improve */}
            <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300">Areas to Prepare</h4>
                </div>
                <ul className="space-y-2">
                  {displayWeaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Quick Tools Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Prepare with Our Tools</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Use our quick access tools in the Resources page to strengthen your application before applying.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickTools.slice(0, 6).map((tool, idx) => (
                <Link 
                  key={idx} 
                  to="/resources"
                  className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
                  onClick={() => onOpenChange(false)}
                >
                  <tool.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="truncate">{tool.name}</span>
                </Link>
              ))}
            </div>
            <Link to="/resources" onClick={() => onOpenChange(false)}>
              <Button variant="link" className="mt-2 p-0 h-auto text-primary">
                View all tools in Resources →
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Go Back & Prepare
            </Button>
            {scholarshipLink ? (
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={handleApplyNow}
              >
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button disabled className="flex-1">
                No Application Link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreApplyModal;
