import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SignUpModal from "@/components/auth/SignUpModal";
import { 
  Search, 
  Target, 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Bell, 
  Shield,
  Smartphone,
  Globe,
  Award,
  BookOpen
} from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      icon: Search,
      title: "AI-Powered Matching",
      description: "Our smart algorithm finds scholarships and opportunities perfectly matched to your profile, interests, and goals.",
      badge: "Core Feature"
    },
    {
      icon: BarChart3,
      title: "Application Tracking Dashboard",
      description: "Visual dashboard to track all your applications from 'To Apply' to 'Accepted' with progress insights.",
      badge: "Most Popular"
    },
    {
      icon: Target,
      title: "Success Probability Score",
      description: "Get realistic acceptance likelihood for each opportunity based on your profile and historical data.",
      badge: "Pro Feature"
    },
    {
      icon: Users,
      title: "Grantly Scholar Community",
      description: "Connect with mentors, alumni, and fellow students who've successfully secured scholarships.",
      badge: "Community"
    }
  ];

  const additionalFeatures = [
    {
      icon: Calendar,
      title: "Smart Deadline Management",
      description: "Never miss another deadline with intelligent reminders and calendar integration."
    },
    {
      icon: FileText,
      title: "Document Organization",
      description: "Store and organize all your application documents in one secure place."
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Get instant updates when new opportunities match your profile."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with enterprise-level security."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Access your opportunities and track progress from any device, anywhere."
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Discover scholarships from universities and organizations worldwide."
    }
  ];

  const comingSoon = [
    {
      icon: BookOpen,
      title: "Video Learning Courses",
      description: "Master scholarship applications with expert-led video tutorials and workshops."
    },
    {
      icon: Award,
      title: "Mentor Matching",
      description: "Get paired with successful alumni who can guide your scholarship journey."
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
              Powerful Features
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              Discover the tools that make Grantly the ultimate platform for managing your scholarship journey and achieving your dreams.
            </p>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Core Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The essential tools that make Grantly the ultimate scholarship tracking platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <feature.icon className="h-12 w-12 text-primary" />
                      <Badge variant={
                        feature.badge === 'Core Feature' ? 'default' :
                        feature.badge === 'Most Popular' ? 'secondary' :
                        feature.badge === 'Pro Feature' ? 'outline' : 'secondary'
                      }>
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-card-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Toolkit
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Additional features that make your scholarship journey smooth and organized.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Exciting new features we're building to make your experience even better.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {comingSoon.map((feature, index) => (
                <Card key={index} className="bg-gradient-card border-border relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <CardContent className="p-6">
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Start your free trial today and see how Grantly can transform your scholarship journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpModal>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Start Free Trial
                </Button>
              </SignUpModal>
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/pricing'}>
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;