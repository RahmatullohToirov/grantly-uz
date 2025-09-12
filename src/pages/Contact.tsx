import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  HelpCircle,
  Users,
  FileText
} from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help with your account or general questions",
      contact: "support@grantly.com",
      responseTime: "Within 24 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Quick answers to urgent questions",
      contact: "Available in-app",
      responseTime: "Instant"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      responseTime: "Mon-Fri, 9AM-6PM EST"
    }
  ];

  const supportTopics = [
    {
      icon: HelpCircle,
      title: "General Questions",
      description: "How Grantly works, features, and getting started"
    },
    {
      icon: Users,
      title: "Account & Billing",
      description: "Subscription plans, payments, and account management"
    },
    {
      icon: FileText,
      title: "Technical Support",
      description: "Bug reports, app issues, and troubleshooting"
    }
  ];

  const faqs = [
    {
      question: "How does Grantly find scholarships for me?",
      answer: "Our AI algorithm analyzes your profile, academic background, interests, and goals to match you with relevant scholarships and opportunities from our database of thousands of options."
    },
    {
      question: "Is Grantly really free to use?",
      answer: "Yes! Our basic plan is completely free and includes scholarship matching, basic tracking, and access to our community. Premium features like advanced analytics and mentorship require a subscription."
    },
    {
      question: "Can I track scholarships I found outside of Grantly?",
      answer: "Absolutely! You can manually add any scholarship or opportunity to your dashboard and track its progress through our application management system."
    },
    {
      question: "How accurate are the success probability scores?",
      answer: "Our probability scores are based on historical data, your profile strength, and competition analysis. While not guaranteed, they provide a realistic assessment to help you prioritize applications."
    },
    {
      question: "Do you support international students?",
      answer: "Yes! Grantly supports students from all countries and includes scholarships for studying abroad, international programs, and country-specific opportunities."
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
              Get In Touch
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8 animate-slide-up">
              Ready to start your scholarship journey? Have questions about our platform? We're here to help you succeed.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How Can We Help?
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the best way to reach us based on your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300 text-center">
                  <CardHeader>
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <method.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {method.description}
                    </p>
                    <p className="font-semibold text-card-foreground mb-2">
                      {method.contact}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {method.responseTime}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Send Us a Message
                </h2>
                <p className="text-lg text-muted-foreground">
                  Fill out the form below and we'll get back to you soon
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground">
                      Contact Form
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-card-foreground">First Name</label>
                        <Input placeholder="John" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Last Name</label>
                        <Input placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Email</label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Subject</label>
                      <Input placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Message</label>
                      <Textarea 
                        placeholder="Tell us more about your question or issue..."
                        rows={5}
                      />
                    </div>
                    <Button className="w-full" onClick={() => alert('Message sent successfully! We\'ll get back to you soon.')}>
                      Send Message
                      <Mail className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Support Topics */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Common Topics
                  </h3>
                  <div className="space-y-4">
                    {supportTopics.map((topic, index) => (
                      <Card key={index} className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <topic.icon className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <h4 className="font-semibold text-card-foreground mb-1">
                                {topic.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {topic.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Office Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">
                          123 Education Street, Learning City, LC 12345
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 6:00 PM EST
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions about Grantly
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Can't find the answer you're looking for?
              </p>
              <Button variant="outline">
                View Full FAQ
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Our support team is ready to help you succeed in your scholarship journey.
            </p>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Start Live Chat
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;