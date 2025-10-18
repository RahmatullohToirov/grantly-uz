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
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d5d5abbb-a27e-4b06-8508-d663f6314de3.png" 
                alt="Grantly - Find. Apply. Achieve." 
                className="h-12 sm:h-16 md:h-20 w-auto hover:scale-105 transition-transform"
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              {t('about')}
            </a>
            <a href="/features" className="text-muted-foreground hover:text-primary transition-colors">
              {t('features')}
            </a>
            <a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              {t('pricing')}
            </a>
            <a href="/resources" className="text-muted-foreground hover:text-primary transition-colors">
              {t('resources')}
            </a>
            <a href="/community" className="text-muted-foreground hover:text-primary transition-colors">
              {t('community')}
            </a>
            <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              {t('contact')}
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <SignInModal>
                <Button 
                  variant="ghost" 
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
            </div>
            
            {/* Mobile menu button - Always visible on small screens */}
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            {/* Theme and Language Switchers for Mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-border sm:hidden">
              <span className="text-sm text-muted-foreground">Settings</span>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
            
            <a 
              href="/about" 
              className="block py-2.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about')}
            </a>
            <a 
              href="/features" 
              className="block py-2.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('features')}
            </a>
            <a 
              href="/pricing" 
              className="block py-2.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('pricing')}
            </a>
            <a 
              href="/resources" 
              className="block py-2.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('resources')}
            </a>
            <a 
              href="/community" 
              className="block py-2.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('community')}
            </a>
            <a 
              href="/contact" 
              className="block py-2.5 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('contact')}
            </a>
            
            {/* Auth Buttons for Mobile */}
            <div className="pt-4 flex flex-col space-y-2 border-t border-border">
              <SignInModal>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('signIn')}
                </Button>
              </SignInModal>
              <SignUpModal>
                <Button 
                  size="lg"
                  className="w-full bg-gradient-primary text-primary-foreground"
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