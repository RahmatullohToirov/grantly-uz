import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";

interface ApplicationTrackerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplicationTracker({ open, onOpenChange }: ApplicationTrackerProps) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["user-applications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_applications")
        .select(`
          *,
          scholarship:scholarships(*)
        `)
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-100 text-blue-700";
      case "in_progress": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days;
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    inProgress: applications.filter((a) => a.status === "in_progress").length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Application Tracker
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="px-6 py-4 border-b border-border">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-border flex gap-2 flex-wrap">
          {["all", "in_progress", "submitted", "accepted", "rejected"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Button>
          ))}
        </div>

        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading applications...</div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground">
                Start tracking your scholarship applications by adding them from the Scholarships page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const deadline = app.scholarship?.deadline;
                const daysLeft = getDaysUntilDeadline(deadline);
                const isOverdue = deadline && isPast(new Date(deadline));

                return (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold truncate">{app.scholarship?.title}</h3>
                            <Badge className={getStatusColor(app.status || "in_progress")}>
                              {app.status?.replace("_", " ") || "In Progress"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Applied: {format(new Date(app.applied_at || new Date()), "MMM d, yyyy")}
                            </span>
                            {deadline && (
                              <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : daysLeft !== null && daysLeft <= 7 ? "text-orange-500" : ""}`}>
                                <Calendar className="h-4 w-4" />
                                {isOverdue ? "Overdue" : `${daysLeft} days left`}
                              </span>
                            )}
                          </div>
                          {app.notes && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {app.scholarship?.link && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={app.scholarship.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
