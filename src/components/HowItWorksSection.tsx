import { User, Brain, Trophy } from "lucide-react";

const steps = [
  {
    icon: User,
    title: "Build Your Profile",
    description: "Tell us about your academic background, interests, and goals. Our smart questionnaire takes just 5 minutes.",
    step: "01"
  },
  {
    icon: Brain,
    title: "Get AI-Matched Scholarships", 
    description: "Our advanced AI analyzes thousands of opportunities and finds the perfect matches based on your unique profile.",
    step: "02"
  },
  {
    icon: Trophy,
    title: "Apply with Confidence",
    description: "Access personalized application guidance, essay tips, and track your progress all in one place.",
    step: "03"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">Grantly</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to unlock your scholarship potential and start your journey to success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 transform translate-x-6 z-0"></div>
              )}
              
              {/* Card */}
              <div className="relative bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-button">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;