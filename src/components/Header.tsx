import { Button } from "@/components/ui/button";
import SignInModal from "@/components/auth/SignInModal";
import SignUpModal from "@/components/auth/SignUpModal";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      {/* Main Header */}
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d5d5abbb-a27e-4b06-8508-d663f6314de3.png" 
                alt="Grantly - Find. Apply. Achieve." 
                className="h-20 w-auto hover:scale-105 transition-transform"
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
            <a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
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

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <SignInModal>
              <Button 
                variant="ghost" 
                className="hidden md:inline-flex"
                data-signin-trigger
              >
                {t('signIn')}
              </Button>
            </SignInModal>
            <SignUpModal>
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-primary text-primary-foreground hover:shadow-button transition-all"
                data-signup-trigger
              >
                {t('getStartedFree')}
              </Button>
            </SignUpModal>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <nav className="container mx-auto px-6 py-4 space-y-2">
            <a 
              href="/about" 
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="/features" 
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="/pricing" 
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="/resources" 
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </a>
            <a 
              href="/community" 
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </a>
            <a 
              href="/contact" 
              className="block py-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="pt-4 flex flex-col space-y-2">
              <SignInModal>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('signIn')}
                </Button>
              </SignInModal>
              <SignUpModal>
                <Button 
                  className="w-full bg-gradient-primary text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('getStartedFree')}
                </Button>
              </SignUpModal>
            </div>
          </nav>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;