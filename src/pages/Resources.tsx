import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Calendar,
  User,
  ArrowRight,
  Award,
  Target,
  TrendingUp
} from "lucide-react";

const Resources = () => {
  const categories = [
    { name: "All", count: 45, active: true },
    { name: "Scholarships", count: 18 },
    { name: "Personal Growth", count: 12 },
    { name: "Study Tips", count: 8 },
    { name: "Career Advice", count: 7 }
  ];

  const featuredArticles = [
    {
      title: "Complete Guide to Scholarship Essays",
      excerpt: "Master the art of writing compelling scholarship essays that get noticed by selection committees.",
      category: "Scholarships",
      readTime: "8 min read",
      date: "Jan 15, 2024",
      author: "Sarah Chen",
      image: "/placeholder-article-1.jpg",
      featured: true
    },
    {
      title: "Building a Winning Application Strategy",
      excerpt: "Step-by-step framework for organizing and optimizing your scholarship applications for maximum success.",
      category: "Scholarships",
      readTime: "6 min read", 
      date: "Jan 12, 2024",
      author: "Marcus Johnson",
      image: "/placeholder-article-2.jpg",
      featured: true
    }
  ];

  const recentArticles = [
    {
      title: "Time Management for Student Success",
      excerpt: "Proven techniques to balance studies, applications, and personal life effectively.",
      category: "Personal Growth",
      readTime: "5 min read",
      date: "Jan 10, 2024",
      author: "Dr. Amanda Lee",
      icon: Target
    },
    {
      title: "Networking Tips for International Students", 
      excerpt: "Build meaningful connections that can open doors to opportunities worldwide.",
      category: "Career Advice",
      readTime: "7 min read",
      date: "Jan 8, 2024",
      author: "Roberto Silva",
      icon: TrendingUp
    },
    {
      title: "Research Skills That Impress Academics",
      excerpt: "Advanced research methodologies that make your academic work stand out.",
      category: "Study Tips", 
      readTime: "9 min read",
      date: "Jan 5, 2024",
      author: "Prof. Emily Zhang",
      icon: BookOpen
    },
    {
      title: "Financial Planning for Students",
      excerpt: "Smart budgeting strategies to make the most of your scholarship money.",
      category: "Personal Growth",
      readTime: "6 min read",
      date: "Jan 3, 2024", 
      author: "Financial Team",
      icon: Award
    }
  ];

  const videoResources = [
    {
      title: "Scholarship Interview Masterclass",
      duration: "24 min",
      category: "Video Course",
      thumbnail: "/placeholder-video-1.jpg"
    },
    {
      title: "Writing Personal Statements", 
      duration: "18 min",
      category: "Tutorial",
      thumbnail: "/placeholder-video-2.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Learning Resources
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              Access expert guides, video tutorials, and scholarship strategies to maximize your success and achieve your educational goals.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 h-5 w-5" />
              <Input 
                placeholder="Search articles, guides, and resources..."
                className="pl-12 py-6 text-lg bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/70"
              />
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-background border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Our most popular and impactful guides to scholarship success
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {featuredArticles.map((article, index) => (
                <Card key={index} className="bg-card border-border overflow-hidden hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video bg-muted relative">
                    <Badge className="absolute top-4 left-4 bg-primary">
                      Featured
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge variant="secondary" className="mb-2">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Fresh insights and practical tips for your educational journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentArticles.map((article, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6">
                    <article.icon className="h-8 w-8 text-primary mb-4" />
                    <Badge variant="outline" className="mb-3">
                      {article.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Resources */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Video Learning
              </h2>
              <p className="text-lg text-muted-foreground">
                Visual guides and masterclasses for scholarship success
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {videoResources.map((video, index) => (
                <Card key={index} className="bg-card border-border overflow-hidden hover:shadow-card transition-all duration-300">
                  <div className="aspect-video bg-muted relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <Badge variant="secondary" className="mb-2">
                        {video.category}
                      </Badge>
                      <p className="text-sm opacity-90">{video.duration}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      {video.title}
                    </h3>
                    <Button className="w-full">
                      Watch Now
                      <Video className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Stay Updated with New Resources
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Get the latest scholarship tips, guides, and opportunities delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Resources;