import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { Check, Star, Sparkles } from "lucide-react";
import SignUpModal from "@/components/auth/SignUpModal";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for getting started with scholarship search",
    features: [
      "Basic profile creation",
      "Up to 10 scholarship matches/month",
      "Basic application tracking",
      "Email support",
      "Mobile app access"
    ],
    cta: "Get Started Free",
    popular: false,
    earlyAccess: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Advanced features for serious scholarship seekers",
    features: [
      "Complete profile optimization",
      "Unlimited scholarship matches",
      "AI acceptance likelihood scores",
      "Personalized application roadmaps",
      "Priority email support",
      "Essay review tools",
      "Deadline reminders",
      "Advanced search filters"
    ],
    cta: "Join Early Access (Free)",
    popular: true,
    earlyAccess: true
  },
  {
    name: "Premium",
    price: "$39",
    period: "/month",
    description: "All features plus expert guidance and mentorship",
    features: [
      "Everything in Pro",
      "Video course library access",
      "1-on-1 mentorship sessions",
      "Custom application strategies",
      "Interview preparation",
      "Success guarantee program",
      "Priority phone support",
      "White-glove application assistance"
    ],
    cta: "Unlock Premium – Early Access",
    popular: false,
    earlyAccess: true
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/10"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Choose Your Success Plan
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              Start free and upgrade as you grow. All plans include our core AI matching technology 
              and are designed with students' budgets in mind.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            {/* Early Access Banner */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Early Access</span>
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  All plans are free for a limited time while we improve the platform.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-gradient-card rounded-2xl p-8 shadow-card border animate-slide-up ${
                    plan.popular 
                      ? 'border-primary/50 ring-2 ring-primary/20 scale-105' 
                      : 'border-border/50 hover:border-primary/30'
                  } transition-all duration-300 hover:-translate-y-1`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-button">
                        <Star className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center space-y-4 mb-8">
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                    
                    {/* Early Access Badge for paid plans */}
                    {plan.earlyAccess && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        Unlocked for Early Users
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center space-x-1">
                        {plan.earlyAccess ? (
                          <>
                            <span className="text-2xl font-bold text-muted-foreground/50 line-through">{plan.price}</span>
                            <span className="text-4xl font-bold text-primary ml-2">Free</span>
                          </>
                        ) : (
                          <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        )}
                        {plan.period && !plan.earlyAccess && (
                          <span className="text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <SignUpModal>
                    <Button 
                      variant={plan.popular ? "hero" : "outline"} 
                      size="lg" 
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </SignUpModal>
                </div>
              ))}
            </div>

            {/* Early Access Disclaimer */}
            <div className="text-center mt-12 animate-fade-in space-y-4">
              <div className="inline-flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50 shadow-soft">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-muted-foreground font-medium">No credit card required during early access</span>
              </div>
              <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
                Early access users may receive special benefits or discounts when paid plans launch.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Common questions about our pricing and features
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {[
                {
                  question: "Is early access really free?",
                  answer: "Yes! During our early access period, all features including Pro and Premium tiers are completely free. No credit card required. We're focused on improving the platform with your feedback."
                },
                {
                  question: "What happens when early access ends?",
                  answer: "We'll notify you well in advance before transitioning to paid plans. Early access users may receive special discounts or benefits as a thank you for helping us improve."
                },
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes! You can upgrade or downgrade your plan at any time. During early access, all features are available to everyone."
                },
                {
                  question: "Do you offer student discounts?",
                  answer: "Yes! When paid plans launch, we'll offer a 50% student discount on all tiers. Simply verify your student status with a valid .edu email address."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-elegant hover:shadow-soft transition-all duration-300 hover:scale-[1.02]">
                  <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold mr-4">
                      {index + 1}
                    </span>
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg ml-14">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Start Your Success Journey?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using Grantly to find and win scholarships — free during early access.
            </p>
            <SignUpModal>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Start Free Today
              </Button>
            </SignUpModal>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Pricing;