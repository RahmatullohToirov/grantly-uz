import { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru' | 'uz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    scholarships: 'Scholarships',
    learningHub: 'Learning Hub',
    expertConnect: 'Expert Connect',
    community: 'Community',
    resources: 'Resources',
    profile: 'Profile',
    logout: 'Log out',
    getStartedFree: 'Get Started Free',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    signInWithGoogle: 'Sign in with Google',
    forgotPassword: 'Forgot password?',
    alreadyHaveAccount: 'Already have an account? Sign in here',
    noAccountYet: 'Don\'t have an account? Sign up for free'
  },
  ru: {
    dashboard: 'Панель управления',
    scholarships: 'Стипендии',
    learningHub: 'Центр обучения',
    expertConnect: 'Связь с экспертами',
    community: 'Сообщество',
    resources: 'Ресурсы',
    profile: 'Профиль',
    logout: 'Выйти',
    getStartedFree: 'Начать бесплатно',
    signIn: 'Войти',
    signUp: 'Регистрация',
    email: 'Электронная почта',
    password: 'Пароль',
    signInWithGoogle: 'Войти через Google',
    forgotPassword: 'Забыли пароль?',
    alreadyHaveAccount: 'Уже есть аккаунт? Войдите здесь',
    noAccountYet: 'Нет аккаунта? Зарегистрируйтесь бесплатно'
  },
  uz: {
    dashboard: 'Boshqaruv paneli',
    scholarships: 'Stipendiyalar',
    learningHub: 'O\'quv markazi',
    expertConnect: 'Ekspertlar bilan aloqa',
    community: 'Jamiyat',
    resources: 'Resurslar',
    profile: 'Profil',
    logout: 'Chiqish',
    getStartedFree: 'Bepul boshlash',
    signIn: 'Kirish',
    signUp: 'Ro\'yxatdan o\'tish',
    email: 'Elektron pochta',
    password: 'Parol',
    signInWithGoogle: 'Google orqali kirish',
    forgotPassword: 'Parolni unutdingizmi?',
    alreadyHaveAccount: 'Hisobingiz bormi? Bu yerdan kiring',
    noAccountYet: 'Hisobingiz yo\'qmi? Bepul ro\'yxatdan o\'ting'
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