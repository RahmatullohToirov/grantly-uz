import { Zap, Target, Route, GraduationCap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description: "Advanced algorithms analyze your profile against millions of scholarships to find perfect matches.",
    gradient: "from-primary to-primary-light"
  },
  {
    icon: Target,
    title: "Acceptance Likelihood Score",
    description: "Know your chances before you apply with our proprietary scoring system based on historical data.",
    gradient: "from-secondary to-secondary-light"
  },
  {
    icon: Route,
    title: "Personalized Application Roadmap",
    description: "Step-by-step guidance tailored to each scholarship with deadlines, requirements, and tips.",
    gradient: "from-primary-light to-secondary"
  },
  {
    icon: GraduationCap,
    title: "Expert Video Courses",
    description: "Learn from scholarship winners and experts with our comprehensive course library.",
    gradient: "from-secondary-light to-primary"
  },
  {
    icon: Shield,
    title: "Application Security",
    description: "Your personal information is protected with enterprise-grade security and encryption.",
    gradient: "from-primary to-secondary-light"
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Stay informed with instant notifications about new opportunities and application deadlines.",
    gradient: "from-secondary to-primary-light"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Powerful Features for 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to discover, apply for, and win scholarships. 
            Our platform combines cutting-edge AI with expert guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`relative w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              {/* Content */}
              <div className="relative space-y-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;