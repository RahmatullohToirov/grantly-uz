import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import studentsSuccess from "@/assets/students-success.jpg";
import SignUpModal from "@/components/auth/SignUpModal";

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

            <SignUpModal>
              <Button variant="hero" size="xl" className="group">
                Join Our Mission
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpModal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;