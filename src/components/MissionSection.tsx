import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import studentsSuccess from "@/assets/students-success.jpg";

const MissionSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={studentsSuccess}
                alt="Students celebrating scholarship success"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20"></div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -top-4 -left-4 bg-background rounded-xl p-4 shadow-card border border-border/50 animate-float">
              <div className="text-2xl font-bold text-primary">$2.1M+</div>
              <div className="text-sm text-muted-foreground">Scholarships Won</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-background rounded-xl p-4 shadow-card border border-border/50 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-2xl font-bold text-secondary">15,000+</div>
              <div className="text-sm text-muted-foreground">Success Stories</div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-foreground">Our Mission:</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Equal Access to Opportunity
                </span>
              </h2>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Every student deserves the chance to pursue their dreams, regardless of their background 
                  or financial situation. That's why we built Grantly.
                </p>
                <p>
                  Our AI-powered platform democratizes access to educational opportunities by making 
                  scholarship discovery and applications easier, faster, and more effective than ever before.
                </p>
                <p>
                  We believe that when we remove barriers to education, we unlock human potential 
                  and create a better future for everyone.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-background/50 rounded-xl backdrop-blur-sm border border-border/30">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Match Accuracy</div>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-xl backdrop-blur-sm border border-border/30">
                  <div className="text-3xl font-bold text-secondary">3.2x</div>
                  <div className="text-sm text-muted-foreground">Higher Success Rate</div>
                </div>
              </div>
              
              <Button variant="hero" size="xl" className="group">
                Join Our Mission
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;