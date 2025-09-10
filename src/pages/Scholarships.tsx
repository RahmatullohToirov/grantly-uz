import { useState } from "react";
import { Search, Filter, Globe, DollarSign, Clock, GraduationCap, MapPin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const scholarships = [
    {
      title: "Global Development Scholarship",
      provider: "International Development Foundation",
      amount: "$50,000",
      deadline: "July 15, 2024",
      type: "Full Scholarship",
      location: "Global",
      level: "Graduate",
      field: "Development Studies",
      description: "Supporting future leaders in sustainable development and global cooperation.",
      tags: ["Fully Funded", "International", "Development"],
      fit: 95
    },
    {
      title: "Women in STEM Excellence Award",
      provider: "Tech Innovation Institute",
      amount: "$25,000",
      deadline: "August 30, 2024",
      type: "Merit-based",
      location: "United States",
      level: "Undergraduate",
      field: "STEM",
      description: "Empowering women to excel in science, technology, engineering, and mathematics.",
      tags: ["Women", "STEM", "Merit-based"],
      fit: 88
    },
    {
      title: "Climate Action Fellowship",
      provider: "Green Future Foundation",
      amount: "$75,000",
      deadline: "September 10, 2024",
      type: "Research Fellowship",
      location: "Europe",
      level: "PhD",
      field: "Environmental Science",
      description: "Research funding for innovative climate solutions and environmental sustainability.",
      tags: ["Research", "Environment", "Fellowship"],
      fit: 92
    },
    {
      title: "Emerging Leaders Scholarship",
      provider: "Global Leadership Council",
      amount: "$30,000",
      deadline: "June 20, 2024",
      type: "Leadership Award",
      location: "International",
      level: "Master's",
      field: "Business & Leadership",
      description: "Developing the next generation of global leaders and entrepreneurs.",
      tags: ["Leadership", "Business", "International"],
      fit: 85
    },
    {
      title: "Healthcare Innovation Grant",
      provider: "Medical Research Foundation",
      amount: "$40,000",
      deadline: "October 5, 2024",
      type: "Research Grant",
      location: "North America",
      level: "Graduate",
      field: "Medicine & Health",
      description: "Supporting breakthrough research in healthcare technology and patient care.",
      tags: ["Healthcare", "Innovation", "Research"],
      fit: 79
    },
    {
      title: "Digital Arts & Media Scholarship",
      provider: "Creative Technology Institute",
      amount: "$20,000",
      deadline: "November 15, 2024",
      type: "Creative Arts",
      location: "Global",
      level: "Undergraduate",
      field: "Digital Arts",
      description: "Supporting creative minds in digital media, design, and interactive arts.",
      tags: ["Arts", "Technology", "Creative"],
      fit: 73
    }
  ];

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gradient-primary py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Scholarship Opportunities
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Discover thousands of scholarships matched to your profile and academic goals
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search scholarships by field, provider, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg bg-background/95 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters Section */}
        <div className="flex flex-wrap items-center justify-between mb-8 p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-soft">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Badge variant="secondary">Level</Badge>
            <Badge variant="secondary">Location</Badge>
            <Badge variant="secondary">Amount</Badge>
            <Badge variant="secondary">Deadline</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredScholarships.length} of {scholarships.length} scholarships
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredScholarships.map((scholarship, index) => (
            <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-card transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {scholarship.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-3">
                      {scholarship.provider}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {scholarship.fit}% match
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {scholarship.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {scholarship.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{scholarship.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{scholarship.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{scholarship.level}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-6">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{scholarship.field}</span>
                </div>
                
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    Save for Later
                  </Button>
                  <Button className="flex-1 bg-gradient-primary hover:shadow-button transition-all">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Scholarships
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Scholarships;