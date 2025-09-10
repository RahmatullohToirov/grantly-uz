import { Button } from "@/components/ui/button";
import SignInModal from "@/components/auth/SignInModal";
import SignUpModal from "@/components/auth/SignUpModal";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d5d5abbb-a27e-4b06-8508-d663f6314de3.png" 
                alt="Grantly - Find. Apply. Achieve." 
                className="h-16 w-auto hover:scale-105 transition-transform"
              />
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="/scholarships" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Scholarships
            </a>
            <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
            <a href="/community" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
            <a href="/resources" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Resources
            </a>
            <a href="/profile" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Profile
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <SignInModal>
              <Button 
                variant="ghost" 
                className="hidden md:inline-flex"
              >
                Sign In
              </Button>
            </SignInModal>
            <SignUpModal>
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:shadow-button transition-all"
              >
                Get Started Free
              </Button>
            </SignUpModal>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;