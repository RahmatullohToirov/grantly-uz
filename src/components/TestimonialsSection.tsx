import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    university: "Stanford University",
    scholarship: "Merit Scholarship - $45,000",
    quote: "Grantly found scholarships I never knew existed. The AI matching was incredibly accurate, and I received three scholarship offers in just two months!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c5b9?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    university: "MIT",
    scholarship: "STEM Excellence Award - $30,000",
    quote: "The acceptance likelihood scores helped me focus on the right opportunities. I'm now studying at my dream school thanks to Grantly!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    university: "Harvard University",
    scholarship: "Leadership Grant - $50,000",
    quote: "The personalized roadmap and essay guidance were game-changers. I felt confident throughout the entire application process.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    name: "David Kim",
    university: "UC Berkeley",
    scholarship: "Innovation Scholarship - $25,000",
    quote: "As a first-generation college student, I had no idea where to start. Grantly made the whole process simple and achievable.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    name: "Priya Patel",
    university: "Columbia University",
    scholarship: "Diversity Excellence - $40,000",
    quote: "The AI found opportunities that were perfect for my background and interests. I couldn't be happier with the results!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    name: "James Wilson",
    university: "Yale University",
    scholarship: "Academic Achievement - $35,000",
    quote: "Grantly's platform is intuitive and powerful. The deadline reminders and application tracking kept me organized throughout.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Success 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real students, real results. See how Grantly has helped thousands of students 
            unlock their potential and achieve their educational dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-button">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.university}</div>
                  <div className="text-sm font-medium text-secondary">{testimonial.scholarship}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Student Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">$2.1M+</div>
            <div className="text-muted-foreground">Scholarships Won</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
            <div className="text-muted-foreground">Success Stories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">3.2x</div>
            <div className="text-muted-foreground">Higher Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;