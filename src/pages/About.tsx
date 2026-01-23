import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";
import SignUpModal from "@/components/auth/SignUpModal";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "Empowering students worldwide by making education opportunities accessible and trackable."
    },
    {
      icon: Heart,
      title: "Vision", 
      description: "A world where every student can achieve their educational dreams regardless of financial barriers."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive network of scholars, mentors, and alumni who succeed together."
    },
    {
      icon: Award,
      title: "Impact",
      description: "Helping thousands of students track applications and secure life-changing opportunities."
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
              About Grantly
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              We believe every student deserves access to educational opportunities. 
              Grantly makes scholarship discovery and application tracking simple, organized, and successful.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Purpose
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Grantly was born from the frustration of losing track of scholarship applications 
                and missing life-changing opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
              </div>
              
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <p className="text-lg text-card-foreground mb-6 leading-relaxed">
                  Grantly started when our founders realized they had lost track of dozens of scholarship 
                  applications, missing deadlines and opportunities that could have changed their lives. 
                  The frustration of scattered emails, forgotten deadlines, and unclear application statuses 
                  led to a simple question:
                </p>
                
                <blockquote className="text-2xl font-semibold text-primary text-center my-8 italic">
                  "Why isn't there a simple way to track all our opportunities in one place?"
                </blockquote>
                
                <p className="text-lg text-card-foreground mb-6 leading-relaxed">
                  Today, Grantly helps thousands of students worldwide organize their scholarship journey, 
                  track their progress, and connect with a community of successful scholars. We've transformed 
                  the chaotic process of opportunity hunting into an organized, trackable, and successful experience.
                </p>
                
                <p className="text-lg text-card-foreground leading-relaxed">
                  Our platform isn't just about finding scholarships—it's about empowering students to take 
                  control of their educational future and achieve their dreams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already tracking their opportunities and achieving their dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpModal>
                <Button size="lg">
                  Get Started Free
                </Button>
              </SignUpModal>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/features'}>
                Explore Features
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

export default About;