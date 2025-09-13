import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/5fe2fbcf-488e-4b74-85a8-76d8b3071f79.png" 
                alt="Grantly Logo" 
                className="h-16 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-background/80 leading-relaxed">
              Empowering students worldwide to discover and win scholarships through 
              AI-powered matching and expert guidance.
            </p>
            <div className="text-lg font-semibold text-secondary">
              Find. Apply. Achieve.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-background">Quick Links</h3>
            <div className="space-y-3">
              <a href="#how-it-works" className="block text-background/80 hover:text-secondary transition-colors">
                How It Works
              </a>
              <a href="#features" className="block text-background/80 hover:text-secondary transition-colors">
                Features
              </a>
              <a href="#pricing" className="block text-background/80 hover:text-secondary transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="block text-background/80 hover:text-secondary transition-colors">
                Success Stories
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-background">Support</h3>
            <div className="space-y-3">
              <a href="/about" className="block text-background/80 hover:text-secondary transition-colors">
                About Us
              </a>
              <a href="/contact" className="block text-background/80 hover:text-secondary transition-colors">
                Contact
              </a>
              <a href="/faq" className="block text-background/80 hover:text-secondary transition-colors">
                FAQ
              </a>
              <a href="/help" className="block text-background/80 hover:text-secondary transition-colors">
                Help Center
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-background">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-background/80">hello@grantly.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-background/80">1-800-GRANTLY</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-background/80">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Legal links */}
            <div className="flex items-center space-x-6">
              <a href="/terms" className="text-background/80 hover:text-secondary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="/privacy" className="text-background/80 hover:text-secondary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-background/80 hover:text-secondary transition-colors text-sm">
                Cookie Policy
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-8 border-t border-background/20">
            <p className="text-background/60 text-sm">
              © 2025 Grantly. All rights reserved. Made with ❤️ for students worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;