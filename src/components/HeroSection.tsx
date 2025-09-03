import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-lighter/5 via-transparent to-secondary-lighter/5"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary-lighter/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary-lighter/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Unlock Your Future
                </span>
                <br />
                <span className="text-foreground">with Grantly</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                AI that finds scholarships and opportunities tailored just for you. 
                From discovery to application, we're here to help you achieve your dreams.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="hero-outline" size="xl" className="group">
                <Play className="group-hover:scale-110 transition-transform" />
                See How It Works
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>AI-powered matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>1M+ opportunities</span>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <img
                src={heroIllustration}
                alt="Student achieving scholarship success"
                className="w-full h-auto rounded-2xl shadow-card animate-float"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-primary rounded-2xl shadow-soft animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary rounded-xl shadow-soft animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;