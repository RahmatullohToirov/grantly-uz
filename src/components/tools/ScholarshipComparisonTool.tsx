import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScholarships } from "@/hooks/useScholarships";
import { Check, X, Scale, Plus, Trash2, DollarSign, Calendar, MapPin, GraduationCap } from "lucide-react";
import { format } from "date-fns";

interface ScholarshipComparisonToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScholarshipComparisonTool({ open, onOpenChange }: ScholarshipComparisonToolProps) {
  const { data: scholarships = [] } = useScholarships();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedScholarships = scholarships.filter((s) => selectedIds.includes(s.id));

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return "Varies";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "Rolling";
    return format(new Date(deadline), "MMM d, yyyy");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Scholarship Comparison Tool
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Selection Panel */}
          <div className="w-72 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Select Scholarships (max 4)</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedIds.length}/4 selected
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {scholarships.map((scholarship) => (
                  <Card
                    key={scholarship.id}
                    className={`cursor-pointer transition-all ${
                      selectedIds.includes(scholarship.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleSelection(scholarship.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${
                            selectedIds.includes(scholarship.id)
                              ? "bg-primary border-primary"
                              : "border-border"
                          }`}
                        >
                          {selectedIds.includes(scholarship.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm line-clamp-2">{scholarship.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatAmount(scholarship.amount)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Comparison Panel */}
          <div className="flex-1 overflow-auto">
            {selectedScholarships.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <Scale className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Scholarships Selected</h3>
                  <p className="text-muted-foreground">
                    Select scholarships from the left panel to compare them side by side.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedScholarships.length}, minmax(200px, 1fr))` }}>
                  {selectedScholarships.map((scholarship) => (
                    <Card key={scholarship.id} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => toggleSelection(scholarship.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm line-clamp-2 pr-8">{scholarship.title}</CardTitle>
                        {scholarship.matchScore && (
                          <Badge variant={scholarship.matchScore >= 70 ? "default" : "secondary"}>
                            {scholarship.matchScore}% Match
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-primary">{formatAmount(scholarship.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDeadline(scholarship.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{scholarship.location || "Any"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{scholarship.category || "General"}</span>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {scholarship.description || "No description available"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Requirements:</p>
                          <div className="space-y-1">
                            {scholarship.min_gpa && (
                              <div className="flex items-center gap-2 text-xs">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>Min GPA: {scholarship.min_gpa}</span>
                              </div>
                            )}
                            {scholarship.financial_need_required && (
                              <div className="flex items-center gap-2 text-xs">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>Financial need required</span>
                              </div>
                            )}
                            {scholarship.eligible_fields?.length > 0 && (
                              <div className="flex items-center gap-2 text-xs">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>Specific fields</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button className="w-full" size="sm" asChild>
                          <a href={scholarship.link || "#"} target="_blank" rel="noopener noreferrer">
                            Apply Now
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
