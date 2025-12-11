import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScholarships } from "@/hooks/useScholarships";
import { useEnhancedProfile, calculateEnhancedMatchScore } from "@/hooks/useEnhancedMatching";
import { Search, Filter, DollarSign, Calendar, MapPin, Star, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ScholarshipFinderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScholarshipFinder({ open, onOpenChange }: ScholarshipFinderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("match");

  const { data: scholarships = [], isLoading } = useScholarships(searchQuery);
  const { data: profile } = useEnhancedProfile();

  const enrichedScholarships = scholarships.map((scholarship) => {
    if (profile) {
      const matchResult = calculateEnhancedMatchScore(profile, {
        id: scholarship.id,
        title: scholarship.title,
        description: scholarship.description,
        amount: scholarship.amount,
        deadline: scholarship.deadline,
        location: scholarship.location,
        category: scholarship.category,
        link: scholarship.link,
        requirements: scholarship.requirements,
        source_name: scholarship.source_name,
        eligible_genders: scholarship.eligible_genders || null,
        min_age: scholarship.min_age || null,
        max_age: scholarship.max_age || null,
        eligible_nationalities: scholarship.eligible_nationalities || null,
        eligible_countries: scholarship.eligible_countries || null,
        eligible_education_levels: scholarship.eligible_education_levels || null,
        eligible_fields: scholarship.eligible_fields || null,
        min_gpa: scholarship.min_gpa || null,
        financial_need_required: scholarship.financial_need_required || null,
      });
      return { ...scholarship, calculatedMatchScore: matchResult.matchScore, isEligible: matchResult.isEligible };
    }
    return { ...scholarship, calculatedMatchScore: scholarship.matchScore || 0, isEligible: true };
  });

  const filteredScholarships = enrichedScholarships
    .filter((s) => {
      if (minAmount && s.amount && s.amount < parseInt(minAmount)) return false;
      if (category !== "all" && s.category !== category) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "match") return (b.calculatedMatchScore || 0) - (a.calculatedMatchScore || 0);
      if (sortBy === "amount") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  const categories = [...new Set(scholarships.map((s) => s.category).filter(Boolean))];

  const formatAmount = (amount: number | null) => {
    if (!amount) return "Varies";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Scholarship Finder
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-border space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships by name, description..."
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">Min Amount</Label>
              <Input
                type="number"
                placeholder="$0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="amount">Highest Amount</SelectItem>
                  <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setMinAmount("");
                  setCategory("all");
                  setSortBy("match");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Scholarships Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{filteredScholarships.length} scholarships found</p>
              {filteredScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold">{scholarship.title}</h3>
                          {scholarship.calculatedMatchScore !== undefined && (
                            <Badge variant={scholarship.calculatedMatchScore >= 70 ? "default" : "secondary"}>
                              <Star className="h-3 w-3 mr-1" />
                              {scholarship.calculatedMatchScore}% Match
                            </Badge>
                          )}
                          {!scholarship.isEligible && (
                            <Badge variant="outline" className="text-orange-600 border-orange-300">
                              May not be eligible
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {scholarship.description || "No description available"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <DollarSign className="h-4 w-4" />
                            {formatAmount(scholarship.amount)}
                          </span>
                          {scholarship.deadline && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(scholarship.deadline), "MMM d, yyyy")}
                            </span>
                          )}
                          {scholarship.location && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {scholarship.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {scholarship.link && (
                          <Button size="sm" asChild>
                            <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                              Apply <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onOpenChange(false);
                            navigate("/scholarships");
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
