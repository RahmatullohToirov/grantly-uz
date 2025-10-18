import { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru' | 'uz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    scholarships: 'Scholarships',
    learningHub: 'Learning Hub',
    expertConnect: 'Expert Connect',
    community: 'Community',
    resources: 'Resources',
    profile: 'Profile',
    about: 'About',
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    
    // Auth
    logout: 'Log out',
    getStartedFree: 'Get Started Free',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    signInWithGoogle: 'Sign in with Google',
    forgotPassword: 'Forgot password?',
    alreadyHaveAccount: 'Already have an account? Sign in here',
    noAccountYet: 'Don\'t have an account? Sign up for free',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    download: 'Download',
    share: 'Share',
    bookmark: 'Bookmark',
    learnMore: 'Learn More',
    viewAll: 'View All',
    startNow: 'Start Now',
    joinNow: 'Join Now',
    contactUs: 'Contact Us',
    
    // Hero
    heroTitle: 'Find. Apply. Achieve.',
    heroSubtitle: 'Your Journey to Global Scholarships Starts Here',
    
    // Footer
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    newsletter: 'Newsletter',
    newsletterText: 'Subscribe to our newsletter for scholarship updates',
    yourEmail: 'Your email',
    subscribe: 'Subscribe',
    allRightsReserved: 'All rights reserved',
  },
  ru: {
    // Navigation
    dashboard: 'Панель управления',
    scholarships: 'Стипендии',
    learningHub: 'Центр обучения',
    expertConnect: 'Связь с экспертами',
    community: 'Сообщество',
    resources: 'Ресурсы',
    profile: 'Профиль',
    about: 'О нас',
    features: 'Возможности',
    pricing: 'Цены',
    contact: 'Контакты',
    
    // Auth
    logout: 'Выйти',
    getStartedFree: 'Начать бесплатно',
    signIn: 'Войти',
    signUp: 'Регистрация',
    email: 'Электронная почта',
    password: 'Пароль',
    signInWithGoogle: 'Войти через Google',
    forgotPassword: 'Забыли пароль?',
    alreadyHaveAccount: 'Уже есть аккаунт? Войдите здесь',
    noAccountYet: 'Нет аккаунта? Зарегистрируйтесь бесплатно',
    
    // Common
    search: 'Поиск',
    filter: 'Фильтр',
    download: 'Скачать',
    share: 'Поделиться',
    bookmark: 'Закладка',
    learnMore: 'Узнать больше',
    viewAll: 'Посмотреть все',
    startNow: 'Начать сейчас',
    joinNow: 'Присоединиться',
    contactUs: 'Связаться с нами',
    
    // Hero
    heroTitle: 'Найти. Подать. Достичь.',
    heroSubtitle: 'Ваш путь к международным стипендиям начинается здесь',
    
    // Footer
    quickLinks: 'Быстрые ссылки',
    followUs: 'Следите за нами',
    newsletter: 'Новостная рассылка',
    newsletterText: 'Подпишитесь на нашу рассылку для обновлений о стипендиях',
    yourEmail: 'Ваш email',
    subscribe: 'Подписаться',
    allRightsReserved: 'Все права защищены',
  },
  uz: {
    // Navigation
    dashboard: 'Boshqaruv paneli',
    scholarships: 'Stipendiyalar',
    learningHub: 'O\'quv markazi',
    expertConnect: 'Ekspertlar bilan aloqa',
    community: 'Jamiyat',
    resources: 'Resurslar',
    profile: 'Profil',
    about: 'Biz haqimizda',
    features: 'Imkoniyatlar',
    pricing: 'Narxlar',
    contact: 'Aloqa',
    
    // Auth
    logout: 'Chiqish',
    getStartedFree: 'Bepul boshlash',
    signIn: 'Kirish',
    signUp: 'Ro\'yxatdan o\'tish',
    email: 'Elektron pochta',
    password: 'Parol',
    signInWithGoogle: 'Google orqali kirish',
    forgotPassword: 'Parolni unutdingizmi?',
    alreadyHaveAccount: 'Hisobingiz bormi? Bu yerdan kiring',
    noAccountYet: 'Hisobingiz yo\'qmi? Bepul ro\'yxatdan o\'ting',
    
    // Common
    search: 'Qidirish',
    filter: 'Filtr',
    download: 'Yuklab olish',
    share: 'Ulashish',
    bookmark: 'Xatcho\'p',
    learnMore: 'Batafsil',
    viewAll: 'Hammasini ko\'rish',
    startNow: 'Hozir boshlash',
    joinNow: 'Qo\'shilish',
    contactUs: 'Biz bilan bog\'laning',
    
    // Hero
    heroTitle: 'Toping. Ariza bering. Erishish.',
    heroSubtitle: 'Global stipendiyalarga sayohatingiz shu yerdan boshlanadi',
    
    // Footer
    quickLinks: 'Tezkor havolalar',
    followUs: 'Bizni kuzatib boring',
    newsletter: 'Yangiliklar',
    newsletterText: 'Stipendiya yangiliklari uchun obuna bo\'ling',
    yourEmail: 'Sizning email',
    subscribe: 'Obuna bo\'lish',
    allRightsReserved: 'Barcha huquqlar himoyalangan',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};