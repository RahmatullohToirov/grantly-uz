import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

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
    popular: false
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
    cta: "Start Pro Trial",
    popular: true
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
    cta: "Go Premium",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Choose Your 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Success Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core AI matching technology 
            and are designed with students' budgets in mind.
          </p>
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
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
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
              <Button 
                variant={plan.popular ? "hero" : "outline"} 
                size="lg" 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50 shadow-soft">
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-muted-foreground font-medium">30-day money-back guarantee on all paid plans</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;