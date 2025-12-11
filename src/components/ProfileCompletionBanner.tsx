import { Link } from "react-router-dom";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

interface ProfileCompletionBannerProps {
  variant?: 'full' | 'compact';
}

export const ProfileCompletionBanner = ({ variant = 'full' }: ProfileCompletionBannerProps) => {
  const completeness = useProfileCompleteness();

  if (completeness.isComplete) {
    if (variant === 'compact') return null;
    
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
        <CardContent className="flex items-center gap-4 p-4">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-green-800 dark:text-green-200">Profile Complete</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              You're getting the most accurate scholarship matches!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Profile {completeness.percentage}% complete
          </p>
        </div>
        <Link to="/profile">
          <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/50">
            Complete
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                Complete Your Profile for Better Matches
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Add your details to unlock personalized scholarship recommendations and accurate eligibility matching.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-amber-700 dark:text-amber-300">Profile Completion</span>
                <span className="font-medium text-amber-800 dark:text-amber-200">{completeness.percentage}%</span>
              </div>
              <Progress value={completeness.percentage} className="h-2 bg-amber-200 dark:bg-amber-800" />
            </div>

            {completeness.missingRequired.length > 0 && (
              <div className="text-sm">
                <p className="text-amber-700 dark:text-amber-300 mb-1">Missing required fields:</p>
                <div className="flex flex-wrap gap-2">
                  {completeness.missingRequired.slice(0, 4).map(field => (
                    <span 
                      key={field} 
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded text-xs"
                    >
                      {field}
                    </span>
                  ))}
                  {completeness.missingRequired.length > 4 && (
                    <span className="px-2 py-1 text-amber-700 dark:text-amber-300 text-xs">
                      +{completeness.missingRequired.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <Link to="/profile">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Complete Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
