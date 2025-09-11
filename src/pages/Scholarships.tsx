import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const scholarships = [
    {
      id: 1,
      title: "Gates Cambridge Scholarship",
      provider: "University of Cambridge",
      amount: "$50,000",
      deadline: "Dec 15, 2024",
      location: "United Kingdom",
      level: "Graduate",
      fitScore: 95,
      description: "Full scholarship for outstanding applicants from outside the UK to pursue a full-time postgraduate degree.",
      tags: ["Fully Funded", "International", "STEM"],
      saved: false
    },
    {
      id: 2,
      title: "Fulbright Program",
      provider: "U.S. Department of State",
      amount: "$30,000",
      deadline: "Oct 12, 2024",
      location: "United States",
      level: "Graduate",
      fitScore: 88,
      description: "Educational exchange program to increase mutual understanding between Americans and people of other countries.",
      tags: ["Government", "Exchange", "Cultural"],
      saved: true
    },
    {
      id: 3,
      title: "Rhodes Scholarship",
      provider: "Rhodes Trust",
      amount: "Full funding",
      deadline: "Sep 30, 2024",
      location: "United Kingdom",
      level: "Graduate",
      fitScore: 92,
      description: "The world's oldest graduate scholarship programme, enabling outstanding young people to study at Oxford.",
      tags: ["Prestigious", "Leadership", "Oxford"],
      saved: false
    },
    {
      id: 4,
      title: "Chevening Scholarship",
      provider: "UK Government",
      amount: "Full funding",
      deadline: "Nov 2, 2024",
      location: "United Kingdom",
      level: "Master's",
      fitScore: 85,
      description: "UK government's global scholarship programme, funded by the Foreign and Commonwealth Office.",
      tags: ["Government", "Leadership", "One Year"],
      saved: true
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

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
            <TabsTrigger value="saved">Saved (2)</TabsTrigger>
            <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
            <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                        {scholarship.saved && (
                          <BookmarkIcon className="h-4 w-4 text-blue-500 fill-current" />
                        )}
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        {scholarship.provider}
                      </CardDescription>
                    </div>
                    <Badge className={`${getScoreColor(scholarship.fitScore)} border-0`}>
                      {scholarship.fitScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {scholarship.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scholarship.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCapIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <BookmarkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 mt-6">
            {scholarships.filter(s => s.saved).map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                {/* Same card content as above */}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                        <BookmarkIcon className="h-4 w-4 text-blue-500 fill-current" />
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        {scholarship.provider}
                      </CardDescription>
                    </div>
                    <Badge className={`${getScoreColor(scholarship.fitScore)} border-0`}>
                      {scholarship.fitScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {scholarship.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scholarship.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCapIcon className="h-3 w-3 text-muted-foreground" />
                      <span>{scholarship.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <BookmarkIcon className="h-4 w-4 fill-current" />
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-4 mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
              <p className="text-muted-foreground">
                Our AI is analyzing your profile to find the best scholarship matches.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4 mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Upcoming Deadlines</h3>
              <p className="text-muted-foreground">
                Scholarships with deadlines in the next 30 days will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Scholarships;