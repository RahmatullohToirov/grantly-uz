import { Instagram, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/5fe2fbcf-488e-4b74-85a8-76d8b3071f79.png" 
                alt="Grantly Logo" 
                className="h-24 sm:h-28 md:h-32 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-background/80 leading-relaxed text-sm md:text-base">
              Empowering students worldwide to discover and win scholarships through 
              AI-powered matching and expert guidance.
            </p>
            <div className="text-base md:text-lg font-semibold text-secondary">
              {t('heroTitle')}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-semibold text-background">{t('quickLinks')}</h3>
            <div className="space-y-2 md:space-y-3">
              <a href="/about" className="block text-sm md:text-base text-background/80 hover:text-secondary transition-colors">
                {t('about')}
              </a>
              <a href="/features" className="block text-sm md:text-base text-background/80 hover:text-secondary transition-colors">
                {t('features')}
              </a>
              <a href="/pricing" className="block text-sm md:text-base text-background/80 hover:text-secondary transition-colors">
                {t('pricing')}
              </a>
              <a href="/contact" className="block text-sm md:text-base text-background/80 hover:text-secondary transition-colors">
                {t('contact')}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-semibold text-background">{t('contactUs')}</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-secondary flex-shrink-0" />
                <span className="text-background/80 text-sm md:text-base">info@grantly.uz</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-secondary flex-shrink-0" />
                <span className="text-background/80 text-sm md:text-base">Tashkent, UZ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-background/20 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <a href="/terms" className="text-background/80 hover:text-secondary transition-colors text-xs md:text-sm">
                Terms of Service
              </a>
              <a href="/privacy" className="text-background/80 hover:text-secondary transition-colors text-xs md:text-sm">
                Privacy Policy
              </a>
              <a href="/cookies" className="text-background/80 hover:text-secondary transition-colors text-xs md:text-sm">
                Cookie Policy
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <a href="https://t.me/grantly_uz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://www.instagram.com/grantly_uz/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://www.linkedin.com/company/grantly-uz/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 md:mt-8 pt-6 md:pt-8 border-t border-background/20">
            <p className="text-background/60 text-xs md:text-sm">
              © 2025 Grantly. {t('allRightsReserved')}. Made with ❤️ for students worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
