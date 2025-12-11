import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { format, isAfter, isBefore, addDays, startOfDay } from "date-fns";
import { useTrackedScholarships } from "@/hooks/useDashboardData";
import { useSavedScholarships } from "@/hooks/useScholarships";

interface DeadlineItem {
  id: string;
  title: string;
  deadline: Date;
  type: 'saved' | 'applied';
  daysUntil: number;
}

export const DeadlineCalendar = () => {
  const { data: trackedScholarships } = useTrackedScholarships();
  const { data: savedScholarships } = useSavedScholarships();

  const upcomingDeadlines = useMemo(() => {
    const today = startOfDay(new Date());
    const items: DeadlineItem[] = [];

    // Add tracked scholarships
    trackedScholarships?.forEach(s => {
      if (s.deadline) {
        const deadlineDate = new Date(s.deadline);
        if (isAfter(deadlineDate, today)) {
          items.push({
            id: s.id,
            title: s.title,
            deadline: deadlineDate,
            type: 'applied',
            daysUntil: Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      }
    });

    // Add saved scholarships
    savedScholarships?.forEach(s => {
      if (s.deadline && !items.find(i => i.title === s.title)) {
        const deadlineDate = new Date(s.deadline);
        if (isAfter(deadlineDate, today)) {
          items.push({
            id: s.id,
            title: s.title,
            deadline: deadlineDate,
            type: 'saved',
            daysUntil: Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
          });
        }
      }
    });

    return items.sort((a, b) => a.deadline.getTime() - b.deadline.getTime()).slice(0, 5);
  }, [trackedScholarships, savedScholarships]);

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 3) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (daysUntil <= 7) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    if (daysUntil <= 14) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  if (upcomingDeadlines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>
            Your saved and tracked scholarship deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming deadlines. Save some scholarships to track their deadlines!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>
          {upcomingDeadlines.length} deadline{upcomingDeadlines.length !== 1 ? 's' : ''} coming up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingDeadlines.map(item => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3 rounded-lg border bg-card"
          >
            <div className="flex-1 min-w-0 mr-3">
              <p className="font-medium text-sm truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(item.deadline, 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-xs">
                {item.type === 'applied' ? 'Applied' : 'Saved'}
              </Badge>
              <Badge className={`text-xs ${getUrgencyColor(item.daysUntil)}`}>
                {item.daysUntil === 0 ? 'Today' : 
                 item.daysUntil === 1 ? '1 day' : 
                 `${item.daysUntil} days`}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
