import { Button } from "@/components/ui/button";
import grantlyLogo from "@/assets/grantly-logo.png";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/5fe2fbcf-488e-4b74-85a8-76d8b3071f79.png" 
                alt="Grantly Logo" 
                className="h-12 w-auto hover:scale-105 transition-transform"
              />
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="/features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="/resources" className="text-muted-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="/community" className="text-muted-foreground hover:text-primary transition-colors">
              Community
            </a>
            <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex"
              onClick={() => window.location.href = '/signin'}
            >
              Sign In
            </Button>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;