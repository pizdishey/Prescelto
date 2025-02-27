'use client';

import { motion } from 'framer-motion';
import { FaDownload, FaDiscord, FaGithub, FaCrown, FaRocket, FaStar, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import { HiShieldCheck, HiTerminal, HiCode } from 'react-icons/hi';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import PurchaseModal from './components/PurchaseModal';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import Notification from './components/Notification';
import type { UserData } from './components/AuthModal';
import { useRouter } from 'next/navigation';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export default function Home() {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<null | {
    name: string;
    price: string;
    duration: string;
  }>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Добавляем состояние для размеров окна
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Проверяем реферальный код при загрузке страницы
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
      showNotification('Реферальный код применен! Зарегистрируйтесь, чтобы получить бонус', 'info');
    }
  }, []);

  useEffect(() => {
    // Обновляем размеры окна после монтирования компонента
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Применяем тему при загрузке и изменении
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkTheme(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkTheme);
  }, [isDarkTheme]);

  const currentTheme = isDarkTheme ? 'blue' : 'green';

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePurchase = (plan: { name: string; price: string; duration: string }) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showNotification('Войдите или зарегистрируйтесь для покупки', 'info');
    } else {
      setSelectedPlan(plan);
    }
  };

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    const savedRefCode = localStorage.getItem('referralCode');
    if (savedRefCode && savedRefCode !== userData.referralCode) {
      // В реальном приложении здесь будет API-запрос
      const updatedUser = {
        ...userData,
        bonusPoints: userData.bonusPoints + 100, // Начисляем 100 бонусных баллов
      };
      setUser(updatedUser);
      showNotification('Вы получили 100 бонусных баллов за регистрацию по реферальной ссылке!', 'success');
    } else {
      showNotification('Добро пожаловать!', 'success');
    }
    localStorage.removeItem('referralCode');
  };

  const handlePurchaseComplete = () => {
    showNotification('Спасибо за покупку!', 'success');
    // В реальном приложении здесь будет обновление данных пользователя
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
    showNotification('Вы успешно вышли из аккаунта', 'info');
  };

  const handleProfileClick = () => {
    if (user) {
      router.push('/account');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const features = [
    {
      title: 'Расширенный функционал',
      description: 'Богатый набор инструментов для улучшения игрового процесса',
      icon: HiCode,
    },
    {
      title: 'Безопасность',
      description: 'Продвинутая система защиты от обнаружения с регулярными обновлениями',
      icon: HiShieldCheck,
    },
    {
      title: 'Гибкая настройка',
      description: 'Полностью настраиваемый интерфейс и параметры под ваш стиль игры',
      icon: HiTerminal,
    },
  ];

  const pricingPlans = [
    {
      name: 'Базовый',
      price: '199₽',
      duration: '1 месяц',
      icon: FaStar,
      features: [
        'Базовые функции мода',
        'Обновления в течение месяца',
        'Базовая поддержка',
      ],
      color: 'from-primary to-secondary',
      buttonColor: 'bg-primary/10 hover:bg-primary/20',
    },
    {
      name: 'Премиум',
      price: '499₽',
      duration: '3 месяца',
      icon: FaCrown,
      features: [
        'Все функции мода',
        'Приоритетная поддержка',
        'Ранний доступ к обновлениям',
        'Дополнительные конфигурации',
      ],
      color: 'from-secondary to-accent',
      buttonColor: 'bg-primary/10 hover:bg-primary/20',
      recommended: true,
    },
    {
      name: 'Максимум',
      price: '999₽',
      duration: 'Навсегда',
      icon: FaRocket,
      features: [
        'Пожизненный доступ',
        'VIP поддержка',
        'Все будущие обновления',
        'Эксклюзивные функции',
        'Индивидуальные настройки',
      ],
      color: 'from-accent to-primary',
      buttonColor: 'bg-primary/10 hover:bg-primary/20',
    },
  ];

  return (
    <main className={`min-h-screen ${isDarkTheme ? 'bg-blue-bg-darker text-white' : 'bg-green-bg-darker text-gray-800'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 ${isDarkTheme ? 'bg-blue-bg-lighter' : 'bg-green-bg-lighter'} shadow-sm transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-8 py-3 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`text-xl font-bold text-${currentTheme}-primary`}
          >
            Prescelto
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`p-2 rounded-full ${isDarkTheme ? 'bg-blue-primary/10 text-blue-primary hover:bg-blue-primary/20' : 'bg-green-primary/10 text-green-primary hover:bg-green-primary/20'} transition-all`}
            >
              {isDarkTheme ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </motion.button>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProfileClick}
                className={`flex items-center gap-2 px-3 py-1.5 bg-${currentTheme}-primary/10 text-${currentTheme}-primary hover:bg-${currentTheme}-primary/20 rounded-md transition-all font-medium shadow-sm`}
              >
                <FaUser />
                {user.username}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAuthModalOpen(true)}
                className={`px-3 py-1.5 bg-${currentTheme}-primary/10 text-${currentTheme}-primary hover:bg-${currentTheme}-primary/20 rounded-md transition-all font-medium shadow-sm`}
              >
                Войти
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-8">
          <div className="max-w-2xl">
            <motion.h1 
              className={`text-4xl md:text-5xl font-bold mb-4 text-${currentTheme}-primary`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Prescelto
            </motion.h1>
            <motion.p 
              className={`text-lg mb-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Инновационное решение для улучшения игрового процесса
            </motion.p>
            <motion.button
              onClick={scrollToPricing}
              className={`px-6 py-2 bg-${currentTheme}-primary/10 text-${currentTheme}-primary hover:bg-${currentTheme}-primary/20 rounded-md transition-all`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Начать использование
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${isDarkTheme ? 'bg-blue-bg-lighter' : 'bg-green-bg-lighter'} transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`text-3xl font-bold mb-12 text-${currentTheme}-primary`}
            >
              Возможности
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 ${isDarkTheme ? 'bg-blue-bg' : 'bg-green-bg'} rounded-lg hover:shadow-md transition-all`}
              >
                <feature.icon className={`w-8 h-8 text-${currentTheme}-primary mb-4`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
                <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-16 ${isDarkTheme ? 'bg-blue-bg' : 'bg-green-bg'} transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`text-3xl font-bold mb-12 text-${currentTheme}-primary`}
            >
              Тарифы
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg ${isDarkTheme ? 'bg-blue-bg-lighter' : 'bg-green-bg-lighter'} hover:shadow-lg transition-all`}
            >
              <div className={`text-lg font-semibold mb-4 text-${currentTheme}-primary`}>Базовый</div>
              <div className={`text-3xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                199₽ <span className={`text-sm font-normal ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>/ месяц</span>
              </div>
              <ul className="mb-6 space-y-2">
                {pricingPlans[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <HiShieldCheck className={`w-5 h-5 text-${currentTheme}-primary`} />
                    <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePurchase(pricingPlans[0])}
                className={`w-full py-2 bg-${currentTheme}-primary/10 text-${currentTheme}-primary hover:bg-${currentTheme}-primary/20 rounded-md transition-all`}
              >
                Выбрать
              </motion.button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-lg ${isDarkTheme ? 'bg-blue-bg-lighter' : 'bg-green-bg-lighter'} hover:shadow-lg transition-all relative overflow-hidden`}
            >
              <div className={`text-lg font-semibold mb-4 text-${currentTheme}-primary`}>Премиум</div>
              <div className={`text-3xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                499₽ <span className={`text-sm font-normal ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>/ месяц</span>
              </div>
              <ul className="mb-6 space-y-2">
                {pricingPlans[1].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <HiShieldCheck className={`w-5 h-5 text-${currentTheme}-primary`} />
                    <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePurchase(pricingPlans[1])}
                className={`w-full py-2 bg-${currentTheme}-primary/90 text-white hover:bg-${currentTheme}-secondary/90 rounded-md transition-all`}
              >
                Выбрать
              </motion.button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-lg ${isDarkTheme ? 'bg-blue-bg-lighter' : 'bg-green-bg-lighter'} hover:shadow-lg transition-all`}
            >
              <div className={`text-lg font-semibold mb-4 text-${currentTheme}-primary`}>Максимум</div>
              <div className={`text-3xl font-bold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                999₽ <span className={`text-sm font-normal ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>/ месяц</span>
              </div>
              <ul className="mb-6 space-y-2">
                {pricingPlans[2].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <HiShieldCheck className={`w-5 h-5 text-${currentTheme}-primary`} />
                    <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePurchase(pricingPlans[2])}
                className={`w-full py-2 bg-${currentTheme}-primary/10 text-${currentTheme}-primary hover:bg-${currentTheme}-primary/20 rounded-md transition-all`}
              >
                Выбрать
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-16 ${isDarkTheme ? 'bg-blue-bg' : 'bg-green-bg'} transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`text-3xl font-bold mb-12 text-${currentTheme}-primary`}
            >
              FAQ
            </motion.h2>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Совместим ли мод с последней версией?",
                answer: "Да, мод регулярно обновляется для поддержки последних версий Minecraft",
                icon: FaRocket
              },
              {
                question: "Как получить поддержку?",
                answer: "Присоединяйтесь к нашему Discord серверу для получения помощи",
                icon: FaDiscord
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 ${isDarkTheme ? 'bg-blue-bg-lighter' : 'bg-green-bg-lighter'} rounded-lg hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-${currentTheme}-primary/10 rounded-lg shrink-0`}>
                    <faq.icon className={`w-6 h-6 text-${currentTheme}-primary`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>{faq.question}</h3>
                    <p className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${isDarkTheme ? 'bg-blue-bg-darker' : 'bg-green-bg-darker'} border-t border-${currentTheme}-primary/10 transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-8 flex justify-between items-center">
          <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>© 2024 Prescelto</p>
          <div className="flex gap-4">
            <FaDiscord className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} hover:text-${currentTheme}-primary transition-colors`} />
            <FaGithub className={`w-5 h-5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'} hover:text-${currentTheme}-primary transition-colors`} />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <PurchaseModal
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan || { name: '', price: '', duration: '' }}
        user={user}
        onPurchaseComplete={handlePurchaseComplete}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </main>
  );
} 