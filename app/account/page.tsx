'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaGift, FaCopy, FaCheck, FaCrown, FaCalendar, FaClock, FaHistory, FaChartLine, FaUsers, FaStar, FaHome, FaCamera, FaPaw, FaCarrot, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { UserData } from '../components/AuthModal';

interface Subscription {
  plan: string;
  purchaseDate: string;
  expiryDate: string;
  isActive: boolean;
}

interface ExtendedUserData extends UserData {
  registrationDate: string;
  subscription: Subscription | null;
  purchaseHistory: {
    date: string;
    plan: string;
    amount: number;
  }[];
}

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ExtendedUserData | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showStats, setShowStats] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [chinchillaMode, setChinchillaMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [chinchillaHappiness, setChinchillaHappiness] = useState(0);
  const [showChinchilla, setShowChinchilla] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [secretCode, setSecretCode] = useState('');

  useEffect(() => {
    // В реальном приложении здесь будет API-запрос
    const mockUser: ExtendedUserData = {
      id: '123',
      username: 'Пользователь',
      email: 'user@example.com',
      referralCode: 'ABC123',
      bonusPoints: 250,
      registrationDate: '2024-02-12',
      subscription: {
        plan: 'Премиум',
        purchaseDate: '2024-02-12',
        expiryDate: '2024-05-12',
        isActive: true,
      },
      purchaseHistory: [
        {
          date: '2024-02-12',
          plan: 'Премиум',
          amount: 999,
        }
      ],
    };
    setUser(mockUser);
  }, []);

  // Конами код для активации секретного режима
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          setChinchillaMode(true);
          setShowChinchilla(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const copyReferralCode = () => {
    if (user) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAvatarClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        setChinchillaMode(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const feedChinchilla = () => {
    if (chinchillaMode) {
      setChinchillaHappiness(prev => Math.min(prev + 10, 100));
      setShowChinchilla(true);
      setTimeout(() => setShowChinchilla(false), 2000);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // В реальном приложении здесь бы менялась тема
  };

  // Добавляем новые факты
  const chinchillaFacts = [
    'Шиншиллы могут прыгать до 1.5 метров в высоту!',
    'Мех шиншиллы в 30 раз мягче человеческого волоса',
    'Шиншиллы принимают пылевые ванны',
    'У шиншилл отличная память',
    'Шиншиллы живут до 20 лет',
    'Шиншиллы спят днем и активны ночью',
    'У шиншилл самый густой мех среди всех животных',
    'Детеныши шиншилл рождаются полностью развитыми',
    'Шиншиллы могут поворачивать уши на 360 градусов',
    'Шиншиллы очень социальные животные',
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-darker text-white flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const statsData = [
    { label: 'Дней с нами', value: '45', icon: FaChartLine },
    { label: 'Приглашено друзей', value: '3', icon: FaUsers },
    { label: 'Заработано баллов', value: user?.bonusPoints || '0', icon: FaStar },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-darker' : 'bg-gray-100'} text-white pt-20 pb-10 transition-colors duration-500`}>
      {/* Фоновый градиент */}
      <div className={`fixed inset-0 bg-gradient-to-br ${
        isDarkMode 
          ? 'from-primary/5 via-dark-darker to-accent/5' 
          : 'from-primary/20 via-white to-accent/20'
      } pointer-events-none transition-colors duration-500`} />

      {showChinchilla && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="text-6xl">🦫</div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Верхняя навигация */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-6 py-3 bg-primary rounded-lg hover:bg-secondary transition-all"
            >
              <FaHome />
              Главная страница
            </motion.button>
            {chinchillaMode && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={feedChinchilla}
                className="flex items-center gap-2 px-6 py-3 bg-primary/80 rounded-lg hover:bg-secondary transition-all"
              >
                <FaCarrot />
                Покормить шиншиллу
              </motion.button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-dark-lighter hover:bg-dark transition-all"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
            </motion.button>
            {chinchillaMode && (
              <div className="flex items-center gap-2">
                <FaHeart className="text-red-500" />
                <div className="w-20 h-2 bg-dark-lighter rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${chinchillaHappiness}%` }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {chinchillaMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-primary italic text-center mb-4"
          >
            {chinchillaFacts[Math.floor(Math.random() * chinchillaFacts.length)]}
          </motion.div>
        )}

        {/* Навигация по табам */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {['profile', 'subscription', 'referral', 'history'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-dark-lighter text-gray-400 hover:bg-dark'
              }`}
            >
              {tab === 'profile' && 'Профиль'}
              {tab === 'subscription' && 'Подписка'}
              {tab === 'referral' && 'Рефералы'}
              {tab === 'history' && 'История'}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6"
          >
            {activeTab === 'profile' && (
              <>
                {/* Профиль */}
                <motion.div
                  variants={itemVariants}
                  className="bg-dark-lighter rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: chinchillaMode ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative group"
                      onClick={handleAvatarClick}
                    >
                      <div className={`w-16 h-16 rounded-full overflow-hidden ${
                        avatar ? '' : 'bg-gradient-to-br from-primary to-accent'
                      } flex items-center justify-center cursor-pointer`}>
                        {avatar ? (
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <FaUser className="w-8 h-8 text-white" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <FaCamera className="text-white" />
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {chinchillaMode && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <FaPaw className="text-primary" />
                        </motion.div>
                      )}
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold">{user?.username}</h1>
                      <p className="text-gray-400">{user?.email}</p>
                    </div>
                  </div>

                  {/* Статистика */}
                  <motion.div
                    initial={false}
                    animate={{ height: showStats ? 'auto' : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {statsData.map((stat, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          className="bg-dark rounded-lg p-4 flex items-center gap-3"
                        >
                          <stat.icon className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                            <div className="text-xl font-bold">{stat.value}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowStats(!showStats)}
                    className="w-full py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showStats ? 'Скрыть статистику' : 'Показать статистику'}
                  </motion.button>
                </motion.div>

                {/* Основная информация */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-dark-lighter rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <FaCalendar className="text-primary" />
                      <span>Дата регистрации</span>
                    </div>
                    <div className="text-lg">{formatDate(user?.registrationDate || '')}</div>
                  </div>
                  <div className="bg-dark-lighter rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <FaGift className="text-primary" />
                      <span>Бонусные баллы</span>
                    </div>
                    <div className="text-lg">
                      <motion.span
                        key={user?.bonusPoints}
                        initial={{ scale: 1.5, color: '#0ea5e9' }}
                        animate={{ scale: 1, color: '#ffffff' }}
                        className="font-bold"
                      >
                        {user?.bonusPoints}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>

                {/* Добавляем обработку секретного кода в профиле */}
                <input
                  type="text"
                  className="hidden"
                  value={secretCode}
                  onChange={(e) => {
                    setSecretCode(e.target.value);
                    if (e.target.value.toLowerCase() === 'chinchilla') {
                      setChinchillaMode(true);
                      setSecretCode('');
                    }
                  }}
                />
              </>
            )}

            {activeTab === 'subscription' && user?.subscription && (
              <motion.div
                variants={itemVariants}
                className="bg-dark-lighter rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaCrown className="text-primary" />
                  Активная подписка
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-dark rounded-lg p-4"
                  >
                    <div className="text-gray-400 mb-1">Тариф</div>
                    <div className="text-lg font-medium">{user.subscription.plan}</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-dark rounded-lg p-4"
                  >
                    <div className="text-gray-400 mb-1">Дата покупки</div>
                    <div className="text-lg">{formatDate(user.subscription.purchaseDate)}</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-dark rounded-lg p-4"
                  >
                    <div className="text-gray-400 mb-1">Действует до</div>
                    <div className="text-lg">{formatDate(user.subscription.expiryDate)}</div>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex items-center gap-2"
                >
                  <FaClock className="text-primary" />
                  <span className="text-gray-400">
                    {user.subscription.isActive ? 'Активна' : 'Истекла'}
                  </span>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'referral' && (
              <motion.div
                variants={itemVariants}
                className="bg-dark-lighter rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaGift className="text-primary" />
                  Реферальная программа
                </h2>
                <div className="bg-dark rounded-lg p-4 mb-4">
                  <label className="block text-gray-400 mb-2">Ваш реферальный код</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={user?.referralCode}
                      readOnly
                      className="bg-dark-darker text-white px-4 py-2 rounded-lg flex-1"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyReferralCode}
                      className="px-4 py-2 bg-primary hover:bg-secondary rounded-lg transition-all flex items-center gap-2"
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? 'Скопировано!' : 'Копировать'}
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Поделитесь своим реферальным кодом с друзьями и получайте бонусные баллы за каждую их покупку!
                </p>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                variants={itemVariants}
                className="bg-dark-lighter rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaHistory className="text-primary" />
                  История покупок
                </h2>
                <div className="space-y-4">
                  {user?.purchaseHistory.map((purchase, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      className="bg-dark rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{purchase.plan}</div>
                        <div className="text-gray-400">{formatDate(purchase.date)}</div>
                      </div>
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="text-lg font-medium text-primary"
                      >
                        {purchase.amount}₽
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 